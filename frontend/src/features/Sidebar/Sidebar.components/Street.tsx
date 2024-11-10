import React from 'react';
import { StreetData } from '../../../models/StreetData';
import { InfoDivided } from '../../../components/InfoDivided';

type StreetDataProps = {
  data: StreetData | null;
};

const labels: Record<keyof StreetData, string> = {
  ST_NAME: 'Улица',
  ST_TYP_BEF: 'Тип улицы',
  ST_NM_BASE: 'Название без типа',
  ROAD_CATEG: 'Класс улицы',
  RoadDirect: 'Направление движения',
  RbndStght: 'Полос в прямом направлении',
  RbndBck: 'Полос в обратном направлении',
  Width: 'Ширина полотна',
  MaxSpdDrct: 'Максимальная скорость',
  AvgSpdDrct: 'Средняя скорость',
  MaxSpdRvrs: 'Максимальная скорость в обратном движении',
  AvgSpdRvrs: 'Средняя скорость в обратном движении',
  Foot: 'Количество пешеходных пересечений',
  Car: 'Количество автомобильных перекрестков',
};

const getPrepareValue = (label: string, value: string | number | null) => {
  switch (label) {
    case 'RoadDirect':
      return getRoadDirect(String(value));
    case 'Width':
      return `${value} м`;
    case 'MaxSpdDrct':
    case 'AvgSpdDrct':
    case 'MaxSpdRvrs':
    case 'AvgSpdRvrs':
      return `${value} км/ч`;
    default:
      return value;
  }
};

const StreetDataDisplay: React.FC<StreetDataProps> = ({ data }) => {
  if (!data) return null;
  const preparedData = Object.keys(data)
    .map((key: string) => {
      return (
        Boolean(data[key as keyof StreetData]) && {
          label: labels[key as keyof StreetData],
          value: getPrepareValue(key, data[key as keyof StreetData]),
        }
      );
    })
    .filter(Boolean) as { label: string; value: string | number }[];
  return (
    <div className="Card">
      <h3>Информация об улице</h3>
      <ul>
        {preparedData.map(({ label, value }) => (
          <li key={label}>
            <InfoDivided label={label} value={value} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StreetDataDisplay;

const getRoadDirect = (direct: string) => {
  switch (direct) {
    case '0':
      return 'Перекрыто';
    case 'F':
      return 'Только прямо';
    case 'T':
      return 'Только обратно';
    default:
      return 'Двустороннее';
  }
};
