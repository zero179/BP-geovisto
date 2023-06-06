import * as L from "leaflet";
import { Optional, Tool, DrawnObject } from "./../index";
import IDrawingLayerTool from "../tool/IDrawingLayerTool";

export type DrawingBtns = { [key: string]: HTMLAnchorElement };

export type Options = L.ControlOptions & {
  map?: L.Map;
  tool: Optional<IDrawingLayerTool>;
  drawingBtns?: DrawingBtns;
  selectedTool: Optional<Tool>;
};

export type TDrawingToolbar = L.Control & {
  options: Options;
  initialize(options: Options): void;
  createUi(): HTMLDivElement;
  getSelectedLayer(): Optional<DrawnObject> | undefined;
  createToolbarBtn(
    className: string,
    btnContainer: HTMLDivElement,
    title: string,
    icon: string,
    extra: boolean
  ): HTMLAnchorElement;
};

// don't know how to define class DrawingToolbar that extends Control without needing to define method addTo and others...
declare module "leaflet" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace control {
    function drawingToolbar(options?: Options): TDrawingToolbar;
  }
}
