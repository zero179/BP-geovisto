import { AbstractMapFormInput, IMapFormInput, IMapFormInputProps, MapFormInputFactory } from "geovisto";
import { SelectOpt } from "../util/constants";
export interface IDrawingSelectFormInputProps extends IMapFormInputProps {
    onChangeAction: ((this: GlobalEventHandlers, ev: Event) => unknown) | null;
    options: string[] | SelectOpt[];
}
export interface DrawingILabeledSelectFormInputProps extends IDrawingSelectFormInputProps {
    label: string;
}
export declare class DrawingMapFormInputFactory extends MapFormInputFactory {
    /**
     * It creates the select form input.
     */
    selectOpt(props: IDrawingSelectFormInputProps): IMapFormInput;
    /**
     * It creates the labeled select form input.
     */
    labeledSelectOpt(props: DrawingILabeledSelectFormInputProps): IMapFormInput;
}
/**
 * This class represents a basic select form input composed of options.
 *
 * @author Jiri Hynek
 * @author Anfrej Tlcina
 */
declare class DrawingSelectFormInput extends AbstractMapFormInput {
    /**
     * the input element is initialized when required
     */
    private element?;
    constructor(props: IDrawingSelectFormInputProps);
    /**
     * Static function returns identifier of the input type
     */
    static ID(): string;
    /**
     * It returns select element.
     */
    create(): HTMLElement;
    /**
     * It returns value of the select element.
     */
    getValue(): string;
    /**
     * It sets value of the select element.
     *
     * @param value
     */
    setValue(value: string): void;
    setDisabled(disabled: boolean): void;
}
export default DrawingSelectFormInput;
