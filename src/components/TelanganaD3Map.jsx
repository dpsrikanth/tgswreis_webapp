import React, { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";

// 🔥 Normalize helper
const normalizeDistrict = (name = "") =>
  name
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/district/g, "")
    .replace(/\s+/g, " ");

export default function TelanganaD3Map() {
  const svgRef = useRef(null);
  const wrapperRef = useRef(null);

  const [districts, setDistricts] = useState(null);
  const [schools, setSchools] = useState(null);

  const [hoverInfo, setHoverInfo] = useState(null); // tooltip state

  useEffect(() => {
    // put both files inside: public/maps/
    Promise.all([
      fetch("/maps/telangana_districts_33.geojson").then((r) => r.json()),
      fetch("/maps/telangana_schools_points.geojson").then((r) => r.json()),
    ])
      .then(([districtsData, schoolsData]) => {
        setDistricts(districtsData);
        setSchools(schoolsData);
      })
      .catch((err) => console.error("Map load error:", err));
  }, []);

  // 🎨 District colors (33)
  const districtColorMap = useMemo(() => {
    if (!districts?.features) return {};

    const colors = [
      "#f94144", "#f3722c", "#f8961e", "#f9844a", "#f9c74f",
      "#90be6d", "#43aa8b", "#4d908e", "#577590", "#277da1",
      "#9b5de5", "#f15bb5", "#fee440", "#00bbf9", "#00f5d4",
      "#8ecae6", "#219ebc", "#023047", "#ffb703", "#fb8500",
      "#ff6d00", "#ff006e", "#8338ec", "#3a86ff", "#06d6a0",
      "#118ab2", "#073b4c", "#ef476f", "#ffd166", "#8d99ae",
      "#2b2d42", "#d90429", "#6a4c93",
    ];

    const map = {};
    districts.features.forEach((f, i) => {
      // IMPORTANT: this property name depends on your geojson
      const dName =
        f?.properties?.DISTRICT_N ||
        f?.properties?.district ||
        f?.properties?.District ||
        f?.properties?.NAME ||
        "Unknown";

      map[normalizeDistrict(dName)] = colors[i % colors.length];
    });

    return map;
  }, [districts]);

  useEffect(() => {
    if (!districts || !svgRef.current || !wrapperRef.current) return;

    const width = wrapperRef.current.clientWidth;
    const height = 650;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // clear redraw

    svg.attr("width", width).attr("height", height);

    // main group for zoom
    const g = svg.append("g");

    // projection
    const projection = d3.geoMercator().fitSize([width, height], districts);
    const path = d3.geoPath(projection);

    // zoom
    const zoom = d3
      .zoom()
      .scaleExtent([1, 8])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // draw districts
    g.selectAll("path")
      .data(districts.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("stroke", "#222")
      .attr("stroke-width", 0.8)
      .attr("fill", (d) => {
        const dName =
          d?.properties?.DISTRICT_N ||
          d?.properties?.district ||
          d?.properties?.District ||
          d?.properties?.NAME ||
          "Unknown";

        return districtColorMap[normalizeDistrict(dName)] || "#d9d9d9";
      })
      .attr("fill-opacity", 0.65)
      .on("mousemove", (event, d) => {
        const dName =
          d?.properties?.DISTRICT_N ||
          d?.properties?.district ||
          d?.properties?.District ||
          d?.properties?.NAME ||
          "Unknown";

        setHoverInfo({
          x: event.clientX,
          y: event.clientY,
          name: dName,
        });
      })
      .on("mouseleave", () => setHoverInfo(null));

    // district labels
    g.selectAll("text")
      .data(districts.features)
      .enter()
      .append("text")
      .text((d) => {
        const dName =
          d?.properties?.DISTRICT_N ||
          d?.properties?.district ||
          d?.properties?.District ||
          d?.properties?.NAME ||
          "";
        return dName;
      })
      .attr("x", (d) => path.centroid(d)[0])
      .attr("y", (d) => path.centroid(d)[1])
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("font-weight", "600")
      .attr("fill", "#111")
      .attr("pointer-events", "none");

    // plot schools
    if (schools?.features?.length) {
      g.selectAll("circle")
        .data(schools.features)
        .enter()
        .append("circle")
        .attr("cx", (d) => projection(d.geometry.coordinates)[0])
        .attr("cy", (d) => projection(d.geometry.coordinates)[1])
        .attr("r", 2.5)
        .attr("fill", "#000")
        .attr("opacity", 0.85)
        .on("mousemove", (event, d) => {
          setHoverInfo({
            x: event.clientX,
            y: event.clientY,
            name: `${d.properties.SchoolName} (${d.properties.SchoolCode})`,
          });
        })
        .on("mouseleave", () => setHoverInfo(null));
    }
  }, [districts, schools, districtColorMap]);

  return (
    <div ref={wrapperRef} style={{ width: "100%", position: "relative" }}>
      <svg ref={svgRef} style={{ width: "100%", borderRadius: "12px" }} />

      {/* Tooltip */}
      {hoverInfo && (
        <div
          style={{
            position: "fixed",
            top: hoverInfo.y + 12,
            left: hoverInfo.x + 12,
            background: "rgba(0,0,0,0.8)",
            color: "white",
            padding: "6px 10px",
            borderRadius: "8px",
            fontSize: "12px",
            zIndex: 9999,
            pointerEvents: "none",
            maxWidth: "260px",
          }}
        >
          {hoverInfo.name}
        </div>
      )}
    </div>
  );
}
