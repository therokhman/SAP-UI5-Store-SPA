/**
 * SAPUI5 component for managing the application.
 * @extends sap.ui.core.UIComponent
 * @namespace aliaksei.rakhmanko.Component
 */

sap.ui.define([
        "sap/ui/core/UIComponent"
    ],
    function (UIComponent) {
        "use strict";

        return UIComponent.extend("aliaksei.rakhmanko.Component", {
            metadata: {
                manifest: "json",
                handleValidation: true
            },

            /**
             * Initializes the component.
             * Calls the base component's initialization function and activates routing.
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();
            }
        });
    }
);