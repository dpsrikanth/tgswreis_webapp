import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import marker1x from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker1x,
  shadowUrl: markerShadow,
});

// 🔥 normalize helper
const normalizeDistrict = (name = "") =>
  name
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\s+/g, " ");

export default function TelanganaSchoolMap() {
  const [districts, setDistricts] = useState(null);
  const [schools, setSchools] = useState(null);

  const geoJsonRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    fetch("/maps/telangana_districts_33.geojson")
      .then((r) => r.json())
      .then(setDistricts);

    fetch("/maps/telangana_schools_points.geojson")
      .then((r) => r.json())
      .then(setSchools);
  }, []);

  // ✅ Assign sample colors for 33 districts
  const districtColorMap = useMemo(() => {
    // 33 nice distinct-ish colors
    const colors = [
      "#f94144", "#f3722c", "#f8961e", "#f9844a", "#f9c74f",
      "#90be6d", "#43aa8b", "#4d908e", "#577590", "#277da1",
      "#9b5de5", "#f15bb5", "#fee440", "#00bbf9", "#00f5d4",
      "#8ecae6", "#219ebc", "#023047", "#ffb703", "#fb8500",
      "#ff6d00", "#ff006e", "#8338ec", "#3a86ff", "#06d6a0",
      "#118ab2", "#073b4c", "#ef476f", "#ffd166", "#8d99ae",
      "#2b2d42", "#d90429", "#6a4c93"
    ];

    if (!districts?.features) return {};

    const map = {};
    districts.features.forEach((f, i) => {
      const dName = f?.properties?.DISTRICT_N || "";
      map[normalizeDistrict(dName)] = colors[i % colors.length];
    });

    return map;
  }, [districts]);

  // ✅ Style districts with color
  const districtStyle = (feature) => {
    const dName = feature?.properties?.DISTRICT_N || "";
    const key = normalizeDistrict(dName);

    return {
      weight: 1.2,
      color: "#222",        // border line
      fillOpacity: 0.35,
      fillColor: districtColorMap[key] || "#cccccc",
    };
  };

  // ✅ Fit map to Telangana bounds once districts load
  useEffect(() => {
    if (!districts || !mapRef.current) return;

    const layer = L.geoJSON(districts);
    const bounds = layer.getBounds();

    // Fit Telangana
    mapRef.current.fitBounds(bounds, { padding: [20, 20] });

    // Lock user inside Telangana
    mapRef.current.setMaxBounds(bounds.pad(0.1));
  }, [districts]);

  return (
    <div style={{ height: "85vh", width: "100%" }}>
      <MapContainer
        center={[17.9, 79.1]}
        zoom={7}
        minZoom={7}
        maxZoom={13}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(map) => (mapRef.current = map)}
      >
        {/* OSM tiles */}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* District boundaries */}
        {districts && (
          <GeoJSON
            ref={geoJsonRef}
            data={districts}
            style={districtStyle}
          />
        )}

        {/* School markers */}
        {schools?.features?.map((f) => (
          <Marker
            key={f.properties.SchoolCode}
            position={[
              f.geometry.coordinates[1],
              f.geometry.coordinates[0],
            ]}
          >
            <Popup>
              <div>
                <b>{f.properties.SchoolName}</b>
                <br />
                <small>Code: {f.properties.SchoolCode}</small>
                <br />
                <small>District: {f.properties.DistrictName}</small>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
