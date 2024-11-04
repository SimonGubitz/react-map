import React, { useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMapEvent, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Point, LatLngTuple, Icon } from "leaflet";
import { MapPinX } from "lucide-react";

const icon = new Icon({
  iconUrl: require("../assets/icon-map-marker256x256.png"),
  iconAnchor: [22.5, 40],
  iconSize: new Point(45, 45),
});

interface MapComponentProps {
  distance: number,
  confirmEnd: boolean,
  clickPosition: { lat: number; lng: number },
  customMarkers: { lat: number; lng: number }[];
  customDistanceMarkers: { lat: number; lng: number }[];
  // customLines: [{ lat1: number; lng1: number }, { lat2: number; lng2: number }][];
  customLines: [[number, number], [number, number]][];
  setConfirmEnd: (confirmEnd: boolean) => void;
  setCustomMarkers: (position: { lat: number; lng: number }) => void;
  setClickPosition: (position: { lat: number; lng: number }) => void;
  setHoverPosition: (position: { lat: number; lng: number }) => void;
  setDistance: (distance: number) => void;
  setFinalDistance: (finalDistance: number) => void;
}

const MapEvent: React.FC<{
  confirmEnd: boolean,
  distance: number,
  clickPosition: { lat: number; lng: number },
  setConfirmEnd: (confirmEnd: boolean) => void;
  setClickPosition: (position: { lat: number; lng: number }) => void,
  setHoverPosition: (position: { lat: number; lng: number }) => void,
  setDistance: (distance: number) => void,
  setFinalDistance: (distance: number) => void,
}> = ({ confirmEnd, distance, clickPosition, setClickPosition, setHoverPosition, setDistance, setFinalDistance, setConfirmEnd }) => {
  const map = useMap();

  useMapEvent("click", (e) => {
    if (confirmEnd) {
      setClickPosition(e.latlng);
    }
    if (distance > 0 && !confirmEnd) {
      setFinalDistance(map.distance(clickPosition, e.latlng));
      setConfirmEnd(true); // Lock the start point after setting the final distance
    }
  });
  useMapEvent("contextmenu", (e) => {
    e.originalEvent.preventDefault();
    setClickPosition(e.latlng);
  });


  useMapEvent("mouseover", (e) => {
    setHoverPosition(e.latlng);
    if (clickPosition !== null && !confirmEnd) {
      const measuredDistance = map.distance(clickPosition, e.latlng);
      setDistance(measuredDistance);
    }
  });
  useMapEvent("mousemove", (e) => {
    setHoverPosition(e.latlng);
    if (clickPosition !== null) {
      const measuredDistance = map.distance(clickPosition, e.latlng);
      setDistance(measuredDistance);
    }
  });

  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ distance, clickPosition, customMarkers, customDistanceMarkers, customLines, confirmEnd, setConfirmEnd, setClickPosition, setHoverPosition, setCustomMarkers, setDistance, setFinalDistance }) => {
  const center: LatLngTuple = [52.2799, 8.0470]; // Center coordinates: Osnabrück, Niedersachsen

  const [seeDefaultMarker, setSeeDefaultMarker] = useState(true);


  return (
    <MapContainer center={center} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {seeDefaultMarker && <Marker key={1234} position={center} icon={icon}>
        <Popup>
          <div className="flex flex-col justify-center w-max">
            <div className="flex flex-row align-center">
              Default Location: <span style={{ color: "blue" }}>Osnabrück</span>
            </div>
            <button onClick={() => { setSeeDefaultMarker(false) }} className="flex justify-center bg-stone-900 text-white p-2 rounded">
              <MapPinX size={14} /> Remove Marker
            </button>
          </div>
        </Popup>
      </Marker>}

      {customMarkers.length > 0 && customMarkers.map((position, index) => (
        <Marker key={index} position={[position.lat, position.lng]} icon={icon}>
          <Popup>
            Marker at {[position.lat, position.lng].toString()}
          </Popup>
        </Marker>
      ))}

      {customDistanceMarkers.length > 0 && customDistanceMarkers.map((position, index) => (
        <Marker key={index} position={[position.lat, position.lng]} icon={icon}>
          <Popup>
            Marker at {[position.lat, position.lng].toString()}
          </Popup>
        </Marker>
      ))}

      {customLines.length > 0 &&
        <Polyline positions={customLines[0]} color="black"/>
      }


      <MapEvent distance={distance} clickPosition={clickPosition} setClickPosition={setClickPosition} setHoverPosition={setHoverPosition} setDistance={setDistance} setFinalDistance={setFinalDistance} setConfirmEnd={setConfirmEnd} confirmEnd={confirmEnd} />
    </MapContainer>
  );
};

export default MapComponent;
