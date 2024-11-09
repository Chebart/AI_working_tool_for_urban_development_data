import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { useCurrentBuilding } from '../../shared/hooks/useCurrentBuilding.ts';
import { useCurrentStreet } from '../../shared/hooks/useCurrentStreet.ts';
import { useCurrentBusStop } from '../../shared/hooks/useCurrentBusStop.ts';
import { useCurrentMetro } from '../../shared/hooks/useCurrentMetro.ts';

const MapView = () => {
  const [geo, setGeo] = useState(null);
  const [first, setFirst] = useState(false);
  const [second, setSecond] = useState(false);
  const [third, setThird] = useState(false);

  const [currentBuilding, setCurrentBuilding] = useCurrentBuilding();
  const [currentStreet, setCurrentStreet] = useCurrentStreet();
  const [currentBusStop, setCurrentBusStop] = useCurrentBusStop();
  const [currentMetro, setCurrentMetro] = useCurrentMetro();

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

  console.log('stop', currentBusStop)

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
