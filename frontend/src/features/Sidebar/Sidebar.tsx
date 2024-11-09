import BuildingDataDisplay from './Sidebar.components/Building';
import MetroExitDataDisplay from './Sidebar.components/Metro';
import StopDataDisplay from './Sidebar.components/Stop';
import StreetDataDisplay from './Sidebar.components/Street';
import './Sidebar.scss';
export const Sidebar = () => {
  return (
    <div className="Sidebar">
      <StreetDataDisplay
        data={{
          ST_NAME: '',
          ST_TYP_BEF: '',
          ST_NM_BASE: '',
          ROAD_CATEG: 0,
          RoadDirect: '',
          RbndStght: null,
          RbndBck: null,
          Width: 0,
          MaxSpdDrct: 0,
          AvgSpdDrct: 0,
          MaxSpdRvrs: 0,
          AvgSpdRvrs: 0,
          Foot: 0,
          Car: 0,
        }}
      />{' '}
      <br />
      <hr />
      <br />
      <StopDataDisplay
        data={{
          TrType: '',
          Name: '',
          TrStopId: 0,
        }}
      />
      <br />
      <hr />
      <br />
      <MetroExitDataDisplay
        data={{
          Number: '',
          Text: '',
        }}
      />
      <br />
      <hr />
      <br />
      <BuildingDataDisplay
        data={{
          Type: '',
          Purpose: '',
          Elevation: 0,
          Entrances: 0,
          Apartments: 0,
          District: '',
          Street: '',
          Number: '',
        }}
      />
    </div>
  );
};
