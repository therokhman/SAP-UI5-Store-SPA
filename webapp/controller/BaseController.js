/**
 * Base controller providing common functionalities for controllers in the application.
 * @namespace aliaksei.rakhmanko.controller
 */
sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History",
        "sap/ui/core/UIComponent"
    ], function (Controller, History, UIComponent) {
        "use strict";

        /**
         * Base controller providing common functionalities for controllers in the application.
         * @class
         * @extends sap.ui.core.mvc.Controller
         */
        return Controller.extend("aliaksei.rakhmanko.controller.BaseController", {

            /**
             * Retrieves the router associated with the controller.
             * @public
             * @returns {sap.ui.core.routing.Router} The router instance.
             */
            getRouter: function () {
                return UIComponent.getRouterFor(this);
            },

            /**
             * Navigates back to the previous page in the application history.
             * If there is no previous page, it navigates to the "StoresOverview" page.
             * @public
             */
            onNavBack: function () {
                let oHistory = History.getInstance();
                let sPreviousHash = oHistory.getPreviousHash();
                
                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    this.getRouter().navTo("StoresOverview", {}, true);
                }
            },

            /**
             * Retrieves a model by name from the view.
             * @public
             * @param {string} sName - The name of the model.
             * @returns {sap.ui.model.Model} The model instance.
             */
            getModel: function (sName) {
                return this.getView().getModel(sName);
            },

            /**
             * Sets a model with the given name to the view.
             * @public
             * @param {sap.ui.model.Model} oModel - The model to be set.
             * @param {string} sName - The name of the model.
             */
            setModel: function (oModel, sName) {
                return this.getView().setModel(oModel, sName);
            },

            /**
             * Retrieves the resource bundle from the owner component.
             * @public
             * @returns {sap.ui.model.resource.ResourceModel} The resource bundle.
             */
            getResourceBundle: function () {
                return this.getOwnerComponent().getModel("i18n").getResourceBundle();
            }
        });
    });