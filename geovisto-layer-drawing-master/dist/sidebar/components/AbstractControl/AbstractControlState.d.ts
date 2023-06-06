import IDrawingLayerTool, { DrawingForm } from "./../../../model/types/tool/IDrawingLayerTool";
import { DrawnObject, LayerType } from "../../../model/types";
import { ControlStateProps, TAbstractControlState } from "./types";
/**
 * Abstract class for control state.
 *
 * control gives inputs for manipulation of created objects
 *
 * class should should contain only methods for data and logic of inputs, not rendering
 */
declare class AbstractControlState implements TAbstractControlState {
    tabControl: DrawingForm;
    tool: IDrawingLayerTool;
    control: any;
    constructor(props: ControlStateProps);
    _getSelected: () => DrawnObject | null;
    _getExtraSelected: () => Array<DrawnObject>;
    _redrawSidebar: (type?: LayerType) => void;
}
export default AbstractControlState;
