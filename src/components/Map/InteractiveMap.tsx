import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';

// Fix Leaflet's default icon issue with Webpack/Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Mock data for locations
const mockLocations = [
  { id: 1, lat: -23.5505, lng: -46.6333, name: 'Hub São Paulo', status: 'Active', details: 'Main distribution center' },
  { id: 2, lat: -22.9068, lng: -43.1729, name: 'Shipment 1001', status: 'In Transit', details: 'Delivery to Rio de Janeiro' },
  { id: 3, lat: -15.7801, lng: -47.9292, name: 'Shipment 1002', status: 'Delayed', details: 'Waiting for customs clearance' },
  { id: 4, lat: -30.0346, lng: -51.2177, name: 'Hub Porto Alegre', status: 'Maintenance', details: 'Secondary hub' },
];

const InteractiveMap: React.FC = () => {
  const { t } = useTranslation();
  const center: [number, number] = [-23.5505, -46.6333]; // São Paulo coordinates

  return (
    <MapContainer
      center={center}
      zoom={5}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {mockLocations.map((location) => (
        <Marker key={location.id} position={[location.lat, location.lng]}>
          <Popup>
            <div className="font-semibold">{location.name}</div>
            <div className="text-sm">
              {t('status')}: {t(location.status.toLowerCase().replace(' ', '_'))}
            </div>
            <div className="text-xs text-gray-500 mt-1">{location.details}</div>
            <div className="text-xs text-gray-500">
              Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default InteractiveMap;
