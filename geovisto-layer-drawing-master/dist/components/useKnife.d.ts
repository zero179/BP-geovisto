import "leaflet-draw";
import { LooseObject } from "../model/types";
/**
 * @author Andrej Tlcina
 */
declare module "leaflet" {
    namespace Draw {
        class Slice extends Polyline {
            constructor(map: Map, params: LooseObject);
        }
    }
}
