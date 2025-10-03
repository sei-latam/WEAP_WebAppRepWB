//************************************* Create query to visualize multiple images using DateSlider *******************************************

// Define monthly ImageCollections with a unique band
var collections_t = {
  'Temperatura media mes (°C)': {
    ic_t: Temp_Collection_month.select('temperature'),
    vis: {min: -5, max: 33, palette: ['#313695','#4575b4','#74add1','#abd9e9','#e0f3f8','#ffffbf','#fee090','#fdae61','#f46d43','#d73027']}
  },
  'Precipitación media mes (mm)': {
    ic_t: Prcp_Collection_month.select('precipitation'),
    vis: {min: 0, max: 1275, palette: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b', '#041836']}
  },
  'Escorrentía media mes (mm)': {
    ic_t: Run_Collection_month.select('runoff'),
    vis: {min: 0, max: 1137, palette: ['#D0F4FF','#A8E9FF','#7FDFFF','#56D4F0','#3CC9D9','#2ABFBF', '#1AB3A6', '#13998F', '#0F7F78', '#0B6561']}
  },
  'Et Real media mes (mm)': {
    ic_t: ETReal_Collection_month.select('etreal'),
    vis: {min: 0, max: 230, palette: ['af0000', 'eb1e00', 'ff6400', 'ffb300', 'ffeb00', '9beb4a', '33db80', '00b4ff', '0064ff', '000096']}
  },
  'Et Ref media mes (mm)': {
    ic_t: ETRef_Collection_month.select('etref'),
    vis: {min: 43, max: 213, palette: ['d73027', 'f46d43', 'fdae61', 'fee08b', 'ffffbf', 'd9ef8b', 'a6d96a','66bd63', '1a9850', '006837']}
  },
};

// UI Elements
var collectionSelect_t = ui.Select({
  items: Object.keys(collections_t),
  placeholder: 'Seleccione variable',
  style: {stretch: 'horizontal'}
});

var dateSlider_t = ui.DateSlider({
  start: '1980-01-01',
  end: '2020-12-31',
  value: ['1980-01-01', '2020-12-31'],
  style: {stretch: 'horizontal'},
  period: 30  // Monthly step
});

var displayButton_t = ui.Button({
  label: 'Adicionar imagen(es) 🖼️',
  style: {stretch: 'horizontal'},
  onClick: displayImage_t
});


// Display a single image based on selected collection, date range, and palette
function displayImage_t() {
  var selected_t = collectionSelect_t.getValue();
  if (!selected_t) {
    ui.alert('Por favor seleccione una imagen');
    return;
  }

  var range_t = dateSlider_t.getValue();
  var start_t = ee.Date(range_t[0]);
  var end_t = ee.Date(range_t[1]);

  var config_t = collections_t[selected_t];
  var ic_t = config_t.ic_t.filterDate(start_t, end_t);

  var image_t = ic_t.sort('system:time_start').first();
  var date_t = image_t.date().format('YYYY-MM');

  //mapPanel.layers().reset();
  mapPanel.centerObject(image_t, 6);
  mapPanel.addLayer(image_t, config_t.vis, selected_t + ' ' + date_t.getInfo());
}

var chartPanel4 = ui.Panel({
  layout: ui.Panel.Layout.Flow('vertical'),
  style: {width: '300px'}
});

var panel_sli = ui.Panel({style: {width: '300px'}});

chartPanel.add(ui.Label('Filtro de imagenes por variable y fecha 📅 ', {stretch: 'horizontal', textAlign: 'center', fontSize: '14px'}));

panel_sli.add(collectionSelect_t);
panel_sli.add(dateSlider_t);
panel_sli.add(displayButton_t);
chartPanel4.add(panel_sli)
chartPanel.add(chartPanel4);
