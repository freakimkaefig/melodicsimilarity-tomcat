/*
    MetaSearchModel.js
    controlled by SongSheetController
    executes some solr queries

*/

SongSheet.MetaSearchModel = function(){
    var that = {};
    var metaQueryResults = {};

    var init = function(){

    };

    /*
    Request search from REST-API
    Resource is /metaData/complexQuery
    Following QueryParams are according to REST-API
    Please refer to Documentation or REST-API Code for further information
    */
    var sendRequest = function(request, numOfQueries){
            $.ajax({
                type     : "GET",
                url      : SERVERADDRESS + "/SolrInteractionServer/rest/ssc-api-read/metaData/complexQuery?"+ request + '&start=' + (numOfQueries*100),
                success  : function(msg){
                    console.log('Success');
                    console.log(msg.response);
                    that.metaQueryResults = msg;
                    console.log("trigger!");
                    $(that).trigger("requestInitialized");
                    return that.queryResult;
                },
                error    : function(msg) {
                    console.log('Failed');
                }
            });

    };

    that.metaQueryResults = metaQueryResults;
    that.init = init;
    that.sendRequest = sendRequest;

    return that;
};