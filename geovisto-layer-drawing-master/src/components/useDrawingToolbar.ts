import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";

import "../style/drawingLayer.scss";
import { EditTool, TransformTool } from "../tools";
import { Tool } from "../model/types";
import { DrawingBtns, Options } from "../model/types/sidebar/DrawingToolbar";

/**
 * @author Andrej Tlcina
 */
export default function useDrawingToolbar(): void {
  const DrawingToolbar = L.Control.extend({
    options: {
      position: "topleft",
      drawingBtns: {},
      map: undefined,
      tool: null,
      selectedTool: null,
    } as Options,
    /**
     * runs whenever you create instance
     *
     * @param {Object} options
     */
    initialize: function (options: Options) {
      if (options) {
        L.Util.setOptions(this, options);
      }
    },
    /**
     * runs whenever control is being added
     */
    onAdd: function (map: L.Map) {
      this.options.map = map;
      return this.createUi();
    },
    /**
     * creates toolbar with multiple buttons
     */
    createUi: function () {
      const topContainer = L.DomUtil.create("div", "drawingtoolbar");
      const toolContainer: HTMLDivElement = L.DomUtil.create(
        "div",
        "leaflet-bar leaflet-control",
        topContainer
      ) as HTMLDivElement;
      toolContainer.style.cursor = "pointer";
      const cancelables: HTMLAnchorElement[] = [];

      const toggleHideBtnVisibility = (e: Event) => {
        cancelables.forEach((btn) =>
          btn?.lastElementChild?.classList?.add("hide")
        );
        let hideBtn = (e?.target as HTMLElement)?.lastChild as HTMLElement;
        // * if there is no last child we must've clicked the 'outside' the icon
        if (!hideBtn)
          hideBtn = (e?.target as HTMLElement)?.nextSibling as HTMLElement;
        // * careful not to hide the icon
        if (hideBtn?.tagName === "I") return;
        if (hideBtn) {
          // console.log({ hideBtn });
          hideBtn.classList.toggle("hide");
        }
      };

      const drawingTools = this.options.tool?.drawingTools || {};

      const handleClick = (e: Event, tool: Tool) => {
        const selectedEl = this.getSelectedLayer();
        // * functions are called so user is not drawing over object that has transform handles
        if (tool.getName() !== "transform-drawing-tool") {
          if (selectedEl) TransformTool.disableTransform(selectedEl);
        }
        if (tool.getName() !== "edit-drawing-tool") {
          if (selectedEl) EditTool.disableNodeEdit(selectedEl);
        }
        // * disable previous tool
        this.options.selectedTool?.deactivate();
        toggleHideBtnVisibility(e);

        // * enable currently selected tool
        tool.activate();
        this.options.selectedTool = tool;
      };

      Object.keys(drawingTools).forEach((key) => {
        const tool: Tool = drawingTools[key];
        const canBeCanceled = tool.canBeCanceled();

        const btn = this.createToolbarBtn(
          tool.getName(),
          toolContainer,
          tool.getTitle(),
          tool.getIconName(),
          canBeCanceled
        );

        if (canBeCanceled) cancelables.push(btn as HTMLAnchorElement);

        L.DomEvent.on(btn, "click", (e) => handleClick(e, tool), this);

        (this.options.drawingBtns as DrawingBtns)[key] = btn as HTMLAnchorElement;
      });

      L.DomEvent.disableClickPropagation(topContainer);
      return topContainer;
    },

    /**
     * creates toolbar button
     */
    createToolbarBtn: function (
      className: string,
      btnContainer: HTMLDivElement,
      title: string,
      icon: string,
      extra = false
    ) {
      const returnBtn = L.DomUtil.create(
        "a",
        `${className} d-side-button`,
        btnContainer
      );
      returnBtn.title = title;
      returnBtn.innerHTML = `<i class="${icon}" aria-hidden="true"></i>`;
      if (extra) {
        const extraBtn = L.DomUtil.create("a", "extra-btn hide", returnBtn);
        extraBtn.innerHTML = `Cancel`;
      }
      return returnBtn;
    },

    /**
     *
     * @returns currently selected geo. object
     */
    getSelectedLayer: function () {
      return this.options.tool?.getState()?.selectedLayer;
    },
  });

  (L.control.drawingToolbar as any) = function (options?: Options) {
    if (!options) {
      options = {} as Options;
    }
    return new DrawingToolbar(options);
  };
}
