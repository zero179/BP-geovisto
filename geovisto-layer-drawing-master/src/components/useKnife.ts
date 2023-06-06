import L, { DrawMap, DrawOptions } from "leaflet";
import "leaflet-draw";
import { LooseObject } from "../model/types";

/**
 * @author Andrej Tlcina
 */

declare module "leaflet" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Draw {
    class Slice extends Polyline {
      public constructor(map: Map, params: LooseObject);
    }
  }
}

/**
 * extends polyline, it does not change a lot just its type to 'knife'
 */
L.Draw.Slice = L.Draw.Polyline.extend({
  statics: {
    TYPE: "knife",
  },
  // @method initialize(): void
  initialize: function (map: DrawMap, options: DrawOptions.PolylineOptions) {
    // if touch, switch to touch icon
    if (L.Browser.touch) {
      this.options.icon = this.options.touchIcon;
    }

    // Need to set this here to ensure the correct message is used.
    this.options.drawError.message = L.drawLocal.draw.handlers.polyline.error;

    // Merge default drawError options with custom options
    if (options && options.drawError) {
      options.drawError = L.Util.extend(
        {},
        this.options.drawError,
        options.drawError
      );
    }

    // Save the type so super can fire, need to do this as cannot do this.TYPE :(
    this.type = (L.Draw.Slice as any).TYPE;

    L.Draw.Feature.prototype.initialize.call(this, map, options);
  },
  _calculateFinishDistance: function (potentialLatLng: any) {
    let lastPtDistance;
    if (this._markers.length > 0) {
      let finishMarker;
      if (
        this.type === (L.Draw.Polyline as any).TYPE ||
        this.type === (L.Draw.Slice as any).TYPE
      ) {
        finishMarker = this._markers[this._markers.length - 1];
      } else if (this.type === (L.Draw.Polygon as any).TYPE) {
        finishMarker = this._markers[0];
      } else {
        return Infinity;
      }
      const lastMarkerPoint = this._map.latLngToContainerPoint(
          finishMarker.getLatLng()
        ),
        potentialMarker = new L.Marker(potentialLatLng, {
          icon: this.options.icon,
          zIndexOffset: this.options.zIndexOffset * 2,
        });
      const potentialMarkerPint = this._map.latLngToContainerPoint(
        potentialMarker.getLatLng()
      );
      lastPtDistance = lastMarkerPoint.distanceTo(potentialMarkerPint);
    } else {
      lastPtDistance = Infinity;
    }
    return lastPtDistance;
  },
});
