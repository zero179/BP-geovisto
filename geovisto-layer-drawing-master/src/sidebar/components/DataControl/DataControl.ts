import { IMapFormInput } from "geovisto";
import { createButton, MAPPING_MODEL } from "../../../util/inputs";
import AbstractControl from "../AbstractControl/AbstractControl";
import { ControlProps } from "../AbstractControl/types";
import DataControlState from "./DataControlState";
import DataControlUtils from "./DataControlUtils";
import { TDataControl } from "./types";

class DataControl extends AbstractControl implements TDataControl {
  public state;

  public constructor(props: ControlProps) {
    super(props);

    this.state = new DataControlState({
      tabControl: props.tabControl,
      control: this,
    });
  }

  // ************************* Data Inputs ***************************************

  /**
   * creates a field for picking column name where to choose identifier from
   */
  private createPickIdentifier = (): IMapFormInput => {
    const { data } = this.state;

    const idOpts = data[0]
      ? Object.keys(data[0]).map((k) => ({ value: k, label: k }))
      : [];

    const result = MAPPING_MODEL.idKey.input({
      ...MAPPING_MODEL.idKey.props,
      onChangeAction: this.state.changeWhichIdUseAction,
      options: [{ value: "", label: "" }, ...idOpts],
    });

    return result;
  };

  /**
   * creates a field for identier input
   */
  private createIdentifierInput = (): IMapFormInput => {
    const { data } = this.state;

    const idKey = this.state.getIdentifierType();

    let idOpts = data && data[0][idKey] ? data.map((d) => d[idKey]) : [];
    idOpts = Array.from(new Set(idOpts));

    const result = MAPPING_MODEL.identifier.input({
      ...MAPPING_MODEL.identifier.props,
      onChangeAction: (e: Event) =>
        this.state.changeIdentifierAction((e.target as HTMLInputElement).value),
      options: idOpts,
      placeholder: "e.g. CZ",
    });

    return result;
  };

  public renderDataInputs = (elem: HTMLDivElement): void => {
    const disableTextFields = !this.state._getSelected();
    // Select Pick Identifier
    const inputPickIdentifier = this.createPickIdentifier();
    elem.appendChild(inputPickIdentifier.create() as Node);
    inputPickIdentifier.setDisabled(disableTextFields);
    inputPickIdentifier.setValue(this.state.getIdentifierType());
    // textfield Identifier
    const inputId = this.createIdentifierInput();
    elem.appendChild(inputId.create() as Node);
    inputId.setDisabled(disableTextFields);
    inputId.setValue(this.state._getSelected()?.identifier || "");
    // textarea Description
    const inputDesc = MAPPING_MODEL.description.input({
      ...MAPPING_MODEL.description.props,
      onChangeAction: this.state.changeDescriptionAction,
    });
    elem.appendChild(inputDesc.create() as Node);
    inputDesc.setValue(
      DataControlUtils.convertDescfromPopText(
        (this.state._getSelected()?.getPopup()?.getContent() || "") as string
      )
    );
    inputDesc.setDisabled(disableTextFields);
  };

  // ************************* Data Inputs END ***************************************

  // ************************* Filter Inputs ***************************************

  private setDataKey = (e: InputEvent, index: number): void => {
    const val = (e.target as HTMLSelectElement).value;
    this.state.setFiltersKey(index, val);
    this.state._redrawSidebar(this.state._getSelected()?.layerType);
  };

  private setDataValue = (e: InputEvent, index: number): void => {
    const val = (e.target as HTMLSelectElement).value;
    this.state.setFiltersValue(index, val);
    this.state.callIdentifierChange();
    this.state._redrawSidebar(this.state._getSelected()?.layerType);
  };

  /**
   * creates the filter fields
   */
  public renderDataFilters = (elem: HTMLDivElement): void => {
    const { data } = this.state;

    const idOpts = data[0]
      ? Object.keys(data[0]).map((k) => ({ value: k, label: k }))
      : [];

    for (let index = 0; index < this.state.filtersAmount; index++) {
      const filtersKey = this.state.getFiltersKey(index);
      // * input for key
      const inputKey = MAPPING_MODEL.dataFilterKey.input({
        ...MAPPING_MODEL.dataFilterKey.props,
        onChangeAction: (e: InputEvent) => this.setDataKey(e, index),
        options: [{ value: "", label: "" }, ...idOpts],
      });

      // ***********************************************************
      let valueOpts =
        data && data[0][filtersKey] ? data.map((d) => d[filtersKey]) : [];
      valueOpts = Array.from(new Set(valueOpts));
      // * input for value
      const inputValue = MAPPING_MODEL.dataFilterValue.input({
        ...MAPPING_MODEL.dataFilterValue.props,
        onChangeAction: (e: InputEvent) => this.setDataValue(e, index),
        options: ["", ...valueOpts],
      });

      // * append elements
      elem.appendChild(document.createElement("hr"));
      elem.appendChild(inputKey.create() as Node);
      elem.appendChild(inputValue.create() as Node);

      inputKey.setValue(filtersKey);
      inputValue.setValue(this.state.getFiltersValue(index));
    }
  };

  private addFilter = (): void => {
    this.state.increaseFilters();
    this.state._redrawSidebar(this.state._getSelected()?.layerType);
  };

  private removeFilter = (): void => {
    this.state.decreaseFilters();
    this.state.callIdentifierChange();
    this.state._redrawSidebar(this.state._getSelected()?.layerType);
  };

  /**
   * creates the buttons for adding/removing buttons
   */
  public renderFilterInputs = (elem: HTMLDivElement): void => {
    const disabled = !this.state._getSelected();

    const wrapper = document.createElement("div");
    wrapper.style.width = "100%";
    const addFilterBtn = createButton("Add Filter", this.addFilter, disabled);
    const removeFilterBtn = createButton(
      "Remove Filter",
      this.removeFilter,
      disabled
    );
    wrapper.appendChild(addFilterBtn);
    wrapper.appendChild(removeFilterBtn);
    elem.appendChild(wrapper);
  };

  // ************************* Filter Inputs END ***************************************
}

export default DataControl;
