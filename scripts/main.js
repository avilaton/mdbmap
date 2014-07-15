//hardcoded for cordoba
var lon = -64.1857371;
var lat = -31.4128832;
var zoom = 9;

var map, polygonLayer, formats;

function MapView() {
	this.initMap();
	this.initStyles();
}

MapView.prototype.initMap = function() {
	this.map = new OpenLayers.Map('map', {
			maxResolution: 360/512/16, 
			numZoomLevels: 18,
			units: 'm',
			projection: new OpenLayers.Projection("EPSG:900913"),
			displayProjection: new OpenLayers.Projection("EPSG:4326"),
			controls: [ 
					new OpenLayers.Control.Navigation(), 
					new OpenLayers.Control.PanZoomBar(),
					new OpenLayers.Control.Attribution(),
					new OpenLayers.Control.LayerSwitcher(),
					new OpenLayers.Control.MousePosition() ]
				});
};

MapView.prototype.initStyles = function() {
	
};

MapView.prototype.addLayers = function() {
	// body...
};

function createMap(){
	map = new OpenLayers.Map('map',{
			'maxResolution': 360/512/16, 
			'numZoomLevels':18,
			units: 'm',
			projection: new OpenLayers.Projection("EPSG:900913"),
			displayProjection: new OpenLayers.Projection("EPSG:4326"),
			controls: [ 
					new OpenLayers.Control.Navigation(), 
					new OpenLayers.Control.PanZoomBar(),
					new OpenLayers.Control.Attribution(),
					new OpenLayers.Control.LayerSwitcher(),
					new OpenLayers.Control.MousePosition() ]
				});

	epsg4326 =  new OpenLayers.Projection("EPSG:4326"); //WGS 1984 projection
	projectTo = new OpenLayers.Projection("EPSG:900913");

	var baseLayer = new OpenLayers.Layer.OSM( "Mapnik OSM");

	// Style maps
	var defStyle = new OpenLayers.Style({
				strokeColor: "blue", strokeWidth: 1, strokeOpacity: 1, 
				pointRadius: 3, fill:true, 
				fillColor: "blue", fillOpacity:0.5
			});
	var selectStyle = new OpenLayers.Style({
				strokeColor: "red", strokeWidth: 2, strokeOpacity: 1, 
				pointRadius: 5, fillColor:"red", fill:true, 
				fillOpacity:0.5,
				label : "Time: ${name}\nSpeed: ${desc}",
				fontColor: "black", fontSize: "12px", 
				fontFamily: "Courier New, monospace", fontWeight: "bold",
				labelAlign: "left", labelXOffset: "10", labelYOffset: "30",
				labelOutlineColor: "white", labelOutlineWidth: 3
			});
	var styleMap = new OpenLayers.StyleMap({
								'default':defStyle,
								'select': selectStyle
			});

	var trackLayer = new OpenLayers.Layer.Vector("Tracks", {
		styleMap:styleMap,
		projection: new OpenLayers.Projection("EPSG:4326"),
		strategies: [new OpenLayers.Strategy.Fixed()],
		protocol: new OpenLayers.Protocol.HTTP({
			url: "./gpx/track.gpx", 
			format: new OpenLayers.Format.GPX()
		})
	});
	trackLayer.id = 'tracks';
	
	var wptStyle = new OpenLayers.Style({
				strokeColor: "red", strokeWidth: 2, strokeOpacity: 1, 
				fillColor:"red", fill:true, 
				fillOpacity:0.5,
				label : "WptName: ${NomWpt}\nRadius: ${radius} m",
				fontColor: "black", fontSize: "12px", 
				fontFamily: "Courier New, monospace", fontWeight: "bold",
				labelAlign: "left", labelXOffset: "10", labelYOffset: "30",
				labelOutlineColor: "white", labelOutlineWidth: 3
			});
	var wptStyleMap = new OpenLayers.StyleMap({'default':wptStyle});
	
	polygonLayer = new OpenLayers.Layer.Vector("Polygon Layer",{
			styleMap: wptStyleMap
			});
	polygonLayer.id = 'polygonLayer';
	
	map.addLayers([baseLayer]);
	map.addLayers([trackLayer]);
	map.addLayers([polygonLayer]);
	
	var selectControl = new OpenLayers.Control.SelectFeature(trackLayer, {hover: true});
	map.addControl(selectControl);
	selectControl.activate();

	if(!map.getCenter()){
		map.setCenter(
			new OpenLayers.LonLat(lon,lat).transform(
				new OpenLayers.Projection("EPSG:4326"),
				map.getProjectionObject()
			), zoom
		);
	}
}


$(document).ready( function () {
	createMap();
	var mapView = new MapView();
	
	$.getJSON('./data/wpt.json').done(function(data) {
		$.each(data, function(idx, obj) {
			var lonLat = new OpenLayers.LonLat(obj.lon ,obj.lat).transform(epsg4326, projectTo);
			var circle = OpenLayers.Geometry.Polygon.createRegularPolygon(
						new OpenLayers.Geometry.Point(lonLat.lon,lonLat.lat),
						obj.radius, 50);
			var feature = new OpenLayers.Feature.Vector(circle,	obj);
			polygonLayer.addFeatures([feature]);
		});
		map.zoomToExtent(polygonLayer.getDataExtent()); 
	});
	
});
