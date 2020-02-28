
function jumpTo(lon, lat, zoom) {
	var x = Lon2Merc(lon);
	var y = Lat2Merc(lat);
	map.setCenter(new OpenLayers.LonLat(x, y), zoom);
	return false;
}

function Lon2Merc(lon) {
	return 20037508.34 * lon / 180;
}

function Lat2Merc(lat) {
	var PI = 3.14159265358979323846;
	lat = Math.log(Math.tan( (90 + lat) * PI / 360)) / (PI / 180);
	return 20037508.34 * lat / 180;
}

function addMarker(layer, lon, lat, popupContentHTML) {
	var ll = new OpenLayers.LonLat(Lon2Merc(lon), Lat2Merc(lat));
	var feature = new OpenLayers.Feature(layer, ll);
	feature.closeBox = true;
	feature.popupClass = OpenLayers.Class(
    OpenLayers.Popup.FramedCloud,
    {
      minSize: new OpenLayers.Size(260, 100),
    }
  );
	feature.data.popupContentHTML = popupContentHTML;
	feature.data.overflow = 'hidden';

	marker = new OpenLayers.Marker(ll);
	marker.feature = feature;

	var markerClick = function(evt) {
		if (this.popup == null) {
			this.popup = this.createPopup(this.closeBox);
			map.addPopup(this.popup);
			this.popup.show();
		} else {
			this.popup.toggle();
		}
		OpenLayers.Event.stop(evt);
	};

	marker.events.register('mousedown', feature, markerClick);

	layer.addMarker(marker);
	map.addPopup(feature.createPopup(feature.closeBox));
}

function marcoAddMarker(layer, lon, lat, color) {
  var iconUrl = {
    red: './js/img/marker.png',
    blue: './js/img/marker-blue.png',
    gold: './js/img/marker-gold.png',
    green: './js/img/marker-green.png',
  }[color] || './js/img/marker.png';

  var size = new OpenLayers.Size(21,25);
  var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
  var icon = new OpenLayers.Icon(iconUrl);

  try {
    layer.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(lon, lat), icon));
  } catch (err) {
    console.log('provided layer is not an OpenLayers.Layer.Markers');
  }
}

function getTileURL(bounds) {
	var res = this.map.getResolution();
	var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
	var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
	var z = this.map.getZoom();
	var limit = Math.pow(2, z);
	if (y < 0 || y >= limit) {
		return null;
	} else {
		x = ((x % limit) + limit) % limit;
		url = this.url;
		path= z + '/' + x + '/' + y + '.' + this.type;
		if (url instanceof Array) {
			url = this.selectUrl(path, url);
		}
		return url+path;
	}
}

// Map event listener moved
function mapEventMove(event) {
	// Update harbour layer
	refreshHarbours();
}
