var icon = require('./marker-icon.png');
var inactiveIcon = require('./marker-icon-inactive.png');
var EVENTS = require('./events');
var emitter = require('../../../utils/emitter');

/**
 * @param {Event} event
 * @param {Object} map Google Map instance
 * @constructor
 */
function Marker(event, map, i) {
  var marker = this;
  this.event = event;
  event.marker = this;
  this.map = map;
  this.isActive = true;

  // Marker instance
  var markerInstance = new google.maps.Marker({
    title: event.title + ' [' + i + ']',
    position: event.city.position,
    draggable: false,
    visible: true,
    icon: this.getIcon(),
    map: map ? map.instance : null
  });

  this.marker = markerInstance;

  markerInstance.addListener('click', function () {
    emitter.emit(EVENTS.EVENT_SELECTED, event);
    marker.openWindow();
  });

  // Info window
  var infoWindow = new google.maps.InfoWindow({
    content: event.title
  });

  infoWindow.addListener('closeclick', function () {
    emitter.emit(EVENTS.EVENT_DESELECTED);
  });

  this.infoWindow = infoWindow;
}

Marker.prototype.getIcon = function () {
  var mapZoom = this.map.instance.getZoom();
  var isActive = this.isActive;

  return {
    scaledSize: {
      width: mapZoom <= 5 ? 16 : 32,
      height: mapZoom <= 5 ? 16 : 32
    },
    opacity: 1,
    url: isActive ? icon : inactiveIcon
  };
};

Marker.prototype.openWindow = function () {
  this.infoWindow.open(this.map.instance, this.marker);
};

Marker.prototype.closeWindow = function () {
  this.infoWindow.close();
};

Marker.prototype.activate = function () {
  this.isActive = true;
  this.marker.setIcon(this.getIcon());
  this.marker.setZIndex(2);
};

Marker.prototype.deactivate = function () {
  this.isActive = false;
  this.marker.setIcon(this.getIcon());
  this.marker.setZIndex(1);
  this.closeWindow();
};

module.exports = Marker;