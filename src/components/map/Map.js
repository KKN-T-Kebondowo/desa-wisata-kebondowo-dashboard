import { useMemo, useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import './map.css';

function GoogleMapComponent({ latitude, longitude, onMapClick }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>Loading...</div>;

  return <Map latitude={latitude} longitude={longitude} onMapClick={onMapClick} />;
}

function Map({ latitude, longitude, onMapClick }) {
  const center = useMemo(() => ({ lat: latitude, lng: longitude }), [latitude, longitude]);

  const handleMapClick = (event) => {
    const clickedLat = event.latLng.lat();
    const clickedLng = event.latLng.lng();
    const clickedPosition = { lat: clickedLat, lng: clickedLng };
    onMapClick(clickedPosition); // Call the onMapClick function with the clicked position
  };

  return (
    <GoogleMap zoom={15} center={center} mapContainerClassName="map-container" onClick={handleMapClick}>
      <Marker position={center} />
    </GoogleMap>
  );
}

export default GoogleMapComponent;
