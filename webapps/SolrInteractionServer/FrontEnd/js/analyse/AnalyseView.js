Analyse.AnalyseView = function(){
    var that = {};

    var init = function(){
    	
    	
    };

    // Build the barchart via google charts
    var showProcessingStatusBarChart = function(processingStatus){
       
       // Set data
       var data = google.visualization.arrayToDataTable([
        ['Erschließungszustand', 'Unbearbeitet', 'Entwurf', 'Vollständig ausgezeichnet'],
        ['Dokumente', processingStatus.unedited, processingStatus.design, processingStatus.edited]
      ]);

       // Adjust Design
       var options = {'title':'Erschließungszustand des Liedblattkorpus',
                      'fontSize':21,
                      'fontName': 'Helvetica',
                       'width':900,
                       'height':400,
                       'colors': ['red', 'orange', 'green'],
                       'legend': {position: 'top', textStyle: {fontSize: 14}},
                   	   'isStacked': 'percent'};

       var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
       chart.draw(data, options);         
    };

    var fadeIn = function(){
      $("#chart_div").css({opacity: 0, visibility: "visible"}).animate({opacity: 1}, 1000);
      $("#footer").css({opacity: 0, visibility: "visible"}).animate({opacity: 1}, 1000);
    };

    that.init = init;
    that.showProcessingStatusBarChart = showProcessingStatusBarChart;
    that.fadeIn = fadeIn;

    return that;
};