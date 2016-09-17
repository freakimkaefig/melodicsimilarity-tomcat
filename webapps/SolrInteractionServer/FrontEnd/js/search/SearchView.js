
/*
    SearchView.js
    responsible for the view in the SearchView.html
    controlled by SearchController
    creates and manages the main search results

*/

Search.SearchView = function(){
    var that = {};
    // represents whether the extended search is currently shown or not (1: true; -1: false)
    var extendedSearchVisibility = -1;
    // search parameter request string
    var searchRequestParam = "";
    // number of documents shown on one page of the pagination
    var DOCUMENTS_PER_PAGE = 10;
    var imgLoadCounter = 0;

    var searchRequest = {
        dateFindAid: "",
        text: "",
        receivedOn: "",
        signature: "",
        oldSignature: "",

        versionNumber: "",
        missingCause: "",
        origin: "",
        title: "",
        type: "",

        includes: "",
        incipit: "",
        numberOfPages: "",
        singPlace: "",
        remark: "",

        landscapeArchive: "",
        publication: "",
        sungOn: "",
        recordedOn: "",
        submittedOn: "",

        singer: "",
        reference: "",
        handwrittenSource: "",
        recorder: "",
        archive: "",
        lastChangedPerson: ""
    };

    var init = function(){

        $('#extendedSearch1').hide();
        $('#loading-spinner-div-search').hide();
        $('#resultsHeader').hide();
        $('#displayResults').hide();
        $("#searchAllInput").focus();
        $("#searchAllInput").select();

        searchRequestParam = "*:*";
        initClickEvents();

    };

    // init few click events
    var initClickEvents = function(){
        $('#refreshButton').on("click", clearSearchMask);
        $('#extendedSearch1Button').on("click", showExtendedSearch);
    };

    // show extended search according to current UI
    var showExtendedSearch = function(){
        event.preventDefault();

        if(extendedSearchVisibility == -1){
            $("#extendedSearch1I").removeClass("glyphicon-chevron-down");
            $("#extendedSearch1I").addClass("glyphicon-chevron-up");
            $('#extendedSearch1').fadeIn();
        }else{
            $("#extendedSearch1I").removeClass("glyphicon-chevron-up");
            $("#extendedSearch1I").addClass("glyphicon-chevron-down");
            $('#extendedSearch1').fadeOut();
        }

        extendedSearchVisibility *= -1;
    };

    // clear the search mask
    var clearSearchMask = function(){

        $("#dateFindAidInput").val("");
        $("#receivedOnInput").val("");
        $("#signatureInput").val("");
        $("#oldSignatureInput").val("");
        $("#versionNumberInput").val("");

        $("#missingCauseInput").val("");
        $("#originInput").val("");
        $("#titleInput").val("");
        $("#typeInput").val("");
        $("#includesInput").val("");

        $("#incipitInput").val("");
        $("#numberOfPagesInput").val("");
        $("#singPlaceInput").val("");
        $("#remarkInput").val("");
        $("#landscapeArchiveInput").val("");

        $("#publicationInput").val("");
        $("#sungOnInput").val("");
        $("#recordedOnInput").val("");
        $("#submittedOnInput").val("");
        $("#singerInput").val("");

        $("#referenceInput").val("");
        $("#handwrittenSourceInput").val("");
        $("#recorderInput").val("");
        $("#archiveInput").val("");
        $("#searchTextInput").val("");

        $('#searchAllInput').val("");
        $("#lastChangedPersonInput").val("");
    };

    // get the search request parameters of the search mask
    var initSearchRequestParam = function(){

        that.searchRequestParam = "";

        searchRequest.edited = $('#checkBoxEdited').is(':checked');
        searchRequest.unedited = $('#checkBoxUnedited').is(':checked');
        searchRequest.design = $('#checkBoxDesign').is(':checked');

        searchRequest.dateFindAid = $("#dateFindAidInput").val();
        searchRequest.receivedOn = $("#receivedOnInput").val();
        searchRequest.signature = cleanSignatureSearchInput($("#signatureInput").val());
        searchRequest.oldSignature = $("#oldSignatureInput").val();
        searchRequest.versionNumber = $("#versionNumberInput").val();

        searchRequest.missingCause = $("#missingCauseInput").val();
        searchRequest.origin = $("#originInput").val();
        searchRequest.title = $("#titleInput").val();
        searchRequest.type = $("#typeInput").val();
        searchRequest.includes = $("#includesInput").val();

        searchRequest.incipit = $("#incipitInput").val();
        searchRequest.numberOfPages = $("#numberOfPagesInput").val();
        searchRequest.singPlace = $("#singPlaceInput").val();
        searchRequest.remark = $("#remarkInput").val();
        searchRequest.landscapeArchive = $("#landscapeArchiveInput").val();

        searchRequest.publication = $("#publicationInput").val();
        searchRequest.sungOn = $("#sungOnInput").val();
        searchRequest.recordedOn = $("#recordedOnInput").val();
        searchRequest.submittedOn = $("#submittedOnInput").val();
        searchRequest.singer = $("#singerInput").val();

        searchRequest.reference = $("#referenceInput").val();
        searchRequest.handwrittenSource = $("#handwrittenSourceInput").val();
        searchRequest.recorder = $("#recorderInput").val();
        searchRequest.archive = $("#archiveInput").val();
        searchRequest.text = $("#searchTextInput").val();

        searchRequest.lastChangedPerson = $("#lastChangedPersonInput").val();

        searchRequest.searchAll = $('#searchAllInput').val();
        that.searchRequestParam += (searchRequest.searchAll != "") ? "queryAll=" + searchRequest.searchAll + "&": "";

        that.searchRequestParam += (searchRequest.dateFindAid != "") ? "value=" + searchRequest.dateFindAid + "&field=dateFindAid&" : "";
        that.searchRequestParam += (searchRequest.receivedOn != "") ? "value=" + searchRequest.receivedOn + "&field=receivedOn&" : "";
        that.searchRequestParam += (searchRequest.signature != "") ? "value=" + searchRequest.signature + "&field=signature&" : "";
        that.searchRequestParam += (searchRequest.oldSignature != "") ? "value=" + searchRequest.oldSignature + "&field=oldSignature&" : "";
        that.searchRequestParam += (searchRequest.versionNumber != "") ? "value=" + searchRequest.versionNumber + "&field=versionNumber&" : "";

        that.searchRequestParam += (searchRequest.missingCause != "") ? "value=" + searchRequest.missingCause + "&field=missingCause&" : "";
        that.searchRequestParam += (searchRequest.origin != "") ? "value=" + searchRequest.origin + "&field=origin&" : "";
        that.searchRequestParam += (searchRequest.title != "") ? "value=" + searchRequest.title + "&field=title&" : "";
        that.searchRequestParam += (searchRequest.type != "") ? "value=" + searchRequest.type + "&field=type&" : "";
        that.searchRequestParam += (searchRequest.includes != "") ? "value=" + searchRequest.includes + "&field=includes&" : "";

        that.searchRequestParam += (searchRequest.incipit != "") ? "value=" + searchRequest.incipit + "&field=incipit&" : "";
        that.searchRequestParam += (searchRequest.numberOfPages != "") ? "value=" + searchRequest.numberOfPages + "&field=numberOfPages&" : "";
        that.searchRequestParam += (searchRequest.singPlace != "") ? "value=" + searchRequest.singPlace + "&field=singPlace&" : "";
        that.searchRequestParam += (searchRequest.remark != "") ? "value=" + searchRequest.remark + "&field=remark&" : "";
        that.searchRequestParam += (searchRequest.landscapeArchive != "") ? "value=" + searchRequest.landscapeArchive + "&field=landscapeArchive&" : "";

        that.searchRequestParam += (searchRequest.publication != "") ? "value=" + searchRequest.publication + "&field=publication&" : "";
        that.searchRequestParam += (searchRequest.sungOn != "") ? "value=" + searchRequest.sungOn + "&field=sungOn&" : "";
        that.searchRequestParam += (searchRequest.recordedOn != "") ? "value=" + searchRequest.recordedOn + "&field=recordedOn&" : "";
        that.searchRequestParam += (searchRequest.submittedOn != "") ? "value=" + searchRequest.submittedOn + "&field=submittedOn&" : "";
        that.searchRequestParam += (searchRequest.singer != "") ? "value=" + searchRequest.singer + "&field=singer&" : "";

        that.searchRequestParam += (searchRequest.reference != "") ? "value=" + searchRequest.reference + "&field=reference&" : "";
        that.searchRequestParam += (searchRequest.handwrittenSource != "") ? "value=" + searchRequest.handwrittenSource + "&field=handwrittenSource&" : "";
        that.searchRequestParam += (searchRequest.recorder != "") ? "value=" + searchRequest.recorder + "&field=recorder&" : "";
        that.searchRequestParam += (searchRequest.archive != "") ? "value=" + searchRequest.archive + "&field=archive&" : "";
        that.searchRequestParam += (searchRequest.text != "") ? "value=" + searchRequest.text + "&field=text&" : "";
        that.searchRequestParam += (searchRequest.lastChangedPerson != "") ? "value=" + searchRequest.lastChangedPerson + "&field=lastChangedPerson&" : "";

        that.searchRequestParam += (searchRequest.edited) ? "processingStatus=edited&" : "";
        that.searchRequestParam += (searchRequest.unedited) ? "processingStatus=unedited&" : "";
        that.searchRequestParam += (searchRequest.design) ? "processingStatus=design&" : "";

        var requestLength = that.searchRequestParam.length;
        // delete the last "&" from the search parameter request string
        if (that.searchRequestParam.substr(requestLength-1, requestLength) == "&"){
            that.searchRequestParam = that.searchRequestParam.substr(0, requestLength-1);
        }

    };

     var cleanSignatureSearchInput = function(string){

        // clean signature search input of whitespaces and characters because it caused unintentional search behaviour

        var newString = string.replace(' ','');
        newString = newString.replace('a', '');
        newString = newString.replace('A', '');
        newString = newString.replace('b', '');
        newString = newString.replace('B', '');
        newString = newString.replace('c', '');
        newString = newString.replace('C', '');
        newString = newString.replace('d', '');
        newString = newString.replace('D', '');
        newString = newString.replace('e', '');
        newString = newString.replace('E', '');
        newString = newString.replace('f', '');
        newString = newString.replace('F', '');
        newString = newString.replace('g', '');
        newString = newString.replace('G', '');
        newString = newString.replace('h', '');
        newString = newString.replace('H', '');
        newString = newString.replace('i', '');
        newString = newString.replace('I', '');
        newString = newString.replace('j', '');
        newString = newString.replace('J', '');
        newString = newString.replace('k', '');
        newString = newString.replace('K', '');
        newString = newString.replace('l', '');
        newString = newString.replace('L', '');
        newString = newString.replace('m', '');
        newString = newString.replace('M', '');
        newString = newString.replace('n', '');
        newString = newString.replace('N', '');
        newString = newString.replace('o', '');
        newString = newString.replace('O', '');
        newString = newString.replace('p', '');
        newString = newString.replace('P', '');
        newString = newString.replace('q', '');
        newString = newString.replace('Q', '');
        newString = newString.replace('r', '');
        newString = newString.replace('R', '');
        newString = newString.replace('s', '');
        newString = newString.replace('S', '');
        newString = newString.replace('t', '');
        newString = newString.replace('T', '');
        newString = newString.replace('u', '');
        newString = newString.replace('U', '');
        newString = newString.replace('v', '');
        newString = newString.replace('V', '');
        newString = newString.replace('w', '');
        newString = newString.replace('W', '');
        newString = newString.replace('x', '');
        newString = newString.replace('X', '');
        newString = newString.replace('y', '');
        newString = newString.replace('Y', '');
        newString = newString.replace('z', '');
        newString = newString.replace('Z', '');

        return newString;

    };


    // Build the results of a query
    var showQueryResults = function(msg, start, date_key){

        hideResultElements();

        imgLoadCounter = 0;
        var documents = msg.documents;
        var hlt = msg.highlighting;
        var numFound = msg.numFound;
        var currentPagination = (start/10);
        
        //Reset the Resultlist
        resetResultList();

        //Render Information how many results are found
        buildNumFoundSnippet(numFound);

        var pagNumber = 0;
        if((numFound % DOCUMENTS_PER_PAGE) == 0){
            pagNumber = parseInt(numFound / DOCUMENTS_PER_PAGE);
        }else{
            pagNumber = parseInt(numFound / DOCUMENTS_PER_PAGE) + 1;
        }

        buildPagination(pagNumber, currentPagination);
        // init documents array
        documents = Array.prototype.slice.call(documents, 0, DOCUMENTS_PER_PAGE);

        $.each(documents, function(i, doc) {

            var metaDataSnippet = '<p class="metaDataSnippet">';
            var snippet = "";
            var highlighting = "";
            var snippetArray = [];
            console.log(doc);

            // build array with highlighting snippets
            for(property in hlt[doc.id]){
                snippetArray.push(property);
            };


            //Snippet for text gets build, if text ist in snippetArray
            if(jQuery.inArray("text",snippetArray) != -1){
                $.each(hlt[doc.id].text, function(j, htltext){
                    highlighting += '<span>' + htltext + ' ... </span>';
                })

                //If text is in SnippetArray, remove text from snippetarray
                snippetArray = jQuery.grep(snippetArray, function(value) {
                    return value != "text";
                });
                //Now you can build the snippet for the metadata
                $.each(snippetArray, function(k, hltmetadata){
                    metaDataSnippet += translateMetaData(hltmetadata) + ': ' + hlt[doc.id][hltmetadata] + '; ';;
                })

            //If theres no snippet for text, schow the first 600 chars of the text
            }else{
                var text = doc.text.substring(0,600);
                if(text == ""){
                    text = "Kein Liedtext vorhanden.";
                }
                highlighting += '<span>' + text + '... </span>';

                //Show the metadata snippet if its there
                $.each(snippetArray, function(k, hltmetadata){
                    metaDataSnippet += (translateMetaData(hltmetadata)) + ': ' + hlt[doc.id][hltmetadata] + '; ';;
                })
            };

            //Build the html for one resultitem, starting with the inner stuff
            var href = "LiedblattDetailView.html?id="+ doc.id + "&date_key=" + date_key;
            var status = getStatus(doc);

            snippet = addImageAndIncipit(snippet, doc, status, href);
            metaDataSnippet = finishMetaDataSnippet(snippetArray, metaDataSnippet, doc);

            snippet += '<div class="col-md-9"><p>' +  highlighting;
            snippet += metaDataSnippet + '</div></div></div></a>';

            $('#displayResults').append(snippet);

        })
    
        /*
        Wait to load all images before continuing logic
        and letting results fade in
        Method gets invoked when a thumbanil is loaded,
        and get counted up to absolute number of thumbnails loaded
        via imgLoadCounter (only cosmetic feature)
        */

        $(".image-thumbnail").on('load', function() {
          
          imgLoadCounter = imgLoadCounter + 1;

          if(imgLoadCounter == $(".image-thumbnail").length){
            imgLoadCounter = 0;
            
            
            $(that).trigger("resultsRendered");
          }
          
        });
        $('#loading-spinner-div-search').hide();
        showResultElements();
     
    };

    var hideResultElements = function(){
        $("#displayResults").css("visibility", "hidden");
        $("#paginationBottom").css("visibility", "hidden");
        $("#footer").css("visibility", "hidden");

        $("#displayResults").css("opacity", 0);
        $("#paginationBottom").css("opacity", 0);
        $("#footer").css("opacity", 0);
    };

    var showResultElements = function(){
        
        $('#resultsHeader').fadeIn();
        $('#displayResults').fadeIn();
    };

    var resetResultList = function(){
        $('#displayResults').children().remove();
        $('#resultsHeader').children().remove();
        $('#paginationTop').children().remove();
        $('#paginationBottom').children().remove();
    };

    var buildNumFoundSnippet = function(numFound){
        var numFoundsnippet = "";
        numFoundsnippet += '<p>';
        numFoundsnippet += (numFound > 1) ? numFound + " Dokumente gefunden." : "";
        numFoundsnippet += (numFound == 1) ? numFound + " Dokument gefunden." : "";
        numFoundsnippet += (numFound == 0) ? "Keine Ergebnisse gefunden." : "";
        numFoundsnippet += '</p>';

        $('#resultsHeader').append(numFoundsnippet);
    };

    var finishMetaDataSnippet = function(snippetArray, metaDataSnippet, doc){
        if(jQuery.inArray("signature",snippetArray) == -1){
                metaDataSnippet += 'Signaturnummer: '+ ((doc.hasOwnProperty("signature")) && doc.signature != "" ? doc.signature : "unbekannt") + '; ';
            }
        if(jQuery.inArray("archive",snippetArray) == -1){
                metaDataSnippet += 'Archiv: ' + ((doc.hasOwnProperty("archive")) && doc.archive != "" ? doc.archive : "unbekannt") + '; ';
            }
        if(jQuery.inArray("archive",snippetArray) == -1){
                metaDataSnippet += 'Erhalten am: ' + ((doc.hasOwnProperty("receivedOn")) && doc.receivedOn != "" ? doc.receivedOn : "unbekannt");
            }
        metaDataSnippet += '</p>';
        return metaDataSnippet;
    };

    var addImageAndIncipit = function(snippet, doc, status, href){
        //href gets set no matter what
            snippet += '<a style="text-decoration: none;" title="Liedblatt in neuem Tab öffnen" href=' + href + " target='_blank'>";
            //incipit gets set as incipit or as 'kein incipit vorhanden' if not
            snippet += '<div class="resultItems"><div class="incipitHeadline">' + ((doc.hasOwnProperty("incipit")) ? doc.incipit : "Kein Incipit vorhanden");
            snippet += '</div>';
            snippet += '<div class="row"><div class="col-md-3">';

            snippet += '<img src="../img/jpegs/thumbnail.' + doc.imagename + '" class="image-thumbnail" style="width: 70%; height: 70%; display: block; margin-left: auto; margin-right: auto;"><div class="' + status + '"></div></div>';

            return snippet;
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

    var buildInBetweenPagination = function(paginationSize, currentPagination){
        
        paginationStart = 1;
        // Build first page button and ... part
        $('#paginationTop').append('<li><a href="#searchButton" class="paginationItem">' + paginationStart + '</a></li>');
        $('#paginationBottom').append('<li><a href="#searchButton" class="paginationItem">' + paginationStart + '</a></li>');
        $("#paginationTop").append('<li><a class="paginationInactive" href="#searchButton">' + '...' + '</a></li>');
        $("#paginationBottom").append('<li><a class="paginationInactive" href="#searchButton">' + '...' + '</a></li>');
        // define range of page buttons in the middle
        var startPagination = currentPagination - 2;
        var endPagination = currentPagination + 3;

        for(i = startPagination; i < endPagination; i++){
                    if(i == currentPagination){
                    $('#paginationTop').append('<li class="active"><a href="#searchButton" class="paginationItem">' + (i+1) + '</a></li>');
                    $('#paginationBottom').append('<li class="active"><a href="#searchButton" class="paginationItem">' + (i+1) + '</a></li>');
                    }else{
                    $('#paginationTop').append('<li><a href="#searchButton" class="paginationItem">' + (i+1) + '</a></li>');
                    $('#paginationBottom').append('<li><a href="#searchButton" class="paginationItem">' + (i+1) + '</a></li>');
                    }
                    
                }
        // Build last page button and .. part
        paginationEnd = paginationSize;
        $("#paginationTop").append('<li><a class="paginationInactive" href="#searchButton">' + '...' + '</a></li>');
        $("#paginationBottom").append('<li><a class="paginationInactive" href="#searchButton">' + '...' + '</a></li>');
        $('#paginationTop').append('<li><a href="#searchButton" class="paginationItem">' + paginationEnd + '</a></li>');
        $('#paginationBottom').append('<li><a href="#searchButton" class="paginationItem">' + paginationEnd + '</a></li>');

    };

    var buildLeftIsMorePagination = function(paginationSize, currentPagination){
        paginationStart = 1;

        // Build first page button and ... part
        $('#paginationTop').append('<li><a href="#searchButton" class="paginationItem">' + paginationStart + '</a></li>');
        $('#paginationBottom').append('<li><a href="#searchButton" class="paginationItem">' + paginationStart + '</a></li>');
        $("#paginationTop").append('<li><a class="paginationInactive" href="#searchButton">' + '...' + '</a></li>');
        $("#paginationBottom").append('<li><a class="paginationInactive" href="#searchButton">' + '...' + '</a></li>');

        // Last seven pages are shown
        var shownPagination = paginationSize - 7;
        
        for(i = shownPagination; i < paginationSize; i++){
                    if(i == currentPagination){
                    $('#paginationTop').append('<li class="active"><a href="#searchButton" class="paginationItem">' + (i+1) + '</a></li>');
                    $('#paginationBottom').append('<li class="active"><a href="#searchButton" class="paginationItem">' + (i+1) + '</a></li>');
                    }else{
                    $('#paginationTop').append('<li><a href="#searchButton" class="paginationItem">' + (i+1) + '</a></li>');
                    $('#paginationBottom').append('<li><a href="#searchButton" class="paginationItem">' + (i+1) + '</a></li>');
                    }
                    
                }

        
    };

    var buildRightIsMorePagination = function(paginationSize, currentPagination){
        
        //First seven pages are shown
        for(i = 0; i < 7; i++){
                    if(i == currentPagination){
                    $('#paginationTop').append('<li class="active"><a href="#searchButton" class="paginationItem">' + (i+1) + '</a></li>');
                    $('#paginationBottom').append('<li class="active"><a href="#searchButton" class="paginationItem">' + (i+1) + '</a></li>');
                    }else{
                    $('#paginationTop').append('<li><a href="#searchButton" class="paginationItem">' + (i+1) + '</a></li>');
                    $('#paginationBottom').append('<li><a href="#searchButton" class="paginationItem">' + (i+1) + '</a></li>');
                    }
                    
                }
        paginationEnd = paginationSize;
        // Build last Page and ... part
        $("#paginationTop").append('<li><a class="paginationInactive" href="#searchButton">' + '...' + '</a></li>');
        $("#paginationBottom").append('<li><a class="paginationInactive" href="#searchButton">' + '...' + '</a></li>');
        $('#paginationTop').append('<li><a href="#searchButton" class="paginationItem">' + paginationEnd + '</a></li>');
        $('#paginationBottom').append('<li><a href="#searchButton" class="paginationItem">' + paginationEnd + '</a></li>');
    };

    var buildStandardPagination = function(paginationSize, currentPagination){
        for(i = 0; i < paginationSize; i++){
                    if(i == currentPagination){
                    $('#paginationTop').append('<li class="active"><a href="#searchButton" class="paginationItem">' + (i+1) + '</a></li>');
                    $('#paginationBottom').append('<li class="active"><a href="#searchButton" class="paginationItem">' + (i+1) + '</a></li>');
                    }else{
                    $('#paginationTop').append('<li><a href="#searchButton" class="paginationItem">' + (i+1) + '</a></li>');
                    $('#paginationBottom').append('<li><a href="#searchButton" class="paginationItem">' + (i+1) + '</a></li>');
                    }
                    
                }
    };

    // Method to build a left-button for pagination
    var buildLeftPagination = function(paginationSize, currentPagination){
        $("#paginationTop").append('<li><a class="leftPagination" href="#searchButton">' + '<' + '</a></li>');
        $("#paginationBottom").append('<li><a class="leftPagination" href="#searchButton">' + '<' + '</a></li>');

    };

    // Method to build a right-button for pagination
    var buildRightPagination = function(paginationSize, currentPagination){
        $("#paginationTop").append('<li><a class="rightPagination" href="#searchButton">' + '>' + '</a></li>');
        $("#paginationBottom").append('<li><a class="rightPagination" href="#searchButton">' + '>' + '</a></li>');
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
    // get first character of a word as the upper case
    var firstLetterBig = function(word){
        var firstLetter = word.charAt(0).toUpperCase();
        var newWord = firstLetter + word.substring(1, word.length);
        return newWord;

    };
    // translate the meta data names from english to german
    var translateMetaData = function(data){
        switch (data){
            case "signature": return "Signaturnummer";
            case "dateFindAid": return "Dat. Findbuch";
            case "receivedOn": return "Erhalten am";
            case "oldSignature": return "Altsignatur";
            case "versionNumber": return "Versionsnummer";

            case "missingCause": return "Fehlt, weil...";
            case "origin": return "Herkunft";
            case "title": return "Titel";
            case "type": return "Liedgattung";
            case "includes": return "Umfasst";

            case "incipit": return "Incipit";
            case "numberOfPages": return "Blattzahl";
            case "singPlace": return "Sangesort";
            case "remark": return "Bemerkung";
            case "landscapeArchive": return "Landschaftsarchiv";

            case "publication": return "Veröffentlichung";
            case "sungOn": return "Gesungen am";
            case "recordedOn": return "Aufgezeichnet am";
            case "submittedOn": return "Eingesandt am";
            case "singer": return "Sänger/in";

            case "reference": return "Verweis";
            case "handwrittenSource": return "Quelle";
            case "recorder": return "Aufzeichner";
            case "archive": return "Archivort";
            case "lastChangedPerson": return "Zuletzt geändert von";
        }
    };

    var getExtendedSearchVisibility = function(){
        return extendedSearchVisibility;
    };


    that.init = init;
    that.searchRequestParam = searchRequestParam;
    that.initSearchRequestParam = initSearchRequestParam;
    that.showQueryResults = showQueryResults;
    that.DOCUMENTS_PER_PAGE = DOCUMENTS_PER_PAGE;
    that.getExtendedSearchVisibility = getExtendedSearchVisibility;

    return that;

};