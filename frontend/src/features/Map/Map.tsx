import {
  YMapComponentsProvider,
  YMap,
  YMapDefaultSchemeLayer,
  YMapDefaultFeaturesLayer,
  YMapControls,
  YMapZoomControl,
  // YMapFeature,
} from 'ymap3-components';

import customization from './Map.utils/customization.json';
import { VectorCustomization } from '@yandex/ymaps3-types';
// import { useEffect, useState } from 'react';

export interface MapProps {
  children: React.ReactNode;
}

export const Map = ({ children }: MapProps) => {
  // const [geo, setGeo] = useState(null);
  // // shapefile.open("/data/Дома_исходные.shp")
  // useEffect(() => {
  //   fetch('/data/Дома_исходные.geojson')
  //     .then((r) => r.json())
  //     .then((d) => setGeo(d));
  // }, []);
  return (
    <MapContainer>
      <YMapDefaultSchemeLayer
        customization={customization as VectorCustomization}
      />
      <YMapDefaultFeaturesLayer />
      {/* {geo &&
        geo.features?.map((feature, i) => {
          if (i % 1000 === 0) console.log(i);
          return (
            <YMapFeature
              key={i}
              geometry={feature.geometry}
              properties={feature.properties}
            />
          );
        })} */}

      {children}
      <YMapControls position="right">
        <YMapZoomControl />
      </YMapControls>
    </MapContainer>
  );
};

const MapContainer = ({ children }: MapProps) => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <YMapComponentsProvider
        key="map-provider"
        apiKey="ba153082-46a7-49b3-b3e7-6055444d73ee">
        <YMap location={{ center: [37.64, 55.76], zoom: 12 }}>{children}</YMap>
      </YMapComponentsProvider>
    </div>
  );
};
