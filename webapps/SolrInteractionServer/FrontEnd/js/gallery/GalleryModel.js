/*
    GalleryModel.js
    controlled by GalleryController
    executes some solr queries

*/

Gallery.GalleryModel = function(){

    var that = {};
    var ajax = new XMLHttpRequest();
    var queryResult = {};
    var DOCUMENTS_PER_PAGE = 9;

    var init = function(){

    };

    /*
    Send request to REST-API, only use processingStatus and start parameter
    to define query
    */
    var sendRequest = function(edited, design, unedited, start){
        var requestUrl = "";

        requestUrl += SERVERADDRESS + '/SolrInteractionServer/rest/ssc-api-read/searchableDocs/complexQuery?*:*';
        requestUrl += "&start=" + start + "&rows=" + DOCUMENTS_PER_PAGE;
        requestUrl += ((edited == 1) ? "&processingStatus=edited" : "");
        requestUrl += ((design == 1) ? "&processingStatus=design" : "");
        requestUrl += ((unedited == 1) ? "&processingStatus=unedited" : "");

        $.ajax({
            type     : "GET",
            url      : requestUrl,
            success  : function(msg){
                that.queryResult = msg;
                $(that).trigger("requestInitialized");
                return that.queryResult;
            },
            error    : function(msg) {
                console.log('Failed');
            }
        });
    };

    /*
    Method to save resultlist to local storage when opening new songsheet
    necessary for "Letztes Blatt"
    */
    var saveResultListToLS = function(queryResultsIds, date_key){
        
        var ids = queryResultsIds;

        if(queryResultsIds == 0){
            return;
        }

        try{
            // save id-list by timestamp if local storage has enough storage...
            var identifier = "resultList__" + date_key;
            localStorage[identifier] = JSON.stringify(ids);

        }catch(err){
            //... delete oldest lists by recursive strategy as long as necessary
            deleteOldestListAndTryAgain();
            saveResultListToLS(queryResultsIds, date_key);
        }
    };

    // Method to delete the oldest list in local storage to make space for a new one
    var deleteOldestListAndTryAgain = function(){
        var dates = [];

            for(var key in localStorage){
            var values = key.split("__");

            if(values[1] != undefined){
                console.log("Timestamp in dates: " + values[1]);
                dates.push(parseInt(values[1]));
                }
            
            }
            var oldestDate = Math.min.apply(Math, dates);
            var itemToDelete = "resultList__" + oldestDate;
            localStorage.removeItem(itemToDelete);
    };

    that.init = init;
    that.sendRequest = sendRequest;
    that.queryResult = queryResult;
    that.saveResultListToLS = saveResultListToLS;
    that.deleteOldestListAndTryAgain = deleteOldestListAndTryAgain;

    return that;
};