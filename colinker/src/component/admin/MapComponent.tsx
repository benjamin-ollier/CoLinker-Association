import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = { lat: 48.8566, lng: 2.3522 };

const MapComponent = ({ onLocationSelect, position }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  const handleMapClick = (event) => {
    const newPos = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    onLocationSelect(newPos);
  };

  if (loadError) {
    console.error("Error loading Google Maps API:", loadError);
    return <div>Error: Google Maps API could not be loaded.</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={position || defaultCenter}
      zoom={10}
      onClick={handleMapClick}
    >
      {position && <Marker position={position} />}
    </GoogleMap>
  );
};

export default MapComponent;
