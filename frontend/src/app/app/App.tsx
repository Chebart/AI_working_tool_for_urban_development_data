import { MapView } from '../../features/LeafletMap/Map';
import { Sidebar } from '../../features/Sidebar/Sidebar';
import './app.scss';
export function App() {
  return (
    <div className="App">
      <Sidebar />
      <MapView />
    </div>
  );
}
