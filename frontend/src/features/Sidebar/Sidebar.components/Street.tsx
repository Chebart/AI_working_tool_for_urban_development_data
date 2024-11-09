import React from 'react';

type StreetData = {
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

type StreetDataProps = {
  data: StreetData;
};

const StreetDataDisplay: React.FC<StreetDataProps> = ({ data }) => {
  return (
    <div>
      <h2>Информация об улице</h2>
      <ul>
        <li>
          <strong>Название улицы:</strong> {data.ST_NAME}
        </li>
        <li>
          <strong>Тип улицы:</strong> {data.ST_TYP_BEF}
        </li>
        <li>
          <strong>Название без типа:</strong> {data.ST_NM_BASE}
        </li>
        <li>
          <strong>Класс улицы:</strong> {data.ROAD_CATEG}
        </li>
        <li>
          <strong>Направление движения:</strong> {data.RoadDirect}
        </li>
        <li>
          <strong>Полос в прямом направлении:</strong>{' '}
          {data.RbndStght ?? 'NULL'}
        </li>
        <li>
          <strong>Полос в обратном направлении:</strong>{' '}
          {data.RbndBck ?? 'NULL'}
        </li>
        <li>
          <strong>Ширина полотна (м):</strong> {data.Width}
        </li>
        <li>
          <strong>Макс. скорость (прямо):</strong> {data.MaxSpdDrct}
        </li>
        <li>
          <strong>Сред. скорость (прямо):</strong> {data.AvgSpdDrct}
        </li>
        <li>
          <strong>Макс. скорость (обратно):</strong> {data.MaxSpdRvrs}
        </li>
        <li>
          <strong>Сред. скорость (обратно):</strong> {data.AvgSpdRvrs}
        </li>
        <li>
          <strong>Возможность передвижения пешком:</strong>{' '}
          {data.Foot === 1 ? 'Да' : 'Нет'}
        </li>
        <li>
          <strong>Возможность передвижения на машине:</strong>{' '}
          {data.Car === 1 ? 'Да' : 'Нет'}
        </li>
      </ul>
    </div>
  );
};

export default StreetDataDisplay;
