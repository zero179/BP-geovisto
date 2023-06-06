import { TAbstractControl } from "./../AbstractControl/types";
import { TAbstractControlState } from "../AbstractControl/types";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TGeoJSONControlState extends TAbstractControlState {

}

export interface TGeoJSONControl extends TAbstractControl<TGeoJSONControlState> {
  renderGeoJSONInputs(elem: HTMLDivElement): void;
}
