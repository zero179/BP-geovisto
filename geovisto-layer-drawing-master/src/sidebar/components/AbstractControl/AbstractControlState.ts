import IDrawingLayerTool, {
  DrawingForm,
} from "./../../../model/types/tool/IDrawingLayerTool";
import { DrawnObject, LayerType } from "../../../model/types";
import { ControlStateProps, TAbstractControlState } from "./types";

/**
 * Abstract class for control state.
 *
 * control gives inputs for manipulation of created objects
 *
 * class should should contain only methods for data and logic of inputs, not rendering
 */
class AbstractControlState implements TAbstractControlState {
  public tabControl: DrawingForm;
  public tool: IDrawingLayerTool;
  public control;

  public constructor(props: ControlStateProps) {
    this.tabControl = props.tabControl;
    this.tool = props.tabControl.getTool();
    this.control = props.control;
  }

  public _getSelected = (): DrawnObject | null => {
    return this.tool.getState().selectedLayer;
  };

  public _getExtraSelected = (): Array<DrawnObject> => {
    return this.tool.getState().extraSelected;
  };

  public _redrawSidebar = (type?: LayerType): void => {
    return this.tabControl.redrawTabContent(type || "");
  };
}

export default AbstractControlState;
