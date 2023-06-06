/**
 * @author Andrej Tlcina
 */

import { DrawingMapFormInputFactory } from "../inputs/DrawingSelectFormInput";
import { MappingModel } from "../model/types/tool/IDrawingLayerToolDefaults";

/**
 * creates checkbox
 */
export const createCheck = (
  value: boolean,
  onCheck: (val: boolean) => void,
  prefix: string,
  label: string
): HTMLDivElement => {
  const onChange = (e: Event) => {
    const val = (<HTMLInputElement>e.target).checked;
    onCheck(val);
  };
  const ID = prefix + "-check-input";
  const inputWrapper = document.createElement("div");
  inputWrapper.className = `${ID}-wrapper check-wrapper`;
  const check = document.createElement("input");
  check.type = "checkbox";
  check.checked = value;
  check.id = ID;
  check.onchange = onChange;
  const checkLabel = document.createElement("label");
  // checkLabel.for = ID;
  checkLabel.innerText = label;
  inputWrapper.appendChild(check);
  inputWrapper.appendChild(checkLabel);
  return inputWrapper;
};

/**
 * creates a grid of options, when a tile is clicked passed function runs
 * was made for colors and icons, if img is true it expects icon urls as options
 */
export const createPalette = (
  label: string,
  opts: string[],
  activeIdx: number,
  changeAction: (opt: string) => void,
  img = false
): HTMLDivElement => {
  const inputPalette = document.createElement("div");
  if (label) inputPalette.appendChild(document.createTextNode(label + ": "));
  const wrapper = document.createElement("div");
  wrapper.style.display = "grid";
  wrapper.style.width = "100%";
  wrapper.style.gridTemplateColumns = "repeat(4, 1fr)";
  inputPalette.appendChild(wrapper);
  opts.forEach((opt, idx) => {
    const elem = document.createElement("div");
    elem.style.boxSizing = "border-box";
    elem.style.background = img ? `url(${opt})` : opt;
    elem.style.backgroundRepeat = "no-repeat";
    elem.style.backgroundPosition = "center";
    elem.style.backgroundSize = "contain";
    elem.style.height = "20px";
    elem.style.display = "inline-block";
    elem.style.cursor = "pointer";
    if (idx === activeIdx) {
      elem.style.border = "1px solid #333";
    }
    elem.addEventListener("click", () => changeAction(opt));
    wrapper.appendChild(elem);
  });
  return inputPalette;
};

export const createButton = (
  text: string,
  onClick: () => void,
  disabled: boolean
): HTMLButtonElement => {
  const btn = document.createElement("button");
  btn.innerText = text;
  btn.addEventListener("click", onClick);
  if (disabled) {
    btn.setAttribute("disabled", String(disabled));
  } else {
    btn.removeAttribute("disabled");
  }
  return btn;
};

const FormInput = new DrawingMapFormInputFactory();

/**
 * Data mapping model which can be used in the sidebar form.
 */
export const MAPPING_MODEL: MappingModel = {
  idKey: {
    props: {
      name: "idKey",
      label: "ID key",
    },
    input: FormInput.labeledSelectOpt,
  },
  identifier: {
    props: { name: "identifier", label: "Identifier" },
    input: FormInput.labeledAutocomplete,
  },
  description: {
    props: { name: "description", label: "Description" },
    input: FormInput.textArea,
  },
  strokeThickness: {
    props: {
      name: "stroke-thickness",
      label: "Stroke thickness",
    },
    input: FormInput.labeledSelectOpt,
  },
  search: {
    props: { name: "search", label: "Search" },
    input: FormInput.labeledAutocomplete,
  },
  searchForArea: {
    props: {
      name: "search-for-area",
      label: "Search",
    },
    input: FormInput.labeledSelectOpt,
  },
  adminLevel: {
    props: {
      name: "admin-level",
      label: "Pick level of administration",
    },
    input: FormInput.labeledSelectOpt,
  },
  iconUrl: {
    props: {
      name: "iconUrl",
      label: "Icon URL",
    },
    input: FormInput.labeledText,
  },
  dataFilterKey: {
    props: {
      name: "data-filter-key",
      label: "Pick column",
    },
    input: FormInput.labeledSelectOpt,
  },
  dataFilterValue: {
    props: {
      name: "data-filter-value",
      label: "Pick value",
    },
    input: FormInput.labeledSelectOpt,
  },
  brushSize: {
    props: {
      name: "brush-size",
    },
    input: FormInput.labeledSlider,
  },
  customToleranceValue: {
    props: {
      name: "custom-tolerance",
    },
    input: FormInput.labeledSlider,
  },
  iconAnchor: {
    props: {
      name: "icon-anchor",
    },
    input: FormInput.labeledSlider,
  },
  customToleranceCheck: {
    props: {
      name: "custom-tolerance",
      label:
        "By selecting the option you can custom level of detail for brush strokes",
    },
    input: FormInput.labeledCheckbox,
  },
  changeConnect: {
    props: {
      name: "change-connect",
      label: "By selecting the option marker will be able to create topology",
    },
    input: FormInput.labeledCheckbox,
  },
  intersectActivated: {
    props: {
      name: "intersect-activated",
      label:
        "By selecting the option you can create intersects with selected polygon",
    },
    input: FormInput.labeledCheckbox,
  },
  searchConnect: {
    props: {
      name: "search-connect",
      label:
        "By creating new marker while having this choice selected, you will create path between newly created marker and selected marker or last created marker via Topology tool",
    },
    input: FormInput.labeledCheckbox,
  },
  highQuality: {
    props: {
      name: "high-quality",
      label:
        "By selecting the option displayed polygons will be in higher quality, which however means that some operations will take longer to execute",
    },
    input: FormInput.labeledCheckbox,
  },
};
