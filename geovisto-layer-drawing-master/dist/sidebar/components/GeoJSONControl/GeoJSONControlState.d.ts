import AbstractControlState from "../AbstractControl/AbstractControlState";
import { ControlStateProps } from "../AbstractControl/types";
import { TGeoJSONControlState } from "./types";
declare class GeoJSONControlState extends AbstractControlState implements TGeoJSONControlState {
    constructor(props: ControlStateProps);
}
export default GeoJSONControlState;
