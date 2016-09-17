Upload.UploadController = function(){
	/*
	Package to handle Upload of data
	Most data handling is connected to UI-Elements of the used Fine Uploader Library
	--> therefore whole logic is implemented in UploadView

	Fine Uploader Library is used to implement upload: http://fineuploader.com/
	*/
    var that = {};

    var uploadView = null;

    var init = function(){
        uploadView = Upload.UploadView();

        uploadView.init();

    };

    that.init = init;

    return that;
};