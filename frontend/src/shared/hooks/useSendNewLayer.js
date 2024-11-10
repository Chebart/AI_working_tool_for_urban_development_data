import { useNewLayer } from '../../store/useNewLayer.ts';
import { useLayersStore } from '../../store/useLayersStore.ts';
import { Feature, GeoJsonProperties, Geometry } from 'geojson';

export function useSendNewLayer() {
  const lines = useNewLayer(state => state.lines);
  const polygons = useNewLayer(state => state.polygons);
  const layers = useLayersStore(state => state.layers);
  Object.values(polygons).forEach((item) => {
    layers[2].features.push(item);
  });

}
