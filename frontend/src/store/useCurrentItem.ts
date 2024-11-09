import { create } from 'zustand';
import { BuildingData } from '../models/BuildingData.ts';
import { StreetData } from '../models/StreetData.ts';
import { MetroExitData } from '../models/MetroExitData.ts';
import { StopData } from '../models/StopData.ts';

interface CurrentItems {
  currentBuilding: BuildingData | null,
  currentStreet: StreetData | null,
  currentMetro: MetroExitData | null,
  currentBusStop: StopData | null,
  setCurrentBuilding: (newItem: BuildingData) => void,
  setCurrentStreet: (newItem: StreetData) => void,
  setCurrenMetro: (newItem: MetroExitData) => void,
  setCurrentBusStop: (newItem: StopData) => void,
}

export const useCurrentItem =
  create<CurrentItems>()((set) => ({
    currentBuilding: null,
    currentStreet: null,
    currentMetro: null,
    currentBusStop: null,

    setCurrentBuilding: (newItem: BuildingData) => {
      set(() => ({ currentBuilding: newItem }));
    },
    setCurrentStreet: (newItem: StreetData) => {
      set(() => ({ currentStreet: newItem }));
    },
    setCurrenMetro: (newItem: MetroExitData) => {
      set(() => ({ currentMetro: newItem }));
    },
    setCurrentBusStop: (newItem: StopData) => {
      set(() => ({ currentBusStop: newItem }));
    },
  }));