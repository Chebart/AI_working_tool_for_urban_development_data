import { create } from 'zustand';

export type LayerType = 'roads' | 'metroStations' | 'busStops' | 'buildings';

// State for each layer's visibility
type LayerVisibility = {
  [key in LayerType]: boolean;
};

// State for managing layer versions
interface LayerVersions {
  roads: number;
  buildings: number;
}

// Define the Zustand store
interface MapLayersStore {
  // Layer visibility states
  visibility: LayerVisibility;
  toggleLayerVisibility: (layer: LayerType) => void;

  // Version synchronization for roads and buildings
  versions: LayerVersions;
  setVersion: (version: number) => void;

  // Reset state
  resetLayers: () => void;
}

const useMapLayersStore = create<MapLayersStore>((set) => ({
  // Initial visibility state for all layers
  visibility: {
    roads: true,
    metroStations: false,
    busStops: false,
    buildings: false,
  },

  // Toggle visibility for individual layers
  toggleLayerVisibility: (layer) =>
    set((state) => ({
      visibility: {
        ...state.visibility,
        [layer]: !state.visibility[layer],
      },
    })),

  // Version synchronization for roads and buildings
  versions: { roads: 1, buildings: 1 },
  setVersion: (version) =>
    set(() => ({
      versions: { roads: version, buildings: version },
    })),

  // Reset layers to default state
  resetLayers: () =>
    set(() => ({
      visibility: {
        roads: true,
        metroStations: false,
        busStops: false,
        buildings: false,
      },
      versions: { roads: 1, buildings: 1 },
    })),
}));

export default useMapLayersStore;
