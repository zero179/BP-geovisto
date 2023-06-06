import { DrawnObject } from "../../model/types";
import { TAbstractTool } from "../AbstractTool/types";

export interface TGeometricSliceTool extends TAbstractTool {
  polySlice(layer: DrawnObject): void;
}
