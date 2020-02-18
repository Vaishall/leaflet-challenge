var myMap = L.map("map", {
  center: [15.5994, -28.6731],
  zoom: 3
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken: API_KEY
}).addTo(myMap);

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

function chooseColor(magnitude) {
  if (magnitude < 1) {
    return 'green';
  }
  else if (magnitude < 2) {
    return 'lime';
  }
  else if (magnitude < 3) {
    return 'yellow';
  }
  else if (magnitude < 4) {
    return 'orange';
  }
  else if (magnitude < 5) {
    return 'orangered';
  }
  else {
    return 'red';
  }
}

d3.json(url , function(data) {
  data.features.forEach(function(earthquake){
    L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]],{
      fillOpacity: 0.5,
      color: "black",
      fillColor: chooseColor(earthquake.properties.mag),
      // Adjust radius
      radius: earthquake.properties.mag * 100000
    }).bindPopup(`<h3>Magnitude: ${earthquake.properties.mag}</h3> <hr> <h3>Location: ${earthquake.properties.place}</h3>`)
    .addTo(myMap);
  });
});

var legend = L.control({position: 'bottomright'});
legend.onAdd = function(map){
  var div = L.DomUtil.create('div', 'info legend'),
  magnitudes = [0,1,2,3,4,5],
  labels = [];
  for (var i=0; i<magnitudes.length; i++) {
    div.innerHTML += '<i style="background:' + chooseColor(magnitudes[i]) + '"></i> ' + magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
   }
  return div;
};

legend.addTo(myMap);