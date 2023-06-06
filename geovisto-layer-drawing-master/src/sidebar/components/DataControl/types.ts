import { LooseObject } from "./../../../model/types/index";
import {
  TAbstractControl,
  TAbstractControlState,
} from "../AbstractControl/types";
import { IMapData } from "geovisto";

export type TData = LooseObject;
export type TFilterValue = string;

export interface TDataControlState extends TAbstractControlState {
  data: IMapData;
  identifierType: string;
  filtersAmount: number;
  filtersKeys: string[];
  filtersValues: TFilterValue[];
  clearFilters(): void;
  getFiltersKey(idx: number): string;
  getFiltersValue(idx: number): TFilterValue;
  setFiltersKey(idx: number, value: string): void;
  setFiltersValue(idx: number, value: TFilterValue): void;
  increaseFilters(): void;
  decreaseFilters(): void;
  getIdentifierType(): string;
  changeWhichIdUseAction(e: InputEvent): void;
  changeIdentifierAction(id: string): void;
  changeDescriptionAction(e: InputEvent): void;
  changeDesc(inputText: string): void;
  callIdentifierChange(haveToCheckFilters?: boolean): void;
}

export interface TDataControl extends TAbstractControl<TDataControlState> {
  renderDataInputs(elem: HTMLDivElement): void;
  renderDataFilters(elem: HTMLDivElement): void;
  renderFilterInputs(elem: HTMLDivElement): void;
}
