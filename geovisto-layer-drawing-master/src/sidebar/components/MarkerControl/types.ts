import { TAbstractControl } from "./../AbstractControl/types";
import { LooseObject, DrawnObject } from "./../../../model/types/index";
import { TAbstractControlState } from "../AbstractControl/types";
import { MappingModel } from "../../../model/types/tool/IDrawingLayerToolDefaults";

export interface TMarkerControlState extends TAbstractControlState {
  iconSrcs: Set<string>;
  selectedIcon: string;
  getSelectedIcon(): string;
  setSelectedIcon(icon: string): void;
  changeIconOpts(iconOpt: LooseObject): DrawnObject | null;
  changeIconAction(icon: string): void;
  changeIconAnchor(e: Event, coordinate: "x" | "y"): void;
  addIconAction(e: InputEvent): void;
  appendToIconSrcs(iconUrl: string): void;
}

export interface TMarkerControl extends TAbstractControl<TMarkerControlState> {
  renderIconInputs(elem: HTMLDivElement): void;
}
