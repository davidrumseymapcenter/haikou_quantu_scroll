import "maplibre-gl/dist/maplibre-gl.css";
import { Map, AttributionControl } from "maplibre-gl";

const map = new Map({
  container: "map",
  style: {
    version: 8,
    sources: {
      satellite: {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        maxzoom: 19,
        attribution:
          "Tiles &copy; Esri &mdash; Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
      },
    },
    layers: [{ id: "satellite", type: "raster", source: "satellite" }],
  },
  center: [0, 20],
  zoom: 2,
  attributionControl: false,
  preserveDrawingBuffer: true,
});

map.addControl(new AttributionControl({ compact: true }));

document.getElementById("opacity-slider").addEventListener("input", (e) => {
  map.setPaintProperty("historical", "raster-opacity", Number(e.target.value));
});

map.on("load", () => {
  map.setProjection({ type: "globe" });

  map.addSource("historical", {
    type: "raster",
    tiles: [
      "https://allmaps.xyz/maps/8d5fd8848ed41d9d/{z}/{x}/{y}.png",
    ],
    tileSize: 256,
    attribution: "David Rumsey Map Collection, Allmaps",
  });

  map.addLayer({
    id: "historical",
    type: "raster",
    source: "historical",
  });

  map.flyTo({ center: [109, 28], zoom: 4, duration: 3000 });
});
