import { create } from 'zustand';
import { FeatureCollection } from 'geojson';

interface LayersState {
  layers: Array<FeatureCollection>,
  loadLayers: () => void
}

export const useLayersStore = create<LayersState>((set) => ({
  layers: [],
  loadLayers: () => {
    Promise.all([
      fetch('/data/Metro/Выходы_метро.geojson').then((r) => r.json()),
      fetch('/data/Stops/Остановки_ОТ.geojson').then((r) => r.json()),
      fetch('/data/House_1/House_1очередь_ЖК.geojson').then((r) => r.json()),
      fetch('/data/House_2/House_2очередь_ЖК.geojson').then((r) => r.json()),
      fetch('/data/House_3/House_3очередь_ЖК.geojson').then((r) => r.json()),
    ]).then((d) => set(() => ({layers: d})));
  }
}));