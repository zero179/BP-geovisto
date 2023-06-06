

import { 
    AbstractMapFormInput,
    IMapFormInput,
    IMapFormInputProps,
    MapFormInputFactory
} from "geovisto";

import { SelectOpt } from "../util/constants";

const ID = "geovisto-input-select-drawing";

export interface IDrawingSelectFormInputProps extends IMapFormInputProps {
    onChangeAction: ((this: GlobalEventHandlers, ev: Event) => unknown) | null;
    options: string[] | SelectOpt[];
}

export interface DrawingILabeledSelectFormInputProps extends IDrawingSelectFormInputProps {
    label: string;
}

export class DrawingMapFormInputFactory extends MapFormInputFactory {
    
    /**
     * It creates the select form input.
     */
     public selectOpt(props: IDrawingSelectFormInputProps): IMapFormInput {
        return new DrawingSelectFormInput(props);
    }

    /**
     * It creates the labeled select form input.
     */
     public labeledSelectOpt(props: DrawingILabeledSelectFormInputProps): IMapFormInput {
        return new DrawingSelectFormInput(props);
    }
}

/**
 * This class represents a basic select form input composed of options.
 * 
 * @author Jiri Hynek
 * @author Anfrej Tlcina
 */
class DrawingSelectFormInput extends AbstractMapFormInput {
    
    /**
     * the input element is initialized when required
     */
    private element?: HTMLSelectElement;

    public constructor(props: IDrawingSelectFormInputProps) {
        super(props);
    }
    
    /**
     * Static function returns identifier of the input type
     */
    public static ID(): string {
        return ID;
    }

    /**
     * It returns select element.
     */
    public create(): HTMLElement {
        if(this.element == undefined) {
            const props = (<IDrawingSelectFormInputProps> this.getProps());
            // create select element
            this.element = document.createElement('select');
            this.element.onchange = props.onChangeAction;
            // append options
            let option: HTMLOptionElement;
            const options: string[] | SelectOpt[] = props.options;
            for (let i = 0; i < options.length; i++) {
              option = this.element.appendChild(
                document.createElement("option")
              );
              if (typeof options[i] === "object" && options[i] !== null) {
                const opt = options[i] as SelectOpt;
                option.setAttribute("value", String(opt.value));
                option.innerHTML = opt.label;
                option.selected = Boolean(opt.selected);
              } else {
                const opt = options[i] as string;
                option.setAttribute("value", opt);
                option.innerHTML = opt;
              }
            }
        }
        return this.element;
    }

    /**
     * It returns value of the select element.
     */
    public getValue(): string {
        return this.element ? this.element.value : "";
    }

    /**
     * It sets value of the select element.
     * 
     * @param value 
     */
    public setValue(value: string): void {
        if(this.element) {
            this.element.value = value;
        }
    }

    /*
     * Sets/removes attribute 'disabled' from input box.
     */
    public setDisabled(disabled: boolean): void {
        if(this.element) {
            if(disabled == true) {
                this.element.setAttribute("disabled", "true");            
            } else {
                this.element.removeAttribute("disabled");
            }
        }
    }
}
export default DrawingSelectFormInput;