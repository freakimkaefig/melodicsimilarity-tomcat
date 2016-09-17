/*
    GalleryController.js
    manages the classes GalleryView.js, GalleryModel.js
    responsible for functionality on the GalleryView.html

*/

Gallery.GalleryController = function(){
    var that = {};

    var galleryModel = null;
    var galleryView = null;
    // number of the first document to show in the result list
    var start = 0;
    // read processingstatus from url (edited, design, unedited) (1: true, 0: false)
    var processingStatus = "";

    var init = function(){
        galleryModel = Gallery.GalleryModel();
        galleryView = Gallery.GalleryView();

        galleryModel.init();
        galleryView.init();

        // add some trigger event listeners
        $(galleryView).on("ViewReadyForRequest", executeRequest);
        $(galleryModel).on("requestInitialized", initQueryResults);

        $(galleryView).on("editedStatusChange", showNewPage);
        $(galleryView).on("designStatusChange", showNewPage);
        $(galleryView).on("uneditedStatusChange", showNewPage);

        $(galleryView).on("resultClicked", showSongSheetInNewList);

        $(galleryView).on("resultsRendered", fadeInResults);

        initURLParameter();

        console.log("hello world");
    };

    var fadeInResults = function(){
        $("#galleryResults").css({opacity: 0, visibility: "visible"}).animate({opacity: 1}, 1000);
        $("#footer").css({opacity: 0, visibility: "visible"}).animate({opacity: 1}, 1000);
    };

    /*
    Method to show a new page, with new request-data in the url
    URL defines start, which must be a multiplier of 9 (because rows is 9)
    and the states selected, by order and number if present or not (0 not, 1 yes)
    URL-FormForm: ?start=[multiplier of 9]&[0|1][0|1][0|1]
    Example: only edited and design on second page
    http://localhost:8080/SolrInteractionServer/FrontEnd/wp/GalleryView.html?start=9&110
    */
    var showNewPage = function(){
        location.replace("GalleryView.html?start=0&" + galleryView.edited + "" + galleryView.design + "" + galleryView.unedited);
    };
    // forces GalleryModel to execute the solr request with the selected processing status
    var executeRequest = function(){
        
        galleryModel.sendRequest(galleryView.edited, galleryView.design, galleryView.unedited, start);
        
        
    };
    /*
    check the url parameters
    has form: ?start=[multiplier of 9]&[0|1][0|1][0|1]
    first [0|1] is edited, second is design, third is unedited, 0 --> not in results, 1 --> in results
    */
    var initURLParameter = function(){
        var params = window.location.search.split("?")[1];

        start = params.split("&")[0].split("=")[1];
        processingStatus = params.split("&")[1];

        initViewForRequest();
    };
    // check the selected processing status for request
    var initViewForRequest = function(){
        var edited = ((processingStatus.charAt(0) == 1) ? 1 : 0);
        var design = ((processingStatus.charAt(1) == 1) ? 1 : 0);
        var unedited = ((processingStatus.charAt(2) == 1) ? 1 : 0);

        galleryView.setProcessingStatus(edited, design, unedited);
    };
    // force view to show the query results
    var initQueryResults = function(){
       var numFound = galleryModel.queryResult.numFound;
       var paginationSize = Math.ceil(numFound/9);
       var page = Math.floor((start)/9);
       
       galleryView.showQueryResults(galleryModel.queryResult, paginationSize, page);
    };

    // Method to open songsheet in new tab, list is list saved for gallery
    var showSongSheetInNewList = function(event, id, allIds, timestamp){

        galleryModel.saveResultListToLS(allIds, timestamp);
        
        var href = "LiedblattDetailView.html?id="+ id + "&date_key=" + timestamp;
        window.open(href, "_blank");
        
    };

    that.init = init;

    return that;
};