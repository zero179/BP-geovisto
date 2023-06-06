import DataControl from "./components/DataControl/DataControl";
import MarkerControl from "./components/MarkerControl/MarkerControl";
import PolyControl from "./components/PolyControl/PolyControl";
import BrushControl from "./components/BrushControl/BrushControl";
import SearchControl from "./components/SearchControl/SearchControl";
import {
  Controls,
  DrawingForm,
  SelectedDrawingTool,
  TabState,
} from "../model/types/tool/IDrawingLayerTool";

import { DrawnObject } from "../model/types";
import GeoJSONControl from "./components/GeoJSONControl/GeoJSONControl";

/**
 * This class manages the state of the sidebar tab.
 * It wraps the state since the sidebar tab can work with state objects which needs to be explicitly serialized.
 *
 * @author Andrej Tlcina
 */
class DrawingLayerToolMapFormState implements TabState {
  public tabControl: DrawingForm;
  public enabledTool: SelectedDrawingTool | null;
  public guideLayers: DrawnObject[];
  public controls!: Controls;
  /**
   * It creates a tab control state.
   */
  public constructor(tabControl: DrawingForm) {
    this.tabControl = tabControl;

    // * element/layer that was enabled and not created yet
    this.enabledTool = null;

    this.guideLayers = [];
  }

  /**
   * method initializes controls for objects manipulation
   */
  public initializeControls = (): void => {
    const { tabControl } = this;

    const controls = {
      DataControl: new DataControl({ tabControl }),
      MarkerControl: new MarkerControl({ tabControl }),
      PolyControl: new PolyControl({ tabControl }),
      SearchControl: new SearchControl({ tabControl }),
      BrushControl: new BrushControl({ tabControl }),
      GeoJSONControl: new GeoJSONControl({ tabControl }),
    };

    this.controls = controls;
  };

  /**
   * method if defined for easier access through tabControlState class/object
   */
  public getSelectedColor(): string {
    const state = this.controls["PolyControl"]?.state;
    return state?.getSelectedColor() || "";
  }

  /**
   * method if defined for easier access through tabControlState class/object
   */
  public getSelectedStroke(): number {
    const state = this.controls["PolyControl"]?.state;
    return state?.getSelectedStroke() || 0;
  }

  /**
   * method if defined for easier access through tabControlState class/object
   */
  public getSelectedIcon(): string {
    const state = this.controls["MarkerControl"]?.state;
    return state?.getSelectedIcon() || "";
  }

  public setSelectedIcon(icon: string): void {
    this.controls["MarkerControl"]?.state?.setSelectedIcon(icon);
  }

  /**
   * method if defined for easier access through tabControlState class/object
   */
  public callIdentifierChange(haveToCheckFilters = false): void {
    const state = this.controls["DataControl"]?.state;
    state?.callIdentifierChange(haveToCheckFilters);
  }

  /**
   * method if defined for easier access through tabControlState class/object
   */
  public appendToIconSrcs(iconUrl: string): void {
    const state = this.controls["MarkerControl"]?.state;
    state?.appendToIconSrcs(iconUrl);
  }

  /**
   * method for easier access through tabControlState class/object
   */
  public getIntersectActivated(): boolean {
    const state = this.controls["PolyControl"]?.state;
    return state?.intersectActivated || false;
  }
  /**
   * adds guide layer for snapping
   */
  public pushGuideLayer(layer: DrawnObject): void {
    this.guideLayers.push(layer);
  }

  /**
   * setter for enabledTool variable
   */
  public setEnabledTool(val: SelectedDrawingTool | null): void {
    this.enabledTool?.disable();
    this.enabledTool = val;
  }

  /**
   * getter
   */
  public getEnabledTool(): SelectedDrawingTool | null {
    return this.enabledTool;
  }
}
export default DrawingLayerToolMapFormState;
