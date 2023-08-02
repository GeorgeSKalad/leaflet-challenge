// We create the tile layer that will be the background of our map.
//this is just for test purposes
console.log("Step 1 working");

// We create the TILE LAYER that will be the background of our map.
//copy block of code from any excercise - we are creating the background from openstreetmap.org. 
let basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var gray = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});


// We create the map object with options.
//map object with center coordinates - can get from other examples -
//copy block of code, play around with center parameters - and zoom level. 
//you want most of United states visible 

let map = L.map('map', {
  center: [37.0902, -95.7129],
  zoom: 4 
  });
// create 

let tectonicplates = new L.LayerGroup();
let earthquakes = new L.LayerGroup();

let overlays = {
  "Tectonic Plates": tectonicplates,
  Earthquakes: earthquakes
};

// Then we add our 'basemap' tile layer to the map.
basemap.addTo(map);

// Here we make call that retrieves our earthquake geoJSON data.
//where are you getting data from? You need the url to .geoJSON

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson").then(function (data) {

  // This function returns the style data for each of the earthquakes we plot on
  // the map. 
  //We pass the magnitude of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
	  //what in geojson determines the radius of the circles? How do you get to that value?
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // This function determines the color of the marker based on the magnitude of the earthquake.
  //which colors make sense here
  function getColor(depth) {
    switch (true) {
      case depth > 90:
        return "#FF0000";
      case depth > 70:
        return "#FF4500";
      case depth > 50:
        return "#FFA500";
      case depth > 30:
        return "#FFA500";
      case depth > 10:
        return "#FFFF00";
      default:
        return "#ADFF2F";
    }
  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  // Earthquakes with a magnitude of 0 were being plotted with the wrong radius.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }

  // Here we add a GeoJSON layer to the map once the file is loaded.
  L.geoJSON(data, {
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    // We set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // We create a popup for each marker to display the magnitude 
	//and location of the earthquake after the marker has been created and styled
	//how do you traverse the geojson data to get to the appropriate values?
	//look up documentation and examples of onEachFeature
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "Magnitude: "
        + feature.properties.mag
        + "<br>Depth: "
        + feature.geometry.coordinates[2]
        + "<br>Location: "
        + feature.properties.place
      );
    }
  }).addTo(map);

  // Here we create a legend control object.
  //Look at prevoius examples with a legend
  let legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");

    let grades = [-10, 10, 30, 50, 70, 90];
    let colors = [
      "#ADFF2F",
      "#FFFF00",
      "#FFD700",
      "#FFA500",
      "#FF4500",
      "#FF0000"
    ];

    // Looping through our intervals to generate a label with a colored square
//	for each interval. Returning a div
    for (let i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
        + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Finally, we our legend to the map.
  legend.addTo(map);
});