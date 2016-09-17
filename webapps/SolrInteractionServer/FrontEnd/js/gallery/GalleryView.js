/*
    GalleryView.js
    controlled by SearchController
    creates and shows the result list shown in the gallery

*/

Gallery.GalleryView = function(){
    var that = {};

    // represents the currently selected processing status (1: true, 0: false)
    var edited = 1;
    var design = 1;
    var unedited = 1;
    // Save how many jpgs are loaded, to fadeIn only when all jpgs are loaded
    var imgLoadCounter = 0;
    // timestamp to save list when opening new songsheet
    var timeStampForResultList = 0;

    var init = function(){

        initButtonClickEventsView();

    };
    /*
        add click events to gallery buttons
    */
    var initButtonClickEventsView = function(){

        $('#editedButton').on("click", function(){
            if (that.edited == 1) that.edited = 0; else that.edited = 1;
            $(that).trigger("editedStatusChange");
            setButtonStatus();
        });

        $('#designButton').on("click", function(){
            if (that.design == 1) that.design = 0; else that.design = 1;
            $(that).trigger("designStatusChange");
            setButtonStatus();
        });

        $('#uneditedButton').on("click", function(){
            if (that.unedited == 1) that.unedited = 0; else that.unedited = 1;
            $(that).trigger("uneditedStatusChange");
            setButtonStatus();
        });


    };
    // display massage if no songsheets could be found with requested parameters
    var showNoResultsMessage = function(){
        
        var text = "Die Liedblattsammlung enthält momentan <em>keine</em> Liedblätter mit den ausgewählten Bearbeitungszuständen.";
        
        $("#resultsNumFound").html(text);
        $("#resultsNumFound").fadeIn();
    };
    // display that no processing status is selected
    var showNothingSelected = function(){
        var text = "Bitte wählen Sie mindestens <em>einen</em> Bearbeitungszustand aus!";
        $("#resultsNumFound").html(text);
        $("#resultsNumFound").fadeIn();
    };

    var showQueryResults = function(msg, paginationSize, page){

        var documents = msg.documents;
        var numFound = msg.numFound;
        var allIds = msg.allIds;

        if(numFound == 0){
            showNoResultsMessage();
            return;
        }

        if(that.edited == 0 && that.unedited == 0 && that.design == 0){
            showNothingSelected();
            return;
        }

        buildPagination(paginationSize, page);

        // Display the range of documents shown, by index in resultlist
        if(!(((page+1)*9) > numFound)){
            $('#galleryResultsHeader').append('<p>Dokumente: ' + ((page*9) + 1) + ' - ' + ((page+1)*9) + ' von insgesamt ' + numFound + '.</p>');
        }else{
            $('#galleryResultsHeader').append('<p>Dokumente: ' + ((page*9) + 1) + ' - ' + numFound + ' von insgesamt ' + numFound + '.</p>');
        }


        var gallerySnippet = "";
        //Reset the Resultlist
        $('#galleryResultsLeft').children().remove();
        $('#galleryResultsMiddle').children().remove();
        $('#galleryResultsRight').children().remove();

        var leftGalleryArray = documents.slice(0,3);
        var middleGalleryArray = documents.slice(3,6);
        var rightGalleryArray = documents.slice(6,9);

        var leftGallerySnippet = "";
        var middleGallerySnippet = "";
        var rightGallerySnippet = "";
        // build upper row
        $.each(leftGalleryArray, function(k, iteml){

            var id = iteml.id;

            leftGallerySnippet += '<div id="' + id + '" class="col-md-4 galleryResultItems">';
            leftGallerySnippet += '<div class="row"><div class="col-md-6"><img src="../img/jpegs/thumbnail.';
            leftGallerySnippet += iteml.imagename + '" class="image-thumbnail" style="width: 110%; height: 110%; display: block; margin-left: auto; margin-right: auto; padding-top:14px;">';
            leftGallerySnippet += '<div class="' + getStatus(iteml) +'2'+ '"></div></div>';
            leftGallerySnippet += '<div class="col-md-6" style="padding-top:12px;"><p class="galleryMetaData">Signatur: ';
            leftGallerySnippet += ((iteml.hasOwnProperty("signature")) && iteml.signature != "" ? iteml.signature : "unbekannt") + '</p>';
            leftGallerySnippet += '<p class="galleryMetaData">Archiv: ' + ((iteml.hasOwnProperty("archive")) && iteml.archive != "" ? iteml.archive : "unbekannt") + '</p>';
            leftGallerySnippet += '<p class="galleryMetaData">Datum: ' + ((iteml.hasOwnProperty("dateFindAid")) && iteml.dateFindAid != "" ? iteml.dateFindAid : "unbekannt") + '</p></div></div>';
            leftGallerySnippet += '<p style="padding-left: 3px;">' + ((iteml.hasOwnProperty("incipit")) && iteml.incipit != "" ? iteml.incipit : "Kein Incipit vorhanden") + '</p></div>';

        })
        // build middle row
        $.each(middleGalleryArray, function(k, itemm){

            var id = itemm.id;

            middleGallerySnippet += '<div id="' + id + '" class="col-md-4 galleryResultItems">';
            middleGallerySnippet += '<div class="row"><div class="col-md-6"><img src="../img/jpegs/thumbnail.';
            middleGallerySnippet += itemm.imagename + '" class="image-thumbnail" style="width: 110%; height: 110%; display: block; margin-left: auto; margin-right: auto; padding-top:14px;">';
            middleGallerySnippet += '<div class="' + getStatus(itemm) +'2'+ '"></div></div>';
            middleGallerySnippet += '<div class="col-md-6" style="padding-top:12px;"><p class="galleryMetaData">Signatur: ';
            middleGallerySnippet += ((itemm.hasOwnProperty("signature")) && itemm.signature != "" ? itemm.signature : "unbekannt") + '</p>';
            middleGallerySnippet += '<p class="galleryMetaData">Archiv: ' + ((itemm.hasOwnProperty("archive")) && itemm.archive != "" ? itemm.archive : "unbekannt") + '</p>';
            middleGallerySnippet += '<p class="galleryMetaData">Datum: ' + ((itemm.hasOwnProperty("dateFindAid")) && itemm.dateFindAid != "" ? itemm.dateFindAid : "unbekannt") + '</p></div></div>';
            middleGallerySnippet += '<p style="padding-left: 3px;">' + ((itemm.hasOwnProperty("incipit")) && itemm.incipit != "" ? itemm.incipit : "Kein Incipit vorhanden") + '</p></div>';

        })
        // build bottom row
        $.each(rightGalleryArray, function(k, itemr){

            var id = itemr.id;

            rightGallerySnippet += '<div id="' + id + '" class="col-md-4 galleryResultItems">';
            rightGallerySnippet += '<div class="row"><div class="col-md-6"><img src="../img/jpegs/thumbnail.';
            rightGallerySnippet += itemr.imagename + '" class="image-thumbnail" style="width: 110%; height: 110%; display: block; margin-left: auto; margin-right: auto; padding-top:14px;">';
            rightGallerySnippet += '<div class="' + getStatus(itemr) +'2'+ '"></div></div>';
            rightGallerySnippet += '<div class="col-md-6" style="padding-top:12px;"><p class="galleryMetaData">Signatur: ';
            rightGallerySnippet += ((itemr.hasOwnProperty("signature")) && itemr.signature != "" ? itemr.signature : "unbekannt") + '</p>';
            rightGallerySnippet += '<p class="galleryMetaData">Archiv: ' + ((itemr.hasOwnProperty("archive")) && itemr.archive != "" ? itemr.archive : "unbekannt") + '</p>';
            rightGallerySnippet += '<p class="galleryMetaData">Datum: ' + ((itemr.hasOwnProperty("dateFindAid")) && itemr.dateFindAid != "" ? itemr.dateFindAid : "unbekannt") + '</p></div></div>';
            rightGallerySnippet += '<p style="padding-left: 3px;">' + ((itemr.hasOwnProperty("incipit")) && itemr.incipit != "" ? itemr.incipit : "Kein Incipit vorhanden") + '</p></div>';

        })

        $('#galleryResultsLeft').append(leftGallerySnippet);
        $('#galleryResultsMiddle').append(middleGallerySnippet);
        $('#galleryResultsRight').append(rightGallerySnippet);

        // Set Timestamp for resultlist, to save list to local storage when songsheet is opened
        timeStampForResultList = Date.now();
        // Make all songsheets clickable
        setClickListener(allIds);

        /*
        Only fadeIn UI when all images are loaded (just cosmetic feature)
        Method gets fired for every image loaded, when 9 images are loaded
        UI can be shown
        */
        $(".image-thumbnail").on('load', function() {
          
          imgLoadCounter = imgLoadCounter + 1;

          if(imgLoadCounter == $(".image-thumbnail").length){
            imgLoadCounter = 0;
            $(that).trigger("resultsRendered");
          }
          
        });
    };

    var setClickListener = function(allIds){
        $(".galleryResultItems").on("click", function(event){
            $(that).trigger("resultClicked", [event.currentTarget.id, allIds, timeStampForResultList]); 
        });
    };

    var setProcessingStatus = function(editedn, designn, uneditedn){

        that.edited = editedn;
        that.design = designn;
        that.unedited = uneditedn;

        setButtonStatus();
        setButtonTitles();

        $(that).trigger("ViewReadyForRequest");
    };

    // set and remove class "active" from gallery status buttons, according to selection
    var setButtonStatus = function(){
        $('#editedButton').removeClass("active");
        $('#designButton').removeClass("active");
        $('#uneditedButton').removeClass("active");

        if(that.edited == 1) $('#editedButton').addClass("active");
        if(that.design == 1) $('#designButton').addClass("active");
        if(that.unedited == 1) $('#uneditedButton').addClass("active");
    };

    // set hover text for the gallery status buttons, according to selection
    var setButtonTitles = function(){
        if(that.edited == 1) $('#editedButton').prop('title', 'Fertig editierte Liedblätter ausblenden'); else $('#editedButton').prop('title', 'Fertig editierte Liedblätter anzeigen');
        if(that.design == 1) $('#designButton').prop('title', 'Bearbeitete Liedblätter ausblenden'); else $('#designButton').prop('title', 'Bearbeitete Liedblätter anzeigen');
        if(that.unedited == 1) $('#uneditedButton').prop('title', 'Unbearbeitete Liedblätter ausblenden'); else $('#uneditedButton').prop('title', 'Unbearbeitete Liedblätter anzeigen');
    };

    var getStatus = function(document){
        if('processingStatus' in document){
            var ps = document.processingStatus;
            switch(ps){
                case 'edited':
                    return 'statusDone';
                case 'design':
                    return 'statusProgressing';
                case 'unedited':
                    return 'statusNothing';
                default:
                    return 'statusNothing';
            }
        }else{
            return 'statusNothing';
        }
    };

    /*
    Method to build custom pagination, needs size of pagination and the current page
    Pagination is build step by step
    Different Methods are invoked according to different situations
    */
    var buildPagination = function(paginationSize, currentPagination){
        // If pagination has more than one element, a left button is somehow required
        if(paginationSize > 1){
            buildLeftPagination(paginationSize, currentPagination);
            // If the number of pages is between 1 and 9 build a standard pagination
            if(paginationSize <= 9){
                buildStandardPagination(paginationSize, currentPagination);
                // If the number of pages is higher than 9, not all pages can be shown
            }else{
                // If the currentPagination is smaller than 4, only on the right side
                // are more pages than can be shown, so this UI-Part has to be adapted
                if(currentPagination < 4){
                    buildRightIsMorePagination(paginationSize, currentPagination);
                }else{
                    // If the current Pagination is on the latter part of the list, only
                    // on the left side are more pages than can be shown, so this UI-Part has to be adapted
                    if(currentPagination > (paginationSize-5)){
                    buildLeftIsMorePagination(paginationSize, currentPagination);
                    }else{
                        // If the number of pages is to big, and the current page is in the middle
                        // on the left and the right part, not all page-buttons can be shown
                        buildInBetweenPagination(paginationSize, currentPagination);
                    }
                }
                
            }
            // If pagination has more than one element, a right button is somehow required
                buildRightPagination(paginationSize, currentPagination);
            }
    };

    // Method to get the link for a new gallerypage according to pagination
    var getHref = function(pageNumber){
        var newStart = ((pageNumber-1)*9);
        var href = "GalleryView.html?start=" + newStart + "&" + that.edited + "" + that.design + "" + that.unedited;
        return href;
    };

    var buildInBetweenPagination = function(paginationSize, currentPagination){
        
        paginationStart = 1;
        // Build first page button and ... part
        $('#paginationTop').append('<li><a href="' + getHref(paginationStart) + '" class="paginationItem">' + paginationStart + '</a></li>');
        $('#paginationBottom').append('<li><a href="' + getHref(paginationStart) + '" class="paginationItem">' + paginationStart + '</a></li>');
        $("#paginationTop").append('<li><a class="paginationInactive" href="">' + '...' + '</a></li>');
        $("#paginationBottom").append('<li><a class="paginationInactive" href="">' + '...' + '</a></li>');
        // define range of page buttons in the middle
        var startPagination = currentPagination - 2;
        var endPagination = currentPagination + 3;

        for(i = startPagination; i < endPagination; i++){
                    if(i == currentPagination){
                    $('#paginationTop').append('<li class="active"><a href="' + getHref(i+1) + '" class="paginationItem">' + (i+1) + '</a></li>');
                    $('#paginationBottom').append('<li class="active"><a href="' + getHref(i+1) + '" class="paginationItem">' + (i+1) + '</a></li>');
                    }else{
                    $('#paginationTop').append('<li><a href="#' + getHref(i+1) + '" class="paginationItem">' + (i+1) + '</a></li>');
                    $('#paginationBottom').append('<li><a href="' + getHref(i+1) + '" class="paginationItem">' + (i+1) + '</a></li>');
                    }
                    
                }

        paginationEnd = paginationSize;

        // Build last page button and .. part
        $("#paginationTop").append('<li><a class="paginationInactive" href="">' + '...' + '</a></li>');
        $("#paginationBottom").append('<li><a class="paginationInactive" href="">' + '...' + '</a></li>');
        $('#paginationTop').append('<li><a href="' + getHref(paginationEnd) + '" class="paginationItem">' + paginationEnd + '</a></li>');
        $('#paginationBottom').append('<li><a href="' + getHref(paginationEnd) + '" class="paginationItem">' + paginationEnd + '</a></li>');

    };

    var buildLeftIsMorePagination = function(paginationSize, currentPagination){
        paginationStart = 1;
        // Build first page button and ... part
        $('#paginationTop').append('<li><a href="' + getHref(paginationStart) + '" class="paginationItem">' + paginationStart + '</a></li>');
        $('#paginationBottom').append('<li><a href="' + getHref(paginationStart) + '" class="paginationItem">' + paginationStart + '</a></li>');
        $("#paginationTop").append('<li><a class="paginationInactive" href="">' + '...' + '</a></li>');
        $("#paginationBottom").append('<li><a class="paginationInactive" href="">' + '...' + '</a></li>');

        // Last seven pages are shown
        var shownPagination = paginationSize - 7;
        for(i = shownPagination; i < paginationSize; i++){
                    if(i == currentPagination){
                    $('#paginationTop').append('<li class="active"><a href="' + getHref(i+1) + '" class="paginationItem">' + (i+1) + '</a></li>');
                    $('#paginationBottom').append('<li class="active"><a href="' + getHref(i+1) + '" class="paginationItem">' + (i+1) + '</a></li>');
                    }else{
                    $('#paginationTop').append('<li><a href="' + getHref(i+1) + '" class="paginationItem">' + (i+1) + '</a></li>');
                    $('#paginationBottom').append('<li><a href="' + getHref(i+1) + '" class="paginationItem">' + (i+1) + '</a></li>');
                    }
                    
                }

        
    };

    var buildRightIsMorePagination = function(paginationSize, currentPagination){
        
        //First seven pages are shown
        for(i = 0; i < 7; i++){
                    if(i == currentPagination){
                    $('#paginationTop').append('<li class="active"><a href="' + getHref(i+1) + '" class="paginationItem">' + (i+1) + '</a></li>');
                    $('#paginationBottom').append('<li class="active"><a href="' + getHref(i+1) + '" class="paginationItem">' + (i+1) + '</a></li>');
                    }else{
                    $('#paginationTop').append('<li><a href="' + getHref(i+1) + '" class="paginationItem">' + (i+1) + '</a></li>');
                    $('#paginationBottom').append('<li><a href="' + getHref(i+1) + '" class="paginationItem">' + (i+1) + '</a></li>');
                    }
                    
                }
        paginationEnd = paginationSize;
        // Build last Page and ... part
        $("#paginationTop").append('<li><a class="paginationInactive" href="">' + '...' + '</a></li>');
        $("#paginationBottom").append('<li><a class="paginationInactive" href="">' + '...' + '</a></li>');
        $('#paginationTop').append('<li><a href="' + getHref(paginationEnd) + '" class="paginationItem">' + paginationEnd + '</a></li>');
        $('#paginationBottom').append('<li><a href="' + getHref(paginationEnd) + '" class="paginationItem">' + paginationEnd + '</a></li>');
    };

    var buildStandardPagination = function(paginationSize, currentPagination){
        for(i = 0; i < paginationSize; i++){
                    if(i == currentPagination){
                    $('#paginationTop').append('<li class="active"><a href="' + getHref(i+1) + '" class="paginationItem">' + (i+1) + '</a></li>');
                    $('#paginationBottom').append('<li class="active"><a href="' + getHref(i+1) + '" class="paginationItem">' + (i+1) + '</a></li>');
                    }else{
                    $('#paginationTop').append('<li><a href="' + getHref(i+1) + '" class="paginationItem">' + (i+1) + '</a></li>');
                    $('#paginationBottom').append('<li><a href="' + getHref(i+1) + '" class="paginationItem">' + (i+1) + '</a></li>');
                    }
                    
                }
    };

    // Method to build a left-button for pagination
    var buildLeftPagination = function(paginationSize, currentPagination){

        var href = getHref(currentPagination);
        if(currentPagination != 0){
            buildLeftArrow(href);
            $("#paginationTop").append('<li><a class="leftPagination" href="' + getHref(currentPagination) + '">' + '<' + '</a></li>');
            $("#paginationBottom").append('<li><a class="leftPagination" href="' + getHref(currentPagination) + '">' + '<' + '</a></li>');
        }else{
            $("#paginationTop").append('<li><a class="leftPagination paginationInactive">' + '<' + '</a></li>');
            $("#paginationBottom").append('<li><a class="leftPagination paginationInactive">' + '<' + '</a></li>');
        }
        

    };

    // Method to build the left-arrow of UI
    var buildLeftArrow = function(href){
        $("#leftLinkAnkor").attr("href", href);
        $("#leftLinkAnkor").show();
    };

    // Method to build the right-button for pagination
    var buildRightPagination = function(paginationSize, currentPagination){
        var nextPage = currentPagination+2;
        var href = getHref(nextPage);
        if(nextPage <= paginationSize){
            buildRightArrow(href);
            $("#paginationTop").append('<li><a class="rightPagination" href="' + getHref(nextPage) + '">' + '>' + '</a></li>');
            $("#paginationBottom").append('<li><a class="rightPagination" href="' + getHref(nextPage) + '">' + '>' + '</a></li>');
        }else{
            $("#paginationTop").append('<li><a class="rightPagination paginationInactive">' + '>' + '</a></li>');
            $("#paginationBottom").append('<li><a class="rightPagination paginationInactive">' + '>' + '</a></li>');
        }
        
    };

    // Method to build the right arrow for UI
    var buildRightArrow = function(href){
        $("#rightLinkAnkor").attr("href", href);
        $("#rightLinkAnkor").show();
    };



    that.init = init;
    that.showQueryResults = showQueryResults;

    that.edited = edited;
    that.design = design;
    that.unedited = unedited;
    that.setProcessingStatus = setProcessingStatus;
    that.buildPagination = buildPagination;

    return that;

};