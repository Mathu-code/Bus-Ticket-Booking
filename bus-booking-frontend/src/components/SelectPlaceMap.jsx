import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState } from 'react';

function ClickMarker({ onSelect }) {
  const [pos, setPos] = useState(null);
  useMapEvents({
    click(e) {
      setPos(e.latlng);
      onSelect && onSelect(e.latlng);
    }
  });
  return pos ? <Marker position={pos} /> : null;
}

export default function SelectPlaceMap({ onSelect }) {
  return (
    <MapContainer center={[7.8731, 80.7718]} zoom={7} style={{ height: "300px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ClickMarker onSelect={onSelect} />
    </MapContainer>
  );
}
