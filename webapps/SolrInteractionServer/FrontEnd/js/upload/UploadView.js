Upload.UploadView= function(){

    var that = {};

    // Fields for every uploader
    var xmlUploader = null;
    var imgUploader = null;
    var tableUploader = null;

    // Field for authentication
    var basicAuthString = "";

    // Arrays to save names of xml/imgs files to delete on comparision
    var xmlNamesToDelete = [];
    var imgNamesToDelete = [];

    // Fields to save upload success
    var xmlUploaded = false;
    var imgUploaded = false;

    // Logic-Fields to determine if xml and img uploader has finished
    // if count reaches 2, reset
    var imgXmlCounter = 0;
    // save failed uploads of either xml and img uploader
    // is dependent on what finishes first
    var failed1 = [];
    var failed2 = [];

    // Arrays to save  xml/imgs file to delete on comparision
    var imgIdsToDelete = [];
    var xmlIdsToDelete = [];

    var init = function(){

        basicAuthString = getEncryptString();
    	initXmlUpload();
    	initImgUpload();
        initImgXmlUploadButton();
    	initTableUpload();
        listenToTriggers();
        initButtonListeners();

    };

    var initButtonListeners = function(){
        // If not logged in prompt login message for main-buttons on page
        if(!(usernameAndPasswordIsSet())){
            $("#imgXmlUpload-button").removeAttr("data-toggle");
            $("#imgXmlUpload-button").on("click", function(){ 
                    promptLogin(); 
                });
        }else{
            $("#imgXmlUpload-button").unbind();
            $("#imgXmlUpload-button").attr("data-toggle", "modal");

        }

        if(!(usernameAndPasswordIsSet())){
            $("#tableUpload-button").removeAttr("data-toggle");
            $("#tableUpload-button").on("click", function(){
                    promptLogin(); 
                    });
        }else{
            $("#tableUpload-button").unbind();
            $("#tableUpload-button").attr("data-toggle", "modal");
        }

        initCancelButtons();
        
    };

    /*
    Method to init the cancel Buttons, meaning cross and abort buttons
    in al UIs. 
    */
    var initCancelButtons = function(){
        // Reset every uploader when clicked on cancel
        $("#cancel-button-imgXml").on("click", function(){
            imgUploader.cancelAll();
            xmlUploader.cancelAll();
            imgUploader.clearStoredFiles();
            xmlUploader.clearStoredFiles();
            imgXmlCounter = 0;
            imgUploader.reset();
            xmlUploader.reset();
            $("#imgXmlUpload").modal('hide');
            $("#compareErrorMessage").hide();
            initCancelButtons();
        });

        $("#cancel-button-table").on("click", function(){
            tableUploader.cancelAll();
            tableUploader.clearStoredFiles();
            tableUploader.reset();
            $("#tableUpload").modal('hide');
            $("#tableProcessEndInfo").hide();
            initTableUpload();
            initCancelButtons();
            
        });

        // Only close modal-view when clicked on cross
        $("#imgXml-cross").on("click", function(){
            console.log("Modal hide");
            $("#imgXmlUpload").modal('hide');
        });

        $("#table-cross").on("click", function(){
            console.log("Modal hide");
            $("#tableUpload").modal('hide');
        })
    };

    // Change authorization information when login or logout happens
    var listenToTriggers = function(){
        $("body").on("Login", updateAuthString);
        $("body").on("Logout", updateAuthString);
    };

    var updateAuthString = function(){
        basicAuthString = getEncryptString();
        // reset all uploader when login information changes
        initXmlUpload();
        initImgUpload();
        initTableUpload();
        initButtonListeners();
    };


    var initXmlUpload = function(){
        // Init xml upload dropzone, set adress and Authorization Header
    	xmlUploader = new qq.FineUploader({
            element: document.getElementById('fine-uploader-xml'),
            template: 'qq-template-xml',
            request: {
                endpoint: SERVERADDRESS + '/SolrInteractionServer/rest/ssc-api-write/xml/upload',
                customHeaders: {
                    "Authorization": basicAuthString
                    }
                },
            cors: {
                //all requests are expected to be cross-domain requests
                expected: false,

                //if you want cookies to be sent along with the request
                sendCredentials: false
            },
            thumbnails: {
                placeholders: {
                    waitingPath: '../libs/fine-uploader/placeholders/waiting-generic.png',
                    notAvailablePath: '../libs/fine-uploader/placeholders/not_available-generic.png'
                }
            },
            autoUpload: false,
            debug: true,
            maxConnections: 1,
            validation: {
                // Only allow xmls to be dropped here, and only show xmls in explorer
                allowedExtensions: ['xml'],
                acceptFiles: ['application/xml']
            },
            messages: {
                // If no xml is dropped show error
                typeError: '{file} hat eine ungültige Erweiterung. Gültige Erweiterungen: {extensions}.'
            },
            callbacks: {
                // Method to invoke when upload process finished (success or not)
                onAllComplete: xmlImgProcessEnd
            }
        });

    };

    var initImgUpload = function(){

    	imgUploader = new qq.FineUploader({
            element: document.getElementById('fine-uploader-img'),
            template: 'qq-template-img',
            request: {
                endpoint: SERVERADDRESS + '/SolrInteractionServer/rest/ssc-api-write/img/upload',
                customHeaders: {
                    "Authorization": basicAuthString
                    }
            },
            cors: {
                //all requests are expected to be cross-domain requests
                expected: false,

                //if you want cookies to be sent along with the request
                sendCredentials: false
            },
            thumbnails: {
                placeholders: {
                    waitingPath: '../libs/fine-uploader/placeholders/waiting-generic.png',
                    notAvailablePath: '../libs/fine-uploader/placeholders/not_available-generic.png'
                }
            },
            autoUpload: false,
            debug: false,
            maxConnections: 1,
            validation: {
                // Only allow jpg to be dropped, only show jpg in explorer
                allowedExtensions: ['jpg'],
                acceptFiles: ['image/jpeg']
            },
            messages: {
                typeError: '{file} hat eine ungültige Erweiterung. Gültige Erweiterungen: {extensions}.'
            },
            callbacks: {
                // Method to invoke when upload is over (success or not)
                onAllComplete: xmlImgProcessEnd
            }
            
        });

    };

    var initImgXmlUploadButton = function(){
        // init click for imgXml-upload-button
        qq(document.getElementById("trigger-upload-imgXml")).attach("click", function() {
            $("#compareErrorMessage").hide();

            // get all submitted files to uploader and compare if every xml file
            // has corresponding partner on jpg side
            var imgStoredFiles = imgUploader.getUploads({status: qq.status.SUBMITTED});
            var xmlStoredFiles = xmlUploader.getUploads({status: qq.status.SUBMITTED});
            // All files without partner get removed from submission and UI
            compareImgXmlUploadsAndCancel(imgStoredFiles, xmlStoredFiles);

            // Get the remaining files and upload them, if nothing remains show error
            // and don't do upload
            var imgRemainingUploads = imgUploader.getUploads({status: qq.status.SUBMITTED});
            var xmlRemainingUploads = xmlUploader.getUploads({status: qq.status.SUBMITTED});
            if(imgRemainingUploads.length > 0 && xmlRemainingUploads.length > 0){
                imgUploader.uploadStoredFiles();
                xmlUploader.uploadStoredFiles();
            }else{
                if(imgIdsToDelete.length > 0 || xmlIdsToDelete.length > 0){
                    renderCompareError();
                }
            }
        });
    };

    /*
    Method gets invoked when either xml uploader or img uploader is finished
    */
    var xmlImgProcessEnd = function(succeeded, failed){
        
        imgXmlCounter++;
        // save failed files for uploader that finishes first
        failed1 = failed;

        // if second uploader has finished (second time this method is invoked)
        if(imgXmlCounter == 2){
            // reset counter for next upload
            imgXmlCounter = 0;
            // save failed files of second uploader
            failed2 = failed;

            // if some files didn't have corresponding partners show Error
            if(xmlNamesToDelete.length > 0 || imgNamesToDelete.length > 0){
                renderCompareError();
                return;
            }

            // if something failed show error
            if(failed1.length > 0 || failed2.length > 0){
                renderErrorUpload();
                return;
            }
            
            // only if everything went good show success
            renderSuccessUpload();

        }
    };

    /*
    Method to build the UI for the error message when the comparison fails
    */
    var renderCompareError = function(){
        var errorMessage = "<b>Prozess abgeschlossen.</b><br/><br/>";
        errorMessage = errorMessage + "Es wurden Dateien nicht hochgeladen, da die entsprechenden Partnerdateien fehlen:<br>";

        // Show all missing partners by name, first for the imgs...
        for(var i = 0; i < imgNamesToDelete.length; i++){
            errorMessage = errorMessage + "Zur Datei <em>" + imgNamesToDelete[i] + 
            "</em> fehlt die Datei <em>" + getRawName(imgNamesToDelete[i]) + ".xml" + "</em>.<br/>";
        }

        errorMessage = errorMessage + "<br>";

        // ... then for the xmls
        for(var i = 0; i < xmlNamesToDelete.length; i++){
            errorMessage = errorMessage + "Zur Datei <em>" + xmlNamesToDelete[i] + "</em> fehlt die Datei <em>" + 
            getRawName(xmlNamesToDelete[i]) + ".jpg</em>" + ".<br/>";
        }

        $("#compareErrorMessage").html(errorMessage);
        $("#compareErrorMessage").removeClass("compareErrorMessageCorrect");
        $("#compareErrorMessage").addClass("compareErrorMessageWrong");
        $("#compareErrorMessage").fadeIn();
    };

    /*
    Method to invoke before trying to upload files
    Check if every file has its corresponding partners
    and remove them from upload if not so
    */
    var compareImgXmlUploadsAndCancel = function(imgUploads, xmlUploads){
        imgIdsToDelete = getImgIdsToDelete(imgUploads, xmlUploads);
        xmlIdsToDelete = getXmlIdsToDelete(imgUploads, xmlUploads);
        xmlNamesToDelete = getXmlNamesToDelete(xmlIdsToDelete);
        imgNamesToDelete = getImgNamesToDelete(imgIdsToDelete);

        cancelUploads(imgIdsToDelete, xmlIdsToDelete);
    };

    /*
    Method to show Success-UI on successful Upload (nothing goes wrond)
    */
    var renderSuccessUpload = function(){
        var successMessage = "<b>Prozess abgeschlossen.</b><br/><br/>Dateien erfolgreich hochgeladen.";
        $("#compareErrorMessage").html(successMessage);
        $("#compareErrorMessage").removeClass("compareErrorMessageWrong");
        $("#compareErrorMessage").addClass("compareErrorMessageCorrect");
        $("#compareErrorMessage").fadeIn();
    };

    /*
    Method to show error message when some file couldn't get uploaded
    */
    var renderErrorUpload = function(){
        var errorMessage = "<b>Prozess abgeschlossen.</b><br/><br/>Eine oder mehrere Dateien konnten nicht hochgeladen werden.";
        $("#compareErrorMessage").html(errorMessage);
        $("#compareErrorMessage").addClass("compareErrorMessageWrong");
        $("#compareErrorMessage").removeClass("compareErrorMessageCorrect");
        $("#compareErrorMessage").fadeIn();
    };

    var cancelUploads = function(imgIdsToDelete, xmlIdsToDelete){
        
        for(var i = 0; i < imgIdsToDelete.length; i++){
            
            imgUploader.cancel(imgIdsToDelete[i]);
        }

        for(var i = 0; i < xmlIdsToDelete.length; i++){
            
            xmlUploader.cancel(xmlIdsToDelete[i]);
        }
    };

    /*
    Method to get all names of the xml files to delete
    */
    var getXmlNamesToDelete = function(xmlIdsToDelete){
        var xmlNamesToDelete = [];
        for(var i = 0; i < xmlIdsToDelete.length; i++){
            var xmlName = xmlUploader.getName(xmlIdsToDelete[i]);
            xmlNamesToDelete.push(xmlName);
        }
        return xmlNamesToDelete;
    };

    /*
    Method to get all names of the jpg files to delete
    */
    var getImgNamesToDelete = function(imgIdsToDelete){
        var imgNamesToDelete = [];
        for(var i = 0; i < imgIdsToDelete.length; i++){
            var imgName = imgUploader.getName(imgIdsToDelete[i]);
            imgNamesToDelete.push(imgName);
        }
        return imgNamesToDelete;
    };

    /*
    Algorithm to get all jpgs without corresponding xml file on upload try
    A corresponding file is missing if it doesn't has the same name (minus the ending)
    */
    var getImgIdsToDelete = function(imgUploads, xmlUploads){
        var imgIdsToDelete = [];

        for(var i = 0; i < imgUploads.length; i++){
            var imgToDelete = true;
            for(var j = 0; j < xmlUploads.length; j++){
                var imgName = getRawName(imgUploads[i].name);
                var xmlName = getRawName(xmlUploads[j].name);
                // compare if names are the same without the ending (e.g. .jpg)
                if(imgName == xmlName){
                    imgToDelete = false;
                }
            }
            if(imgToDelete){
                imgIdsToDelete.push(imgUploads[i].id);
            }

        }

        return imgIdsToDelete;

    };

    /*
    Algorithm to get all xmls without corresponding jpg file on upload try
    */
    var getXmlIdsToDelete = function(imgUploads, xmlUploads){
        var xmlIdsToDelete = [];

        for(var i = 0; i < xmlUploads.length; i++){
            var xmlToDelete = true;
            for(var j = 0; j < imgUploads.length; j++){
                var xmlName = getRawName(xmlUploads[i].name);
                var imgName = getRawName(imgUploads[j].name);
                // compare if names are the same without the ending (e.g. .jpg)
                if(imgName == xmlName){
                    xmlToDelete = false;
                }
                
            }
            if(xmlToDelete){
                xmlIdsToDelete.push(xmlUploads[i].id);
            }

        }
        return xmlIdsToDelete;
    };

    // Get the name of xml or jpg file without the ending
    var getRawName = function(name){
        var sliceIndex = name.lastIndexOf(".");
        name = name.substring(0, sliceIndex);
        return name;
    };

    var initTableUpload = function(){

    	tableUploader = new qq.FineUploader({
            element: document.getElementById('fine-uploader-table'),
            template: 'qq-template-table',

            request: {
                endpoint: SERVERADDRESS + '/SolrInteractionServer/rest/ssc-api-write/table/upload',
                customHeaders: {
                    "Authorization": basicAuthString
                    }
            },
            cors: {
                //all requests are expected to be cross-domain requests
                expected: false,

                //if you want cookies to be sent along with the request
                sendCredentials: false
            },
            thumbnails: {
                placeholders: {
                    waitingPath: '../libs/fine-uploader/placeholders/waiting-generic.png',
                    notAvailablePath: '../libs/fine-uploader/placeholders/not_available-generic.png'
                }
            },
            autoUpload: false,
            debug: true,
            validation: {
                // only allow excel-data to be dropped, only show xls-data in explorer
                allowedExtensions: ['xls'],
                acceptFiles: ['application/vnd.ms-excel']
            },
            messages: {
                typeError: '{file} hat eine ungültige Erweiterung. Gültige Erweiterungen: {extensions}.'
            },
            maxConnections: 1,
            callbacks: {
                // Method to invoke when upload is finished (succes or fail)
                onAllComplete: tableProcessEnd
            }

        });
        
        // init upload button to upload submitted files
        qq(document.getElementById("trigger-upload-table")).attach("click", function() {
            $("#tableProcessEndInfo").hide();
            tableUploader.uploadStoredFiles();
        });

    };

    /*
    Method gets invoked if upload is finished (succes or fail)
    */
    var tableProcessEnd = function(succeeded, failed){
        // if something fail show error...
        if(failed.length > 0){
            var errorMessage = "<b>Prozess abgeschlossen.</b><br/><br/>Eine oder mehrere Dateien konnten nicht hochgeladen werden.";
            $("#tableProcessEndInfo").html(errorMessage);
            $("#tableProcessEndInfo").removeClass("tableProcessEndInfoCorrect");
            $("#tableProcessEndInfo").addClass("tableProcessEndInfoWrong");
            $("#tableProcessEndInfo").fadeIn();
        }else{
            //... else show success
            var successMessage = "<b>Prozess abgeschlossen.</b><br/><br/>Dateien erfolgreich hochgeladen.";
            $("#tableProcessEndInfo").html(successMessage);
            $("#tableProcessEndInfo").addClass("tableProcessEndInfoCorrect");
            $("#tableProcessEndInfo").removeClass("tableProcessEndInfoWrong");
            $("#tableProcessEndInfo").fadeIn();
        }
    };

    that.init = init;

    return that;
};