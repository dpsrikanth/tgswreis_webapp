import React, { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { useSelector } from "react-redux";
import { _fetch } from "../libs/utils";

// 🔥 Normalize helper
const normalizeDistrict = (name = "") =>
  name
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/district/g, "")
    .replace(/\s+/g, " ");

export default function TelanganaInspectionHeatMap() {
  const svgRef = useRef(null);
  const wrapperRef = useRef(null);

  const token = useSelector((s) => s.userappdetails.TOKEN);

  const [districts, setDistricts] = useState(null);
  const [schools, setSchools] = useState(null);

  const [todayInspections, setTodayInspections] = useState([]);
  const [hoverInfo, setHoverInfo] = useState(null);

  // 1) Load map geojson
  useEffect(() => {
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

  // 2) Fetch todays inspections
  useEffect(() => {
    const fetchToday = async () => {
      try{
      
              _fetch('tourinspectionheatmap',null,false,token).then(res => {
                  if(res.status === 'success'){
                      setTodayInspections(res.data || []);
                  }else {
                      console.error(res.message);
                  }
              })
      
          }catch(error){
              console.error('Error fetching Todays Schedule',error)
          }
    };

    if (token) fetchToday();
  }, [token]);

  // 3) Build district => inspection count map
 const inspectionCountByDistrict = useMemo(() => {
  const map = {};

  for (const row of todayInspections) {
    const district = row?.DistrictName || "";
    const key = normalizeDistrict(district);

    if (!key) continue;

    const count = Number(row?.InspectionCount || 0);

    map[key] = (map[key] || 0) + count;
  }

  return map;
}, [todayInspections]);

  // 4) Build heat scale based on max count
  const heatScale = useMemo(() => {
    const values = Object.values(inspectionCountByDistrict);
    const max = values.length ? Math.max(...values) : 0;

    // Light -> Dark (you can change colors)
    return d3
      .scaleLinear()
      .domain([0, max || 1])
      .range(["#f1f5f9", "#ef4444"]); // gray -> red
  }, [inspectionCountByDistrict]);

  // 5) Draw map
  useEffect(() => {
    if (!districts || !svgRef.current || !wrapperRef.current) return;

    const width = wrapperRef.current.clientWidth;
    const height = 650;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.attr("width", width).attr("height", height);

    const g = svg.append("g");

    const projection = d3.geoMercator().fitSize([width, height], districts);
    const path = d3.geoPath(projection);

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
      .attr("stroke", "#111")
      .attr("stroke-width", 0.7)
      .attr("fill", (d) => {
        const dName = d?.properties?.DISTRICT_N || "Unknown";
        const key = normalizeDistrict(dName);
        const count = inspectionCountByDistrict[key] || 0;
        return heatScale(count);
      })
      .attr("fill-opacity", 0.85)
      .on("mousemove", (event, d) => {
        const dName = d?.properties?.DISTRICT_N || "Unknown";
        const key = normalizeDistrict(dName);
        const count = inspectionCountByDistrict[key] || 0;

        setHoverInfo({
          x: event.clientX,
          y: event.clientY,
          name: `${dName} — ${count} inspections`,
        });
      })
      .on("mouseleave", () => setHoverInfo(null));

    // district labels
    g.selectAll("text")
      .data(districts.features)
      .enter()
      .append("text")
      .text((d) => d?.properties?.DISTRICT_N || "")
      .attr("x", (d) => path.centroid(d)[0])
      .attr("y", (d) => path.centroid(d)[1])
      .attr("text-anchor", "middle")
      .attr("font-size", "9px")
      .attr("font-weight", "700")
      .attr("fill", "#111")
      .attr("pointer-events", "none");

    // OPTIONAL: plot schools dots
    if (schools?.features?.length) {
      g.selectAll("circle")
        .data(schools.features)
        .enter()
        .append("circle")
        .attr("cx", (d) => projection(d.geometry.coordinates)[0])
        .attr("cy", (d) => projection(d.geometry.coordinates)[1])
        .attr("r", 2.2)
        .attr("fill", "#000")
        .attr("opacity", 0.5)
        .on("mousemove", (event, d) => {
          setHoverInfo({
            x: event.clientX,
            y: event.clientY,
            name: `${d.properties.SchoolName} (${d.properties.SchoolCode})`,
          });
        })
        .on("mouseleave", () => setHoverInfo(null));
    }
  }, [districts, schools, inspectionCountByDistrict, heatScale]);

  return (
    <div ref={wrapperRef} style={{ width: "100%", position: "relative" }}>
      <h5 style={{ marginBottom: 10, fontWeight: 700 }}>
        Today Inspection Heatmap
      </h5>

      <svg ref={svgRef} style={{ width: "100%", borderRadius: "12px" }} />

      {/* Tooltip */}
      {hoverInfo && (
        <div
          style={{
            position: "fixed",
            top: hoverInfo.y + 12,
            left: hoverInfo.x + 12,
            background: "rgba(0,0,0,0.85)",
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
