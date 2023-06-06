import { CircleMarker, LatLng, LeafletMouseEvent } from "leaflet";
import { TAbstractTool } from "./../AbstractTool/types";

export interface TPaintTool extends TAbstractTool {
  _action: "draw" | "erase" | null;
  _circle: CircleMarker | null;
  _latlng: LatLng;
  _circleRadius: number;

  getMouseDown(): boolean;
  getBrushSize(): number;
  getBrushSizeConstraints(): {
    maxBrushSize: number;
    minBrushSize: number;
  };
  resizeBrush(val: number): void;
  stop(): void;
  _addMouseListener(): void;
  _removeMouseListener(): void;
  _onMouseDown(event: LeafletMouseEvent): void;
  _onMouseUp(): void;
  _onMouseMove(event: LeafletMouseEvent): void;
  _setLatLng(latlng: LatLng): void;
}
