export type StreetData = {
  ST_NAME: string;
  ST_TYP_BEF: string;
  ST_NM_BASE: string;
  ROAD_CATEG: number;
  RoadDirect: number | string;
  RbndStght: number | null;
  RbndBck: number | null;
  Width: number;
  MaxSpdDrct: number;
  AvgSpdDrct: number;
  MaxSpdRvrs: number;
  AvgSpdRvrs: number;
  Foot: number;
  Car: number;
};