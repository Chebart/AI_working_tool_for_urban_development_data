import { useLayersStore } from '../../store/useLayersStore.ts';

export function useLayers() {
  return [useLayersStore(state => state.layers), useLayersStore(state => state.loadLayers)];
}