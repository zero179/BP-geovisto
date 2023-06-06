import AbstractControl from "../AbstractControl/AbstractControl";
import { ControlProps } from "../AbstractControl/types";
import DataControlState from "./DataControlState";
import { TDataControl } from "./types";
declare class DataControl extends AbstractControl implements TDataControl {
    state: DataControlState;
    constructor(props: ControlProps);
    /**
     * creates a field for picking column name where to choose identifier from
     */
    private createPickIdentifier;
    /**
     * creates a field for identier input
     */
    private createIdentifierInput;
    renderDataInputs: (elem: HTMLDivElement) => void;
    private setDataKey;
    private setDataValue;
    /**
     * creates the filter fields
     */
    renderDataFilters: (elem: HTMLDivElement) => void;
    private addFilter;
    private removeFilter;
    /**
     * creates the buttons for adding/removing buttons
     */
    renderFilterInputs: (elem: HTMLDivElement) => void;
}
export default DataControl;
