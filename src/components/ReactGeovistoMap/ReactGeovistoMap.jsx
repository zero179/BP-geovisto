import React, { Component } from "react";

// Geovisto
import { Geovisto } from "geovisto";

// styles
import '../styles/common.scss';


/**
 * React component which wraps Geovisto map.
 * 
 * @author Jiri Hynek
 */
class ReactGeovistoMap extends Component{
    
    

    /**
     * Initializes object.
     * 
     * @param props 
     */
     constructor(props) {
        super(props);

        if(props.id == undefined) props.id = this.getDefaultId();

        // create new Geovisto map
        this.m = Geovisto.createMap(props);
    }

    /**
     * It returns Geovisto map.
     */
    getMap() {
        return this.m;
    }

    /**
     * It returns a default id used for Geovisto map container.
     */
    getDefaultId() {
        return 'my-geovisto-map';
    }

    /**
     * It returns a default class name used for Geovisto map container.
     */
    getDefaultClass() {
        return 'geovisto-map';
    }

    /**
     * Draw map after component is rendered
     */
    componentDidMount() {
        // draw map with the current config
        this.m.draw(this.props.config ?? Geovisto.getMapConfigManagerFactory().default({}));
    }

    /**
     * Redraw map after component is updated
     */
    componentDidUpdate() {
        // redraw map with a new config and new props
        this.m.redraw(this.props.config ?? Geovisto.getMapConfigManagerFactory().default({}), this.props);
    }

    /**
     * The render function prepares a wrapper which will be used by Geovisto/Leaflet to render the map.
     */
    render() {
        return <div id={this.props.id} className={this.getDefaultClass()} />;
    }
}
export default ReactGeovistoMap;