Analyse.AnalyseController = function(){
    /*
    Package to show graph-chart in AnalyseView.html

    Uses Google Charts to build chart: https://developers.google.com/chart/
    */
    var that = {};
    var analyseView = null;
    var analyseModel = null;

    var init = function(){

        loadGoogleChart();
        
    };

    var loadGoogleChart = function(){
        // First load google charts version 43
        google.charts.load('43', {'packages':['corechart']});
        google.charts.setOnLoadCallback(googleChartsLoaded);
            

    };

    var googleChartsLoaded = function(){
        // Only continue render process when googel charts is loaded
        continueInit();
    };

    var continueInit = function(){

        analyseView = Analyse.AnalyseView();
        analyseView.init();

        analyseModel = Analyse.AnalyseModel();

        initListener();
        // Start Fetching the data of the solr-core by initializing the analyseModel
        analyseModel.init();

    };

    var initListener = function(){
        // Start data calculations after request to solr was successfull
        $(analyseModel).on("AllDocsFetched", startCalculations);
    };

    var startCalculations = function(event, message){
        // Get data calculations as js-Object from analyseModel
        var processingStatusData = analyseModel.getProcessingStatusData(message.documents);

        // Render graph with calculations
        showGraphs(processingStatusData);
    };

    var showGraphs = function(processingStatus){
        
        // Build the chart and let it fade in
        analyseView.showProcessingStatusBarChart(processingStatus);
        analyseView.fadeIn();
    }; 

    that.init = init;

    return that;
};