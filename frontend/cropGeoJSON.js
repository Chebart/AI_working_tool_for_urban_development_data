import { readFile, writeFile } from 'fs';

/**
 * Function to check if a point is within a bounding box.
 * @param {Array<number>} point - An array [lon, lat] representing the point's coordinates.
 * @param {Array<number>} topLeft - An array [lon, lat] representing the top-left corner of the bounding box.
 * @param {Array<number>} bottomRight - An array [lon, lat] representing the bottom-right corner of the bounding box.
 * @returns {boolean} - True if the point is within the bounding box, false otherwise.
 */
function isPointInBoundingBox(point, topLeft, bottomRight) {
  const [lon, lat] = point;
  return (
    lon >= topLeft[0] &&
    lon <= bottomRight[0] &&
    lat <= topLeft[1] &&
    lat >= bottomRight[1]
  );
}

/**
 * Function to filter GeoJSON features based on bounding box.
 * @param {Object} geojson - The GeoJSON data.
 * @param {Array<number>} topLeft - An array [lon, lat] for the top-left bounding box coordinates.
 * @param {Array<number>} bottomRight - An array [lon, lat] for the bottom-right bounding box coordinates.
 * @returns {Object} - The filtered GeoJSON data.
 */
function cleanGeoJSON(geojson, topLeft, bottomRight) {
  const filteredFeatures = geojson.features.filter((feature) => {
    if (feature.geometry.type === 'Point') {
      return isPointInBoundingBox(
        feature.geometry.coordinates,
        topLeft,
        bottomRight,
      );
    } else if (
      feature.geometry.type === 'LineString' ||
      feature.geometry.type === 'MultiPoint'
    ) {
      return feature.geometry.coordinates.some((point) =>
        isPointInBoundingBox(point, topLeft, bottomRight),
      );
    } else if (
      feature.geometry.type === 'Polygon' ||
      feature.geometry.type === 'MultiLineString'
    ) {
      return feature.geometry.coordinates
        .flat()
        .some((point) => isPointInBoundingBox(point, topLeft, bottomRight));
    } else if (feature.geometry.type === 'MultiPolygon') {
      return feature.geometry.coordinates
        .flat(2)
        .some((point) => isPointInBoundingBox(point, topLeft, bottomRight));
    }
    return false;
  });

  return {
    ...geojson,
    features: filteredFeatures,
  };
}

// Read GeoJSON file
readFile(
  'public/data/Houses_init/Дома_исходные.geojson',
  'utf8',
  (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
    /**
55.55, 37.473
55.54, 37.51
 */
    const geojson = JSON.parse(data);
    const topLeft = [37.47, 55.56]; // Replace with actual top-left coordinates [lon, lat]
    const bottomRight = [37.51, 55.537]; // Replace with actual bottom-right coordinates [lon, lat]

    const cleanedGeoJSON = cleanGeoJSON(geojson, topLeft, bottomRight);

    // Write cleaned GeoJSON to a new file
    writeFile(
      'cleaned_output.geojson',
      JSON.stringify(cleanedGeoJSON, null, 2),
      (err) => {
        if (err) {
          console.error('Error writing file:', err);
          return;
        }
        console.log('Cleaned GeoJSON saved to cleaned_output.geojson');
      },
    );
  },
);
