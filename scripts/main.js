function MapView() {
  this.initMap();
  this.setStyles();
  this.addLayers();
  this.addControls();

  //hardcoded for cordoba
  var lon = -64.1857371;
  var lat = -31.4128832;
  var zoom = 9;
  this.setCenter(lon, lat, zoom);
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

  this.epsg4326 =  new OpenLayers.Projection("EPSG:4326"); //WGS 1984 projection
  this.projectTo = new OpenLayers.Projection("EPSG:900913");
};

MapView.prototype.setStyles = function() {
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
  this.styleMap = new OpenLayers.StyleMap({
    'default':defStyle,
    'select': selectStyle
  });
 
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
  this.wptStyleMap = new OpenLayers.StyleMap({'default': wptStyle});
};

MapView.prototype.addControls = function() {
  var selectControl = new OpenLayers.Control.SelectFeature(this.layers.trackLayer, {hover: true});
  this.map.addControl(selectControl);
  selectControl.activate();
};

MapView.prototype.setCenter = function(lon, lat, zoom) {
  if(!this.map.getCenter()){
    this.map.setCenter(
      new OpenLayers.LonLat(lon,lat).transform(
        new OpenLayers.Projection("EPSG:4326"),
        this.map.getProjectionObject()
      ), zoom
    );
  }
};

MapView.prototype.addLayers = function() {
  this.layers = {};
  this.layers.baseLayer = new OpenLayers.Layer.OSM( "Mapnik OSM");

  this.layers.trackLayer = new OpenLayers.Layer.Vector("Tracks", {
    styleMap: this.styleMap,
    projection: new OpenLayers.Projection("EPSG:4326"),
    strategies: [new OpenLayers.Strategy.Fixed()],
    protocol: new OpenLayers.Protocol.HTTP({
      url: "./gpx/track.gpx", 
      format: new OpenLayers.Format.GPX()
    })
  });
  
  this.layers.polygonLayer = new OpenLayers.Layer.Vector("Polygon Layer",{
    styleMap: this.wptStyleMap
  });

  this.map.addLayers([this.layers.baseLayer, this.layers.trackLayer]);
  this.map.addLayers([this.layers.polygonLayer]);
};

MapView.prototype.addWPT = function(data) {
  var self = this;
  $.each(data, function(idx, obj) {
    var lonLat = new OpenLayers.LonLat(obj.lon ,obj.lat).transform(self.epsg4326, self.projectTo);
    var circle = OpenLayers.Geometry.Polygon.createRegularPolygon(
          new OpenLayers.Geometry.Point(lonLat.lon,lonLat.lat),
          obj.radius, 50);
    var feature = new OpenLayers.Feature.Vector(circle, obj);
    self.layers.polygonLayer.addFeatures([feature]);
  });
  this.map.zoomToExtent(this.layers.polygonLayer.getDataExtent()); 
};

$(document).ready( function () {
  var mapView = new MapView();
  
  $.getJSON('data/wpt.json').done(function(data) {
    mapView.addWPT(data);
  });
  
});
