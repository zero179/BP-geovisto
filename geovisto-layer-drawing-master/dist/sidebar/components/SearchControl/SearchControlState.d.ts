import { TSearchControlState } from "./types";
import { LooseObject } from "./../../../model/types/index";
import { ControlStateProps } from "./../AbstractControl/types";
import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";
import AbstractControlState from "../AbstractControl/AbstractControlState";
declare class SearchControlState extends AbstractControlState implements TSearchControlState {
    countries: Array<{
        name: string;
        "alpha-2": string;
        "country-code": string;
    }>;
    countryCode: string;
    adminLevel: number;
    searchOpts: LooseObject[];
    highQuality: boolean;
    connectActivated: boolean;
    constructor(props: ControlStateProps);
    /**
     * takes countries from static file and maps through them
     */
    getSelectCountries(): {
        value: string;
        label: string;
    }[];
    /**
     * sets whether displayed polygon will be of high quality
     */
    setHighQuality(val: boolean): void;
    /**
     * sets whether we are creating topology with search
     */
    setConnectActivated(val: boolean): void;
    /**
     * sets for what area we are searching for
     */
    searchForAreaAction: (e: InputEvent) => void;
    /**
     * sets for what administration level we are searching for
     */
    pickAdminLevelAction: (e: InputEvent) => void;
    /**
     * sets new options for place search
     */
    searchAction: (e: InputEvent) => Promise<void>;
    /**
     * called when user picks a place from displayed options
     */
    onInputOptClick: (value: string) => void;
    /**
     * builds query from inputed values and send it to Overpass API
     *
     * @returns
     */
    fetchAreas: () => Promise<void>;
}
export default SearchControlState;
