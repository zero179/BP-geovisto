import { Map } from "leaflet";
import { DrawnObject, LayerType } from "../../model/types";
import IDrawingLayerTool, {
  ActiveTool,
  DrawingForm,
} from "../../model/types/tool/IDrawingLayerTool";

export interface TAbstractTool {
  drawingTool: IDrawingLayerTool;
  sidebar: DrawingForm;
  leafletMap?: Map;
  activetool: ActiveTool | null;
  _isActive: boolean;
  getName(): string;
  getIconName(): string;
  getTitle(): string;
  result(): LayerType | "";
  canBeCanceled(): boolean;
  _redrawSidebar(type?: LayerType | ""): void;
  setCurrentToolAsEnabled(): void;
  activate(): void;
  deactivate(): void;
  enable(): void;
  disable(): void;
  getSelectedLayer(): DrawnObject | null;
  isToolActive(): boolean;
}

export type ToolProps = {
  drawingTool: IDrawingLayerTool;
};
