/**
 * Controller for the "NotFound" view, handling not-found scenarios.
 * @namespace aliaksei.rakhmanko.controller
 */
sap.ui.define([
    "aliaksei/rakhmanko/controller/BaseController"
], function (BaseController) {
    "use strict";

    /**
     * Controller for the "NotFound" view, handling not-found scenarios.
     * @class
     * @extends aliaksei.rakhmanko.controller.BaseController
     */
    return BaseController.extend("aliaksei.rakhmanko.controller.NotFound", {
        /**
         * Lifecycle hook called when the controller is instantiated.
         * @public
         */
        onInit: function () {
        }
    })
})