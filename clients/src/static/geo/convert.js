
//const centroids = require("./country_centroids_old.json");
const centroids = require("./czech_districts_centroids_old.json");

const createFeature = (centroid) => {

    const feature = {
        type: "Feature",
        id: centroid.id,
        properties: {
          name: centroid.name,
        },
        geometry: {
          type: "Point",
          coordinates: [
            centroid.lat,
            centroid.long
          ]
        }
      }

    return feature;
}

const geojson = {
  type: "FeatureCollection",
  features: []
}

for(let i = 0; i < centroids.length; i++) {
    geojson.features.push(createFeature(centroids[i]));
}

fs = require('fs');
fs.writeFile('./czech_districts_centroids.json', JSON.stringify(geojson, null, 2), function (err) {
    if (err) return console.log(err);
    console.log('writing...');
  });