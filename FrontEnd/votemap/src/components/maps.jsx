import { useRef, useState } from "react";
import { MapContainer, TileLayer, Rectangle } from "react-leaflet";
import Maptiler from "./osm-provider";
import "../../node_modules/leaflet/dist/leaflet.css";

export default function Maps({ lat, long }) {
  const [center, setCenter] = useState({
    lat: -8.58147617,
    lng: 116.10975173,
  });
  const ZOOM_LEVEL = 7.5;
  const mapRef = useRef();

  return (
    <div className="d-flex justify-content-center">
      <MapContainer
        center={center}
        zoom={ZOOM_LEVEL}
        ref={mapRef}
        style={{
          width: "600px",
          height: "400px",
        }}
      >
        <TileLayer
          url={Maptiler.maptiler.url}
          attribution={Maptiler.maptiler.attribution}
        />
      </MapContainer>
    </div>
  );
}
