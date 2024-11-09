type BuildingData = {
  Type: string;
  Purpose: string;
  Elevation: number;
  Entrances: number;
  Apartments: number;
  District: string;
  Street: string;
  Number: string;
};

type BuildingDataProps = {
  data: BuildingData;
};

const BuildingDataDisplay: React.FC<BuildingDataProps> = ({ data }) => {
  return (
    <div>
      <h2>Информация о здании</h2>
      <ul>
        <li>
          <strong>Тип здания:</strong> {data.Type}
        </li>
        <li>
          <strong>Назначение здания:</strong> {data.Purpose}
        </li>
        <li>
          <strong>Количество этажей:</strong> {data.Elevation}
        </li>
        <li>
          <strong>Количество подъездов:</strong> {data.Entrances}
        </li>
        <li>
          <strong>Количество квартир:</strong> {data.Apartments}
        </li>
        <li>
          <strong>Район:</strong> {data.District}
        </li>
        <li>
          <strong>Название улицы:</strong> {data.Street}
        </li>
        <li>
          <strong>Номер дома:</strong> {data.Number}
        </li>
      </ul>
    </div>
  );
};

export default BuildingDataDisplay;
