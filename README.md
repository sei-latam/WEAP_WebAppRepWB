# WEAP_WebAppRepWB

## Summary
Development Protocols and Processes for Accessing Data from the Bolivia Surface Water Balance...


App available in :

### Use and install this repository

HTTPS
```html
https://github.com/sei-latam/WEAP_WebAppRepWB
```

GitHub CLI
```html
gh repo clone sei-latam/WEAP_WebAppRepWB
```
Git repositories on Google Earth Engine
```html
https://earthengine.googlesource.com/users/carlosmendez/ExercicesSEI/+/refs/heads/master/Application_SEI_Water
```

### Description

Repository built in `Google Earth Engine (GEE)` and `Google Colab`.

Each part is described below:

- First folder (Files_and_data)
  
- Second folder (Google_Git_versions)
  
- Third folder (App_using_Google_Colab)
  
- Fourth folder (Tests_and_queries)

### Datasets and packages

#### External Basemaps

```Javascript
var snazzy =require("users/aazuspan/snazzy:styles");
// https://github.com/aazuspan/snazzy
var MultiBrand = "https://snazzymaps.com/style/20053/multi-brand-network"
```
#### Palettes and Symbology

```Javascript
require('users/gena/packages:palettes');
// https://github.com/gee-community/ee-palettes#gennadii-donchyts-fedor-baart--justin-braaten
var Temp_pal = ['#313695','#4575b4','#74add1','#abd9e9','#e0f3f8','#ffffbf','#fee090','#fdae61','#f46d43','#d73027'];//10
var Prcp_pal = ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b', '#041836'];//10
var Runoff_pal = ['#D0F4FF','#A8E9FF','#7FDFFF','#56D4F0','#3CC9D9','#2ABFBF', '#1AB3A6', '#13998F', '#0F7F78', '#0B6561']; //10
var ETReal_pal = ['af0000', 'eb1e00', 'ff6400', 'ffb300', 'ffeb00', '9beb4a', '33db80', '00b4ff', '0064ff', '000096']; //10
var ETRef_pal = ['d73027', 'f46d43', 'fdae61', 'fee08b', 'ffffbf', 'd9ef8b', 'a6d96a','66bd63', '1a9850', '006837']; // 10
```

### Variables, Images and ImageCollections

- 1. Temperature

```Javascript
var Temperature = ee.Image("projects/ee-sebastianpalominoangel/assets/Assets_BM_Bolivia/Tmedio_M1_M492_multiband")
```
     
- 2. Precipitation

```Javascript
var Precipitation = ee.Image("projects/ee-sebastianpalominoangel/assets/Assets_BM_Bolivia/PcP_M1_M492_multiband")
```
     
- 3. Runoff

```Javascript
var Runoff = ee.Image("projects/ee-sebastianpalominoangel/assets/Assets_BM_Bolivia/Escorrentia_M1_M492_multiband")
```
     
- 4. Real Evapotranspiration

```Javascript
var Evap_real = ee.Image("projects/ee-sebastianpalominoangel/assets/Assets_BM_Bolivia/ETR_M1_M492_multiband")
```
     
- 5. Evapotranspiration of Reference

```Javascript
var Evap_reference = ee.Image("projects/ee-sebastianpalominoangel/assets/Assets_BM_Bolivia/ETref_M1_M492_multiband")
```

## Versions and releases

Version `1.0`

```HTML
link
```

## Credits and repository of data

The original code, repositories and scripts used in this project, are available at:

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. Please make sure to update tests as appropriate. 

## License

BSD 3-Clause License

Copyright (c) 2025, Stockholm Environment Institute - Latin America

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
