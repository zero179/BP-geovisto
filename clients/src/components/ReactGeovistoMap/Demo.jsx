// React
import React, { Component } from "react"

// React-Geovisto
import ReactGeovistoMap from './ReactGeovistoMap'

import "./demo.scss"
import {GeovistoTilesLayerTool} from "geovisto-layer-tiles"
import { GeovistoSidebarTool } from 'geovisto-sidebar';
import 'geovisto-sidebar/dist/index.css';
import { GeovistoDrawingLayerTool } from 'geovisto-layer-drawing'
import 'geovisto-layer-drawing/dist/index.css';
// Geovisto Tools
import {CopyBlock, dracula } from "react-code-blocks";
import { Geovisto } from "geovisto"
import PopUp from "./PopUp";

const C_ID_select_data = "leaflet-combined-map-select-data"
const C_ID_check_data = "leaflet-combined-map-check-data"
const C_ID_input_data = "leaflet-combined-map-input-data"
const C_ID_check_config = "leaflet-combined-map-check-config"
const C_ID_input_config = "leaflet-combined-map-input-config"
const C_ID_input_import = "leaflet-combined-map-input-import"
const C_ID_input_export = "leaflet-combined-map-input-export"
const C_ID_get_geojson = "leaflet-combined-map-get-geojson"
const C_ID_get_geojson_from_props = "leaflet-combined-map-get-geojson-from-props"


export class Demo extends Component {
  constructor(props) {
    super(props)
    this.infodata = require("../../static/info/test.md")
    this.infodata2 = require("../../static/info/test2.md")

    this.state = {
      geoJSONString: "",
      config: require("../../static/config/config.json"),
    }
    this.map = React.createRef()
    this.getGeoJson = this.getGeoJson.bind(this);
    this.getGeoJsonFromProps = this.getGeoJsonFromProps.bind(this);
  }

  getMapFromGeojson() {
    //Get the GeoJSON object
    /*
    if (this.map.current) {
      console.log(this.map.current, "aaaa"); // Add this line to check the object in the console
    }
    const geojson = JSON.parse(this.state.geoJSONString);
    //console.log("tu je json", geojson)
    // odkrokovat si
    //console.log(this.map.current,"mmmmmm")
    // Deserialize the GeoJSON and update the map state
    const drawingTool = this.map.current.m.getState().getTools().getById("geovisto-tool-layer-drawing");
    drawingTool.getState().deserializeGeoJSON(geojson);
    */
   // Get the GeoJSON object
   if (this.map.current.m) {
    console.log(this.map.current.m, "aaaa"); // Add this line to check the object in the console
  }
  
  const geojson = JSON.parse(this.state.geoJSONString);
  console.log("GeoJSON:", geojson); // Log the GeoJSON object
  
  if (this.map.current && this.map.current.m) {
    const drawingTool = this.map.current.m.getState().getTools().getById("geovisto-tool-layer-drawing");
    console.log("Drawing tool:", drawingTool); // Log the drawing tool object
    
    if (drawingTool) {
      drawingTool.getState().deserializeGeoJSON(geojson);
    } else {
      console.log("Drawing tool not found.");
    }
  } else {
    console.log("Map or map's 'm' property not found.");
  }

    // Get the map object
    //const map = drawingTool.getMap();
    //console.log("tu je mapa", map)

 
  }

  getGeoJson() {
    // if (this.map.current && this.map.current.m) {
    //   const geoJSON = this.map.current.m.getState().getTools().getById("geovisto-tool-layer-drawing").getState().serializeToGeoJSON();
    //   const geoJSONString = JSON.stringify(geoJSON, null, 4) ?? '';

    //   this.setState({geoJSONString: geoJSONString})

    //   //console.log(geoJSONString)
    //   return geoJSONString;
    // } else {
    //   //console.log("FAIL")
    //   return ""
    // }
    if (this.map.current && this.map.current.m) {
      const drawingTool = this.map.current.m.getState().getTools().getById("geovisto-tool-layer-drawing");
      if (drawingTool) {
        const geoJSON = drawingTool.getState().serializeToGeoJSON();
        const geoJSONString = JSON.stringify(geoJSON, null, 4) ?? '';
  
        console.log("GeoJSON:", geoJSONString); // Log the GeoJSON string
  
        this.setState({ geoJSONString });
      } else {
        console.log("Drawing tool not found.");
      }
    } else {
      console.log("Map or map's 'm' property not found.");
    }
  }


  getGeoJsonFromProps = () => {
    //console.log(this.props, "data su tu");
    const geojson = JSON.parse(this.props.mojeData);
    console.log("hello", geojson, this.map.current.m.getState().getTools().getById("geovisto-tool-layer-drawing"));

    this.map.current.m.getState().getTools().getById("geovisto-tool-layer-drawing").getState().deserializeGeoJSON(geojson);

  
    // Serialize the GeoJSON to a string

    /*this.setState({ geoJSONString }, () => {
      this.getMapFromGeojson();
    });*/
    // // Update the state with the GeoJSON string
    // this.setState({ geoJSONString });
      
    // // Set the data prop of the ReactGeovistoMap component
    
    // // Call the function to display the map
    // this.getMapFromGeojson();
  };


  componentDidMount() {    
   
    // process path
    const pathSubmitted = function(file, result) {
      const reader = new FileReader()
      const onLoadAction = function(e) {
        try {
          console.log(e)
          //console.log(reader.result);
          if (typeof reader.result == "string") {
            result.json = JSON.parse(reader.result)
          }
        } catch (ex) {
          console.log("unable to read file")
          console.log(ex)
        }
      }
      reader.onload = onLoadAction
      reader.readAsText(file)
    }

    // process data path
    const data = {
      json: undefined
    }
    const dataPathSubmitted = function() {
      console.log(this.files)
      if (this.files) {
        pathSubmitted(this.files[0], data)
      }
    }
    document
      .getElementById(C_ID_input_data)
      ?.addEventListener("change", dataPathSubmitted, false)

    // process config path
    const config = {
      json: undefined
    }
    const configPathSubmitted = function() {
      console.log(this.files)
      if (this.files) {
        pathSubmitted(this.files[0], config)
      }
    }
    document
      .getElementById(C_ID_input_config)
      ?.addEventListener("change", configPathSubmitted, false)

    // import action
    const importAction = e => {
      console.log(e)
      console.log("data: ", data)
      console.log("config: ", config)

      // process data json
      if (
        !document.getElementById(C_ID_check_data).checked ||
        data.json === undefined
      ) {
        const fileName = document.getElementById(C_ID_select_data).value
        console.log(fileName)
        data.json = require("../../static/data/" + fileName)
      }

      // process config json
      if (
        !document.getElementById(C_ID_check_config).checked ||
        config.json === undefined
      ) {
        config.json = require("../../static/config/config.json")
      }

      // update state
      this.setState({
        data: data.json,
        config: config.json
      })
    }
    document
      .getElementById(C_ID_input_import)
      ?.addEventListener("click", importAction)
    
    // get geojson after click on button
    const pressGeo = document.getElementById(C_ID_get_geojson);
  
    if (pressGeo) {
      pressGeo.addEventListener('click', this.getGeoJson);
    }

    // const pressGeoFromProp = document.getElementById(C_ID_get_geojson_from_props);
    
    // if (pressGeoFromProp) {
    //   pressGeoFromProp.addEventListener('click', this.getGeoJsonFromProps);
    // }


    const pressGeoFromProp = document.getElementById(C_ID_get_geojson_from_props);

    if (pressGeoFromProp) {
      pressGeoFromProp.addEventListener('click', this.getGeoJsonFromProps);
    }
  
    // export action
    const exportAction = e => {
      console.log(e)

      // export map configuration
      const config = JSON.stringify(
        this.map.current?.getMap().export(),
        null,
        2
      )

      // download file
      const element = document.createElement("a")
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(config)
      )
      element.setAttribute("download", "config.json")
      element.style.display = "none"
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      console.log("rendered map:")
    }
    document
      .getElementById(C_ID_input_export)
      ?.addEventListener("click", exportAction)
  }

  render() {
    console.log("rendering...")
    console.log("nebol")
    return (
      <div className="demo-container">
        <div className="demo-toolbar">
          <input id={C_ID_input_import} type="submit" value="import" />
          <input id={C_ID_input_export} type="submit" value="export" />
          <input id={C_ID_get_geojson} type="submit" value="get" />
          <input id={C_ID_get_geojson_from_props} type="submit" value="get geojson from props" onClick={this.getGeoJsonFromProps}/>
          <PopUp content={this.state.geoJSONString}/>
        </div>
        <div className="demo">
          <div className="code">
      
            <CopyBlock
              text={this.state.geoJSONString}
              language="json"
              showLineNumbers
              codeBlock
              theme={dracula}
              
            />
          </div>
          <div className="demo-map">
            <ReactGeovistoMap
              ref={this.map}
              id="my-geovisto-map"
              data={Geovisto.getMapDataManagerFactory().json(this.state.data)}
             
              config={Geovisto.getMapConfigManagerFactory().default(
                this.state.config
              )}
              globals={undefined}
              templates={undefined}
              tools={Geovisto.createMapToolsManager([
                GeovistoSidebarTool.createTool({
                  id: "geovisto-tool-sidebar",
              }),
                GeovistoTilesLayerTool.createTool({
                  id: "geovisto-tool-layer-map"
                }),
                GeovistoDrawingLayerTool.createTool({
                  id: "geovisto-tool-layer-drawing",
              }),
              ])}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default {
  title: "Demo",
  component: Demo
}

export const GeovistoMap = () => <Demo />
