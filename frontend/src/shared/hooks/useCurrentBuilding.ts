import { useCurrentItem } from '../../store/useCurrentItem.ts';

export function useCurrentBuilding() {
  return [useCurrentItem(store => store.currentBuilding), useCurrentItem(store => store.setCurrentBuilding)];
}