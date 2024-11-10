import { InfoDivided } from '../../../components/InfoDivided';
import { StopData } from '../../../models/StopData';

type StopDataProps = {
  data: StopData | null;
};

const labels: Record<keyof StopData, string> = {
  TrType: 'Тип',
  Name: 'Название',
  TrStopId: 'Номер',
};

const StopDataDisplay: React.FC<StopDataProps> = ({ data }) => {
  if (!data) return null;
  return (
    <div className="Card">
      <h3>Информация об остановке</h3>
      <ul>
        {Object.keys(data).map((key: string) => {
          return (
            Boolean(data[key as keyof StopData]) && (
              <li className="ListItem" key={key}>
                <InfoDivided
                  label={labels[key as keyof StopData]}
                  value={data[key as keyof StopData]}
                />
              </li>
            )
          );
        })}
      </ul>
    </div>
  );
};

export default StopDataDisplay;
