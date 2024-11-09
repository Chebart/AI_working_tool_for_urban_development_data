import { useCurrentItem } from '../../store/useCurrentItem.ts';

export function useCurrentBusStop() {
  return [useCurrentItem(store => store.currentBusStop),
    useCurrentItem(store => store.setCurrentBusStop)];
}