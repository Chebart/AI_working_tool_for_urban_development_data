import { BuildingData } from '../../models/BuildingData';
import { MetroExitData } from '../../models/MetroExitData';
import { StopData } from '../../models/StopData';
import { StreetData } from '../../models/StreetData';
import { useCurrentBuilding } from '../../shared/hooks/useCurrentBuilding';
import { useCurrentBusStop } from '../../shared/hooks/useCurrentBusStop';
import { useCurrentMetro } from '../../shared/hooks/useCurrentMetro';
import { useCurrentStreet } from '../../shared/hooks/useCurrentStreet';
import BuildingDataDisplay from './Sidebar.components/Building';
import { MapLayersManager } from './Sidebar.components/MapLayersManager';
import MetroExitDataDisplay from './Sidebar.components/Metro';
import StopDataDisplay from './Sidebar.components/Stop';
import StreetDataDisplay from './Sidebar.components/Street';

import './Sidebar.scss';

export const Sidebar = () => {
  const [currentStreet] = useCurrentStreet();
  const [currentBuilding] = useCurrentBuilding();
  const [currentMetro] = useCurrentMetro();
  const [currentStop] = useCurrentBusStop();

  return (
    <div className="Sidebar">
      <MapLayersManager />
      <br />
      <hr />
      <br />
      <h2>Информация</h2>
      <div className="Sidebar-Cards">
        <StreetDataDisplay data={currentStreet as StreetData | null} />
        <StopDataDisplay data={currentStop as StopData | null} />
        <MetroExitDataDisplay data={currentMetro as MetroExitData | null} />
        <BuildingDataDisplay data={currentBuilding as BuildingData | null} />
      </div>
    </div>
  );
};
