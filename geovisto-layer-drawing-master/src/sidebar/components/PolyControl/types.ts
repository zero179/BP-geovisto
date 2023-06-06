import { TAbstractControl } from "./../AbstractControl/types";
import { SelectOpts } from "../../../util/constants";
import { TAbstractControlState } from "../AbstractControl/types";

export interface TPolyControlState extends TAbstractControlState {
  intersectActivated: boolean;
  colors: string[];
  selectedColor: string;
  strokes: SelectOpts;
  selectedStroke: number;
  getSelectedColor(): string;
  getSelectedStroke(): number;
  setIntersectActivated(val: boolean): void;
  changeColorAction(color: string): void;
  changeWeightAction(e: Event): void;
}

export interface TPolyControl extends TAbstractControl<TPolyControlState> {
  createIntersectionCheck(): HTMLElement;
  renderPolyInputs(elem: HTMLDivElement): void;
}
