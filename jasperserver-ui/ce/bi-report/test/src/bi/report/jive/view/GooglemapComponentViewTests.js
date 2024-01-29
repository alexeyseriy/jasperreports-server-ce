/*
 * Copyright (C) 2005 - 2022 TIBCO Software Inc. All rights reserved. Confidentiality & Proprietary.
 * Licensed pursuant to commercial TIBCO End User License Agreement.
 */
import $ from "jquery";
import sinon from "sinon";
import GooglemapComponentView from "src/bi/report/jive/view/GooglemapComponentView";
import GooglemapComponentModel from "src/bi/report/jive/model/GooglemapComponentModel";

describe("GooglemapComponentViewTests", () => {
    let sandbox,
        mapView;

    beforeEach(() => {
        sandbox = sinon.createSandbox();

        const model = new GooglemapComponentModel({
            id: "mapContainerId",
            instanceData: {
                requestParams: "reqParams",
                useMarkerClustering: false,
                useMarkerSpidering: false
            }
        });

        mapView = new GooglemapComponentView({ model });
    });

    afterEach(() => {
        sandbox.restore();
        mapView.remove();
    });

    it("Should call methods for loading external scripts", () => {
        const getGoogleMapsLoadedPromiseSpy = sandbox.spy(mapView, '_getGoogleMapsLoadedPromise');
        const getMarkerClustererLoadedPromiseSpy = sandbox.spy(mapView, '_getMarkerClustererLoadedPromise');
        const getMarkerSpideringLoadedPromiseSpy = sandbox.spy(mapView, '_getMarkerSpideringLoadedPromise');

        mapView.render($("<div id='mapContainerId'></div>"));

        expect(getGoogleMapsLoadedPromiseSpy).toHaveBeenCalledWith("reqParams");
        expect(getMarkerClustererLoadedPromiseSpy).toHaveBeenCalledWith(false);
        expect(getMarkerSpideringLoadedPromiseSpy).toHaveBeenCalledWith(false);
    });
});
