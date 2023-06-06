import { TSearchControl } from "./types";
import { ControlProps } from "./../AbstractControl/types";
import { MAPPING_MODEL } from "../../../util/inputs";
import { ADMIN_LEVELS } from "../../../util/constants";
import AbstractControl from "../AbstractControl/AbstractControl";
import SearchControlState from "./SearchControlState";
import { IMapFormInput } from "geovisto";

class SearchControl extends AbstractControl implements TSearchControl {
  public state;
  public inputSearch: IMapFormInput | null;
  public inputConnect: HTMLElement | null;
  public errorMsg: HTMLDivElement | null;
  public searchForAreasBtn: HTMLButtonElement | null;

  public constructor(props: ControlProps) {
    super(props);

    this.state = new SearchControlState({
      tabControl: props.tabControl,
      control: this,
    });

    this.inputSearch = null;
    this.inputConnect = null;
    this.errorMsg = null;
    this.searchForAreasBtn = null;
  }

  /**
   * checkbox to be able to create topology with place search
   */
  private createConnectCheck = (): HTMLElement => {
    const onChange = (e: Event) => {
      const val = (e.target as HTMLInputElement).checked;
      this.state.setConnectActivated(val);
    };
    const { connectActivated } = this.state;

    const result = MAPPING_MODEL.searchConnect.input({
      ...MAPPING_MODEL.searchConnect.props,
      defaultValue: connectActivated,
      onChangeAction: onChange,
    });

    const checkWrapper = document.createElement("div");
    checkWrapper.classList.add("connect-check");
    checkWrapper.appendChild(result.create());

    return checkWrapper;
  };

  /**
   * checkbox to set if result of area search will be HQ
   */
  private createHighQualityCheck = (): HTMLElement => {
    const onChange = (e: Event) => {
      const val = (e.target as HTMLInputElement).checked;
      this.state.setHighQuality(val);
    };
    const { highQuality } = this.state;

    const result = MAPPING_MODEL.highQuality.input({
      ...MAPPING_MODEL.highQuality.props,
      defaultValue: highQuality,
      onChangeAction: onChange,
    });

    return result.create();
  };

  /**
   * creates heading element
   */
  private addHeading = (title: string, elem: HTMLDivElement): void => {
    const headingTag = document.createElement("h3");
    headingTag.innerText = title;
    elem.appendChild(headingTag);
  };

  /**
   * creates all of the search inputs
   *
   * @param {Object} elem HTML element wrapper
   * @param {Object} model
   */
  public renderSearchInputs = (elem: HTMLDivElement): void => {
    this.addHeading("Search for place", elem);
    // * labeled text Search
    this.inputSearch = MAPPING_MODEL.search.input({
      ...MAPPING_MODEL.search.props,
      onChangeAction: this.state.searchAction,
      placeholder: "Press enter for search",
      setData: this.state.onInputOptClick,
      options: [],
    });
    elem.appendChild(this.inputSearch.create() as Node);

    this.inputConnect = this.createConnectCheck();
    elem.appendChild(this.inputConnect);
    // * divider
    elem.appendChild(document.createElement("hr"));

    this.addHeading("Search for area", elem);
    // * labeled text Search
    const inputSearchForArea = MAPPING_MODEL.searchForArea.input({
      ...MAPPING_MODEL.searchForArea.props,
      options: this.state.getSelectCountries(),
      onChangeAction: this.state.searchForAreaAction,
    });
    elem.appendChild(inputSearchForArea.create() as Node);
    inputSearchForArea.setValue(this.state.countryCode || "");
    elem.appendChild(document.createElement("br"));

    const inputAdminLevel = MAPPING_MODEL.adminLevel.input({
      ...MAPPING_MODEL.adminLevel.props,
      options: ADMIN_LEVELS,
      onChangeAction: this.state.pickAdminLevelAction,
    });
    inputAdminLevel.setValue(this.state.adminLevel);
    elem.appendChild(inputAdminLevel.create() as Node);
    elem.appendChild(document.createElement("br"));

    const hqCheck = this.createHighQualityCheck();
    elem.appendChild(hqCheck);

    this.errorMsg = document.createElement("div");
    this.errorMsg.className = "error-text";
    this.errorMsg.innerText = "";
    elem.appendChild(this.errorMsg);

    this.searchForAreasBtn = document.createElement("button");
    this.searchForAreasBtn.innerText = "Submit";
    this.searchForAreasBtn.addEventListener("click", this.state.fetchAreas);
    elem.appendChild(this.searchForAreasBtn);
  };
}

export default SearchControl;
