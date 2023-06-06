import { IGeoData, IGeoDataManager, LabeledAutocompleteFormInput } from "geovisto";

import AbstractControl from "../AbstractControl/AbstractControl";
import { ControlProps } from "../AbstractControl/types";
import GeoJSONControlState from "./GeoJSONControlState";
import { TGeoJSONControl } from "./types";


class GeoJSONControl extends AbstractControl implements TGeoJSONControl {
  public state;
  
  private geoDataManager?: IGeoDataManager;

  public constructor(props: ControlProps) {
    super(props);

    this.state = new GeoJSONControlState({
      tabControl: props.tabControl,
      control: this,
    });

    this.geoDataManager = this.state.tool.getMap()?.getState().getGeoDataManager();
  }
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
  public renderGeoJSONInputs(elem: HTMLDivElement): void {
    this.createImportForm(elem);
    this.createExportForm(elem);
  }

  protected createImportForm(elem: HTMLDivElement): void {
    const exportDiv: HTMLDivElement = document.createElement("div");
    const autocompleteInput = new LabeledAutocompleteFormInput({
      label: "Import geoJSON:",
      options: this.geoDataManager?.getDomainNames() ?? [],
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onChangeAction: () => {}
    });

    const importButton: HTMLInputElement = document.createElement("input");
    importButton.id = "geovisto-tool-drawing-geojson-export-button";
    importButton.type = "button";
    importButton.size = 3;
    importButton.value = "import";
    importButton.onclick = () => {
      const geoData: IGeoData | undefined = this.geoDataManager?.getDomain(autocompleteInput.getValue());
      if(geoData) {
        this.state.tool.getState().deserializeGeoJSON(geoData.getGeoJSON() as any);
      }
    };
    importButton.style.display = "block";

    exportDiv.appendChild(autocompleteInput.create());
    exportDiv.appendChild(importButton);

    elem.appendChild(exportDiv);
  }

  protected createExportForm(elem: HTMLDivElement): void {
    const exportDiv: HTMLDivElement = document.createElement("div");
    exportDiv.style.paddingTop = "1rem";

    const exportLabel:  HTMLDivElement = document.createElement("div");
    exportLabel.style.paddingLeft = "5px";
    //exportLabel.htmlFor = "geovisto-tool-drawing-geojson-export-button";
    exportLabel.innerHTML = "Export geoJSON:";

    const exportButton: HTMLInputElement = document.createElement("input");
    exportButton.id = "geovisto-tool-drawing-geojson-export-button";
    exportButton.type = "button";
    exportButton.size = 3;
    exportButton.value = "export";
    exportButton.onclick = () => {
      const config = JSON.stringify(
        this.state.tool.getState().serializeToGeoJSON(),
        null,
        2
      );
      // download file
      const element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(config)
      );
      element.setAttribute("download", "map.json");
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    };

    exportDiv.appendChild(exportLabel);
    exportDiv.appendChild(exportButton);

    elem.appendChild(exportDiv);
  }

}

export default GeoJSONControl;
