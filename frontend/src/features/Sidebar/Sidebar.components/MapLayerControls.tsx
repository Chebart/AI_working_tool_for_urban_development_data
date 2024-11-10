import React, { useEffect, useState } from 'react';
import useMapLayersStore, { LayerType } from '../../../store/useMapLayersStore';
import { Select } from '../../../components/Select/Select';

// const layers = ['Станции метро', 'Автобусные остановки', 'Здания', 'Улицы'];

const layers: { label: string; value: LayerType }[] = [
  {
    label: 'Станции метро',
    value: 'metroStations',
  },
  {
    label: 'Автобусные остановки',
    value: 'busStops',
  },
  {
    label: 'Здания',
    value: 'buildings',
  },
  {
    label: 'Улицы',
    value: 'roads',
  },
];

export const MapLayerControls: React.FC = () => {
  const { visibility, toggleLayerVisibility, setVersion, resetLayers } =
    useMapLayersStore();

  const [versionCount, setVersionCount] = useState<number>(0);
  useEffect(() => {
    fetch('http://0.0.0.0:9000/get_available_versions')
      .then((res) => res.json())
      .then((data) => setVersionCount(data.versions.length))
      .catch(() => setVersionCount(0));
  }, []);
  return (
    <div>
      <h2>Управление отображением</h2>
      {versionCount > 0 && (
        <div>
          <h3>Версии</h3>
          <Select
            onSelect={(value) => setVersion(+value)}
            options={Array.from({ length: versionCount }, (_, i) => ({
              label: 'Версия ' + (i + 1),
              value: i.toString(),
            }))}
          />
        </div>
      )}
      <div>
        <h3>Слои</h3>
        {layers.map((layer) => (
          <div key={layer.value} className="Input_checkbox">
            <input
              id={layer.value}
              name={layer.value}
              disabled={layer.value === 'roads'}
              type="checkbox"
              checked={visibility[layer.value]}
              onChange={() => toggleLayerVisibility(layer.value)}
            />
            <label htmlFor={layer.value}>{layer.label}</label>
          </div>
        ))}
      </div>

      <button onClick={resetLayers}>Вернуть дефолтные настройки</button>
    </div>
  );
};
