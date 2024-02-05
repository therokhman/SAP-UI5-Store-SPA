/**
 * Controller for the main application view.
 * @namespace aliaksei.rakhmanko.controller
 */
sap.ui.define([
        "aliaksei/rakhmanko/controller/BaseController"
    ],
    function(BaseController) {
      "use strict";
        /**
         * Controller for the main application view.
         * @class
         * @extends aliaksei.rakhmanko.controller.BaseController
         */
      return BaseController.extend("aliaksei.rakhmanko.controller.App", {
        /**
             * Lifecycle hook called when the controller is instantiated.
             * @public
             */
        onInit: function() {
        }
      });
    }
  );
  