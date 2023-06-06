import { IMapData } from "geovisto";
import AbstractControlState from "../AbstractControl/AbstractControlState";
import { ControlStateProps } from "../AbstractControl/types";
import { TDataControlState, TFilterValue } from "./types";
declare class DataControlState extends AbstractControlState implements TDataControlState {
    data: IMapData;
    identifierType: string;
    filtersAmount: number;
    filtersKeys: string[];
    filtersValues: TFilterValue[];
    constructor(props: ControlStateProps);
    /**
     * clears all filters for data mapping
     */
    clearFilters(): void;
    /**
     * gets filter key (column header)
     */
    getFiltersKey(idx: number): string;
    /**
     * gets value in column
     */
    getFiltersValue(idx: number): TFilterValue;
    /**
     * sets value in filterKeys array
     */
    setFiltersKey(idx: number, value: string): void;
    /**
     * sets value in filterValues array
     *
     * @param {Number} idx
     * @param {any} value
     * @returns
     */
    setFiltersValue(idx: number, value: TFilterValue): void;
    /**
     * runs whenever user clicks on 'Add Filter' button
     * essentially creates new filter
     */
    increaseFilters: () => void;
    /**
     * runs whenever user clicks on 'Remove Filter' button
     * essentially removes last added filter and it's values
     */
    decreaseFilters: () => void;
    /**
     * returns "column header name"
     */
    getIdentifierType(): string;
    /**
     * sets which column we should take identifier from
     */
    changeWhichIdUseAction: (e: InputEvent) => void;
    /**
     * called on field change
     */
    changeIdentifierAction: (id: string) => void;
    /**
     * called on change of field
     */
    changeDescriptionAction: (e: InputEvent) => void;
    /**
     * Takes selected element and bind new popup to it
     *
     * @param {String} inputText
     */
    changeDesc: (inputText: string) => void;
    /**
     * forcefuly change identifier (not on field change)
     */
    callIdentifierChange: (haveToCheckFilters?: boolean) => void;
}
export default DataControlState;
