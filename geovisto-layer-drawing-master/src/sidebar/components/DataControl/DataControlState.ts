import { IMapData } from "geovisto";
import AbstractControlState from "../AbstractControl/AbstractControlState";
import { ControlStateProps } from "../AbstractControl/types";
import DataControlUtils from "./DataControlUtils";
import { TDataControlState, TFilterValue } from "./types";

class DataControlState
  extends AbstractControlState
  implements TDataControlState {
  public data: IMapData;
  public identifierType: string;
  public filtersAmount: number;
  public filtersKeys: string[];
  public filtersValues: TFilterValue[];

  public constructor(props: ControlStateProps) {
    super(props);

    this.data =
      props.tabControl
        .getTool()
        .getMap()
        ?.getState()
        ?.getMapData()
        ?.getDataRecords() || [];

    this.identifierType = "";

    this.filtersAmount = 0;
    this.filtersKeys = [];
    this.filtersValues = [];
  }

  /**
   * clears all filters for data mapping
   */
  public clearFilters(): void {
    this.filtersAmount = 0;
    this.filtersKeys = [];
    this.filtersValues = [];
  }

  /**
   * gets filter key (column header)
   */
  public getFiltersKey(idx: number): string {
    const key = this.filtersKeys[idx];
    return key;
  }

  /**
   * gets value in column
   */
  public getFiltersValue(idx: number): TFilterValue {
    const value = this.filtersValues[idx];
    return value;
  }

  /**
   * sets value in filterKeys array
   */
  public setFiltersKey(idx: number, value: string): void {
    if (idx > this.filtersAmount) return;
    this.filtersKeys[idx] = value;
  }

  /**
   * sets value in filterValues array
   *
   * @param {Number} idx
   * @param {any} value
   * @returns
   */
  public setFiltersValue(idx: number, value: TFilterValue): void {
    if (idx > this.filtersAmount) return;
    this.filtersValues[idx] = value;
  }

  /**
   * runs whenever user clicks on 'Add Filter' button
   * essentially creates new filter
   */
  public increaseFilters = (): void => {
    this.filtersAmount += 1;
    this.filtersKeys.push("");
    this.filtersValues.push("");
  };
  /**
   * runs whenever user clicks on 'Remove Filter' button
   * essentially removes last added filter and it's values
   */
  public decreaseFilters = (): void => {
    if (this.filtersAmount === 0) return;
    this.filtersAmount -= 1;
    this.filtersKeys.pop();
    this.filtersValues.pop();
  };

  /**
   * returns "column header name"
   */
  public getIdentifierType(): string {
    return this.identifierType;
  }

  /**
   * sets which column we should take identifier from
   */
  public changeWhichIdUseAction = (e: InputEvent): void => {
    const id = (e.target as HTMLSelectElement).value;
    const selectedEl = this._getSelected();

    this.identifierType = id;

    this._redrawSidebar(selectedEl?.layerType);
  };

  /**
   * called on field change
   */
  public changeIdentifierAction = (id: string): void => {
    if (!id) return;
    const selectedEl = this._getSelected();
    if (selectedEl) selectedEl.identifier = id;

    const data =
      this.tool.getMap()?.getState()?.getMapData()?.getDataRecords() || [];

    // * create new variable and store imported data
    let filteredData = data;
    // * go through all appended filter keys
    this.filtersKeys.forEach((key, idx) => {
      // * loop through each row of imported data
      filteredData = filteredData.filter(
        (d) => String(d[key]) === this.filtersValues[idx]
      );
    });

    const idType = this.identifierType;
    const found = filteredData.find((d) => String(d[idType]) === id);

    let popupText = "";
    if (found) {
      Object.keys(found).forEach((key) => {
        popupText += `${key}: ${found[key]}<br />`;
      });
    }

    this.changeDesc(popupText);
    this._redrawSidebar(selectedEl?.layerType);
  };

  /**
   * called on change of field
   */
  public changeDescriptionAction = (e: InputEvent): void => {
    this.changeDesc((e.target as HTMLTextAreaElement).value);
  };

  /**
   * Takes selected element and bind new popup to it
   *
   * @param {String} inputText
   */
  public changeDesc = (inputText: string): void => {
    const selectedEl = this._getSelected();
    const modInputText = DataControlUtils.convertDescToPopText(inputText);

    const popup1 = selectedEl?.getPopup();
    if (popup1) {
      popup1.setContent(modInputText);
    } else {
      selectedEl?.bindPopup(modInputText, {
        closeOnClick: false,
        autoClose: false,
      });
    }
    // store for import
    if (selectedEl) selectedEl.popupContent = modInputText;
    if (selectedEl?.setStyle) selectedEl.setStyle(modInputText);
  };

  /**
   * forcefuly change identifier (not on field change)
   */
  public callIdentifierChange = (haveToCheckFilters = false): void => {
    if (haveToCheckFilters && this.filtersAmount === 0) return;
    const selectedEl = this._getSelected();
    this.changeIdentifierAction(selectedEl?.identifier || "");
  };
}

export default DataControlState;
