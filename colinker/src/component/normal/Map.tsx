import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',  
};

const defaultCenter = { lat: 48.8566, lng: 2.3522 };

const Map = ({ position }) => {
  useEffect(() => {
    if (position) {
      console.log("Position:", position);
    }
  });

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

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
      center={ position}
      zoom={20}
    >
      {position && <Marker position={position} />}
    </GoogleMap>
  );
};

export default Map;
