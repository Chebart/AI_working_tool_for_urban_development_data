import { create } from 'zustand';
import { FeatureCollection } from 'geojson';

interface LayersState {
  layers: Array<FeatureCollection>;
  loadLayers: (version?: number) => void;
}

export const useLayersStore = create<LayersState>((set) => ({
  layers: [],
  loadLayers: () => {
    // резервируем поля.
    // 0-4 - статика
    // 0 - метро
    // 1 - остановки
    // 2 - здания из init
    // 3 - дороги из init

    // 4-5 - с бэка
    // 4 - здания с бэка
    // 5 - дорожки с бэка

    Promise.all([
      fetch('/data/geojsons/Metro.geojson', { mode: 'no-cors' }).then((r) =>
        r.json(),
      ),
      fetch('/data/geojsons/Stops.geojson', { mode: 'no-cors' }).then((r) =>
        r.json(),
      ),
      fetch('/data/geojsons/Houses_init.geojson', { mode: 'no-cors' }).then(
        (r) => r.json(),
      ),
      fetch('/data/geojsons/Streets_init.geojson', { mode: 'no-cors' }).then(
        (r) => r.json(),
      ),
      // fetch('/get_layer/residence/' + version).then((r) => r.json()),
      // fetch('/get_layer/streets/' + version).then((r) => r.json()),
    ]).then((d) => set(() => ({ layers: d })));
  },
}));
