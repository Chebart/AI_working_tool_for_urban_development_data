import { MapContainer, TileLayer, GeoJSON, FeatureGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import React, { useEffect, useState } from 'react';
import { useCurrentBuilding } from '../../shared/hooks/useCurrentBuilding.ts';
import { useCurrentStreet } from '../../shared/hooks/useCurrentStreet.ts';
import { useCurrentBusStop } from '../../shared/hooks/useCurrentBusStop.ts';
import { useCurrentMetro } from '../../shared/hooks/useCurrentMetro.ts';
import { EditControl } from 'react-leaflet-draw';
import { usePolygons } from '../../shared/hooks/usePolygons.ts';
import { useLines } from '../../shared/hooks/useLines.ts';
import { Polygon, Polyline } from '../../models/LayerItem.ts';

const MapView = () => {
  const [geo, setGeo] = useState(null);
  const [first, setFirst] = useState(false);
  const [second, setSecond] = useState(false);
  const [third, setThird] = useState(false);

  const [currentBuilding, setCurrentBuilding] = useCurrentBuilding();
  const [currentStreet, setCurrentStreet] = useCurrentStreet();
  const [currentBusStop, setCurrentBusStop] = useCurrentBusStop();
  const [currentMetro, setCurrentMetro] = useCurrentMetro();
  const [polygons, addPolygon] = usePolygons();
  const [lines, addLine] = useLines();

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        // Здесь вы можете получить свойства объекта
        console.log(feature.properties);
        if (feature.properties.ST_NAME) {
          // street
          setCurrentStreet(feature.properties);
        } else if (feature.properties.TrType) {
          // stop
          setCurrentBusStop(feature.properties);
        } else if (feature.properties.Text) {
          // metro
          setCurrentMetro(feature.properties);
        } else if (feature.properties.Entrances) {
          // building
          setCurrentBuilding(feature.properties);
        }
        // тут в feature.properties как раз лежит один из объектов, которые я тебе скидывал. если хочешь посмотреть примеры, в папке public/data найдешь файлы с расширением .geojson. не советую открывать Street и Houses_init. от них вскод с ума сходит. если открывать то в блокнотике все будет нормально.
      },
    });
  };

  useEffect(() => {
    Promise.all([
      fetch('/data/House_1/House_1очередь_ЖК.geojson').then((r) => r.json()),
      fetch('/data/House_2/House_2очередь_ЖК.geojson').then((r) => r.json()),
      fetch('/data/House_3/House_3очередь_ЖК.geojson').then((r) => r.json()),
      fetch('/data/Metro/Выходы_метро.geojson').then((r) => r.json()),
      fetch('/data/Stops/Остановки_ОТ.geojson').then((r) => r.json()),
    ]).then((d) => setGeo(d));
  }, []);

  return (
    <div>
      <div>
        <button onClick={() => setFirst((c) => !c)}>
          SHOW FIRST: {String(first)}
        </button>
        <br />
        <button onClick={() => setSecond((c) => !c)}>
          SHOW SECOND: {String(second)}
        </button>
        <br />
        <button onClick={() => setThird((c) => !c)}>
          SHOW THIRD: {String(third)}
        </button>
        <br />
      </div>
      <MapContainer
        center={[55.545, 37.489448705349]}
        zoom={15}
        style={{ height: '90vh' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={(v) => {
              if (v.layerType == 'polyline') {
                addLine(v.layer._leaflet_id, new Polyline([v.layer._latlngs]));
              } else if (v.layerType == 'polygon') {
                addPolygon(v.layer._leaflet_id, new Polygon([v.layer._latlngs]));
              }
            }}
            onEdited={(v) => {
              Object.keys(v.layers._layers).forEach((line) => {
                if (v.layers._layers[line]) {
                  if (v.layers._layers[line]._latlngs.length > 1) {
                    addLine(v.layers._layers[line]._leaflet_id, new Polyline([v.layers._layers[line]._latlngs]));
                  } else {
                    addPolygon(v.layers._layers[line]._leaflet_id, new Polygon([v.layers._layers[line]._latlngs]));
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
        {geo && (
          <>
            {first && (
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
            ))}
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;
