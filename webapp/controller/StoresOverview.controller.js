/**
 * Controller for the "StoresOverview" view, handling store overview and creation.
 * @namespace aliaksei.rakhmanko.controller
 */
sap.ui.define([
    "aliaksei/rakhmanko/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (BaseController, Filter, FilterOperator, MessageToast, MessageBox) {
    "use strict";

    /**
     * Controller for the "StoresOverview" view, handling store overview and creation.
     * @class
     * @extends aliaksei.rakhmanko.controller.BaseController
     */
    return BaseController.extend("aliaksei.rakhmanko.controller.StoresOverview", {
        /**
         * Navigates to the "StoreDetails" view based on the selected store.
         * @param {sap.ui.base.Event} oEvent - The press event.
         * @public
         */
        onNavToStoreDetails: function (oEvent) {
            this.getRouter().navTo("StoreDetails", {
                storeId: oEvent.getSource().getBindingContext().getProperty("id")
            });
        },

        /**
         * Handles the search event for filtering stores based on the query.
         * @param {sap.ui.base.Event} oEvent - The search event.
         * @public
         */
        onStoreSearch: function (oEvent) {
            const oStoresList = this.byId("storesListId");
            const oItemsBinding = oStoresList.getBinding("items");
            const sQuery = oEvent.getParameter("query");
            const oFilter = this.createStoreFilter(sQuery);

            oItemsBinding.filter(oFilter);
        },

        /**
         * Creates a filter for searching stores based on the query.
         * @param {string} sQuery - The search query.
         * @returns {sap.ui.model.Filter} The created filter.
         * @public
         */
        createStoreFilter: function (sQuery) {
            const aFilters = [
                new Filter("Name", FilterOperator.Contains, sQuery),
                new Filter("Address", FilterOperator.Contains, sQuery)
            ];

            if (!!+sQuery) {
                aFilters.push(new Filter("FloorArea", FilterOperator.EQ, +sQuery));
            };

            return new Filter({
                filters: aFilters,
                and: false
            });
        },

        /**
         * Opens the dialog for creating a new store.
         * @async
         * @public
         */
        onOpenCreateStoreDialog: async function () {
            const oODataModel = this.getModel();
            const oEntryCtx = oODataModel.createEntry("/Stores");

            if (!this.oDialog) {
                this.oDialog = await this.loadFragment({
                    name: "aliaksei.rakhmanko.view.fragments.CreateStoreDialog"
                });
            }
                
            this.oDialog.setBindingContext(oEntryCtx);
            this.oDialog.setModel(oODataModel);
            this.oDialog.open();
        },

        /**
         * Event handler for the live change event of input fields in the create store dialog.
         * Validates the input value and sets the ValueState accordingly.
         * @param {sap.ui.base.Event} oEvent - The live change event object.
         * @public
         */
        onLiveChange: function (oEvent) {
            const oInput = oEvent.getSource();
            const sValue = oInput.getValue();
        
            try {
                oInput.getBinding("value").getType().validateValue(sValue);
                oInput.setValueState(sap.ui.core.ValueState.None);
            } catch (oException) {
                oInput.setValueState(sap.ui.core.ValueState.Error);
            }
        },

        /**
         * Handles the press event when creating a new store in the dialog.
         * Validates input values and submits changes if validation is successful.
         * Displays success/error messages accordingly.
         * @public
         */
        onDialogCreateStorePress: function () {
            const aInputs = sap.ui.getCore().byFieldGroupId("createStoreFieldGroup");

            const hasValidationError = aInputs.some((oControl) => {
                if (oControl instanceof sap.m.Input) {
                    return oControl.getValueState() === sap.ui.core.ValueState.Error;
                } else if (oControl instanceof sap.m.DatePicker) {
                    const dateValue = oControl.getDateValue();
                    return !dateValue || isNaN(dateValue.getTime());
                }
                return false;
            });

            if (hasValidationError) {
                MessageBox.error(this.getResourceBundle().getText("formValidationFailed"));
            } else {
                this.submitForm();
            };
        },

        /**
         * Submits the form data for creating a new store.
         * Displays success/error messages accordingly.
         * @public
         */
        submitForm: function () {
            const oODataModel = this.getModel();
            oODataModel.submitChanges({
                success: function () {
                    MessageToast.show(this.getResourceBundle().getText("storeCreateSuccess"));
                    this.oDialog.close();
                },
                error: function () {
                    MessageBox.error(this.getResourceBundle().getText("storeCreateError"));
                }
            });

            MessageToast.show(this.getResourceBundle().getText("storeCreateSuccess"));
            this.oDialog.close();
        },

        /**
         * Handles the press event when canceling store creation in the dialog.
         * @public
         */
        onDialogCancelStorePress: function () {
            const oODataModel = this.getModel();
            const oCtx = this.oDialog.getBindingContext();
			oODataModel.deleteCreatedEntry(oCtx);
            this.oDialog.close();
        },

        /**
         * Handles the after-close event of the dialog.
         * Resets changes in the model.
         * @public
         */
        onAfterClose: function () {
            this.getModel().resetChanges();
        }
    })
});