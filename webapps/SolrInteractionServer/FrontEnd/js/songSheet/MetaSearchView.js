
/*
    MetaSearchView.js
    responsible for the view of the metadata search in the LiedblattDetailView.html
    controlled by SongSheetController
    creates and handles the meta data result tables in the common search environment and the meta data modal

*/

SongSheet.MetaSearchView = function(){
    var that = {};
    // request parameters for the meta data search
    var metaSearchRequestParam = "";
    // local representation of a meta data set
    var currentMetaData = {};
    // number of already sent meta data search queries with the actual search parameters, important for the "view more meta data" - function
    var numberOfMetaQueries = 0;

    var init = function(actualDocument){

        $('.scrollAbleMetaWindow').hide();
        $('#loading-spinner-div').hide();
        $('#loading-spinner-div-modal').hide();
        $('#showDetailedMetaData').hide();

        currentMetaData = {
            dateFindAid: "",
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
            archive: ""
        };
    };

    // get meta data search request parameters from the search mask
    var initMetaSearchRequestParam = function(){
        that.metaSearchRequestParam = "";
        var searchInput = $("#metaSearchTextInput").val();
        var cleanSearchInput = "";

        if((searchInput != "") && ($("#metaSearchSelect").val() == 'signature')){
            cleanSearchInput = cleanSignatureSearchInput(searchInput);
        }else{
            cleanSearchInput = $("#metaSearchTextInput").val();
        }

        if(cleanSearchInput != ""){
            that.metaSearchRequestParam = "value="+ (($("#metaSearchSelect").val() == 'signature') ? (cleanSearchInput+"*") : $("#metaSearchTextInput").val());
            that.metaSearchRequestParam += "&field="+$("#metaSearchSelect").val();
            that.metaSearchRequestParam += "&value="+ (($("#metaSearchSelect").val() == 'signature') ? (cleanSearchInput) : $("#metaSearchTextInput").val());
            that.metaSearchRequestParam += "&field="+$("#metaSearchSelect").val();
            that.metaSearchRequestParam += "&op=OR";
        }else{
             that.metaSearchRequestParam = "";
        }     
    };

    var initMetaSearchRequestParamModal = function(){
        that.metaSearchRequestParam = "";
        var searchInput = $("#metaSearchTextInputModal").val();
        var cleanSearchInput = "";

        if((searchInput != "") && ($("#metaSearchSelectModal").val() == 'signature')){
            cleanSearchInput = cleanSignatureSearchInput(searchInput);
        }else{
            cleanSearchInput = $("#metaSearchTextInputModal").val();
        }

        if(cleanSearchInput != ""){
            that.metaSearchRequestParam = "value="+ (($("#metaSearchSelectModal").val() == 'signature') ? (cleanSearchInput+"*") : $("#metaSearchTextInputModal").val());
            that.metaSearchRequestParam += "&field="+$("#metaSearchSelectModal").val();
            that.metaSearchRequestParam += "&value="+ (($("#metaSearchSelectModal").val() == 'signature') ? (cleanSearchInput) : $("#metaSearchTextInputModal").val());
            that.metaSearchRequestParam += "&field="+$("#metaSearchSelectModal").val();
            that.metaSearchRequestParam += "&op=OR";
        }else{
             that.metaSearchRequestParam = "";
        }
    };

    // remove whitespaces and characters from the signature search input because it causes unintended search problems
    var cleanSignatureSearchInput = function(string){

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

    // load current metadata in the input fields
    var initCurrentMetaData = function(){

        $("#inputReceivedOn").html(currentMetaData.receivedOn);
        $("#inputSignature").html(currentMetaData.signature);
        $("#inputOldSignature").html(currentMetaData.oldSignature);
        $("#inputVersionNumber").html(currentMetaData.versionNumber);
        $("#inputMissingCause").html(currentMetaData.missingCause);

        $("#inputOrigin").html(currentMetaData.origin);
        $("#inputTitle").html(currentMetaData.title);
        $("#inputType").html(currentMetaData.type);
        $("#inputIncludes").html(currentMetaData.includes);
        $("#inputIncipit").html(currentMetaData.incipit);

        $("#inputNumberOfPages").html(currentMetaData.numberOfPages);
        $("#inputSingPlace").html(currentMetaData.singPlace);
        $("#inputRemark").html(currentMetaData.remark);
        $("#inputLandscapeArchive").html(currentMetaData.landscapeArchive);
        $("#inputPublication").html(currentMetaData.publication);

        $("#inputSungOn").html(currentMetaData.sungOn);
        $("#inputRecordedOn").html(currentMetaData.recordedOn);
        $("#inputSubmittedOn").html(currentMetaData.submittedOn);
        $("#inputSinger").html(currentMetaData.singer);
        $("#inputReference").html(currentMetaData.reference);

        $("#inputHandwrittenSource").html(currentMetaData.handwrittenSource);
        $("#inputRecorder").html(currentMetaData.recorder);
        $("#inputArchive").html(currentMetaData.archive);
        $("#inputDateFindAid").html(currentMetaData.dateFindAid);
    };

    // initialize the meta data that is selected in the meta data search results table
    var initSelectedMetaData = function(sig){

        var metaDataSelected = {};
        var sigNumber = "";

        sigNumber = sig.substr(2, sig.length);

        $.ajax({
            type     : "GET",
            url      : "http://localhost:8080/SolrInteractionServer/rest/ssc-api-read/metaData/complexQuery?value="+ sigNumber + "&field=signature",
            success  : function(msg){
                console.log('Success ');
                metaDataSelected = msg.documents[0];

                currentMetaData = {
                    dateFindAid: metaDataSelected.dateFindAid,
                    receivedOn: metaDataSelected.receivedOn,
                    signature: metaDataSelected.signature,
                    oldSignature: metaDataSelected.oldSignature,
                    versionNumber: metaDataSelected.versionNumber,

                    missingCause: metaDataSelected.missingCause,
                    origin: metaDataSelected.origin,
                    title: metaDataSelected.title,
                    type: metaDataSelected.type,
                    includes: metaDataSelected.includes,

                    incipit: metaDataSelected.incipit,
                    numberOfPages: metaDataSelected.numberOfPages,
                    singPlace: metaDataSelected.singPlace,
                    remark: metaDataSelected.remark,
                    landscapeArchive: metaDataSelected.landscapeArchive,

                    publication: metaDataSelected.publication,
                    sungOn: metaDataSelected.sungOn,
                    recordedOn: metaDataSelected.recordedOn,
                    submittedOn: metaDataSelected.submittedOn,
                    singer: metaDataSelected.singer,

                    reference: metaDataSelected.reference,
                    handwrittenSource: metaDataSelected.handwrittenSource,
                    recorder: metaDataSelected.recorder,
                    archive: metaDataSelected.archive
                };

                return 1;
            },
            error    : function(msg) {
                console.log('Failed');
            }
        });

    };

    // show the meta data search results in the table
    var initMetaResultsView = function(response){

        var msg = response.documents;

        /* delete table content, if query gets initialized for the first time */
        if(that.numberOfMetaQueries == 0){
            clearResultTables();
        }

        //check if results exist
        if(msg.length == 0 && that.numberOfMetaQueries == 0){
            $('#displayMetaResults').append('<p style="text-align: left; padding: 5px;">Keine Metadaten gefunden.</p>');
        }else{
            $('.metaDataLastRow').remove();

            /* append table headlines if query gets initialized for the first time*/
            if(that.numberOfMetaQueries == 0){
                var metaDataTableHead = "";
                var metaModalTableHead = "";

                metaDataTableHead +='<thead><tr id="metaDataTableHeadRow" style="font-weight: bold; text-align: left;"><td width="15%">Signatur</td><td width="85%">Incipit</td></tr></thead>';
                metaModalTableHead = buildMetaModalTableHead(metaModalTableHead);

                $('#displayMetaResults').append(metaDataTableHead);
                $('#displayMetaResultsModal').append(metaModalTableHead);
            }

            // create table row for each element in the result list separately for the common search and the modal
            $.each(msg, function(i, metadata) {
                var snippet = "";
                var snippetModal = "";

                snippet = buildSnippet(snippet, metadata);
                snippetModal = buildSnippetForModal(snippetModal, metadata);

                $('#displayMetaResults').append(snippet);
                $('#displayMetaResultsModal').append(snippetModal);
            })

            // display 'more' dialog at the end of the table if there are more results available
            if(response.numFound - (that.numberOfMetaQueries*100) > 100){
                $('#displayMetaResults').append('<tr class="metaDataLastRow"><td colspan="2"><span id="moreMetaData">Zeige mehr Metadaten an</span></td></tr>');
                $('#displayMetaResultsModal').append('<tr class="metaDataLastRow"><td colspan="24"><span id="moreMetaDataModal">Zeige mehr Metadaten an</span></td></tr>');
            }
        }
        // fade in the elements that got created after the request
        handleAfterRequstElementVisibility();
        // add click listener to the row items in the result tables (common environment and modal)
        requestFinished();
        $(that).trigger("afterRequest");
    };
    // clear the result tables (common search environment and modal)
    var clearResultTables = function(){
        $('#displayMetaResults').children().remove();
        $('#displayMetaResultsModal').children().remove();
    };
    // build the table head for the modal after request
    var buildMetaModalTableHead = function(metaModalTableHead){
        metaModalTableHead += '<thead><tr id="metaDataTableHeadRowModal" style="font-weight: bold; text-align: left;">';
        metaModalTableHead += '<td>Signatur</td><td>Incipit</td><td>Datum Findbuch</td><td>Erhalten am</td><td>Altsignatur</td>';
        metaModalTableHead += '<td>Versionsnummer</td><td>Fehlt, weil</td><td>Herkunft</td><td>Titel</td><td>Liedgattung</td>';
        metaModalTableHead += '<td>Umfasst</td><td>Blattzahl</td><td>Sangesort</td><td>Bemerkung</td><td>Landschaftsarchiv</td>';
        metaModalTableHead += '<td>Veröffentlichung</td><td>Gesungen am</td><td>Aufgezeichnet am</td><td>Eingesandt am</td><td>S&auml;nger/in</td>';
        metaModalTableHead += '<td>Verweis</td><td>Quelle</td><td>Aufzeichner</td><td>Archivort</td></tr></thead>';
        return metaModalTableHead;

    };
    // build the table for the common search environment after request
    var buildSnippet = function(snippet, metadata){
        snippet += '<tr class="metaDataRow" style="cursor: default; text-align: left;"><td width="15%">' + metadata.signature + '</td><td width="85%">' + metadata.incipit + '</td>';
        snippet += '</tr>';
        return snippet;
    };
    // build the table for the meta data modal after request
    var buildSnippetForModal = function(snippetModal, metadata){
        snippetModal += '<tr class="metaDataRow" style="cursor: default; text-align: left;"><td>' + metadata.signature + '</td>';
        snippetModal += '<td>' + metadata.incipit + '</td>';
        snippetModal += '<td>' + metadata.dateFindAid + '</td>';
        snippetModal += '<td>' + metadata.receivedOn + '</td>';
        snippetModal += '<td>' + metadata.oldSignature + '</td>';

        snippetModal += '<td>' + metadata.versionNumber + '</td>';
        snippetModal += '<td>' + metadata.missingCause + '</td>';
        snippetModal += '<td>' + metadata.origin + '</td>';
        snippetModal += '<td>' + metadata.title + '</td>';
        snippetModal += '<td>' + metadata.type + '</td>';

        snippetModal += '<td>' + metadata.includes + '</td>';
        snippetModal += '<td>' + metadata.numberOfPages + '</td>';
        snippetModal += '<td>' + metadata.singPlace + '</td>';
        snippetModal += '<td>' + metadata.remark + '</td>';
        snippetModal += '<td>' + metadata.landscapeArchive + '</td>';

        snippetModal += '<td>' + metadata.publication + '</td>';
        snippetModal += '<td>' + metadata.sungOn + '</td>';
        snippetModal += '<td>' + metadata.recordedOn + '</td>';
        snippetModal += '<td>' + metadata.submittedOn + '</td>';
        snippetModal += '<td>' + metadata.singer + '</td>';

        snippetModal += '<td>' + metadata.reference + '</td>';
        snippetModal += '<td>' + metadata.handwrittenSource + '</td>';
        snippetModal += '<td>' + metadata.recorder + '</td>'
        snippetModal += '<td>' + metadata.archive + '</td>';
        snippetModal += '</tr>';
        return snippetModal;
    };
    // fade-out and -in of elements after the search results are initialized
    var handleAfterRequstElementVisibility = function(){
        $('#loading-spinner-div').fadeOut();
        $('#loading-spinner-div-modal').fadeOut();
        $('#showDetailedMetaData').fadeIn();
        $('.scrollAbleMetaWindow').fadeIn();
    };

    // add click events to the rows in the meta data result tables
    var requestFinished = function(){

            $('.metaDataRow').on("click", function(){
                // show the buttons for connecting the metadata with the songsheet if one row is selected
                $('#connectMetaData').fadeIn();
                $('#connectMetaDataModal').fadeIn();
                // remove the highlighting class "success" in every table row in common search environment and in modal
                $('.metaDataRow').removeClass('success');
                // check which row number the selected row has in the whole table
                var row = $(this).parent().children().index($(this));

                // add the success class to the table rows in the common search environment and in the modal to highlight it with green color
                $('#displayMetaResults tr').eq(row+1).addClass('success');
                $('#displayMetaResultsModal tr').eq(row+1).addClass('success');

                // save the signature of the selected metadata
                var selectedItemSig = $(this).find('td:first').html();

                // local saving of the selected meta data
                initSelectedMetaData(selectedItemSig);
            
            });
    };
    // update the local currentMetaData object
    var updateMetaData = function(processingStatus){

        that.currentMetaData.dateFindAid = $("#inputDateFindAid").html();
        that.currentMetaData.receivedOn = $("#inputReceivedOn").html();
        that.currentMetaData.signature = $("#inputSignature").html();
        that.currentMetaData.oldSignature = $("#inputOldSignature").html();
        that.currentMetaData.versionNumber = $("#inputVersionNumber").html();

        that.currentMetaData.missingCause = $("#inputMissingCause").html();
        that.currentMetaData.origin = $("#inputOrigin").html();
        that.currentMetaData.title = $("#inputTitle").html();
        that.currentMetaData.type = $("#inputType").html();
        that.currentMetaData.includes = $("#inputIncludes").html();

        that.currentMetaData.incipit = $("#inputIncipit").html();
        that.currentMetaData.numberOfPages = $("#inputNumberOfPages").html();
        that.currentMetaData.singPlace = $("#inputSingPlace").html();
        that.currentMetaData.remark = $("#inputRemark").html();
        that.currentMetaData.landscapeArchive = $("#inputLandscapeArchive").html();

        that.currentMetaData.publication = $("#inputPublication").html();
        that.currentMetaData.sungOn = $("#inputSungOn").html();
        that.currentMetaData.recordedOn = $("#inputRecordedOn").html();
        that.currentMetaData.submittedOn = $("#inputSubmittedOn").html();
        that.currentMetaData.singer = $("#inputSinger").html();

        that.currentMetaData.reference = $("#inputReference").html();
        that.currentMetaData.handwrittenSource = $("#inputHandwrittenSource").html();
        that.currentMetaData.recorder = $("#inputRecorder").html();
        that.currentMetaData.archive = $("#inputArchive").html();

        that.currentMetaData.processingStatus = processingStatus;

        // Save user information to metadates
        var user = Cookies.get('username');
        if(user == undefined){
            user = "";
        }
        that.currentMetaData.lastChangedPerson = user;
        
        // Save date information to metadates
        var date = new Date(Date.now());
        date = toW3CString(date);
        that.currentMetaData.lastChangedDate = date;

        $(that).trigger("metaDataUpdated");

    };

    // transform javascript date to solr date
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

    // manage the number of already sent meta data search queries
    var incrementNumberOfMetaQueries = function(){
      that.numberOfMetaQueries += 1;
    };

    var resetNumberOfMetaQueries = function(){
        that.numberOfMetaQueries = 0;
    };

    that.init = init;
    that.metaSearchRequestParam = metaSearchRequestParam;
    that.initMetaSearchRequestParam = initMetaSearchRequestParam;
    that.initCurrentMetaData = initCurrentMetaData;
    that.currentMetaData = currentMetaData;
    that.initMetaResultsView = initMetaResultsView;
    that.updateMetaData = updateMetaData;
    that.numberOfMetaQueries = numberOfMetaQueries;
    that.incrementNumberOfMetaQueries = incrementNumberOfMetaQueries;
    that.resetNumberOfMetaQueries = resetNumberOfMetaQueries;
    that.initMetaSearchRequestParamModal = initMetaSearchRequestParamModal;

    return that;

};