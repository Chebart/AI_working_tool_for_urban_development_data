import { useNewLayer } from '../../store/useNewLayer.ts';

export function usePolygons() {
  return [useNewLayer(store => store.polygons), useNewLayer(store => store.addNewPolygon)];
}