/*
    SearchController.js
    manages the classes SearchView.js and SearchModel.js
    responsible for functionality on the SearchView.html

*/

Search.SearchController = function(){
    var that = {};

    var searchModel = null;
    var searchView = null;
    // Boolean to check if theres need to scroll to first result of list e.g. first search
    var scrollEffectOn = true;

    // timestamp to save list when opening new songsheet
    var timeStampForResultList = 0;


    var init = function(){
        searchModel = Search.SearchModel();
        searchView = Search.SearchView();

        searchModel.init();
        searchView.init();

        $(searchModel).on("requestInitialized", initResultView);
        $(searchView).on("resultsRendered", renderResultsAndPagination);
        initSearchButtons();

    };

    /*
    Method to show resultlist when all images are successfully loaded
    and UI is ready to fadeIn
    */
    var renderResultsAndPagination = function(){
        var elementToScrollTo;
        // Change element to scroll to, according to extendedSearch shown or not
        if(searchView.getExtendedSearchVisibility() == -1){
            elementToScrollTo = $("#extendedSearch1Button");
        }else{
            elementToScrollTo = $("#recorderInput");
        }
        
        $("#paginationBottom").css({opacity: 0, visibility: "visible"}).animate({opacity: 1}, 1000);
        $("#displayResults").css({opacity: 0, visibility: "visible"}).animate({opacity: 1}, 1000);
        $("#footer").css({opacity: 0, visibility: "visible"}).animate({opacity: 1}, 1000);

        // Animate the scrollTo-Effect if necessary
        if(scrollEffectOn){
            $('html, body').animate({
                scrollTop: $(elementToScrollTo).offset().top
                }, 2000);
                $('html,body').stop(true, false).animate({scrollTop: $(elementToScrollTo).offset().top
                }, 2000);
        }
        scrollEffectOn = true;

        // Reset all click listener of pagination
        $(".paginationItem").off("click");
        $(".paginationLeft").off("click");
        $(".paginationRight").off("click");

        // Set click listener of pagination to start new search
        $('.paginationItem').click(function(){

            scrollEffectOn = false;
            searchView.initSearchRequestParam();
            buildRequest(($(this).text()-1) * searchView.DOCUMENTS_PER_PAGE);

        });

        var currentPagination = $($("li.active")[1]).text();
        var lastPage = $(".paginationItem").last().text();

        // Init left/right navigation of pagination according to situation
        if(currentPagination != 1){
            $(".leftPagination").removeClass("paginationInactive");
            $(".leftPagination").click(function(){
                scrollEffectOn = false;
                searchView.initSearchRequestParam();
                buildRequest((currentPagination-2) * searchView.DOCUMENTS_PER_PAGE);
            });
        }else{
            $(".leftPagination").addClass("paginationInactive");
        }
        
        if(currentPagination != lastPage){
            $(".rightPagination").removeClass("paginationInactive");
           $(".rightPagination").click(function(){
            scrollEffectOn = false;
            searchView.initSearchRequestParam();
            buildRequest((currentPagination) * searchView.DOCUMENTS_PER_PAGE);
            }); 
        }else{
            $(".rightPagination").addClass("paginationInactive");
        }
        
        
    };

    // Get search request parameter from view and force model to send the request
    var buildRequest = function(start){
        searchParam = searchView.searchRequestParam;
        var documentsPerPage = searchView.DOCUMENTS_PER_PAGE;

        searchModel.sendRequest(searchParam, documentsPerPage, start);
    };

    var initResultView = function(event, start){
        
        // Use scrollEffect to check if a new list has been requested and needs to be saved
        // for list in detailView in local storage
        if(scrollEffectOn){
            timeStampForResultList = Date.now();
            searchModel.saveResultListToLS(searchModel.queryResult.allIds, timeStampForResultList);
        }

        searchView.showQueryResults(searchModel.queryResult, start, timeStampForResultList);
    };

    var initSearchButtons = function(){
        $("#searchButton").on("click", function(){
            $('#loading-spinner-div-search').fadeIn();
            searchView.initSearchRequestParam();
            buildRequest(0);
        });

        // send search request on 'enter'
        $('.search-view input').keydown(function(e){
            if(e.keyCode == 13){
                $('#loading-spinner-div-search').fadeIn();
                searchView.initSearchRequestParam();
                buildRequest(0);
            }
        });
    };

    that.init = init;

    return that;
};