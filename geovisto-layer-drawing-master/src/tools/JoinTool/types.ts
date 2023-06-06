import { DrawnObject } from "../../model/types";
import { TAbstractTool } from "../AbstractTool/types";

export interface TJoinTool extends TAbstractTool {
  deselectChosenLayers(): void;
  clearChosenLayers(): void;
  joinChosen(drawObject: DrawnObject): void;
}
