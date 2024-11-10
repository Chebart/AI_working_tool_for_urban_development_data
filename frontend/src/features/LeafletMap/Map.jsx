import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { useCurrentBuilding } from '../../shared/hooks/useCurrentBuilding.ts';
import { useCurrentStreet } from '../../shared/hooks/useCurrentStreet.ts';
import { useCurrentBusStop } from '../../shared/hooks/useCurrentBusStop.ts';
import { useCurrentMetro } from '../../shared/hooks/useCurrentMetro.ts';
import useMapLayersStore from '../../store/useMapLayersStore.ts';

const MapView = () => {
  const [geo, setGeo] = useState(null);

  const [currentBuilding, setCurrentBuilding] = useCurrentBuilding();
  const [currentStreet, setCurrentStreet] = useCurrentStreet();
  const [currentBusStop, setCurrentBusStop] = useCurrentBusStop();
  const [currentMetro, setCurrentMetro] = useCurrentMetro();

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

  useEffect(() => {
    Promise.all([
      fetch('/data/Metro/Выходы_метро.geojson').then((r) => r.json()),
      fetch('/data/Stops/Остановки_ОТ.geojson').then((r) => r.json()),
      fetch('/data/House_1/House_1очередь_ЖК.geojson').then((r) => r.json()),
      fetch('/data/House_2/House_2очередь_ЖК.geojson').then((r) => r.json()),
      fetch('/data/House_3/House_3очередь_ЖК.geojson').then((r) => r.json()),
    ]).then((d) => setGeo(d));
  }, []);

  const visibility = useMapLayersStore((state) => state.visibility);

  return (
    <div>
      <MapContainer
        center={[55.545, 37.489448705349]}
        zoom={15}
        style={{ height: '100vh' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {geo && (
          <>
            {visibility.metroStations && (
              <GeoJSON
                key="metros"
                data={geo[0]}
                onEachFeature={onEachFeature}
              />
            )}
            {visibility.busStops && (
              <GeoJSON
                key="busStops"
                data={geo[1]}
                onEachFeature={onEachFeature}
              />
            )}
            {visibility.buildings && (
              <GeoJSON
                key="buildings"
                data={geo[2]}
                onEachFeature={onEachFeature}
              />
            )}
            {/* {visibility.roads && (
              <GeoJSON
                key="streets"
                data={geo[3]}
                onEachFeature={onEachFeature}
              />
            )} */}
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
