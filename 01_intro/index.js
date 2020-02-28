import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM, {ATTRIBUTION} from 'ol/source/OSM';
import {fromLonLat} from 'ol/proj';

var openSeaMapLayer = new TileLayer({
  source: new OSM({
    attributions: [
      'All maps © <a href="http://www.openseamap.org/">OpenSeaMap</a>',
      ATTRIBUTION
    ],
    opaque: false,
    url: 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png'
  })
});

const map = new Map({
  target: 'map',
  layers: [
    openSeaMapLayer,
    new TileLayer({ // raster layer
      source: new OSM()
    })
  ],
  view: new View({
    center: fromLonLat([9.114508,39.211631]),
    zoom: 10
  })
});
