import { TAbstractTool } from "./../../../tools/AbstractTool/types";
import { TSearchControl } from "./../../../sidebar/components/SearchControl/types";
import { TPolyControl } from "./../../../sidebar/components/PolyControl/types";
import { TMarkerControl } from "./../../../sidebar/components/MarkerControl/types";
import { TDataControl } from "./../../../sidebar/components/DataControl/types";
// Geovisto core
import { DrawnObject, LayerType, LooseObject } from "..";
import { ILayerTool, IMapForm, IMapToolInitProps } from "geovisto";

import { IDrawingLayerToolConfig } from "./IDrawingLayerToolConfig";
import IDrawingLayerToolDefaults from "./IDrawingLayerToolDefaults";
import IDrawingLayerToolProps from "./IDrawingLayerToolProps";
import IDrawingLayerToolState from "./IDrawingLayerToolState";
import { TBrushControl } from "../../../sidebar/components/BrushControl/types";
import * as L from "leaflet";
import { TGeoJSONControl } from "../../../sidebar/components/GeoJSONControl/types";

// * this type represents drawing tool that was selected
export type SelectedDrawingTool<T extends TAbstractTool = TAbstractTool> = T;

export type ActiveTool = DrawnObject &
  (
    | (L.Draw.Slice & { type: "knife" })
    | (L.Draw.Polygon & { type: "polygon" })
    | (L.Draw.Polyline & { type: "polyline" })
    | (L.Draw.ExtendedMarker & { type: "marker" })
  );

export type DrawingForm = IMapForm & {
  redrawTabContent: (type: LayerType | "") => void;
  getState(): TabState;
  getTool(): IDrawingLayerTool;
};

export type Controls = {
  DataControl: TDataControl;
  MarkerControl: TMarkerControl;
  PolyControl: TPolyControl;
  SearchControl: TSearchControl;
  BrushControl: TBrushControl;
  GeoJSONControl: TGeoJSONControl;
};

export type TabState = {
  tabControl: DrawingForm;
  enabledTool: SelectedDrawingTool | null;
  guideLayers: DrawnObject[];
  controls: Controls;
  initializeControls(): void;
  getSelectedColor(): string;
  getSelectedStroke(): number;
  getSelectedIcon(): string;
  setSelectedIcon(icon: string): void;
  callIdentifierChange(haveToCheckFilters: boolean): void;
  appendToIconSrcs(iconUrl: string): void;
  pushGuideLayer(layer: DrawnObject): void;
  setEnabledTool(val: SelectedDrawingTool | null): void;
  getEnabledTool(): SelectedDrawingTool | null;
  getIntersectActivated(): boolean;
};

/**
 * This interface declares the connection layer tool.
 *
 * @author Jiri Hynek
 */
interface IDrawingLayerTool<
  TProps extends IDrawingLayerToolProps = IDrawingLayerToolProps,
  TDefaults extends IDrawingLayerToolDefaults = IDrawingLayerToolDefaults,
  TState extends IDrawingLayerToolState = IDrawingLayerToolState,
  TConfig extends IDrawingLayerToolConfig = IDrawingLayerToolConfig,
  TInitProps extends IMapToolInitProps<TConfig> = IMapToolInitProps<TConfig>
> extends ILayerTool<TProps, TDefaults, TState, TConfig, TInitProps> {
  drawingTools: LooseObject;
  /**
   * It creates a copy of the uninitialized tool.
   */
  copy(): IDrawingLayerTool;
  initializeDrawingTools(): void;
  applyEventListeners(layer: DrawnObject): void;
  highlightElement(el: DrawnObject): void;
  normalizeElement(el: DrawnObject): void;
  redrawMapForm(layerType: LayerType | ""): void;
  getMapForm(): DrawingForm;
  setGlobalSimplificationTolerance(map: L.Map | undefined): void;
}
export default IDrawingLayerTool;
