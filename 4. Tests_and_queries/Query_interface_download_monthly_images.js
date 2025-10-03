//************************************* Create query to download images  *******************************************

// Define UI elements
var panel = ui.Panel({layout: ui.Panel.Layout.flow('vertical'),   
                      style: {width: '200px', position: 'bottom-left', margin: '0px', padding: '0px 0px', backgroundColor: 'rgba(255, 255, 255, 0.99)'}});
var title = ui.Label('Descarga de imagenes mensuales', {fontWeight: 'bold', fontSize: '14px', stretch: 'horizontal', textAlign: 'center'});

  
// Dropdown for ImageCollections
var collectionSelect = ui.Select({
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

// Date selectors
var startDate = ui.Textbox({placeholder: 'Formato YYYY-MM-DD', value: '1980-01'});
var endDate = ui.Textbox({placeholder: 'Formato YYYY-MM-DD', value: '2020-12'});

// Button to trigger download
var downloadButton = ui.Button({
  label: 'Iniciar Descarga',
  style: {stretch: 'horizontal', margin: '10px'},
  onClick: function() {
    var collectionId = collectionSelect.getValue();
    var start = startDate.getValue();
    var end = endDate.getValue();

    if (!collectionId || !start || !end) {
      ui.alert('Please fill in all fields.');
      return;
    }

    var collection = collectionId
      .filterDate(start, end)
      .filterBounds(AOI) 
      .map(function(img) {return img.clip(AOI.geometry())})
      .first(); // Get first image in the filtered collection

    if (collection) {
      var url = collection.getDownloadURL({
        name: 'downloaded_image',
        scale: 1500,
        region: AOI.geometry()
      });

  urlLabel.setUrl(url);
  urlLabel.style().set({shown: true, color: 'blue'});
      //print('Download URL:', url);
    } else {
      print('No image found for the selected parameters.');
    }
  }
});

var urlLabel = ui.Label('Click para descargar', {stretch: 'horizontal', textAlign: 'center', fontSize: '11px', shown: false});

// Assemble UI
panel.add(title);
panel.add(ui.Label('Por favor seleccione una colección', {stretch: 'horizontal', textAlign: 'center', fontSize: '11px'}));
panel.add(collectionSelect);
panel.add(ui.Label('Digite una fecha (año y mes) entre 1980 y 2020', {stretch: 'horizontal', textAlign: 'center', fontSize: '11px'}));
panel.add(ui.Label('Digite la fecha inicial',{stretch: 'horizontal', textAlign: 'center', fontSize: '11px'}));
panel.add(startDate);
panel.add(ui.Label('Digite la fecha final', {stretch: 'horizontal', textAlign: 'center', fontSize: '11px'}));
panel.add(endDate);
panel.add(downloadButton);
panel.add(ui.Label('Por favor espere unos instantes', {stretch: 'horizontal', textAlign: 'center', fontSize: '11px'}));
panel.add(urlLabel);

// Add panel to the map
ui.root.insert(0, panel);
