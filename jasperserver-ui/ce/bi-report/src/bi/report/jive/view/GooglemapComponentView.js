/*
 * Copyright (C) 2005 - 2022 TIBCO Software Inc. All rights reserved. Confidentiality & Proprietary.
 * Licensed pursuant to commercial TIBCO End User License Agreement.
 */


/**
 * @author: Narcis Marcu
 * @version: $Id$
 */

/* global google, markerClusterer, OverlappingMarkerSpiderfier */

import BaseJiveComponentView from './BaseJiveComponentView';
import {loadJsonp} from '../../loader/jsonpLoader';
import {loadScript} from "../../loader/scriptLoader";
import logger from "js-sdk/src/common/logging/logger";

let log = logger.register("GooglemapComponentView");

let loadGoogleMapsPromise = null;
let loadMarkerClustererPromise = null;
let loadMarkerSpideringPromise = null;

export default BaseJiveComponentView.extend({
    render: function ($el) {
        this.$reportEl = $el;
        this.infowindow = null;
        this._init();
    },
    _init: function () {
        const instData = this.model.get('instanceData'),
            useMarkerClustering = instData.useMarkerClustering,
            useMarkerSpidering = instData.useMarkerSpidering;

        let reqParams = instData.requestParams || '';
        if (reqParams[0] === '&') {
            reqParams = reqParams.substring(1);
        }

        // try to load the Google Maps API once, otherwise conflicts will happen
        const googleMapsLoaded = this._getGoogleMapsLoadedPromise(reqParams);

        // try to load the Marker Clusterer API once
        const markerClustererLoaded = this._getMarkerClustererLoadedPromise(useMarkerClustering);

        //try to load the OverlappingMarkerSpiderfier API once
        const markerSpideringLoaded = this._getMarkerSpideringLoadedPromise(useMarkerSpidering);

        Promise.all([googleMapsLoaded, markerClustererLoaded, markerSpideringLoaded])
            .then(() => {
                this._showMap(
                    this.model.get('id'),
                    instData.latitude,
                    instData.longitude,
                    instData.zoom,
                    instData.mapType,
                    instData.markerList,
                    instData.pathsList,
                    useMarkerClustering,
                    useMarkerSpidering,
                    instData.defaultMarkerIcon,
                    instData.legendProperties,
                    instData.resetMapProperties
                );
            })
            .catch(e => {
                log.error(e);
            });
    },
    _getGoogleMapsLoadedPromise: function(reqParams) {
        return new Promise((resolve, reject) => {
            if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
                if (!loadGoogleMapsPromise) {
                    loadGoogleMapsPromise = loadJsonp(`//maps.google.com/maps/api/js?${reqParams}`, 'callback');
                }
                loadGoogleMapsPromise
                    .then(resolve)
                    .catch(reject);
            } else {
                resolve();
            }
        });
    },
    _getMarkerClustererLoadedPromise: function(useMarkerClustering) {
        return new Promise((resolve, reject) => {
            if (useMarkerClustering && typeof markerClusterer === 'undefined') {
                if (!loadMarkerClustererPromise) {
                    loadMarkerClustererPromise = loadScript(
                        'https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js',
                        {scriptProps: {async: true}});
                }
                loadMarkerClustererPromise
                    .then(resolve)
                    .catch(reject);
            } else {
                resolve();
            }
        });
    },
    _getMarkerSpideringLoadedPromise: function(useMarkerSpidering) {
        return new Promise((resolve, reject) => {
            if (useMarkerSpidering && typeof OverlappingMarkerSpiderfier === 'undefined') {
                if (!loadMarkerSpideringPromise) {
                    loadMarkerSpideringPromise = loadScript(
                        'https://cdnjs.cloudflare.com/ajax/libs/OverlappingMarkerSpiderfier/1.0.3/oms.min.js',
                        {scriptProps: {async: true}});
                }
                loadMarkerSpideringPromise
                    .then(resolve)
                    .catch(reject);
            } else {
                resolve();
            }
        });
    },
    _configureImage: function (parentKey, parentProps, parentOptions) {
        var width, height, originX, originY, anchorX, anchorY, pp = parentProps, pk = parentKey;

        width = pp[pk + '.width'] ? parseInt(pp[pk + '.width']) : null;
        height = pp[pk + '.height'] ? parseInt(pp[pk + '.height']) : null;

        originX = pp[pk + '.origin.x'] ? parseInt(pp[pk + '.origin.x']) : 0;
        originY = pp[pk + '.origin.y'] ? parseInt(pp[pk + '.origin.y']) : 0;

        anchorX = pp[pk + '.anchor.x'] ? parseInt(pp[pk + '.anchor.x']) : 0;
        anchorY = pp[pk + '.anchor.y'] ? parseInt(pp[pk + '.anchor.y']) : 0;

        parentOptions[pk] = {
            url: pp[pk + '.url'],
            size: width && height ? new google.maps.Size(width, height) : null,
            origin: new google.maps.Point(originX, originY),
            anchor: new google.maps.Point(anchorX, anchorY)
        };
    },
    _createInfo: function (parentProps) {
        var pp = parentProps;
        if (pp['infowindow.content'] && pp['infowindow.content'].length > 0) {
            var gg = google.maps,
                po = {
                    content: pp['infowindow.content']
                };
            if (pp['infowindow.pixelOffset']) po['pixelOffset'] = pp['infowindow.pixelOffset'];
            if (pp['infowindow.latitude'] && pp['infowindow.longitude']) po['position'] = new gg.LatLng(pp['infowindow.latitude'], pp['infowindow.longitude']);
            if (pp['infowindow.maxWidth']) po['maxWidth'] = pp['infowindow.maxWidth'];
            return new gg.InfoWindow(po);
        }
        return null;
    },
    _placeMarkers: function (markers, map, isForExport, useMarkerSpidering) {
        var markerArr = [];
        if (markers) {
            var self = this, j;
            for (var i = 0; i < markers.length; i++) {
                var markerProps = markers[i];
                var markerLatLng = new google.maps.LatLng(markerProps['latitude'], markerProps['longitude']);
                var markerOptions = {
                    position: markerLatLng
                };

                // for spidering, do not link marker to map directly
                if (!useMarkerSpidering) {
                    markerOptions.map = map;
                }

                if (markerProps['icon.url'] && markerProps['icon.url'].length > 0) this._configureImage('icon', markerProps, markerOptions);
                else if (markerProps['icon'] && markerProps['icon'].length > 0) markerOptions['icon'] = markerProps['icon'];
                else if (markerProps['color'] && markerProps['color'].length > 0) {
                    markerOptions['icon'] = 'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%7C' + markerProps['color'];
                }
                if (markerProps['shadow.url'] && markerProps['shadow.url'].length > 0) this._configureImage('shadow', markerProps, markerOptions);
                else if (markerProps['shadow'] && markerProps['shadow'].length > 0) markerOptions['shadow'] = markerProps['shadow'];
                for (j in markerProps) {
                    if (j.indexOf(".") < 0 && markerProps.hasOwnProperty(j) && !markerOptions.hasOwnProperty(j)) markerOptions[j] = markerProps[j];
                }
                var marker = new google.maps.Marker(markerOptions);

                // when in export mode, do not add unnecessary listener
                if (!isForExport) {
                    marker['info'] = this._createInfo(markerProps);
                    var clickEvent = useMarkerSpidering ? 'spider_click' : 'click';
                    google.maps.event.addListener(marker, clickEvent, function () {
                        if (map.autocloseinfo && self.infowindow) self.infowindow.close();
                        if (this['info']) {
                            self.infowindow = this['info'];
                            this['info'].open(map, this);
                        } else if (this['url'] && this['url'].length > 0) {
                            window.open(this['url'], this['target']);
                        }
                    });
                }
                markerArr.push(marker);
            }
        }

        return markerArr;
    },
    _drawPaths: function (paths, map, isForExport) {
        if (paths) {
            for (var k = 0; k < paths.length; k++) {
                var props = paths[k], o = {}, l = [], isPoly = false;
                var poly, prop;
                for (prop in props) {
                    if (prop === 'locations' && props[prop]) {
                        var loc = props[prop];
                        for (var j = 0; j < loc.length; j++) {
                            var latln = loc[j];
                            l.push(new google.maps.LatLng(latln['latitude'], latln['longitude']));
                        }
                    } else if (prop === 'isPolygon') {
                        isPoly = this._getBooleanValue(props[prop]);
                    } else if (prop === 'visible' || prop === 'editable' || prop === 'clickable' || prop === 'draggable' || prop === 'geodesic') {
                        o[prop] = this._getBooleanValue(props[prop]);
                    } else {
                        o[prop] = props[prop];
                    }
                }
                o['map'] = map;
                if (isPoly) {
                    o['paths'] = l;
                    poly = new google.maps.Polygon(o);
                } else {
                    o['path'] = l;
                    poly = new google.maps.Polyline(o);
                }

                // when in export mode, do not add unnecessary listener
                if (!isForExport) {
                    if (o['path.hyperlink']) {
                        google.maps.event.addListener(poly, 'click', function () {
                            window.open(this['path.hyperlink'], this['path.hyperlink.target'])
                        });
                    }
                }
            }
        }
    },
    _placeSeriesMarkers: function(map, markerSeries, isForExport, globalUseMarkerSpidering) {
        var markerSeriesNames = this._getObjectKeys(markerSeries),
            markerSeriesConfigBySeriesName = {}, i, ln, seriesName;

        for (i = 0, ln = markerSeriesNames.length; i < ln; i++) {
            seriesName = markerSeriesNames[i];
            var seriesConfig = markerSeries[seriesName];
            var useMarkerSpidering = seriesConfig.markerSpidering != null ? seriesConfig.markerSpidering : globalUseMarkerSpidering;

            var useMarkerClustering = null;
            if (seriesConfig.markerClustering != null) {
                if (seriesConfig.markerClustering === true || seriesConfig.markerClustering === "true") {
                    useMarkerClustering = true;
                }
                if (seriesConfig.markerClustering === false || seriesConfig.markerClustering === "false") {
                    useMarkerClustering = false;
                }
            }

            markerSeriesConfigBySeriesName[seriesName] = {
                useMarkerSpidering: useMarkerSpidering,
                useMarkerClustering: useMarkerClustering,
                legendIcon: seriesConfig.legendIcon,
                googleMarkers: this._placeMarkers(seriesConfig.markers, map, isForExport, useMarkerSpidering)
            };
        }

        return markerSeriesConfigBySeriesName;
    },
    _enableSpidering: function(map, markerSeriesConfigBySeriesName) {
        var markerSeriesNames = this._getObjectKeys(markerSeriesConfigBySeriesName),
            i, j, seriesName, markerSeriesConfig, oms = null;
        for (i = 0; i < markerSeriesNames.length; i++) {
            seriesName = markerSeriesNames[i];
            markerSeriesConfig = markerSeriesConfigBySeriesName[seriesName];
            if (markerSeriesConfig.useMarkerSpidering) {
                if (oms === null) {
                    oms = new OverlappingMarkerSpiderfier(map, {
                        markersWontMove: true,
                        markersWontHide: true,
                        basicFormatEvents: true,
                        keepSpiderfied: true
                    });
                }
                for (j = 0; j < markerSeriesConfig.googleMarkers.length; j++) {
                    oms.addMarker(markerSeriesConfig.googleMarkers[j]);
                }
            }
        }

        return oms;
    },
    _enableClustering: function(map, markerSeriesConfigBySeriesName, globalUseMarkerClustering) {
        var markerSeriesNames = this._getObjectKeys(markerSeriesConfigBySeriesName),
            markerClustersBySeriesName = {},
            globalClusterMarkers = [],
            globalClusterSeries = [],
            i, ln, seriesName, markerSeriesConfig;
        for (i = 0, ln = markerSeriesNames.length; i < ln; i++) {
            seriesName = markerSeriesNames[i];
            markerSeriesConfig = markerSeriesConfigBySeriesName[seriesName];

            if (markerSeriesConfig.useMarkerClustering === null && globalUseMarkerClustering) {
                this._extendArray(globalClusterMarkers, markerSeriesConfig.googleMarkers);
                globalClusterSeries.push(seriesName);
            } else if (markerSeriesConfig.useMarkerClustering) {
                markerClustersBySeriesName[seriesName] = new markerClusterer.MarkerClusterer({
                    map: map,
                    markers: markerSeriesConfig.googleMarkers
                });
            }
        }

        if (globalClusterMarkers.length) {
            var globalCluster = new markerClusterer.MarkerClusterer({
                map: map,
                markers: globalClusterMarkers
            });
            for (i = 0, ln = globalClusterSeries.length; i < ln; i++) {
                seriesName = globalClusterSeries[i];
                markerClustersBySeriesName[seriesName] = globalCluster;
            }
        }

        return markerClustersBySeriesName;
    },
    _drawLegend: function(legendProperties, map, mapCanvasId, markerSeriesConfigBySeriesName,
        markerClustersBySeriesName, overlappingMarkerSpiderfier, defaultMarkerIcon, isForExport) {
        if (this._getBooleanValue(legendProperties["enabled"])) {
            var legendLabel = legendProperties["label"] || "Legend",
                legendPosition = legendProperties["position"] || "RIGHT_CENTER",
                legendOrientation = legendProperties["orientation"] || "vertical",
                legendMaxWidth = legendProperties["legendMaxWidth"] || "100px",
                legendMaxWidthFullscreen = legendProperties["legendMaxWidth.fullscreen"] || "150px",
                legendMaxHeight = legendProperties["legendMaxHeight"] || "150px",
                legendMaxHeightFullscreen = legendProperties["legendMaxHeight.fullscreen"] || "300px",
                legendUseMarkerIcons = legendProperties["useMarkerIcons"] == null
                    ? true : this._getBooleanValue(legendProperties["useMarkerIcons"]);


            var legendElement = document.getElementById(mapCanvasId + "_legend");
            var titleContainer = document.createElement("div");
            titleContainer.style.display = "flex";
            titleContainer.style.alignItems = "center";

            var titleElement = document.createElement("h3");
            titleElement.insertAdjacentText("beforeend", legendLabel);

            titleContainer.insertAdjacentElement("beforeend", titleElement);
            legendElement.insertAdjacentElement("beforeend", titleContainer);

            function showHideGoogleMarkers(markerArr, action) {
                var actionMap = action === "show" ? map : null;
                for (var i = 0; i < markerArr.length; i++) {
                    markerArr[i].setMap(actionMap);
                }
            }

            var seriesToggleButton, i, ln, seriesName;
            var markerSeriesNames = this._getObjectKeys(markerSeriesConfigBySeriesName);

            var seriesMarkersWrapper = document.createElement("div");
            seriesMarkersWrapper.style.display = "flex";

            for (i = 0, ln = markerSeriesNames.length; i < ln; i++) {
                seriesName = markerSeriesNames[i];
                seriesToggleButton = document.createElement("button");
                seriesToggleButton.textContent = seriesName;
                seriesToggleButton.type = "button";
                seriesToggleButton.style.backgroundColor = "#fff";
                seriesToggleButton.style.border = "2px solid #fff";
                seriesToggleButton.style.fontFamily = "Roboto,Arial,sans-serif";
                seriesToggleButton.style.fontSize = "12px";
                seriesToggleButton.style.verticalAlign = "top";
                seriesToggleButton.style.cursor = "pointer";

                (function (nameOfSeries) {
                    seriesToggleButton.addEventListener("click", function (event) {
                        var i, markerSeriesConfig = markerSeriesConfigBySeriesName[nameOfSeries];
                        if (markerSeriesConfig.action == null || markerSeriesConfig.action === "show") {
                            markerSeriesConfig.action = "hide";
                        } else {
                            markerSeriesConfig.action = "show";
                        }

                        // show/hide google markers
                        showHideGoogleMarkers(markerSeriesConfig.googleMarkers, markerSeriesConfig.action);

                        // if there is a cluster for the series, add/remove the markers from cluster
                        if (markerClustersBySeriesName[nameOfSeries]) {
                            if (markerSeriesConfig.action === "hide") {
                                markerClustersBySeriesName[nameOfSeries].removeMarkers(markerSeriesConfig.googleMarkers, false);
                            } else {
                                markerClustersBySeriesName[nameOfSeries].addMarkers(markerSeriesConfig.googleMarkers, false);
                            }
                        }

                        // if spidering is enabled for the series, add/remove the markers from spiderfier
                        if (overlappingMarkerSpiderfier != null && markerSeriesConfig.useMarkerSpidering) {
                            if (markerSeriesConfig.action === "hide") {
                                for (i = 0; i < markerSeriesConfig.googleMarkers.length; i++) {
                                    overlappingMarkerSpiderfier.forgetMarker(markerSeriesConfig.googleMarkers[i]);
                                }
                            } else {
                                for (i = 0; i < markerSeriesConfig.googleMarkers.length; i++) {
                                    overlappingMarkerSpiderfier.trackMarker(markerSeriesConfig.googleMarkers[i]);
                                }
                            }
                        }

                        if (markerSeriesConfig.action === "hide") {
                            event.currentTarget.style.color = "#d8d8d8";
                        } else {
                            event.currentTarget.style.color = "#000";
                        }
                    });
                }(seriesName));

                var divWrapper = document.createElement("div");
                divWrapper.style.display = "flex";
                divWrapper.style.alignItems = "flex-start";

                if (legendUseMarkerIcons) {
                    var legendMarkerIcon = markerSeriesConfigBySeriesName[seriesName].legendIcon;
                    if (!legendMarkerIcon) {
                        legendMarkerIcon = markerSeriesConfigBySeriesName[seriesName].googleMarkers[0].getIcon();
                    }
                    if (!legendMarkerIcon) {
                        legendMarkerIcon = defaultMarkerIcon;
                    }

                    if (legendMarkerIcon) {
                        var markerImage = document.createElement("img");
                        markerImage.src = legendMarkerIcon;
                        markerImage.style.width = "16px";
                        markerImage.style.marginBottom = "5px";

                        divWrapper.insertAdjacentElement("beforeend", markerImage);
                    }
                }

                divWrapper.insertAdjacentElement("beforeend", seriesToggleButton);

                seriesMarkersWrapper.insertAdjacentElement("beforeend", divWrapper);
            }

            if (legendOrientation === "horizontal") {
                titleContainer.style.marginRight = "20px";
                legendElement.style.flexDirection = "row";
                seriesMarkersWrapper.style.flexDirection = "row";
                seriesMarkersWrapper.style.alignItems = "center";
            } else {
                titleContainer.style.marginRight = "0";
                legendElement.style.flexDirection = "column";
                seriesMarkersWrapper.style.flexDirection = "column";
                seriesMarkersWrapper.style.alignItems = "flex-start";
            }

            if (legendPosition.indexOf("BOTTOM") !== -1) {
                legendElement.style.marginBottom = "24px";
            } else {
                legendElement.style.marginBottom = "10px";
            }

            seriesMarkersWrapper.style.overflow = "auto";
            legendElement.insertAdjacentElement("beforeend", seriesMarkersWrapper);

            // apply max width/height to legend
            legendElement.style.maxWidth = legendMaxWidth;
            legendElement.style.maxHeight = legendMaxHeight;

            !isForExport && google.maps.event.addListener(map, "bounds_changed", function () {
                // detect fullscreen
                if (map.getDiv().firstChild.clientHeight === window.innerHeight) { // fullscreen
                    legendElement.style.maxWidth = legendMaxWidthFullscreen;
                    legendElement.style.maxHeight = legendMaxHeightFullscreen;
                } else { // not fullscreen
                    legendElement.style.maxWidth = legendMaxWidth;
                    legendElement.style.maxHeight = legendMaxHeight;
                }
            });

            map.controls[google.maps.ControlPosition[legendPosition]].push(legendElement);
        }
    },
    _drawResetMap: function(resetMapProperties, map, latitude, longitude, zoom) {
        if (this._getBooleanValue(resetMapProperties["enabled"])) {
            var resetMapButton = document.createElement("button");
            resetMapButton.textContent = resetMapProperties["label"] || "Reset map";
            resetMapButton.type = "button";
            resetMapButton.style.backgroundColor = "#fff";
            resetMapButton.style.border = "2px solid #fff";
            resetMapButton.style.fontFamily = "Roboto,Arial,sans-serif";
            resetMapButton.style.fontSize = "12px";
            resetMapButton.style.margin = "10px";
            resetMapButton.style.borderRadius = "2px";
            resetMapButton.style.cursor = "pointer";

            resetMapButton.addEventListener("click", function () {
                map.setCenter({lat: latitude, lng: longitude});
                map.setZoom(zoom);
            });

            var controlPosition = resetMapProperties["position"] || "RIGHT_TOP";
            map.controls[google.maps.ControlPosition[controlPosition]].push(resetMapButton);
        }
    },
    _showMap: function (canvasId, latitude, longitude, zoom, mapType, markerList, pathsList,
        useMarkerClustering, useMarkerSpidering, defaultMarkerIcon, legendProperties, resetMapProperties) {
        var mapOptions = {
                zoom: zoom,
                center: new google.maps.LatLng(latitude, longitude),
                mapTypeId: google.maps.MapTypeId[mapType],
                autocloseinfo: true
            },
            container = this.$reportEl.find("#" + canvasId),
            map = new google.maps.Map(container[0], mapOptions);

        container.attr("js-stdnav", "false");

        var markerSeriesConfigBySeriesName = this._placeSeriesMarkers(map, markerList, false, useMarkerSpidering);

        // enable marker spidering only for the configured series
        var overlappingMarkerSpiderfier = this._enableSpidering(map, markerSeriesConfigBySeriesName);

        // enable marker clustering globally and/or per series
        var markerClustersBySeriesName = this._enableClustering(map, markerSeriesConfigBySeriesName, useMarkerClustering);

        // draw marker legend
        this._drawLegend(legendProperties, map, canvasId, markerSeriesConfigBySeriesName, markerClustersBySeriesName,
            overlappingMarkerSpiderfier, defaultMarkerIcon, false);

        // draw resetMap control
        this._drawResetMap(resetMapProperties, map, latitude, longitude, zoom);

        // draw paths
        this._drawPaths(pathsList, map, false);

    },
    _getBooleanValue: function (v) {
        return v === true || v === 'true';
    },
    _extendArray: function(destArr, sourceArr) {
        for (var i of sourceArr) {
            destArr.push(i);
        }
    },
    _getObjectKeys: function(object) {
        var props = [];
        for (var prop in object) {
            if (object.hasOwnProperty(prop)) {
                props.push(prop);
            }
        }
        return props;
    }
});