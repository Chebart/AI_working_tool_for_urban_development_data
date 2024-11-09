type StopData = {
  TrType: string;
  Name: string;
  TrStopId: number;
};

type StopDataProps = {
  data: StopData;
};

const StopDataDisplay: React.FC<StopDataProps> = ({ data }) => {
  return (
    <div>
      <h2>Информация об остановке</h2>
      <ul>
        <li>
          <strong>Тип остановки:</strong> {data.TrType}
        </li>
        <li>
          <strong>Название остановки:</strong> {data.Name}
        </li>
        <li>
          <strong>Идентификатор остановки:</strong> {data.TrStopId}
        </li>
      </ul>
    </div>
  );
};

export default StopDataDisplay;
