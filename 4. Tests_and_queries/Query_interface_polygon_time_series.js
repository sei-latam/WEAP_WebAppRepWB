//************************************* Create query to drawing a polygons and plot time series *******************************************

// Add title to the query 'poligonos'
chartPanel.add(ui.Label('Consultas por polígonos (dibujo)', {stretch: 'horizontal', textAlign: 'center', fontSize: '14px'}));

//Define collections and variables
var collections_drawing = {
  /// Monthly variables
  'Temperatura media mes (°C)': Temp_Collection_month.select('temperature'),
  'Precipitación media mes (mm)': Prcp_Collection_month.select('precipitation'),
  'Escorrentía media mes (mm)': Run_Collection_month.select('runoff'),
  'Et Real media mes (mm)': ETReal_Collection_month.select('etreal'),
  'Et Ref media mes (mm)': ETRef_Collection_month.select('etref'),
/// Annual variables    
  'Temperatura media año (°C)': AnnualCollection_Temp.select('temperature'),
  'Precipitación media año (mm)': AnnualCollection_Prcp.select('precipitation'),
  'Escorrentía media año (mm)': AnnualCollection_Run.select('runoff'),
  'Et Real media año (mm)': AnnualCollection_ETReal.select('etreal'),
  'Et Ref media año (mm)': AnnualCollection_ETRef.select('etref')
};

// Create butttom to start drawing polygon and call startDrawing function 
var drawButton = ui.Button('🖊️Dibuje un polígono', startDrawing);

// Create buttom to select variable
var collectionSelect_pol = ui.Select({
  items: Object.keys(collections_drawing),
  placeholder: 'Seleccione variable',
  style: {stretch: 'horizontal'}
});

// Create butttom to create graphics and call plotTimeSeries function 
var chartButton = ui.Button('📈 Crear Gráfico', plotTimeSeries);

// Start drawing polygon into mapPanel (MASTER MAP)
var drawingTools = mapPanel.drawingTools();
drawingTools.setShown(false);
drawingTools.setDrawModes(['polygon']); //set type of geometry
drawingTools.setShape(null); 

function startDrawing() {
  drawingTools.setShown(true);
  drawingTools.setShape('polygon');
  drawingTools.draw();
}
function plotTimeSeries() {
  if (drawingTools.layers().length === 0) 
  {
    ui.alert('Por favor dibuje un polígono'); //set warning message if the user draw wrong polygon 
    return;
  }

  var geometry = drawingTools.toFeatureCollection().geometry();
  var selected = collectionSelect_pol.getValue();
  if (!selected) {
    ui.alert('Por favor seleccione una variable'); // set warning message if the user didn't select any variable
    return;
  }
  
  //Define a temporal var with the collection selected
  var ic_dra = collections_drawing[selected];
  
  // Create a time series chart in the geometry and extension selected by the polygon
  var chart = ui.Chart.image.series({
    imageCollection: ic_dra,
    region: geometry,
    reducer: ee.Reducer.mean(), // reduce to average
    scale: 500,
    xProperty: 'system:time_start'
  }).setOptions({
    title: selected,
    hAxis: {title: 'Date'},
    vAxis: {title: selected},
    lineWidth: 2,
    pointSize: 4,
          trendlines: {0: 
      {
        type: 'linear', 
        color: 'black', 
        lineWidth: 1,
        pointSize: 0,
        visibleInLegend: true,
        labelInLegend: selected + 'Trend',
      }
                  }
  });
  //Clear the chart panel if there are previous charts or time series
  chartPanel3.clear()
  // Add the chart created in the chartPanel3
  chartPanel3.add(chart);
}

//Create a panel where will be display the time series chart
var chartPanel3 = ui.Panel({
  layout: ui.Panel.Layout.Flow('vertical'),
  style: {width: '300px', backgroundColor: 'rgba(255, 255, 255, 0.99)'}
});

// Create a main panel with the polygon query
var panel_dra = ui.Panel({style: {width: '300px', margin: '0px', padding: '0px 80px'}});

// Add buttoms defined previously 
panel_dra.add(drawButton);
panel_dra.add(collectionSelect_pol);
panel_dra.add(chartButton);
chartPanel.add(panel_dra);

// add the chartPanel3 to ChartPanel (Big Panel)
chartPanel.add(chartPanel3);
