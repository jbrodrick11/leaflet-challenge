// Create map item
let map = L.map("map", {
  center: [0, 0],
  zoom: 3,
});
// Add detail to map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  noWrap: false,
}).addTo(map);

// Create function to colour the markers
function markerColours(depth) {
  if (depth > 90) {
    return "#644D8E";
  } else if (depth > 70) {
    return "#8F5A91";
  } else if (depth > 50) {
    return "#C86C8F";
  } else if (depth > 30) {
    return "#DC828E";
  } else if (depth > 10) {
    return "#EC998D";
  } else {
    return "#fecc99";
  }
}

// Set up dictionary to hold legend colours and hex codes
let legendColours = {
  "0-10": "#fecc99",
  "10-30": "#EC998D",
  "30-50": "#DC828E",
  "50-70": "#C86C8F",
  "70-90": "#8F5A91",
  "90+": "#644D8E",
};

// Create legend variable
let legend = L.control({ position: "bottomright" });

//Create and populate legend
legend.onAdd = function () {
  let div = L.DomUtil.create("div", "info legend");
  for (let key in legendColours) {
    let colour = legendColours[key];
    let label = key;
    let item = `<div><span class="legend-key" style="background-color: ${colour}"></span><span class="legend-label">${label}</span></div>`;
    div.innerHTML += item;
  }
  return div;
};
// Add legend to map
legend.addTo(map);

// Pull GeoJSON Data using D#
d3.json(
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
).then(function (response) {
  console.log(response);

// Loop through each item in the JSON dataset
  for (let i = 0; i < response.features.length; i++) {
    let latitude = response.features[i].geometry.coordinates[1];
    let longitude = response.features[i].geometry.coordinates[0];
    let depth = response.features[i].geometry.coordinates[2];
    let magnitude = response.features[i].properties.mag;
    let title = response.features[i].properties.title;

    let size = magnitude * 3;
// Create markers and detial them based on magnitude and depth
    let marker = L.circleMarker([latitude, longitude], {
      radius: size,
      color: markerColours(depth),
      fillOpacity: 1,
    });
// Add markers to the map
    marker.addTo(map);
    
// Bind Popup details to each point on the map
    marker.bindPopup(
        "<h3>" +title +"</h3>" +
        "<p>" +"Magnitude: " +magnitude +"</p>" +
        "<p>" +"Depth: " + depth +"</p>" +
        "<p>" + "Longitude: " +longitude +"</p>" +
        "<p>" + "Latitude: " +latitude +"</p>"
    );
  }
});
