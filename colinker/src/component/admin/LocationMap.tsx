import React from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '200px',
  height: '150px'
};

const LocationMap = ({ location }) => {
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
      center={location}
      zoom={14}
    >
      <Marker position={location} />
    </GoogleMap>
  );
};

export default LocationMap;
