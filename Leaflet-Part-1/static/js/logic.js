// Add a tile layer.

let satelite=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

let baseMaps = {
  "Street Map": satelite,
  "Topographic Map": topo
};


// Create an overlay object to hold our overlay.
let overlayMaps = {
  Earthquakes: earthquakes
};



let mymap=L.map("map", {
    center:[40.735865959916566, -73.99703481860543],
    zoom:4
});
//sattelitmapmap.addTo(mymap);


baseMaps.addTo(mymap);

let url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//datafile=d3.json(url);


d3.json(url).then( function (data){
  function markerSize(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 5;
}
function chooseColor(magnitude) {
  switch (true) {
  case magnitude > 5:
      return "#581845";
  case magnitude > 4:
      return "#900C3F";
  case magnitude > 3:
      return "#C70039";
  case magnitude > 2:
      return "#FF5733";
  case magnitude > 1:
      return "#FFC300";
  default:
      return "#DAF7A6";
  }
}


    let geojson = L.geoJson(data, {
      onEachFeatue: function (feature, layer) {
        layer.bindPopup(`Magnitude ${feature.property.mag}`)
      },
      pointToLayer : function (feature, latlng){
        return L.circleMarker(latlng,{
          fillOpacity: 0.75,
          color: "white",
          fillColor: chooseColor(feature.properties.mag),
          radius: markerSize(feature.properties.mag)

        })//.bindPopup(`<h1>Magnitude : ${feature.property.mag}</h1> <hr> <h3>latlng:${feature.property.latlng}</h3>`)
      }
   
    }).addTo(mymap);
  
   
  
  
  });