import { Map } from "leaflet";
import { DrawnObject, LayerType } from "../../model/types";
import IDrawingLayerTool, {
  ActiveTool,
  DrawingForm,
} from "../../model/types/tool/IDrawingLayerTool";
import { TAbstractTool, ToolProps } from "./types";

/**
 * Class is Abstract for Drawing tool/feature
 *
 * Drawing tool/feature enables user to create geospatial objects
 *
 * Each tool/feature creates different objects or has different approach for the object creation
 */
class AbstractTool implements TAbstractTool {
  public drawingTool: IDrawingLayerTool;
  public sidebar: DrawingForm;
  public leafletMap?: Map;
  public activetool: ActiveTool | null;
  public _isActive: boolean;

  public constructor(props: ToolProps) {
    // * keeps DrawingLayerTool class/object
    this.drawingTool = props.drawingTool;
    this.sidebar = props.drawingTool.getMapForm();
    this.leafletMap = props.drawingTool.getMap()?.getState()?.getLeafletMap();

    // * variable for keeping L.Draw object so it is possible to enable/disable it
    this.activetool = null;
    // * flag to find out if tool/feature is active
    this._isActive = false;
  }

  public static NAME(): string {
    return "abstract-drawing-tool";
  }

  /**
   * to be extended
   */
  public getName(): string {
    return AbstractTool.NAME();
  }

  /**
   * to be extended
   */
  public getIconName(): string {
    return "fa fa-pencil";
  }

  /**
   * to be extended
   */
  public getTitle(): string {
    return "Abstract drawing tool";
  }

  /**
   * to be extended
   */
  public result(): LayerType | "" {
    return "";
  }

  public canBeCanceled(): boolean {
    return false;
  }

  public _redrawSidebar(type?: LayerType | ""): void {
    this.drawingTool.redrawMapForm(type || "");
  }

  public setCurrentToolAsEnabled(): void {
    this.sidebar.getState().setEnabledTool(this);
  }

  /**
   * because I want to run setCurrentToolAsEnabled every time enabled is run I wrap it with this function
   */
  public activate(): void {
    this.setCurrentToolAsEnabled();
    this.enable();
    this._isActive = true;
    this._redrawSidebar(this.result());
  }

  public deactivate(): void {
    this.disable();
    this.activetool = null;
    this._isActive = false;
    this.sidebar.getState().setEnabledTool(null);
    this._redrawSidebar();
  }

  /**
   * to be extended
   */
  public enable(): void {
    this._redrawSidebar(this.result());
  }

  /**
   * to be extended
   */
  public disable(): void {
    const activeTool = this.activetool;
    if (activeTool) {
      activeTool.disable();
    }
  }

  /**
   *
   * @returns currently selected geo. object
   */
  public getSelectedLayer(): DrawnObject | null {
    return this.drawingTool.getState().selectedLayer;
  }

  public isToolActive(): boolean {
    return this._isActive;
  }
}

export default AbstractTool;
