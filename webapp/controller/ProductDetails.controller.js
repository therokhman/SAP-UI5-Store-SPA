/**
 * Controller for the "ProductDetails" view, handling product details and comments.
 * @namespace aliaksei.rakhmanko.controller
 */
sap.ui.define([
    "aliaksei/rakhmanko/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "aliaksei/rakhmanko/model/formatter",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (BaseController, Filter, FilterOperator, formatter, MessageToast, MessageBox) {
    "use strict";

    /**
     * Controller for the "ProductDetails" view, handling product details and comments.
     * @class
     * @extends aliaksei.rakhmanko.controller.BaseController
     */
    return BaseController.extend("aliaksei.rakhmanko.controller.ProductDetails", {
        /**
         * Formatter functions for the view.
         * @type {object}
         */
        formatter: formatter,
        /**
         * Lifecycle hook called when the controller is instantiated.
         * @public
         */
        onInit: function () {
            this.getRouter().getRoute("ProductDetails").attachPatternMatched(this._onPatternMatched, this);
        },

        /**
         * Handles the pattern matched event for the "ProductDetails" route.
         * @param {sap.ui.base.Event} oEvent - The pattern matched event.
         * @private
         */
        _onPatternMatched: function (oEvent) {
            const sProductId = oEvent.getParameter("arguments").productId;
            const sPath = this.getModel().createKey("/Products", {
                id: sProductId
            })

            this.getView().bindElement({
                path: sPath
            });

            this.byId("commentsListId").getBinding("items").filter(new Filter(
                "ProductId", FilterOperator.EQ, sProductId
            ));
        },

        /**
         * Navigates to the "StoresOverview" view.
         * @public
         */
        onNavToStoresOverview: function () {
            this.getRouter().navTo("StoresOverview");
        },

        /**
         * Navigates to the "StoreDetails" view based on the selected store.
         * @param {sap.ui.base.Event} oEvent - The press event.
         * @public
         */
        onNavToStoreDetails: function (oEvent) {
            const sStoreId = oEvent.getSource().getBindingContext().getProperty("StoreId");

            this.getRouter().navTo("StoreDetails", {
                storeId: sStoreId
            });
        },

        /**
         * Event handler for posting a comment.
         * @param {sap.ui.base.Event} oEvent - The event.
         * @public
         */
        onPostComment: function (oEvent) {
            const oAuthor = this.byId('authorInput');
            const oRating = this.byId('ratingInput'); 
            const sProductId = oEvent.getSource().getBindingContext().getProperty("id");
            const sMessageValue = oEvent.getParameter("value");
        
            if (!this.isCommentValid(oAuthor, oRating)) {
                MessageBox.error(this.getResourceBundle().getText("commentValidationFailed"));
                return;
            }
        
            const oEntryCtx = this.createCommentEntry(oAuthor, oRating, sMessageValue, sProductId);
            this.submitCommentChanges(oEntryCtx, oAuthor, oRating);
        },
        
        /**
         * Checks the validity of a comment.
         * @param {sap.m.Input} oAuthor - The author input field.
         * @param {sap.m.RatingIndicator} oRating - The rating indicator.
         * @returns {boolean} - Returns true if the comment is valid.
         */
        isCommentValid: function (oAuthor, oRating) {
            return oAuthor.getValue() && oRating.getValue() !== 0;
        },
        
        /**
         * Creates a new comment entry.
         * @param {sap.m.Input} oAuthor - The author input field.
         * @param {sap.m.RatingIndicator} oRating - The rating indicator.
         * @param {string} sMessageValue - The message value.
         * @param {string} sProductId - The product ID.
         * @returns {sap.ui.model.Context} - The context of the new comment entry.
         */
        createCommentEntry: function (oAuthor, oRating, sMessageValue, sProductId) {
            return this.getModel().createEntry("/ProductComments", {
                properties: {
                        Author: oAuthor.getValue(),
                        Message: sMessageValue,
                        Rating: oRating.getValue(),
                        Posted: new Date().toISOString(),
                        ProductId: sProductId
                    }
            });
        },
        /**
         * Submits the changes for a new comment.
         * @param {sap.ui.model.Context} oEntryCtx - The context of the new comment entry.
         * @param {sap.m.Input} oAuthor - The author input field.
         * @param {sap.m.RatingIndicator} oRating - The rating indicator.
         * @public
         */
        submitCommentChanges: function (oEntryCtx, oAuthor, oRating) {
            const oODataModel = this.getModel();
            oODataModel.submitChanges({
                success: function () {
                    oAuthor.setValue("");
                    oRating.setValue(0);
                    MessageToast.show(this.getResourceBundle().getText("commentPostedSuccess"));
                    },
                error: function () {
                    oODataModel.deleteCreatedEntry(oEntryCtx);
                    MessageBox.error(this.getResourceBundle().getText("commentPostedError"));
                }
            });
        
            oAuthor.setValue(""); 
            oRating.setValue(0);    
            MessageToast.show(this.getResourceBundle().getText("commentPostedSuccess"));
        }
    })
});