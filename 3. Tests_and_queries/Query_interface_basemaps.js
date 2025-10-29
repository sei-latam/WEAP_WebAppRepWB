//************************************* Import and configure three basemaps as 'BaseChange' 'iconChange' and 'MultiBrand' *******************************************
var BaseChange_map = ui.Button({
  label: 'Alta vegetación',
  onClick: function() {
    mapPanel.setOptions('baseChange', {'baseChange': baseChange});
  }
});
var iconChange_map = ui.Button({
  label: 'Baja vegetación',
  onClick: function() {
    mapPanel.setOptions('iconChange', {'iconChange': iconChange});
  }
});
var MultiBrand_map = ui.Button({
  label: 'Alto contraste',
  onClick: function() {
    mapPanel.setOptions('MultiBrand', {'MultiBrand': MultiBrand});
  }
});
