Analyse.AnalyseModel = function(){
    var that = {};

    var init = function(){
        // request all docs from solr-core to make calculations about processingStatus-Data
    	getAllDocs();
    };

    var getAllDocs = function(){

        // Send request to solr-core
    	$.ajax({
	        type     : "GET",
	        url      : SERVERADDRESS + "/SolrInteractionServer/rest/ssc-api-read/searchableDocs/complexQuery",
	        success  : function(msg, status){
	            console.log('Success ');
                // trigger success to start calculation
	            $(that).trigger("AllDocsFetched", msg);
	        },
	        error    : function(msg) {
	            console.log('Failed');
	        }
	    });
    };

    // Public Method to calculate all necessary data in controller
    // Returns js-Object with keys-number pairs of unedited, edited, design
    var getProcessingStatusData = function(docs){
        // Create Object to return
    	var processingStatus = {};
    	var unedited = 0;
    	var edited = 0;
    	var design = 0;

    	for(var i = 0; i < docs.length; i++){
    		var currentDoc = docs[i];
    		if(currentDoc.processingStatus == "edited"){
    			edited++;
    		}
    		if(currentDoc.processingStatus == "unedited"){
    			unedited++;
    		}
    		if(currentDoc.processingStatus == "design"){
    			design++;
    		}
    	}
    	processingStatus.edited = edited;
    	processingStatus.unedited = unedited;
    	processingStatus.design = design;

    	return processingStatus;
    };

    that.init = init;
    that.getProcessingStatusData = getProcessingStatusData;

    return that;
};