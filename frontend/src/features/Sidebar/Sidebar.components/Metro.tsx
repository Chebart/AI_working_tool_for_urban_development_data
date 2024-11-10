import { InfoDivided } from '../../../components/InfoDivided';
import { MetroExitData } from '../../../models/MetroExitData';

type MetroExitDataProps = {
  data: MetroExitData | null;
};

const labels: Record<keyof MetroExitData, string> = {
  Number: 'Номер выхода',
  Text: 'Название станции',
};

const MetroExitDataDisplay: React.FC<MetroExitDataProps> = ({ data }) => {
  if (!data) return null;
  return (
    <div className="Card">
      <h3>Информация о выходе метро</h3>
      <ul>
        {Object.keys(data).map((key: string) => {
          return (
            Boolean(data[key as keyof MetroExitData]) && (
              <li className="ListItem" key={key}>
                <InfoDivided
                  label={labels[key as keyof MetroExitData]}
                  value={data[key as keyof MetroExitData]}
                />
              </li>
            )
          );
        })}
      </ul>
    </div>
  );
};

export default MetroExitDataDisplay;
