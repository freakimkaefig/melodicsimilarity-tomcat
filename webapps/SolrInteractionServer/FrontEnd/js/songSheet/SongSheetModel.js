/*
    SongSheetModel.js
    controlled by SongSheetController
    executes some solr queries

*/

SongSheet.SongSheetModel = function(){

    var that = {};

    /*
        object that represents the songsheet that is actually
        shown in the LiedBlattDetailView.html
    */
    var songSheetData = {};

    var init = function(){
        songSheetData = {

            text: "",
            id: "",

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
            archive: "",
            processingStatus: "",
            lastChangedDate: "",
            lastChangedPerson: ""
        };
    };

    // Method to get all docs if no resultlist is in local storage for navigation
    // --> start page with new list as full corpus on first item
    var getAllDocs = function(){
        $.ajax({
            type     : "GET",
            url      : SERVERADDRESS + "/SolrInteractionServer/rest/ssc-api-read/searchableDocs/complexQuery",
            success  : function(msg){
                console.log("success");
                $(that).trigger("AllDocsFetched", msg);
            },
            error    : function(msg) {
                console.log('Failed');
            }
        });
    };

    /*
        method to update the songsheet data object in this model
        also sending server request to update the songsheet data on the server

        param
            text: songsheet text that is actually typed in the text input
            meta: meta data that is actually typed in the meta data input fields
    */

    var updateSongSheetData = function (text, meta){

        // update the songsheet data object in this model
        songSheetData = {

            text: text.text,
            id: text.id,

            dateFindAid: meta.dateFindAid,
            receivedOn: meta.receivedOn,
            signature: meta.signature,
            oldSignature: meta.oldSignature,
            versionNumber: meta.versionNumber,

            missingCause: meta.missingCause,
            origin: meta.origin,
            title: meta.title,
            type: meta.type,
            includes: meta.includes,

            incipit: meta.incipit,
            numberOfPages: meta.numberOfPages,
            singPlace: meta.singPlace,
            remark: meta.remark,
            landscapeArchive: meta.landscapeArchive,

            publication: meta.publication,
            sungOn: meta.sungOn,
            recordedOn: meta.recordedOn,
            submittedOn: meta.submittedOn,
            singer: meta.singer,

            reference: meta.reference,
            handwrittenSource: meta.handwrittenSource,
            recorder: meta.recorder,
            archive: meta.archive,
            processingStatus: meta.processingStatus,
            lastChangedPerson: meta.lastChangedPerson,
            lastChangedDate: meta.lastChangedDate
        };

        var requestString = JSON.stringify(songSheetData);
        var basicAuthString = getEncryptString();

        /*
        update the document on the server via REST-API after saving the text and meta data in the songsheet object in this model
        excpects a json-string in data-attribute, with all the fields to update
        as key-value pairs e.g. { "id": "f685091f-f097-4d64-b9cd-e2ce83ebbdce", "text": "new text"}
        please refer to documentation and REST-API for more information
        */
        $.ajax({
            type     : "POST",
            url      : SERVERADDRESS + "/SolrInteractionServer/rest/ssc-api-write/searchableDocs/updateDocument",
            data     : requestString,
            headers  : {"Authorization": basicAuthString},
            accept: "*/*",
            success  : function(msg){
                console.log('Success ');
                $(that).trigger("UploadSuccess");
            },
            error    : function(msg) {
                var messageError = "Upload fehlgeschlagen";
                if(msg.status == "401"){
                    messageError = "Sie haben nicht die Berechtigung für einen Upload";
                }
                $(that).trigger("UploadError", messageError);
            }
        });

    };
    /*
        method to remove a document from the server via REST-API
        expects the id in data-attribute
        please refer to documentation and REST-API for more information
    */
    var startDeleteProcess = function(){

        var basicAuthString = getEncryptString();

        var params = window.location.search.split("?");
        var idParam = params[1].split("&");
        var id = idParam[0].split("=")[1];

        $.ajax({
            type     : "POST",
            url      : SERVERADDRESS + "/SolrInteractionServer/rest/ssc-api-write/removeDocument",
            data     : id,
            headers  : {"Authorization": basicAuthString},
            accept: "*/*",
            success  : function(msg){
                console.log('Success ');
                $(that).trigger("HandleDelete", id);
            },
            error    : function(msg) {
                var messageError = "Upload fehlgeschlagen";
                if(msg.status == "401"){
                    messageError = "Sie haben nicht die Berechtigung für einen Upload";
                }
                $(that).trigger("UploadError", messageError);
            }
        });
    };

    that.init = init;
    that.updateSongSheetData = updateSongSheetData;
    that.getAllDocs = getAllDocs;
    that.startDeleteProcess = startDeleteProcess;

    return that;
};