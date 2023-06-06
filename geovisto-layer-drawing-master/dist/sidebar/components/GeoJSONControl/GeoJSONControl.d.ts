import AbstractControl from "../AbstractControl/AbstractControl";
import { ControlProps } from "../AbstractControl/types";
import GeoJSONControlState from "./GeoJSONControlState";
import { TGeoJSONControl } from "./types";
declare class GeoJSONControl extends AbstractControl implements TGeoJSONControl {
    state: GeoJSONControlState;
    private geoDataManager?;
    constructor(props: ControlProps);
    /**
     * creates heading element
     */
    private addHeading;
    /**
     * creates all of the search inputs
     *
     * @param {Object} elem HTML element wrapper
     * @param {Object} model
     */
    renderGeoJSONInputs(elem: HTMLDivElement): void;
    protected createImportForm(elem: HTMLDivElement): void;
    protected createExportForm(elem: HTMLDivElement): void;
}
export default GeoJSONControl;
