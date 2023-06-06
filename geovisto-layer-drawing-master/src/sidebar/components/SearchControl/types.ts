import { TAbstractControl } from "./../AbstractControl/types";
import { LooseObject } from "./../../../model/types/index";
import { TAbstractControlState } from "../AbstractControl/types";

export interface TSearchControlState extends TAbstractControlState {
  countries: Array<{ name: string; "alpha-2": string; "country-code": string }>;
  countryCode: string;
  adminLevel: number;
  searchOpts: LooseObject[];
  highQuality: boolean;
  connectActivated: boolean;
  getSelectCountries(): { value: string; label: string }[];
  setHighQuality(val: boolean): void;
  setConnectActivated(val: boolean): void;
  searchForAreaAction(e: InputEvent): void;
  pickAdminLevelAction(e: InputEvent): void;
  searchAction(e: InputEvent): Promise<void>;
  onInputOptClick(value: string): void;
  fetchAreas(): Promise<void>;
}

export interface TSearchControl extends TAbstractControl<TSearchControlState> {
  renderSearchInputs(elem: HTMLDivElement): void;
}
