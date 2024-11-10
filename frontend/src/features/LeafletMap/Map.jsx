import { MapContainer, TileLayer, GeoJSON, FeatureGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import React, { useEffect } from 'react';
import { useCurrentBuilding } from '../../shared/hooks/useCurrentBuilding.ts';
import { useCurrentStreet } from '../../shared/hooks/useCurrentStreet.ts';
import { useCurrentBusStop } from '../../shared/hooks/useCurrentBusStop.ts';
import { useCurrentMetro } from '../../shared/hooks/useCurrentMetro.ts';
import useMapLayersStore from '../../store/useMapLayersStore.ts';
import { EditControl } from 'react-leaflet-draw';
import { usePolygons } from '../../shared/hooks/usePolygons.ts';
import { useLines } from '../../shared/hooks/useLines.ts';
import { Polyline } from '../../models/LayerItem.ts';
import { useLayers } from '../../shared/hooks/useLayers.ts';

const MapView = () => {
  const [currentBuilding, setCurrentBuilding] = useCurrentBuilding();
  const [currentStreet, setCurrentStreet] = useCurrentStreet();
  const [currentBusStop, setCurrentBusStop] = useCurrentBusStop();
  const [currentMetro, setCurrentMetro] = useCurrentMetro();
  const [polygons, addPolygon] = usePolygons();
  const [lines, addLine] = useLines();
  const [layers, loadLayers] = useLayers();

  console.log(polygons);

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        // Здесь вы можете получить свойства объекта
        console.log(feature.properties);
        if ('ST_NAME' in feature.properties) {
          // street
          setCurrentStreet(feature.properties);
        } else if ('TrType' in feature.properties) {
          // stop
          setCurrentBusStop(feature.properties);
        } else if ('Text' in feature.properties) {
          // metro
          setCurrentMetro(feature.properties);
        } else if ('Entrances' in feature.properties) {
          // building
          setCurrentBuilding(feature.properties);
        }
        // тут в feature.properties как раз лежит один из объектов, которые я тебе скидывал. если хочешь посмотреть примеры, в папке public/data найдешь файлы с расширением .geojson. не советую открывать Street и Houses_init. от них вскод с ума сходит. если открывать то в блокнотике все будет нормально.
      },
    });
  };

  const { versions } = useMapLayersStore();

  useEffect(() => {
    loadLayers(versions.buildings);
  }, [versions]);

  const visibility = useMapLayersStore((state) => state.visibility);

  return (
    <div>
      <MapContainer
        center={[55.545, 37.489448705349]}
        zoom={15}
        style={{ height: '100vh' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={(v) => {
              if (v.layerType == 'polyline') {
                addLine(v.layer._leaflet_id, new Polyline([v.layer._latlngs]));
              } else if (v.layerType == 'polygon') {
                addPolygon(
                  v.layer._leaflet_id,
                  new CustomPolygon([v.layer._latlngs]),
                );
              }
            }}
            onEdited={(v) => {
              Object.keys(v.layers._layers).forEach((line) => {
                if (v.layers._layers[line]) {
                  if (v.layers._layers[line]._latlngs.length > 1) {
                    addLine(
                      v.layers._layers[line]._leaflet_id,
                      new Polyline([v.layers._layers[line]._latlngs]),
                    );
                  } else {
                    addPolygon(
                      v.layers._layers[line]._leaflet_id,
                      new CustomPolygon([v.layers._layers[line]._latlngs]),
                    );
                  }
                }
              });
            }}
            draw={{
              polyline: true,
              polygon: true,
              rectangle: false,
              circle: false,
              marker: false,
              circlemarker: false,
            }}
          />
        </FeatureGroup>
        {layers && (
          <>
            {visibility.metroStations && (
              <GeoJSON
                key="metros"
                data={layers[0]}
                onEachFeature={onEachFeature}
              />
            )}
            {visibility.busStops && (
              <GeoJSON
                key="busStops"
                data={layers[1]}
                onEachFeature={onEachFeature}
              />
            )}
            {visibility.buildings && (
              <GeoJSON
                key="buildings"
                data={layers[2]}
                onEachFeature={onEachFeature}
              />
            )}
            {visibility.roads && (
              <GeoJSON
                key="streets"
                data={layers[3]}
                onEachFeature={onEachFeature}
              />
            )}
            {/* {first && (
              <GeoJSON
                key="first"
                data={geo[0]}
                onEachFeature={onEachFeature}
              />
            )}
            {second && (
              <GeoJSON
                key="second"
                data={geo[1]}
                onEachFeature={onEachFeature}
              />
            )}
            {third && (
              <GeoJSON
                key="third"
                data={geo[2]}
                onEachFeature={onEachFeature}
              />
            )}
            {geo.slice(3).map((item, i) => (
              <GeoJSON key={i} data={item} onEachFeature={onEachFeature} />
            ))} */}
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;
