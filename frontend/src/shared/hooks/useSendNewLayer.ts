import { useNewLayer } from '../../store/useNewLayer.ts';
import { useLayersStore } from '../../store/useLayersStore.ts';
import { post } from '../../utils/network.ts';

// type LayerType = 'residence' | 'streets' | 'static';

export function useSendNewLayer() {
  const lines = useNewLayer((state) => state.lines);
  const polygons = useNewLayer((state) => state.polygons);
  const layers = useLayersStore((state) => state.layers);
  if (Object.keys(polygons).length > 0) {
    // здания
    post('http://0.0.0.0:9000/new_version/residence', {
      ...layers[4],
      features: [...(layers[4].features || []), ...Object.values(polygons)],
    });
  }
  if (Object.keys(lines).length > 0) {
    // дорожки
    post('http://0.0.0.0:9000/new_version/streets', {
      ...layers[5],
      features: [...(layers[5].features || []), ...Object.values(lines)],
    });
  }
}
