const API_KEY = "pk.eyJ1IjoiYXhpb21hNDIiLCJhIjoiY2swcmhzcDZlMDE1OTNtazA1ZDE1OTNkcCJ9.-QdJ1kX7PvbooSmDCN6B-A";

// API link 
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"


// Markers should reflect the magnitude of the earthquake in their size and color. 
function markerSize(mag) {
  return mag * 20000;
}

// Earthquakes color palette
function markerColor(mag) {
  if (mag <= 1) {
      return "#99ff99";
  } else if (mag <= 2) {
      return "#ddff99";
  } else if (mag <= 3) {
      return "#ffff99";
  } else if (mag <= 4) {
      return "#ffe680";
  } else if (mag <= 5) {
      return "#ff751a";
  } else {
      return "#ff0000";
  };
}

// Perform a query using a GET request
d3.json(link, function(data) {
  createFeatures(data.features);
});

// Create the Leaflet map that plots the earthquakes from the data set 
function createFeatures(earthquakeData) {

  var earthquakes = L.geoJSON(earthquakeData, {

 onEachFeature : function (feature, layer) {
// Add features
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " +  feature.properties.mag + "</p>")
    },     pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.properties.mag),
        fillOpacity: 1,
        stroke: false,
    })
  }
  });
    
  // Create earthquake layer 
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the tile layer that will be the background of our map 
  var streetMap =   L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  // Create base map
  var baseMaps = {
    "Street Map": streetMap,
  };

  // Create overlay map to show earthquake data
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create the map with the layers
  var myMap = L.map("map", {
    center: [19.4284706, -99.1276627],
    zoom: 4,
    layers: [streetMap, earthquakes]
  });

  // Create layer control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);         

  // Create the legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {
  
      var div = L.DomUtil.create('div', 'info legend'),
          magnitudes = [0, 1, 2, 3, 4, 5];
  
      for (var i = 0; i < magnitudes.length; i++) {
          div.innerHTML +=
              '<i style="background:' + markerColor(magnitudes[i] + 1) + '"></i> ' + 
      + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' + ');
      }
  
      return div;
  };
  
  legend.addTo(myMap);

}