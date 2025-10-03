//************************************* Create query with points, coordinates and time series *******************************************

// Define ImageCollections with bands, scales and units
var collections_point = {
/// Monthly variables
  'Temperatura media mes (°C)': {
    collection: Temp_Collection_month.select('temperature'),
    scale: 500,
    unit: 'Celsius (°C)'},
  'Precipitación media mes (mm)': {
    collection: Prcp_Collection_month.select('precipitation'),
    scale: 500,
    unit: 'Milímetros (mm)'},
  'Escorrentía media mes (mm)': {
    collection: Run_Collection_month.select('runoff'),
    scale: 500,
    unit: 'Milímetros (mm)'},
  'Et Real media mes (mm)': {
    collection: ETReal_Collection_month.select('etreal'),
    scale: 500,
    unit: 'Milímetros (mm)'},
  'Et Ref media mes (mm)': {
    collection: ETRef_Collection_month.select('etref'),
    scale: 500,
    unit: 'Milímetros (mm)'},
/// Annual variables    
  'Temperatura media año (°C)': {
    collection: AnnualCollection_Temp.select('temperature'),
    scale: 500,
    unit: 'Celsius (°C)'},
  'Precipitación media año (mm)': {
    collection: AnnualCollection_Prcp.select('precipitation'),
    scale: 500,
    unit: 'Milímetros (mm)'},
  'Escorrentía media año (mm)': {
    collection: AnnualCollection_Run.select('runoff'),
    scale: 500,
    unit: 'Milímetros (mm)'},
  'Et Real media año (mm)': {
    collection: AnnualCollection_ETReal.select('etreal'),
    scale: 500,
    unit: 'Milímetros (mm)'},
  'Et Ref media año (mm)': {
    collection: AnnualCollection_ETRef.select('etref'),
    scale: 500,
    unit: 'Milímetros (mm)'},
  };

// Define textbox when the user will be write the Longitude and Latitude coordinates
var lonInput = ui.Textbox({placeholder: 'Longitude (ej. -65)'});
var latInput = ui.Textbox({placeholder: 'Latitude (ej. -17)'});

// Create buttom to select variables according the coordinates
var select = ui.Select({
  items: Object.keys(collections_point),
  placeholder: 'Seleccione variable'
});


// Create buttom to display time series in the point selected
var plotButton = ui.Button({
  label: '📈 Crear Gráfico',
  onClick: function() {
    // call the coordinates defined previously 
    var lat = parseFloat(latInput.getValue());
    var lon = parseFloat(lonInput.getValue());
    // Call the variable selected previously 
    var dataset = select.getValue();
    
    // Conditional and warning if the user set wrong coordinates
    if (isNaN(lat) || isNaN(lon) || !dataset) {
      ui.alert('Por favor ingrese coordenadas (Long/Lat) dentro del área de estudio');
      return;
    }
    
    // Create a point with the geometry (long, lat)
    var point = ee.Geometry.Point([lon, lat]);
    
    // Import the variable inside the point
    var col = collections_point[dataset].collection;
    var scale = collections_point[dataset].scale;
    var unit = collections_point[dataset].unit;
    
    // Create a time series with the variable, point and coordinates choosed
    var chart = ui.Chart.image.series({
      imageCollection: col,
      region: point,
      reducer: ee.Reducer.mean(), //Reduce with the average
      scale: scale,
      xProperty: 'system:time_start'
    })
    .setOptions({
      title: dataset + '(' + lat + ', ' + lon + ')',
      hAxis: {title: 'Fecha'},
      vAxis: {title: unit},
      lineWidth: 1,
      pointSize: 2,
      trendlines: {0: 
      {
        type: 'linear', 
        color: 'black', 
        lineWidth: 1,
        pointSize: 0,
        visibleInLegend: true,
        labelInLegend: dataset + 'Trend',
      }
                  }
    });
    
    //Add the chart to chartPanel2
    chartPanel2.add(chart);
  }
});

// Create chartPanel2 where will be displayed the time series chart
var chartPanel2 = ui.Panel({
  layout: ui.Panel.Layout.Flow('vertical'),
  style: {width: '300px', backgroundColor: 'rgba(255, 255, 255, 0.99)'}
});

// Create panel and call the previous buttoms
var inputPanel = ui.Panel([
  latInput,
  lonInput,
  select,
  plotButton
], ui.Panel.Layout.Flow('vertical'), {width: '300px', margin: '0px', padding: '0px 80px', backgroundColor: 'rgba(255, 255, 255, 0.99)'}); //set the panel window

// add the inputPanel and chartPanel2 to the chartPanel (big panel in the right section of the app)
chartPanel.add(inputPanel);
chartPanel.add(chartPanel2);
