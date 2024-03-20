import React from "react";
import { Marker } from "react-leaflet";
import { CustomVenueIcon } from "./VenueLocations";
import MarkerPopup from "./MarkerPopup";

const VenueMarkers = (props) => {
  const { venues } = props;

  const markers = venues.map((venue, i) => (
    <Marker key={i} position={venue.geometry} icon={CustomVenueIcon}>
      <MarkerPopup data={venue} />
    </Marker>
  ));

  return <>{markers}</>;
};

export default VenueMarkers;

