import { Select } from '../../../components/Select/Select';

const layers = ['Станции метро', 'Автобусные остановки', 'Здания', 'Улицы'];

export const MapLayersManager = () => {
  return (
    <div>
      <h2>Управление отображением</h2>
      <div>
        <h3>Выбрать очередь</h3>
        <Select
          onSelect={(value, label) => console.log(value, label)}
          options={[
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
            { label: '4', value: '4' },
            { label: '5', value: '5' },
          ]}
        />
      </div>
      <br />
      <div>
        <h3>Слои</h3>
        {/* checkboxes */}
        {layers.map((layer) => (
          // тут надо хуйнуть работу со стейтом. при выборе какого то чекбокса мы делаем в стейте слой = значению чекбокса, а на карте включаем/выключаем отображение слоя
          <div className="Input_checkbox" key={layer}>
            <input
              type="checkbox"
              id={layer}
              onChange={(e) => console.log(e.target.checked)}
            />
            <label htmlFor={layer}>{layer}</label>
          </div>
        ))}
      </div>
    </div>
  );
};
