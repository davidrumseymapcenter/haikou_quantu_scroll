import "maplibre-gl/dist/maplibre-gl.css";
import { Map, AttributionControl } from "maplibre-gl";
import { WarpedMapLayer } from "@allmaps/maplibre";

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
  center: [110, 25],
  zoom: 2,
  attributionControl: false,
  preserveDrawingBuffer: true,
});

const warpedMapLayer = new WarpedMapLayer();

document.getElementById("opacity-slider").addEventListener("input", (e) => {
  warpedMapLayer.setOpacity(Number(e.target.value));
});

document.getElementById("gcp-toggle").addEventListener("change", (e) => {
  map.setLayoutProperty(
    "gcps",
    "visibility",
    e.target.checked ? "visible" : "none",
  );
});

map.addControl(new AttributionControl({ compact: true }));

const ANNOTATION_URL =
  "https://annotations.allmaps.org/images/ea20959651600e01";

map.on("load", () => {
  map.addLayer(warpedMapLayer);

  // Load warped map overlay
  warpedMapLayer
    .addGeoreferenceAnnotationByUrl(ANNOTATION_URL)
    .then(() => {
      const { center, zoom, bearing } = warpedMapLayer.getCenterZoomBearing();
      map.flyTo({ center, zoom: zoom - 1, bearing, duration: 2500 });
    })
    .catch((err) => console.error("Annotation load error:", err));

  // Load GCPs as a point layer from the same annotation
  fetch(ANNOTATION_URL)
    .then((res) => res.json())
    .then((annotation) => {
      const features = annotation.items.flatMap((item) => item.body.features);

      map.addSource("gcps", {
        type: "geojson",
        data: { type: "FeatureCollection", features },
      });

      map.addLayer({
        id: "gcps",
        type: "circle",
        source: "gcps",
        layout: { visibility: "none" },
        paint: {
          "circle-radius": 6,
          "circle-color": "#22cb8d",
          "circle-stroke-color": "#fff",
          "circle-stroke-width": 1.5,
        },
      });
    })
    .catch((err) => console.error("GCP load error:", err));
});
