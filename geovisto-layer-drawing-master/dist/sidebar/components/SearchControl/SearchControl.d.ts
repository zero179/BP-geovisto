import { TSearchControl } from "./types";
import { ControlProps } from "./../AbstractControl/types";
import AbstractControl from "../AbstractControl/AbstractControl";
import SearchControlState from "./SearchControlState";
import { IMapFormInput } from "geovisto";
declare class SearchControl extends AbstractControl implements TSearchControl {
    state: SearchControlState;
    inputSearch: IMapFormInput | null;
    inputConnect: HTMLElement | null;
    errorMsg: HTMLDivElement | null;
    searchForAreasBtn: HTMLButtonElement | null;
    constructor(props: ControlProps);
    /**
     * checkbox to be able to create topology with place search
     */
    private createConnectCheck;
    /**
     * checkbox to set if result of area search will be HQ
     */
    private createHighQualityCheck;
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
    renderSearchInputs: (elem: HTMLDivElement) => void;
}
export default SearchControl;
