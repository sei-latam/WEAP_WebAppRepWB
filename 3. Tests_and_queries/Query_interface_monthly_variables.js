////////////////////////////////////////////////////////////////////////////// Upload monthly variables and set legends with intervals  ///////////////////////////////////////////////////////////////////////////////////////

// Configure the collections and variables to visualize in the map
var collection_var = {
/// Monthly variables
  'Temperatura media mes (°C)': {
    collection: Temp_Collection_month.select('temperature'),
    vis: {min: -5, max: 33, palette: ['#313695','#4575b4','#74add1','#abd9e9','#e0f3f8','#ffffbf','#fee090','#fdae61','#f46d43','#d73027']}},
  'Precipitación media mes (mm)': {
    collection: Prcp_Collection_month.select('precipitation'),
    vis: {min: 0, max: 1275, palette: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b', '#041836']}},
  'Escorrentía media mes (mm)': {
    collection: Run_Collection_month.select('runoff'),
    vis: {min: 0, max: 1137, palette: ['#D0F4FF','#A8E9FF','#7FDFFF','#56D4F0','#3CC9D9','#2ABFBF', '#1AB3A6', '#13998F', '#0F7F78', '#0B6561']}},
  'Et Real media mes (mm)': {
    collection: ETReal_Collection_month.select('etreal'),
    vis: {min: 0, max: 230, palette: ['af0000', 'eb1e00', 'ff6400', 'ffb300', 'ffeb00', '9beb4a', '33db80', '00b4ff', '0064ff', '000096']}},
  'Et Ref media mes (mm)': {
    collection: ETRef_Collection_month.select('etref'),
    vis: {min: 43, max: 213, palette: ['d73027', 'f46d43', 'fdae61', 'fee08b', 'ffffbf', 'd9ef8b', 'a6d96a','66bd63', '1a9850', '006837']}},
/// Annual variables    
  'Temperatura media año (°C)': {
    collection: AnnualCollection_Temp.select('temperature'),
    vis: {min: 1.13, max: 27.80, palette: ['#313695','#4575b4','#74add1','#abd9e9','#e0f3f8','#ffffbf','#fee090','#fdae61','#f46d43','#d73027']}},
  'Precipitación media año (mm)': {
    collection: AnnualCollection_Prcp.select('precipitation'),
    vis: {min: 9.90, max: 6386.74, palette: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b', '#041836']}},
  'Escorrentía media año (mm)': {
    collection: AnnualCollection_Run.select('runoff'),
    vis: {min: 0, max: 5589.16, palette: ['#D0F4FF','#A8E9FF','#7FDFFF','#56D4F0','#3CC9D9','#2ABFBF', '#1AB3A6', '#13998F', '#0F7F78', '#0B6561']}},
  'Et Real media año (mm)': {
    collection: AnnualCollection_ETReal.select('etreal'),
    vis: {min: 0, max: 2001.08, palette: ['af0000', 'eb1e00', 'ff6400', 'ffb300', 'ffeb00', '9beb4a', '33db80', '00b4ff', '0064ff', '000096']}},
  'Et Ref media año (mm)': {
    collection: AnnualCollection_ETRef.select('etref'),
    vis: {min: 706.92, max: 2005.22, palette: ['d73027', 'f46d43', 'fdae61', 'fee08b', 'ffffbf', 'd9ef8b', 'a6d96a','66bd63', '1a9850', '006837']}}
};


//Create a buttom to select variables
var select_var = ui.Select({items: Object.keys(collection_var), placeholder: 'Seleccione variable',
  onChange: function(key) 
  {
    updateMap(key);
    updateLegend(key);
  }
                      });

//Create a buttom to clear legend
var clearButton_var = ui.Button({label: 'Limpiar Leyenda',
  onClick: function() 
  {legendPanel.clear();}
                           });

// Call the maister_panel (FRONT-END) and add the buttoms 
master_panel.add(select_var);
master_panel.add(clearButton_var);

// Call the main_panel (FRONT-END) and add legendPanel
mapPanel.add(legendPanel);

// Create a function to update map
function updateMap(key) {
  mapPanel.layers().reset();
  var image = collection_var[key].collection.mean();
  //Add the layer selected by the user
  mapPanel.addLayer(image, collection_var[key].vis, key);
}

// Create a function to update legend
function updateLegend(key) {
  
  //clear the legend if there are previous layers 
  legendPanel.clear();
  
  //select the respective palette and symbology
  var vis = collection_var[key].vis;
  var min = vis.min;
  var max = vis.max;
  var palette = vis.palette;
  var steps = palette.length;
  
  //Define the invervals of data
  var interval = (max - min) / (steps - 1);

  var title = ui.Label({value: key,style: {fontWeight: 'bold', fontSize: '14px'}});

  //create a panel with the legend
  var legend = ui.Panel({
    layout: ui.Panel.Layout.Flow('vertical'),
    style: {padding: '4px', backgroundColor: 'rgba(255, 255, 255, 0.99)'}
  });

  //Looping to adjust and set the legend
  for (var i = 0; i < steps; i++) {
    var value = (min + i * interval).toFixed(0);
    var colorBox = ui.Label({
      style: {
        backgroundColor: palette[i],
        padding: '8px',
        margin: '2px',
        width: '20px'
      }
    });
    var label = ui.Label(value, {margin: '4px'});
    var row = ui.Panel([colorBox, label], ui.Panel.Layout.Flow('horizontal'));
    legend.add(row);
  }
  
  //Call the legendPanel (FRONT-END) and add the title and legend
  legendPanel.add(title);
  legendPanel.add(legend);
}
