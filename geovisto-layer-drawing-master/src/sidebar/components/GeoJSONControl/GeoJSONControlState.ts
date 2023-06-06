import AbstractControlState from "../AbstractControl/AbstractControlState";
import { ControlStateProps } from "../AbstractControl/types";
import { TGeoJSONControlState } from "./types";

class GeoJSONControlState
  extends AbstractControlState
  implements TGeoJSONControlState {

  public constructor(props: ControlStateProps) {
    super(props);
  }
}

export default GeoJSONControlState;
