/*
    SongSheetController.js
    manages the classes MetaSearchView.js, MetaSearchModel.js, SongSheetView.js and SongSheetModel.js
    responsible for functionality on the LiedblattDetailView.html
    
    Uses shiftzoom for zooming and drag/drop of songsheet picture: http://www.netzgesta.de/shiftzoom/
*/

SongSheet.SongSheetController = function(){
    var that = {};

    var metaSearchModel = null;
    var metaSearchView = null;
    var songSheetModel = null;
    var songSheetView = null;
    
    // displays if meta data search environment is the common search or the modal
    var metaSearchEnvironment = "common";

    var init = function(){

        metaSearchModel = SongSheet.MetaSearchModel();
        metaSearchView = SongSheet.MetaSearchView();
        songSheetModel = SongSheet.SongSheetModel();
        songSheetView = SongSheet.SongSheetView();
        // initialize trigger event listener

        /*
        First listen and wait for resultlist to be set in background
        */
        $(songSheetView).on("DocumentsSet", continueInit);
        $(songSheetView).on("NothingSet", getFullList);

        // React to empty list (no list set on click on "letztes blatt") or deletion
        $(songSheetModel).on("AllDocsFetched", setNewListAndRefresh);
        $(songSheetModel).on("HandleDelete", handleDelete);


        $(metaSearchView).on("afterRequest", metaRequestFinished);

        // Show message when document thats requested doesn't exist
        $(songSheetView).on("documentDeleted", showDocDeleteMessage);

        songSheetModel.init();
        songSheetView.init();

        initMetaDataSearchButtons();
        initButtonClickEvents();
    };

    // continue init if resultlist for navigiation is set
    var continueInit = function(){

        songSheetView.continueInitProcess();

        metaSearchModel.init();
        metaSearchView.init(songSheetView.getActualDocument());
        

        $(metaSearchModel).on("requestInitialized", initMetaResultsView);
        $(metaSearchView).on("metaDataUpdated", forceTextUpdate);
        $(songSheetView).on("textDataUpdated", updateBackEndData);

        $(songSheetModel).on("UploadSuccess", showSuccess);
        $(songSheetModel).on("UploadError", showError);
    };

    var getFullList = function(){
        songSheetModel.getAllDocs();
    };

    // If no resultlist for navigatioin is saved in local storage, start new list
    // new list is entire storage with first element --> refresh
    var setNewListAndRefresh = function(event, message){
        
        var date_key = Date.now();
        localStorage["resultList__" + date_key] = JSON.stringify(message.allIds);
        //what if list doesnt exist but document?
        localStorage["currentId"] = message.allIds[0];

        window.location.href = "LiedblattDetailView.html?id=" + message.allIds[0] + "&date_key=" + date_key;
    };

    /*
    Method to show changes a user makes to processingstatus
    */
    var showSuccess = function(){
        songSheetView.setTimeAndPersonChanged(metaSearchView.currentMetaData.lastChangedDate, metaSearchView.currentMetaData.lastChangedPerson);
        songSheetView.setProcessingStatus(metaSearchView.currentMetaData.processingStatus);
        songSheetView.showSuccess(metaSearchView.currentMetaData.processingStatus);

    };

    var showError = function(event, messageError){
        songSheetView.showError(messageError);
    };

    /*
    Method to show error-message
    if songsheet doesn't exist anymore
    */
    var showDocDeleteMessage = function(){

        $("#docDeletedMessage").show();
        $("#main-container").fadeIn();
        $(".row").hide();
    };

    // Get metadata search request parameter from view and force model to send the request
    var buildRequest = function(){
        metaSearchParam = metaSearchView.metaSearchRequestParam;
        console.log("SP " + metaSearchParam + "; number of Meta Queries: "+ metaSearchView.numberOfMetaQueries);
        metaSearchModel.sendRequest(metaSearchParam, metaSearchView.numberOfMetaQueries);
    };

    // Force view to display the meta data search results
    var initMetaResultsView = function(){
        metaSearchView.initMetaResultsView(metaSearchModel.metaQueryResults);
    };

    // Delete document-id from resultlist in local storage
    // and refresh page on new position in list
    var handleDelete = function(event, id){
        var date_key = songSheetView.getDateKey();
        var lsKey = "resultList__" + date_key;
        var list = JSON.parse(localStorage[lsKey]);
        var index = 0;
        var newId = "";

        for(var i = 0; i < list.length; i++){
            if(list[i] == id){
                index = i;
                break;
            }
        }

        // If list only contains one element, refresh page without new list
        // --> first element of entire corpus gets shown
        if(list.length == 1){
            localStorage.removeItem(lsKey);
            localStorage.removeItem("currentId");
            localStorage.removeItem("current_date_key");
            window.location.replace("SearchView.html");
        }
        if(list.length > 1){
            // if current doc is first in list, show next doc
            if(index == 0){
                newId = list[index+1];
            }
            // if current doc isn't first in the list, show document from before
            if(index > 0){
                newId = list[index-1];
            }
            list.splice(index, 1);
            localStorage[lsKey] = JSON.stringify(list);
            window.location.replace("LiedblattDetailView.html?id=" + newId + "&date_key=" + date_key);
        }

    };

    // set click events for the metadata search buttons and make 'enter' key available
    // For normal view (common) and the modal (both views are synchronized)
    var initMetaDataSearchButtons = function(){

        $("#metaSearchButton").click(function(){
        $('#loading-spinner-div').fadeIn();
        $('#connectMetaData').hide();
        $('#connectMetaDataModal').hide();
        metaSearchEnvironment = "common";
        metaSearchView.resetNumberOfMetaQueries();
        metaSearchView.initMetaSearchRequestParam();
        buildRequest();
    });

    $('#metaSearchTextInput').keydown(function(e){
        if(e.keyCode == 13){
            $('#loading-spinner-div').fadeIn();
            $('#connectMetaData').hide();
            $('#connectMetaDataModal').hide();
            metaSearchEnvironment = "common";
            metaSearchView.resetNumberOfMetaQueries();
            metaSearchView.initMetaSearchRequestParam();
            buildRequest();
        }
    });

    $("#metaSearchButtonModal").click(function(){
        $('#loading-spinner-div-modal').fadeIn();
        $('#connectMetaData').hide();
        $('#connectMetaDataModal').hide();
        metaSearchEnvironment = "modal";
        metaSearchView.resetNumberOfMetaQueries();
        metaSearchView.initMetaSearchRequestParamModal();
        buildRequest();
    });

    $('#metaSearchTextInputModal').keydown(function(e){
        if(e.keyCode == 13){
            $('#loading-spinner-div-modal').fadeIn();
            $('#connectMetaData').hide();
            $('#connectMetaDataModal').hide();
            metaSearchEnvironment = "modal";
            metaSearchView.resetNumberOfMetaQueries();
            metaSearchView.initMetaSearchRequestParamModal();
            buildRequest();
        }
    });
    };
    // adding click events to the buttons
    // common as well as modal
    var initButtonClickEvents = function(){

        // load selected metadata from search in the input fields
        $('#connectMetaData').on("click",function(){
            metaSearchView.initCurrentMetaData();

            $('#detailBox1').fadeOut(function(){
                $('#metaDataSearchBox').hide(function(){
                    $('.detailViewContentButton').removeClass('active');
                    $('ul#songSheetContentPanel li:nth-child(2)').addClass('active');
                    $('#currentMetaDataBox').fadeIn();
                });
            });

        });

        $('#connectMetaDataModal').on("click",function(){
            songSheetView.putInputDataFromModalToCommonSearch();
            metaSearchView.initCurrentMetaData();

            $('#detailBox1').fadeOut(function(){
                $('#metaDataSearchBox').hide(function(){
                    $('.detailViewContentButton').removeClass('active');
                    $('ul#songSheetContentPanel li:nth-child(2)').addClass('active');
                    $('#currentMetaDataBox').fadeIn();
                });
            });

        });

        // Set button to set document "edited" (processingStatus)
        $('#acceptChangesButton').on("click", function(){
            var processingStatus = "edited";
            metaSearchView.updateMetaData(processingStatus);
        });

        // Set button to set document "design" (processingStatus)
        $('#desingChangesButton').on("click", function(){
            var processingStatus = "design";
            metaSearchView.updateMetaData(processingStatus);
        });

        // Set deleteButton
        $("#confirmDeleteSongSheetButton").on("click", function(){
            songSheetModel.startDeleteProcess();
        });


    };

    var forceTextUpdate = function(){
        songSheetView.updateTextData();
    };

    // Main Method to upadate a document with all text changes and metaData changes
    var updateBackEndData = function (){

        songSheetView.currentTextData.text = transformHtmlToText(songSheetView.currentTextData.text);
        transformMetadataToText();
        var text = songSheetView.currentTextData;
        var meta = metaSearchView.currentMetaData;

        songSheetModel.updateSongSheetData(text, meta);
    };

    var transformMetadataToText = function(){

        for(var key in metaSearchView.currentMetaData){
            
            metaSearchView.currentMetaData[key] = transformHtmlToText(metaSearchView.currentMetaData[key]);
        }
    };

    /*
    Method to transform the editable HTML to text
    Removing html-elements but also keeping new line information
    */
    var transformHtmlToText = function(html){
        if(html.substring(0, 5) == "<div>"){
            html = html.substring(5);
        }else{
            html = html.replace("<div>", "\n");
        }
        html = html.replace(/<\/div><div>/g, "\n");

        if(html.substring(html.length - 6) == "</div>"){
            html = html.substring(0, html.length - 6);
        }

        html = html.replace(/<br>/g, "");
        var div = "<div>" + html + "</div>";
        var rawText = $(div).text();
        // Replacing all < and > so nothing gets interpreted as html in Front end
        rawText = rawText.replace(/</g, "&lt;");
        rawText = rawText.replace(/>/g, "&gt;");

        return rawText;
    };

    // add click events to the table rows of the meta data search results when the request is finished
    var metaRequestFinished = function(){
        metaSearchView.incrementNumberOfMetaQueries();

        $('#moreMetaData').on("click", function(){
            $('#loading-spinner-div').fadeIn();
            metaSearchEnvironment = "common";
            metaSearchView.initMetaSearchRequestParam();
            buildRequest();
        });

        $('#moreMetaDataModal').click(function(){
            $('#loading-spinner-div-modal').fadeIn();
            metaSearchEnvironment = "modal";
            metaSearchView.initMetaSearchRequestParamModal();
            buildRequest();
        });
    };

    that.init = init;

    return that;
};