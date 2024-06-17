// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
  });

  data1=d3.json(queryUrl);
  console.log(data1);


  function markerSize(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 5;
}
function chooseColor(depth) {

if (depth <= 10) return " #581845";
    else if (depth > 10 & depth <= 25) return "#900C3F";
    else if (depth > 25 & depth <= 40) return "#C70039";
    else if (depth > 40 & depth <= 55) return "#FF5733";
    else if (depth > 55 & depth <= 70) return "#FFC300";
    else return "#DAF7A6";

  
}
  function createFeatures(earthquakeData) {

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h4> Magnitute: ${feature.properties.mag}</h4> <h4> Place : ${feature.properties.place} </h4> <h4> Depth : ${feature.geometry.coordinates[2]} </h3>`);
    };
    
    
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    let earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer : function (feature, latlng){
        return L.circleMarker(latlng,{
          fillOpacity: 0.75,
          color: "white",
          fillColor: chooseColor(feature.geometry.coordinates[2]),
          radius: markerSize(feature.properties.mag)

        })//.bindPopup(`<h1>Magnitude : ${feature.property.mag}</h1> <hr> <h3>latlng:${feature.property.latlng}</h3>`)
      }
    });
  
    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
  }
 
  function createMap(earthquakes) {
  
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    /*
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });*/
  
    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street//,
      //"Topographic Map": topo
    };
  
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
      center: [
        40.735865959916566, -73.99703481860543
      ],
      zoom: 3,
      layers: [street, earthquakes]
    });
  
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    let legend = L.control({ position: "bottomright" });
    
    /*
    
    legend.onAdd = function() {
      let div = L.DomUtil.create("div", "legend");
         div.innerHTML += "<h4>Depth Color Legend</h4>";
         div.innerHTML += '<i style="background: red"></i><span>(Depth &lt; 10)</span><br>';
         div.innerHTML += '<i style="background: orange"></i><span>(10 < Depth <= 25)</span><br>';
         div.innerHTML += '<i style="background: yellow"></i><span>(25 < Depth <= 40)</span><br>';
         div.innerHTML += '<i style="background: pink"></i><span>(40 < Depth <= 55)</span><br>';
         div.innerHTML += '<i style="background: blue"></i><span>(55 < Depth <= 70)</span><br>';
         div.innerHTML += '<i style="background: green"></i><span>(Depth > 70)</span><br>';
    
      return div;
    };

*/


legend.onAdd = function() {
  var div = L.DomUtil.create('div', 'info legend');
  var grades = [0,10, 25, 40, 55, 70];
  var labels = [];
  var legendInfo = "<h3>Depth</h3>";

  div.innerHTML = legendInfo

  // go through each magnitude item to label and color the legend
  // push to labels array as list item
  for (let i = 0; i < grades.length; i++) {
        labels.push('<ul style="background-color:' + chooseColor(grades[i]+1 ) + '"> <span>' + grades[i] + (grades[i +1] ? '&ndash;' + grades[i + 1] + '' : '+') + '</span></ul>');
      }

    // add each label list item to the div under the <ul> tag
    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  
  return div;
};





    //add the legend to the map
    legend.addTo(myMap);
  
  }