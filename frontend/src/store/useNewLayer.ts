import { create } from 'zustand';
import { Polyline } from '../models/LayerItem.ts';
import { Feature } from 'geojson';

interface NewLayer {
  polygons: Record<number, Feature>;
  lines: Record<number, Polyline>;
  addNewPolygon: (id: number, newItem: Feature) => void;
  addNewLine: (id: number, newItem: Polyline) => void;
}

export const useNewLayer = create<NewLayer>()((set) => ({
  polygons: {},
  lines: {},
  addNewPolygon: (id: number, newItem: Feature) => {
    set((state) => ({
      polygons: { ...state.polygons, [id]: newItem },
    }));
  },
  addNewLine: (id: number, newItem: Polyline) => {
    set((state) => ({
      lines: { ...state.lines, [id]: newItem },
    }));
  },
}));
