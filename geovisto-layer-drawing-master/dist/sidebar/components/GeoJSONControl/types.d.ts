import { TAbstractControl } from "./../AbstractControl/types";
import { TAbstractControlState } from "../AbstractControl/types";
export interface TGeoJSONControlState extends TAbstractControlState {
}
export interface TGeoJSONControl extends TAbstractControl<TGeoJSONControlState> {
    renderGeoJSONInputs(elem: HTMLDivElement): void;
}
