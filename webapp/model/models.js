/**
 * Module providing app-view type models (as in the first "V" in MVVC).
 * @namespace aliaksei.rakhmanko.model
 */
sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], 
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {sap.ui.model.json.JSONModel} JSONModel
     * @param {sap.ui.Device} Device
     * 
     * @returns {Object} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device) {
        "use strict";

        return {
            /**
             * Creates a device model providing runtime info for the device the UI5 app is running on.
             * @function
             * @public
             * @returns {sap.ui.model.json.JSONModel} The device model.
             */
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
        }
    };
});