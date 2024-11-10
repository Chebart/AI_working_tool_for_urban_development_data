import { useNewLayer } from '../../store/useNewLayer.ts';

export function useLines() {
  return [useNewLayer(store => store.lines), useNewLayer(store => store.addNewLine)];
}