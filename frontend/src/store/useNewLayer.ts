import { create } from 'zustand';
import { CustomPolygon, Polyline } from '../models/LayerItem.ts';

interface NewLayer {
  polygons: Record<number, CustomPolygon>,
  lines: Record<number, Polyline>,
  addNewPolygon: (id: number, newItem: CustomPolygon) => void,
  addNewLine: (id: number, newItem: Polyline) => void,
}

export const useNewLayer =
  create<NewLayer>()((set) => ({
    polygons: {},
    lines: {},
    addNewPolygon: (id: number, newItem: CustomPolygon) => {
      set((state) => ({
        polygons: { ...state.polygons, [id]: newItem }
      }));
    },
    addNewLine: (id: number, newItem: Polyline) => {
      set((state) => ({
        lines: { ...state.lines, [id]: newItem }
      }));
    },
  }));