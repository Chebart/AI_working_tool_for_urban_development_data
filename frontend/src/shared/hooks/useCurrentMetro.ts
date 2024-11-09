import { useCurrentItem } from '../../store/useCurrentItem.ts';

export function useCurrentMetro() {
  return [useCurrentItem(store => store.currentMetro), useCurrentItem(store => store.setCurrenMetro)];
}