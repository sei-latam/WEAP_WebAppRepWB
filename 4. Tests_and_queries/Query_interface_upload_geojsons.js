//************************************* Create query to upload and filter time series using Geojson file *******************************************

var AOI_dynamic = null;

// Create chartPanel2 where will be displayed the time series chart
var chartPanel_geojson = ui.Panel({
  layout: ui.Panel.Layout.Flow('vertical'),
  style: {width: '300px', margin: '15px', padding: '0px 0px', backgroundColor: 'rgba(128, 128, 128, 0.05)'}
});

chartPanel.add(ui.Label('Gráfico de series de tiempo importando ⬆️ archivos externos en el mapa 🗺️',{fontSize: '14px', stretch: 'horizontal', textAlign: 'center'}))
chartPanel_geojson.add(ui.Label('Por favor asista el siguiente tutorial online:', {stretch: 'horizontal', textAlign: 'center', fontSize: '11px'}));

var external_tutorial = ui.Label('Adicionar de archivos (.KML .Shp .GeoJSON)', {
  fontSize: '10px', stretch: 'horizontal', textAlign: 'center'},'https://seiorg-my.sharepoint.com/:v:/g/personal/carlos_mendez_sei_org/EQcoeLFbHC5PgAE8nlBHIG8Bhvg61dnuyFhuTdAzYHDr4w?e=xb2dHZ');

// Textbox for GeoJSON input (minified)
var geojsonTextbox = ui.Textbox({
  placeholder: 'Copie aquí el archivo GeoJSON convertido',
  style: {stretch: 'horizontal', textAlign: 'center'}
});
geojsonTextbox.style().set('backgroundColor', 'lightblue');

// Dropdown for layer name
var layerNameSelect = ui.Textbox({
  placeholder: 'Ingrese un nombre al archivo GeoJSON',
  style: {stretch: 'horizontal'}
});

// Textboxes para fechas
var startDateBox = ui.Textbox({
  placeholder: 'Fecha inicio (YYYY-MM-DD)',
  style: {stretch: 'horizontal', textAlign: 'center'}
});
startDateBox.style().set('backgroundColor', '#e6f7ff');

var endDateBox = ui.Textbox({
  placeholder: 'Fecha fin (YYYY-MM-DD)',
  style: {stretch: 'horizontal', textAlign: 'center'}
});
endDateBox.style().set('backgroundColor', '#ffe6e6');

//Define collections and variables
var collections_geojson = {
  'Temperatura media mes (°C)': Temp_Collection_month.select('temperature'),
  'Precipitación media mes (mm)': Prcp_Collection_month.select('precipitation'),
  'Escorrentía media mes (mm)': Run_Collection_month.select('runoff'),
  'Et Real media mes (mm)': ETReal_Collection_month.select('etreal'),
  'Et Ref media mes (mm)': ETRef_Collection_month.select('etref'),
  'Temperatura media año (°C)': AnnualCollection_Temp.select('temperature'),
  'Precipitación media año (mm)': AnnualCollection_Prcp.select('precipitation'),
  'Escorrentía media año (mm)': AnnualCollection_Run.select('runoff'),
  'Et Real media año (mm)': AnnualCollection_ETReal.select('etreal'),
  'Et Ref media año (mm)': AnnualCollection_ETRef.select('etref')
};

// Create dropdown to select variable
var collectionSelect_geo = ui.Select({
  items: Object.keys(collections_geojson),
  placeholder: 'Seleccione variable',
  style: {stretch: 'horizontal'}
});

// Button to parse and display GeoJSON
var importButton = ui.Button({
  label: '✅ Importar GeoJSON y crear gráfico',
  style: {stretch: 'horizontal'},
  onClick: function() {
    var geojsonText = geojsonTextbox.getValue();
    var layerName = layerNameSelect.getValue();
    var selected_geo = collectionSelect_geo.getValue();
    var startDate = startDateBox.getValue();
    var endDate = endDateBox.getValue();

    if (!selected_geo) {
      ui.alert('Por favor seleccione una variable');
      return;
    }

    if (!geojsonText || !layerName || !startDate || !endDate) {
      ui.alert('❗ Complete todos los campos incluyendo fechas.');
      return;
    }

    try {
      var parsed = JSON.parse(geojsonText);
      if (!parsed.features || !Array.isArray(parsed.features)) {
        print('❌ GeoJSON inválido: falta el arreglo "features".');
        return;
      }

      var features = parsed.features.map(function(f) {
        return ee.Feature(ee.Geometry(f.geometry), f.properties || {});
      });
      

      var fc = ee.FeatureCollection(features);
      AOI_dynamic = fc; // Store AOI Global

      
      
      mapPanel.addLayer(fc, {color: 'gray'}, layerName);
      mapPanel.centerObject(fc);

      var geometry = fc.geometry();
      var ic_geo = collections_geojson[selected_geo].filterDate(startDate, endDate);

      var chart_geo = ui.Chart.image.series({
        imageCollection: ic_geo,
        region: geometry,
        reducer: ee.Reducer.mean(),
        scale: 500,
        xProperty: 'system:time_start'
      }).setOptions({
        title: 'Gráfico ' + selected_geo + ' en ' + layerName,
        hAxis: {title: 'Fecha'},
        vAxis: {title: selected_geo},
        lineWidth: 2,
        pointSize: 4,
        trendlines: {
          0: {
            type: 'linear',
            color: 'black',
            lineWidth: 1,
            pointSize: 0,
            visibleInLegend: true,
            labelInLegend: selected_geo + ' Tendencia'
          }
        }
      });

      chartPanel_geojson.add(chart_geo);
    } catch (err) {
      print('❌ Error al analizar GeoJSON:', err.message);
    }
  }
});

// Add elements to the chartPanel_geojson
chartPanel_geojson.add(external_tutorial);
chartPanel_geojson.add(collectionSelect_geo);
chartPanel_geojson.add(startDateBox);
chartPanel_geojson.add(endDateBox);
chartPanel_geojson.add(layerNameSelect);
chartPanel_geojson.add(geojsonTextbox);
chartPanel_geojson.add(ui.Label('Por favor espere mientras se carga el GeoJSON ⌛', {stretch: 'horizontal', textAlign: 'center', fontSize: '11px'}));
chartPanel_geojson.add(importButton);
chartPanel.add(chartPanel_geojson);

// Panel to restore info
var clearPanel_geojson = ui.Panel({
  layout: ui.Panel.Layout.flow('vertical'),
  style: {width: '200px', padding: '10px'}
});

function resetGeoJSONPanel() {
  chartPanel_geojson.clear();
  collectionSelect_geo.setValue(null);
  startDateBox.setValue('');
  endDateBox.setValue('');
  layerNameSelect.setValue('');
  geojsonTextbox.setValue('');
  
  

  var layers = mapPanel.layers();
  for (var i = layers.length() - 1; i >= 0; i--) {
    var layer = layers.get(i);
    if (layer.getName() !== 'Base Map') {
      mapPanel.layers().remove(layer);
    }
  }

  chartPanel_geojson.add(ui.Label('Por favor asista el siguiente tutorial online:', {
    stretch: 'horizontal',
    textAlign: 'center',
    fontSize: '11px'
  }));
  chartPanel_geojson.add(external_tutorial);
  chartPanel_geojson.add(collectionSelect_geo);
  chartPanel_geojson.add(startDateBox);
  chartPanel_geojson.add(endDateBox);
  chartPanel_geojson.add(layerNameSelect);
  chartPanel_geojson.add(geojsonTextbox);
  
  chartPanel_geojson.add(ui.Label('Por favor espere mientras se carga el GeoJSON ⌛', {
    stretch: 'horizontal',
    textAlign: 'center',
    fontSize: '11px'
  }));
  chartPanel_geojson.add(importButton);
}

var resetButton_json = ui.Button({
  label: 'Reiniciar Consulta GeoJSON',
  style: {
    stretch: 'horizontal',
    margin: '10px',
    backgroundColor: 'gray',
    color: 'black'
  },
  onClick: resetGeoJSONPanel
});

clearPanel_geojson.add(resetButton_json);
chartPanel.add(clearPanel_geojson);
