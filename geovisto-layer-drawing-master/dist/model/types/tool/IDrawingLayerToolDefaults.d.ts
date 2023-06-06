import { ILayerToolDefaults, IMapFormInput } from "geovisto";
type InputName = "idKey" | "identifier" | "description" | "strokeThickness" | "search" | "searchForArea" | "adminLevel" | "iconUrl" | "dataFilterKey" | "dataFilterValue" | "brushSize" | "customToleranceValue" | "iconAnchor" | "customToleranceCheck" | "changeConnect" | "intersectActivated" | "searchConnect" | "highQuality";
export type MappingModel = {
    [key in InputName]: {
        props: {
            name: string;
            label?: string;
        };
        input: (props: any) => IMapFormInput;
    };
};
/**
 * This interface provides functions which return the default state values.
 *
 * @author Jiri Hynek
 */
interface IDrawingLayerToolDefaults extends ILayerToolDefaults {
    getType(): string;
    getLayerName(): string;
    getLabel(): string;
    getIcon(): string;
}
export default IDrawingLayerToolDefaults;
