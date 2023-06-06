import IDrawingLayerTool, {
  DrawingForm,
} from "../../../model/types/tool/IDrawingLayerTool";
import { DrawnObject } from "./../../../model/types/index";

export type ControlProps = {
  tabControl: DrawingForm;
};

export type ControlStateProps = ControlProps & {
  control: any;
};

export interface TAbstractControlState {
  tabControl: DrawingForm;
  tool: IDrawingLayerTool;
  control: any;
  _getSelected(): DrawnObject | null;
  _getExtraSelected(): DrawnObject[];
  _redrawSidebar(type?: string): void;
}

export interface TAbstractControl<TState = TAbstractControlState> {
  state: TState;
}
