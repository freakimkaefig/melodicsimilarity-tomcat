
/*
    SongSheetView.js
    responsible for the view in the LiedblattDetailView.html
    controlled by SongSheetController
    handles the songsheet content data and the manipulation of songsheets

*/

SongSheet.SongSheetView = function(){
    var that = {};
    var currentTextData = {};
    var actualDocument = {};
    var currentId = "";
    // pointer to set the index of current doc in resultlist of local storage
    var pointer = -1;
    var documents = [];
    var date_key = "";
    var backupDocument = {};
    // content that can be viewed is the text (1) and the metadata (-1)
    var currentlyContentViewed = 1;

    // get the documents id from the url
    var getIdFromURL = function(){
        var params = window.location.search.split("?");
        var idParam = params[1].split("&");
        var id = idParam[0].split("=")[1];
        return id;

    };
    // get the timestamp from local storage resultlist to to create key for local storage
    var getDateKeyFromURL = function(){
        var params = window.location.search.split("?");
        var dateParam = params[1].split("&");
        var dateKey = dateParam[1].split("=")[1];
        return dateKey;
    };

    var init = function(){

        // if no timestamp for resultlist is in URL, show chronological
        // last songsheet with saved resultlist
        if(window.location.search == ""){
            setPageOnLastList();
        }else{
            // Get id of URL and set it in local storage
            var urlSplit = window.location.search.split("=");
            var id = urlSplit[1];

            currentId = getIdFromURL();
            localStorage["currentId"] = currentId;
            
            // get current timestamp-key from URL and set it in local Storage
            date_key = getDateKeyFromURL();

            localStorage["current_date_key"] = date_key;

            // If id is in list start loading it from local storage
            if(checkIfCurrentIdIsInList()){
                resetNotifications();
                // Hide UI elements to let them fade in, later on
                $('#backToSearchButton').hide();
                $('#metaDataSearchBox').hide();
                $('#currentMetaDataBox').hide();
                $('#songSheetID').hide();
                $('#connectMetaData').hide();
                $('#connectMetaDataModal').hide();
                metaSearchRequestParam = "*:*";

                // Get all infos of current docs (necessary to show img of navigation for example)
                initCurrentDocuments(currentId, date_key);
            // if id isn't anymore in list, it got deleted, show message for this
            }else{
                $(that).trigger("documentDeleted");
            }

            
        }

        initButtonClickEvents();
        
    };

    /*
    Set all Butttons of UI
    */
    var initButtonClickEvents = function(){

        $('#revertChangesText').on("click", revertText);
        $('#revertChangesMetaData').on("click", revertMetaData);

        $('#cancelButtonModal1').on("click", function(){
            putInputDataFromModalToCommonSearch();
        });

        $('#cancelButtonModal2').on("click", function(){
            putInputDataFromModalToCommonSearch();
        });

        $('#confirmRefuseChangesButton').on("click", function(){
            location.reload();
        });

        $('#songSheetContentButton').on("click", function(){
            $('#currentMetaDataBox').fadeOut(function(){
                $('#metaDataSearchBox').hide(function(){
                    $('#detailBox1').fadeIn();
                });
            });
            currentlyContentViewed = 1;
        });

        // add click events to meta data search buttons in common search and in modal
        $('#songSheetMetaDataSearchButton').on("click", function(){
            $('#detailBox1').fadeOut(function(){
                $('#currentMetaDataBox').hide(function(){
                    $('#metaDataSearchBox').fadeIn();
                    $('#metaSearchTextInput').focus();
                });
            });
        });

        $('#songSheetMetaDataButton').on("click", function(){
            $('#detailBox1').fadeOut(function(){
                $('#metaDataSearchBox').hide(function(){
                    $('#currentMetaDataBox').fadeIn();
                });
            });
            currentlyContentViewed = -1;
        });

        $('.detailViewContentButton').on("click", function(){
            $('.detailViewContentButton').removeClass('active');
            $(this).addClass('active');
        });

        $('#resetMetaData').on("click", function(){
            $('#currentMetaDataBox').hide();
            $('#metaDataSearchBox').show();
        });

        // add click events to clear buttons
        $('#clearSongSheetContentButton').on("click", function(){
            $('#songText').text("");
        });
        $('#clearSongSheetMetaDataButton').on("click", clearSongSheetMetaData);

        // trigger modal and put the searchmask content in the modal search mask
        $('#showDetailedMetaData').on("click", function(){
            $('#metaSearchSelectModal').val($('#metaSearchSelect').val());
            $('#metaSearchTextInputModal').val($('#metaSearchTextInput').val());

            $('#metaSearchTextInputModal').focus();
        });
    };

    // put information of search mask from the modal to the common metadata search if the modal is dismissed
    var putInputDataFromModalToCommonSearch = function(){
        $("#metaSearchSelect").val($("#metaSearchSelectModal").val());
        $("#metaSearchTextInput").val($("#metaSearchTextInputModal").val());
    };

    // Method to find the chronological last list and songsheet 
    // (when clicked on "Letztes Blatt" in main menu)
    var setPageOnLastList = function(){
        var numbers = [];
        var iterator = 0;

        // Get all timestamps and save them in numbers
        for(key in localStorage){
            if(key.indexOf("resultList__") != -1){
                
                numbers[iterator] = parseInt(key.substring(12));
                iterator++;
            }
        }

        // If nothing is set yet, trigger this (and start later with first doc of full corpus)
        if(numbers.length == 0 || localStorage["currentId"] == undefined || localStorage["current_date_key"] == undefined){
            triggerNothingSet();
            return;
        }
        // extrem case, list that saved as current isn't there anymore
        if(!(currentDateKeyPresent(numbers, localStorage["current_date_key"]))){
            triggerNothingSet();
            return;
        }

        // the biggest number is the last timestamp, is saved in local storage
        // Refresh page with adjusted URL
        var biggestNumber = localStorage["current_date_key"];
        var newUrl = "LiedblattDetailView.html?id=" + localStorage["currentId"] + "&date_key=" + biggestNumber;
        window.location.href = newUrl;
    };

    // to check if document has been deleted
    var checkIfCurrentIdIsInList = function(){
        var id = localStorage["currentId"];
        var date_key = localStorage["current_date_key"];
        var listKey = "resultList__" + date_key;
        var list = JSON.parse(localStorage[listKey]);
        
        for(var i = 0; i < list.length; i++){
            if(id == list[i]){
                return true;
            }
        }
        return false;

    };

    // to check if the current timestamp still exists
    var currentDateKeyPresent = function(numbers, date_key){
        for(var i = 0; i < numbers.length; i++){
            if(numbers[i] == date_key){
                return true;
            }
        }
        return false;
    }

    var triggerNothingSet = function(){
        $(that).trigger("NothingSet");
    };

    // Method to continue init process in controller, after list and id is loaded
    // and set in local storage
    var continueInitProcess = function(){
        actualDocument = setActualDocument();
        initActualDocument(actualDocument);
        initNavigation();
    };

    var setActualDocument = function(){
        for(var i = 0; i < documents.length; i++){
            if(documents[i].id == currentId){
                // set pointer to the currentDoc in list (necesssary for navigation)
                pointer = i;
                return documents[i];
            }
        }

        return null;
    };

    /*
    Get all information of the docs in resultlist (by ids in local storage) before starting rendering
    necessary for example for rendering the jpg of navigation-buttons by imagename
    */
    var initCurrentDocuments = function(currentId, date_key){

        var resultIds = JSON.parse(localStorage["resultList__" + date_key]);
        var requestUrl = SERVERADDRESS + "/SolrInteractionServer/rest/ssc-api-read/searchableDocs/getDocumentsByIds";
        
        /*
        Create comma seperated list of ids for data-attribute of request
        to send to Server with REST-API
        for example: "f685091f-f097-4d64-b9cd-e2ce83ebbdce,d685091f-f097-4d64-b9cd-e2ce83ebbdce,r685091f-f097-4d64-b9cd-e2ce83ebbdce"
        Please refer to Documentation and REST-API for more information
        */
        var idData = "";
        for(var i = 0; i < resultIds.length; i++){
            if(i != (resultIds.length - 1)){
                idData = idData + resultIds[i] + ",";
            }else{
                idData = idData + resultIds[i];
            }
        }

        $.ajax({
            type     : "POST",
            data     : idData,
            url      : requestUrl,
            success  : function(msg){
                documents = msg;
                $(that).trigger("DocumentsSet");
            },
            error    : function(msg) {
                console.log('Failed');
            }
        });
        
    };

    var resetNotifications = function(){
        $("#editMessage").hide();
        $("#designMessage").hide();
        $("#errorMessage").hide();
    };

    // Set navigation buttons (left,righ arrows and jpgs)
    var initNavigation = function(){

        if(documents[pointer - 1] == undefined){
            $("#leftLink").hide();
        }else{
            setNavigationLinkLeft(documents[pointer-1].imagename);
        }

        if(documents[pointer + 1] == undefined){
            $("#rightLink").hide();
        }else{
            setNavigationLinkRight(documents[pointer+1].imagename);
        }
    };


    // add click events to next and previous document buttons and build ui
    var setNavigationLinkLeft = function(imagename){

        var newId = documents[pointer - 1].id;

        $("#leftLink").on("click", function(){
            location.assign("LiedblattDetailView.html?id=" + newId + "&date_key=" + date_key);
        });

        $("#imgLeft").attr("src", "../img/jpegs/" + imagename);
    };

    var setNavigationLinkRight = function(imagename){

        var newId = documents[pointer + 1].id;

        $("#rightLink").on("click", function(){
            location.assign("LiedblattDetailView.html?id=" + newId + "&date_key=" + date_key);
        });

        $("#imgRight").attr("src", "../img/jpegs/" + imagename);
    };

    // load the document in the html elements
    var initActualDocument = function(doc){

        var actualProcessingStatus = "";

        if(doc.hasOwnProperty("processingStatus")){
            actualProcessingStatus = doc.processingStatus;
        }

        // Transform text of solr-doc to html for editable text, so that new line are preserved
        var newText = transformTextToHtml(doc.text);

        backupDocument = doc;

        $('#songText').html(newText);
        $('#songSheetID').html(doc.id);
        

        activateShiftzoom();

        $('#imagecontent').attr( "src", "../img/jpegs/" + doc.imagename);
        $("#image-link").attr("href", "javascript:window.open('../img/jpegs/" + doc.imagename + "', 'Popup', 'location=1,status=1,scrollbars=1, resizable=1, directories=1, toolbar=1, titlebar=1, width=800, height=800')");

        // If the document has been edited somehow, metadates have to be set
        if(actualProcessingStatus == "edited" || actualProcessingStatus == "design"){

            // Transform text of metadate solr-doc to html for editable text,
            //so that new line are preserved
            transformMetaDataToHtml(doc);

            $('#inputIncludes').html(doc.includes);
            $('#inputSignature').html(doc.signature);
            $('#inputDateFindAid').html(doc.dateFindAid);
            $('#inputReceivedOn').html(doc.receivedOn);
            $('#inputOldSignature').html(doc.oldSignature);

            $('#inputVersionNumber').html(doc.versionNumber);
            $('#inputMissingCause').html(doc.missingCause);
            $('#inputOrigin').html(doc.origin);
            $('#inputTitle').html(doc.title);
            $('#inputType').html(doc.type);

            $('#inputIncipit').html(doc.incipit);
            $('#inputNumberOfPages').html(doc.numberOfPages);
            $('#inputSingPlace').html(doc.singPlace);
            $('#inputRemark').html(doc.remark);
            $('#inputLandscapeArchive').html(doc.landscapeArchive);

            $('#inputPublication').html(doc.publication);
            $('#inputSungOn').html(doc.sungOn);
            $('#inputRecordedOn').html(doc.recordedOn);
            $('#inputSubmittedOn').html(doc.submittedOn);
            $('#inputSinger').html(doc.singer);

            $('#inputReference').html(doc.reference);
            $('#inputHandwrittenSource').html(doc.handwrittenSource);
            $('#inputRecorder').html(doc.recorder);
            $('#inputArchive').html(doc.archive);
            setTimeAndPersonChanged(doc.lastChangedDate, doc.lastChangedPerson);

        }
        setProcessingStatus(doc.processingStatus);

    };

    var transformMetaDataToHtml = function(doc){
            doc.includes = transformTextToHtml(doc.includes);
            doc.signature = transformTextToHtml(doc.signature);
            doc.dateFindAid = transformTextToHtml(doc.dateFindAid);
            doc.receivedOn = transformTextToHtml(doc.receivedOn);
            doc.oldSignature = transformTextToHtml(doc.oldSignature);

            doc.versionNumber = transformTextToHtml(doc.versionNumber);
            doc.missingCause = transformTextToHtml(doc.missingCause);
            doc.origin = transformTextToHtml(doc.origin);
            doc.title = transformTextToHtml(doc.title);
            doc.type = transformTextToHtml(doc.type);

            doc.incipit = transformTextToHtml(doc.incipit);
            doc.numberOfPages = transformTextToHtml(doc.numberOfPages);
            doc.singPlace = transformTextToHtml(doc.singPlace);
            doc.remark = transformTextToHtml(doc.remark);
            doc.landscapeArchive = transformTextToHtml(doc.landscapeArchive);

            doc.publication = transformTextToHtml(doc.publication);
            doc.sungOn = transformTextToHtml(doc.sungOn);
            doc.recordedOn = transformTextToHtml(doc.recordedOn);
            doc.submittedOn = transformTextToHtml(doc.submittedOn);
            doc.singer = transformTextToHtml(doc.singer);

            doc.reference = transformTextToHtml(doc.reference);
            doc.handwrittenSourc = transformTextToHtml(doc.handwrittenSource);
            doc.recorder = transformTextToHtml(doc.recorder);
            doc.archive = transformTextToHtml(doc.archive);
    };

    // set date and last person that changed the songsheet according to information in metadates
    var setTimeAndPersonChanged = function(lastChangedDate, lastChangedPerson){
        $("#timeStampUser").hide();
        lastChangedDate = transformCETtoUTC(lastChangedDate);
        lastChangedDate = makeNiceDate(lastChangedDate);
        $("#timeStampUser").html("Geändert " + lastChangedDate + " von <em>" + lastChangedPerson + "</em>");
        $("#timeStampUser").fadeIn();
    };

    var makeNiceDate = function(date){
        date = date.replace("T", " um ");
        date = date.slice(0, -3);
        return date;
    };

    // Tranformation Algorithm to transform java-date to solr-date (and also date for UI)
    var transformCETtoUTC = function(lastChangedDate){
        var firstChar = lastChangedDate.charAt(0);
        if(!(firstChar >= '0' && firstChar <= '9')){
            lastChangedDate = new Date(lastChangedDate);
            lastChangedDate.setHours(lastChangedDate.getHours() - 1);
            lastChangedDate = new Date(lastChangedDate);
            lastChangedDate = toW3CString(lastChangedDate);
        }
        return lastChangedDate;
    };

    // Activate zoom and drag and drop functionality
    var activateShiftzoom = function(){
        var options = {
            buttons: false,
            wheelinvert: true,
            overview: false,
            wheelstep: 10
        };
        // Show UI when image has been loaded successfully (so user doesn't see the loading)
        $("#imagecontent").on('load', function() {
          $("#main-container").fadeIn(1000, "swing", function(){

          });
          $("#footer-container").fadeIn(1000, "swing");
          shiftzoom.add($("#imagecontent")[0], options);
        });
                
    };

    // display processing status of document
    var setProcessingStatus = function(status){
        if(status == undefined || status == 'unedited'){
            $('#status-icon').addClass('statusNothing-detailview');
            $("#status-text").text('Das Liedblatt wurde noch nicht bearbeitet.');

        }
        if(status == 'edited'){
            $('#status-icon').removeClass('statusNothing-detailview');
            $('#status-icon').removeClass('statusProgressing-detailview');
            $('#status-icon').addClass('statusDone-detailview');
            $("#status-text").text('Das Liedblatt ist als erschlossen ausgezeichnet.');
        }
        if(status == 'design'){
            $('#status-icon').removeClass('statusNothing-detailview');
            $('#status-icon').removeClass('statusDone-detailview');
            $("#status-icon").addClass('statusProgressing-detailview');
            $("#status-text").text('Das Liedblatt ist als Entwurf gespeichert.');
        }
    };

    // Transform the raw text to html for editable text
    // especially transform lines to div-blocks for correct presentation
    var transformTextToHtml = function(text){
        //text = text.replace(/<(?:.|\n)*?>/gm, '');
        text = text.replace(/</g, '&lt;');
        text = text.replace(/>/g, '&gt;');
        text = "<div>" + text;
        text = text.replace(/\n/g, '</div><div>'); 
        text = text + "</div>";
        text = text.replace(/<div><\/div>/g, '<div><br></div>');
        return text;
    };

    var updateTextData = function(){
        that.currentTextData.text = $("#songText").html();
        that.currentTextData.id = $("#songSheetID").text();

        $(that).trigger("textDataUpdated");
    };

    // Method for Clear-Button of metadate-view
    var clearSongSheetMetaData = function(){
        $('#inputIncludes').text("");
        $('#inputSignature').text("");
        $('#inputDateFindAid').text("");
        $('#inputReceivedOn').text("");
        $('#inputOldSignature').text("");

        $('#inputVersionNumber').text("");
        $('#inputMissingCause').text("");
        $('#inputOrigin').text("");
        $('#inputTitle').text("");
        $('#inputType').text("");

        $('#inputIncipit').text("");
        $('#inputNumberOfPages').text("");
        $('#inputSingPlace').text("");
        $('#inputRemark').text("");
        $('#inputLandscapeArchive').text("");

        $('#inputPublication').text("");
        $('#inputSungOn').text("");
        $('#inputRecordedOn').text("");
        $('#inputSubmittedOn').text("");
        $('#inputSinger').text("");

        $('#inputReference').text("");
        $('#inputHandwrittenSource').text("");
        $('#inputRecorder').text("");
        $('#inputArchive').text("");
    };

    var getActualDocument = function(){
        return actualDocument;
    };

    // Show notification that succes was successful
    // differantiation betweend edited and design
    // shown 3 seconds
    var showSuccess = function(processingStatus){
        resetNotifications();
        if(processingStatus == 'edited'){
            $("#editMessage").fadeIn();
            setTimeout(function(){ 
                $("#editMessage").fadeOut();
            }, 3000);
        }
        if(processingStatus == 'design'){
            $("#designMessage").fadeIn();
            setTimeout(function(){ 
                $("#designMessage").fadeOut();
            }, 3000);
        }
    };

    // Show error notification for 3 seconds
    var showError = function(messageError){
        resetNotifications();
        if(!(usernameAndPasswordIsSet())){
            promptLogin();
        }
        $("#errorMessage-panel-title").text(messageError);
        $("#errorMessage").fadeIn();
        setTimeout(function(){ 
                $("#errorMessage").fadeOut();
            }, 3000);
    };

    // Transform javascript timestamp to solr-date
    var toW3CString = function(date) {
        var year = date.getFullYear();
        var month = date.getMonth();
        month ++;
        if (month < 10) {
            month = '0' + month;
        }
        var day = date.getDate();
        if (day < 10) {
            day = '0' + day;
        }
        var hours = date.getHours();
        if (hours < 10) {
            hours = '0' + hours;
        }
        var minutes = date.getMinutes();
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        var seconds = date.getSeconds();
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        var offset = -date.getTimezoneOffset();
        var offsetHours = Math.abs(Math.floor(offset / 60));
        var offsetMinutes = Math.abs(offset) - offsetHours * 60;
        if (offsetHours < 10) {
            offsetHours = '0' + offsetHours;
        }
        if (offsetMinutes < 10) {
            offsetMinutes = '0' + offsetMinutes;
        }
        var offsetSign = '+';
        if (offset < 0) {
            offsetSign = '-';
        }
        return year + '-' + month + '-' + day +
            'T' + hours + ':' + minutes + ':' + seconds + "Z";
    };

    var getDateKey = function(){
        return date_key;
    };

    // Method to implement revert-button for text
    var revertText = function(){

        var newText = transformTextToHtml(backupDocument.text);

        $('#songText').html(newText);
        $('#songSheetID').html(backupDocument.id);
    };

    // revert function for metadates revert button
    var revertMetaData = function(){
        // check if the document still was edited or in design status
        if(backupDocument.processingStatus == "edited" || backupDocument.processingStatus == "design"){

            $('#inputIncludes').text(backupDocument.includes);
            $('#inputSignature').text(backupDocument.signature);
            $('#inputDateFindAid').text(backupDocument.dateFindAid);
            $('#inputReceivedOn').text(backupDocument.receivedOn);
            $('#inputOldSignature').text(backupDocument.oldSignature);

            $('#inputVersionNumber').text(backupDocument.versionNumber);
            $('#inputMissingCause').text(backupDocument.missingCause);
            $('#inputOrigin').text(backupDocument.origin);
            $('#inputTitle').text(backupDocument.title);
            $('#inputType').text(backupDocument.type);

            $('#inputIncipit').text(backupDocument.incipit);
            $('#inputNumberOfPages').text(backupDocument.numberOfPages);
            $('#inputSingPlace').text(backupDocument.singPlace);
            $('#inputRemark').text(backupDocument.remark);
            $('#inputLandscapeArchive').text(backupDocument.landscapeArchive);

            $('#inputPublication').text(backupDocument.publication);
            $('#inputSungOn').text(backupDocument.sungOn);
            $('#inputRecordedOn').text(backupDocument.recordedOn);
            $('#inputSubmittedOn').text(backupDocument.submittedOn);
            $('#inputSinger').text(backupDocument.singer);

            $('#inputReference').text(backupDocument.reference);
            $('#inputHandwrittenSource').text(backupDocument.handwrittenSource);
            $('#inputRecorder').text(backupDocument.recorder);
            $('#inputArchive').text(backupDocument.archive);
            
            // if the document had status unedited, just clear the input fields
        }else{
            $('#inputIncludes').text("");
            $('#inputSignature').text("");
            $('#inputDateFindAid').text("");
            $('#inputReceivedOn').text("");
            $('#inputOldSignature').text("");

            $('#inputVersionNumber').text("");
            $('#inputMissingCause').text("");
            $('#inputOrigin').text("");
            $('#inputTitle').text("");
            $('#inputType').text("");

            $('#inputIncipit').text("");
            $('#inputNumberOfPages').text("");
            $('#inputSingPlace').text("");
            $('#inputRemark').text("");
            $('#inputLandscapeArchive').text("");

            $('#inputPublication').text("");
            $('#inputSungOn').text("");
            $('#inputRecordedOn').text("");
            $('#inputSubmittedOn').text("");
            $('#inputSinger').text("");

            $('#inputReference').text("");
            $('#inputHandwrittenSource').text("");
            $('#inputRecorder').text("");
            $('#inputArchive').text("");
        }
    };

    that.showError = showError;
    that.showSuccess = showSuccess;
    that.init = init;
    that.currentTextData = currentTextData;
    that.updateTextData = updateTextData;
    that.getActualDocument = getActualDocument;
    that.setProcessingStatus = setProcessingStatus;
    that.continueInitProcess = continueInitProcess;
    that.setTimeAndPersonChanged = setTimeAndPersonChanged;
    that.getDateKey = getDateKey;
    that.putInputDataFromModalToCommonSearch = putInputDataFromModalToCommonSearch;

    return that;

};