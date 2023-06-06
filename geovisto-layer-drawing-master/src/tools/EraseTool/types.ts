import { LeafletEvent } from "leaflet";
import { TPaintTool } from "../PaintTool/types";

export interface TEraseTool extends TPaintTool {
  erase(event: LeafletEvent): void;
}
