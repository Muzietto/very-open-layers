
var map;
var layer_mapnik;
var layer_tah;
var layer_seamark;
var marker;

// Position and zoomlevel of the map
var lon = 12.0915;
var lat = 54.1878;
var zoom = 15;

var linkTextSkipperGuide = 'Beschreibung auf SkipperGuide';
var linkTextWeatherHarbour = 'Meteogramm';
var language = 'de';

function drawmap() {

	map = new OpenLayers.Map('map', {
		projection: new OpenLayers.Projection('EPSG:900913'),
		displayProjection: new OpenLayers.Projection('EPSG:4326'),
		eventListeners: {
			'moveend': mapEventMove,
			//'zoomend': mapEventZoom
		},
		controls: [
			new OpenLayers.Control.Navigation(),
			new OpenLayers.Control.ScaleLine({
        topOutUnits : 'nmi',
        bottomOutUnits: 'km',
        topInUnits: 'nmi',
        bottomInUnits: 'km',
        maxWidth: '40'
      }),
			new OpenLayers.Control.LayerSwitcher(),
			new OpenLayers.Control.MousePosition(),
			new OpenLayers.Control.PanZoomBar()
    ],
		maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
		numZoomLevels: 18,
		maxResolution: 156543,
		units: 'meters',
	});

	// Add Layers to map-------------------------------------------------------------------------------------------------------
	// Mapnik
	layer_mapnik = new OpenLayers.Layer.OSM.Mapnik('Mapnik');
	// Seamark
	layer_seamark = new OpenLayers.Layer.TMS(
    'Seezeichen',
    'http://tiles.openseamap.org/seamark/',
    {
      numZoomLevels: 18,
      type: 'png',
      getURL: getTileURL,
      isBaseLayer: false,
      displayOutsideMaxExtent: true
    });
	// Harbours
	layer_pois = new OpenLayers.Layer.Vector(
    'Häfen',
    {
      projection: new OpenLayers.Projection('EPSG:4326'),
      visibility: true,
      displayOutsideMaxExtent:true
    });
	layer_pois.setOpacity(0.8);

	map.addLayers([
    layer_mapnik,
    layer_seamark,
    layer_pois
  ]);
	jumpTo(lon, lat, zoom);

	// Update harbour layer
	refreshHarbours();
}
