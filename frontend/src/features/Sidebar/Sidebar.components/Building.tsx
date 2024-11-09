import { InfoDivided } from '../../../components/InfoDivided';
import { BuildingData } from '../../../models/BuildingData';

type BuildingDataProps = {
  data: BuildingData | null;
};

const labels: Record<keyof BuildingData, string> = {
  Type: 'Тип здания',
  Purpose: 'Назначение здания',
  Elevation: 'Количество этажей',
  Entrances: 'Количество подъездов',
  Apartments: 'Количество квартир',
  District: 'Район',
  Street: 'Название улицы',
  Number: 'Номер дома',
};

const BuildingDataDisplay: React.FC<BuildingDataProps> = ({ data }) => {
  if (!data) return null;
  return (
    <div className="Card">
      <h3>Информация о здании</h3>
      <ul>
        {Object.keys(data).map((key: string) => {
          return (
            Boolean(data[key as keyof BuildingData]) && (
              <li className="ListItem" key={key}>
                <InfoDivided
                  label={labels[key as keyof BuildingData]}
                  value={data[key as keyof BuildingData]}
                />
              </li>
            )
          );
        })}
      </ul>
    </div>
  );
};

export default BuildingDataDisplay;
