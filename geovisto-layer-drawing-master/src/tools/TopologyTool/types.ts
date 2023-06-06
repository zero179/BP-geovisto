import { LatLng, Marker, Polyline } from "leaflet";
//import { DragEvent } from "react";
import { DrawnObject, LooseObject, Optional } from "../../model/types";
import { TMarkerTool } from "../MarkerTool/types";

export interface TTopologyTool extends TMarkerTool {
  isConnectMarker(layer: DrawnObject): boolean;
  plotTopology(
    chosen: Optional<DrawnObject[]>,
    createdMarker: Optional<DrawnObject>
  ): void;
}

export type CustomMarker = Marker & {
  _leaflet_id: string;
};

export type LeafletDrag = /*DragEvent*/ any & {
  latlng: LatLng;
  oldLatLng: LatLng;
  target: LooseObject & { _leaflet_id: string };
};
