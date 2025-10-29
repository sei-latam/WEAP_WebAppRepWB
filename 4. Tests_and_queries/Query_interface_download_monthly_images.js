
//************************************* Create query to Download and export images *******************************************

// Initial configuration
var AOI_dynamic = null; // AOI upload from GeoJSON

var app = {
  state: {},
  ui: {},
  helpers: {}
};

// User interface
app.ui.collectionSelect = ui.Select({
  items: [
    {label: 'Temperatura media mes (°C)', value: Temp_Collection_month.select('temperature')},
    {label: 'Precipitación media mes (mm)', value: Prcp_Collection_month.select('precipitation')},
    {label: 'Escorrentía media mes (mm)', value: Run_Collection_month.select('runoff')},
    {label: 'Et Real media mes (mm)', value: ETReal_Collection_month.select('etreal')},
    {label: 'Et Ref media mes (mm)', value: ETRef_Collection_month.select('etref')},
  ],
  placeholder: 'Seleccione variable',
  style: {stretch: 'horizontal'}
});

app.ui.startDate = ui.Textbox({placeholder: 'Formato YYYY-MM', value: '1980-01'});
app.ui.endDate = ui.Textbox({placeholder: 'Formato YYYY-MM', value: '1980-03'});

app.ui.downloadButton = ui.Button({
  label: 'Generar enlaces de descarga directa',
  style: {stretch: 'horizontal', margin: '10px'},
  onClick: function() {
    app.helpers.createDownloads(false);
  }
});

app.ui.resultPanel = ui.Panel();

left_panel.add(ui.Label('Seleccione variable y rango de fechas para exportar imágenes 📁', {
  stretch: 'horizontal', textAlign: 'center', fontSize: '14px'
}));
left_panel.add(app.ui.collectionSelect);
left_panel.add(ui.Label('Fecha inicial (YYYY-MM)', {textAlign: 'center', fontSize: '11px'}));
left_panel.add(app.ui.startDate);
left_panel.add(ui.Label('Fecha final (YYYY-MM)', {textAlign: 'center', fontSize: '11px'}));
left_panel.add(app.ui.endDate);
left_panel.add(app.ui.downloadButton);
left_panel.add(app.ui.resultPanel);

ui.root.insert(0, left_panel);

// Auxiliar function to export/download

app.helpers.createDownloads = function(toDrive) {
  var button = app.ui.downloadButton;
  button.setDisabled(true);
  var panel = app.ui.resultPanel;
  panel.clear();
  panel.add(ui.Label('⚙️ Generando enlaces de descarga...', {fontWeight: 'bold'}));

  var collection = app.ui.collectionSelect.getValue();
  var start = app.ui.startDate.getValue();
  var end = app.ui.endDate.getValue();

  if (!AOI_dynamic) {
    ui.alert('❗ Primero cargue un archivo GeoJSON válido.');
    button.setDisabled(false);
    return;
  }

  if (!collection || !start || !end) {
    ui.alert('❗ Complete todos los campos.');
    button.setDisabled(false);
    return;
  }

  if (!/^\d{4}-\d{2}$/.test(start) || !/^\d{4}-\d{2}$/.test(end)) {
    ui.alert('❗ Formato de fecha inválido. Use YYYY-MM.');
    button.setDisabled(false);
    return;
  }

  var startDate = ee.Date(start + '-01');
  var endDate = ee.Date(end + '-28');

  var filtered = collection
    .filterDate(startDate, endDate)
    .filterBounds(AOI_dynamic)
    .map(function(img) {
      var date = img.date().format('YYYY-MM');
      return img.set('export_date', date);
    });

  filtered.aggregate_array('export_date').evaluate(function(dates) {
    if (!dates || dates.length === 0) {
      panel.add(ui.Label('⚠️ No se encontraron imágenes en ese rango.'));
      button.setDisabled(false);
      return;
    }

    for (var i = 0; i < dates.length; i++) {
      var dateStr = dates[i];
      var description = 'imagen_' + dateStr;
      var image = ee.Image(filtered.toList(dates.length).get(i));

      var url = image.clip(AOI_dynamic).getDownloadURL({
        name: description,
        scale: 1000,
        region: AOI_dynamic.geometry()
      });

      panel.add(ui.Label({value: description, style: {color: 'blue', textDecoration: 'underline'}, targetUrl: url}));
    }

    button.setDisabled(false);
  });
};
