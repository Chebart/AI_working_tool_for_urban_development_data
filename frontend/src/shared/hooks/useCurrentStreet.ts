import { useCurrentItem } from '../../store/useCurrentItem.ts';

export function useCurrentStreet() {
  return [useCurrentItem(store => store.currentStreet), useCurrentItem(store => store.setCurrentStreet)];
}