/*
    SearchModel.js
    controlled by SearchController
    executes some solr queries

*/

Search.SearchModel = function(){
    var that = {};
    var ajax = new XMLHttpRequest();
    var queryResult = {};

    var init = function(){

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
    /*
        send query and save the answer

        param
            request: request string
            documentsPerPage: how many documents are be shown in one pagination page of the resultlist
            start: the first songsheet that is shown in the resultlist
        
        requeststring is formatted according to REST-API:
        queryAll := a search-term to search in all Fields of a core (connected via OR), default is ""
        value := list of values to search in specific fields, default is an empty list
        field := list of fields in which the values are searched, default is an empty list
         sequence between value and field is important, search is connected via AND

         Examples:
         Returns everything 
         /ssc-api/read/searchableDocs/complexQuery
          
         Returns everything with "Kind":
         /ssc-api-read/searchableDocs/complexQuery/queryAll=Kind
         
         Returns everything with "Kind" and signature "A 2222" and archive "Bayern"
         /ssc-api-read/searchableDocs/complexQuery/queryAll=Kind&field=signature&value=A 2222
         &field=archive&value=Bayern
         
         Returns all docs with processingStatus edited, and start 0 and rows 20
         /ssc-api-read/searchableDocs/complexQuery/processingStatus=edited&start=0&rows=20

         Please consult REST-API Code and documentation for more information

    */
    var sendRequest = function(request, documentsPerPage, start){
        var requestUrl = "";

        requestUrl += SERVERADDRESS + "/SolrInteractionServer/rest/ssc-api-read/searchableDocs/complexQuery?"+ request;
        requestUrl += "&start=" + start + "&rows=" + documentsPerPage;

        $.ajax({
            type     : "GET",
            url      : requestUrl,
            success  : function(msg){
                that.queryResult = msg;
                console.log(that.queryResult);
                $(that).trigger("requestInitialized", start);
                return that.queryResult;
            },
            error    : function(msg) {
                console.log('Failed');
            }
        });
    };

    that.init = init;
    that.sendRequest = sendRequest;
    that.queryResult = queryResult;
    that.saveResultListToLS = saveResultListToLS;

    return that;
};