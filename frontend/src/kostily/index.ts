import proj4 from 'proj4';
// import 'proj4';
// import 'proj4leaflet';

// Настройка проекции EPSG:32637
const EPSG32637 = '+proj=utm +zone=37 +datum=WGS84 +units=m +no_defs'; // EPSG:32637 (UTM 37N)
const EPSG4326 = 'EPSG:4326'; // EPSG:4326 (широта и долгота)

export function convertGeoJSONToEPSG4326(geojson: object) {
  // Создаем копию GeoJSON, чтобы не изменять оригинал
  const convertedGeoJSON = JSON.parse(JSON.stringify(geojson));

  // Проходимся по всем координатам в зависимости от типа геометрии
  convertedGeoJSON.features = convertedGeoJSON.features.map(
    (feature: {
      geometry: {
        coordinates: number[] | number[][] | number[][][] | number[][][][];
        type: string;
      };
    }) => {
      feature.geometry.coordinates = transformCoordinates(
        feature.geometry.coordinates,
        feature.geometry.type,
      );
      return feature;
    },
  );

  return convertedGeoJSON;
}

const getCoords = (coord: [number, number]) => {
  const coords = proj4(EPSG32637, EPSG4326, coord);
  return coords;
};

function transformCoordinates(
  coordinates: number[] | number[][] | number[][][] | number[][][][],
  type: string,
) {
  switch (type) {
    case 'Point':
      return getCoords(coordinates as [number, number]);
    case 'LineString':
    case 'MultiPoint':
      return coordinates.map((coord) => getCoords(coord as [number, number]));
    case 'Polygon':
    case 'MultiLineString':
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return coordinates.map((ring) => ring.map((coord) => getCoords(coord)));
    case 'MultiPolygon':
      return coordinates.map((polygon) =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        polygon.map((ring) => ring.map((coord) => getCoords(coord))),
      );
    default:
      return coordinates;
  }
}

export const deletePoints = (geojson: object) => {
  if (!('features' in geojson) || !Array.isArray(geojson.features))
    return geojson;
  geojson.features = geojson.features.filter(
    (feature: { geometry: { type: string } }) =>
      feature.geometry.type !== 'Point',
  );
  return geojson;
};
