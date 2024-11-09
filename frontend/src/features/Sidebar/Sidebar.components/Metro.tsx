type MetroExitData = {
  Number: string;
  Text: string;
};

type MetroExitDataProps = {
  data: MetroExitData;
};

const MetroExitDataDisplay: React.FC<MetroExitDataProps> = ({ data }) => {
  return (
    <div>
      <h2>Информация о выходе метро</h2>
      <ul>
        <li>
          <strong>Номер выхода:</strong> {data.Number}
        </li>
        <li>
          <strong>Название станции:</strong> {data.Text}
        </li>
      </ul>
    </div>
  );
};

export default MetroExitDataDisplay;
