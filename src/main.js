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

map.addControl(new AttributionControl({ compact: true }));

map.on("load", () => {
  map.addLayer(warpedMapLayer);

  warpedMapLayer
    .addGeoreferenceAnnotationByUrl(
      "https://annotations.allmaps.org/images/ea20959651600e01"
    )
    .then(() => {
      const { center, zoom, bearing } = warpedMapLayer.getCenterZoomBearing();
      map.flyTo({ center, zoom: zoom - 1, bearing, duration: 2500 });
    })
    .catch((err) => console.error("Annotation load error:", err));
});
