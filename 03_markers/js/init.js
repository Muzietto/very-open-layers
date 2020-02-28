
var map;
var layer_mapnik;
var layer_tah;
var layer_seamark;
var marker;

// Position and zoomlevel of the map
var lon = 9.114508;
var lat = 39.211631;
var zoom = 12;

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
      // control mouse events
			new OpenLayers.Control.Navigation(), // http://dev.openlayers.org/docs/files/OpenLayers/Control/Navigation-js.html
      // draw black horiz line with notches bottom left of page
			new OpenLayers.Control.ScaleLine({ // http://dev.openlayers.org/docs/files/OpenLayers/Control/ScaleLine-js.html
        topOutUnits : 'nmi',
        bottomOutUnits: 'km',
        topInUnits: 'nmi',
        bottomInUnits: 'km',
        maxWidth: '40'
      }),
      // allows the user interface to switch between BaseLayers and to show or hide Overlays.
			new OpenLayers.Control.LayerSwitcher(),
      // mouse coordinates lat/lon bottom right of the map
			new OpenLayers.Control.MousePosition({
        prefix: '<a target="_blank" ' +
            'href="http://spatialreference.org/ref/epsg/4326/">' +
            'EPSG:4326</a> coordinates: '
      }),
      // By default it is displayed in the upper left corner of the map as 4 directional arrows above a vertical slider.
			new OpenLayers.Control.PanZoomBar()
    ],
    // Instances of this class represent bounding boxes.  Data stored as left, bottom, right, top floats.
		maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
		numZoomLevels: 18,
    // Required if you are not displaying the whole world on a tile with the size specified in tileSize.
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

  var markers = new OpenLayers.Layer.Markers("Markers");

	map.addLayers([
    layer_mapnik,
    layer_seamark,
    layer_pois,
    markers,
  ]);

	jumpTo(lon, lat, zoom);

  //addMarker(markers, 9.20961, 39.19487, '<p>CIAO CIAO</p>');
  //marcoAddMarker(markers, 9.07262, 39.16227, 'gold');
  
  marcoAddMarker(markers, 9.20961, 39.19487, 'gold');

  // var markers = new OpenLayers.Layer.Markers( "Markers" );
  // map.addLayer(markers);
  //
  // var size = new OpenLayers.Size(21,25);
  // var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
  // var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png', size, offset);
  // markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(0,0),icon));
  // markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(0,0),icon.clone()));
  // Update harbour layer
	refreshHarbours();
}
