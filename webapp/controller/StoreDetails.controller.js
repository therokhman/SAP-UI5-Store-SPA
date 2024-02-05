/**
 * Controller for the "StoreDetails" view, handling store details and product management.
 * @namespace aliaksei.rakhmanko.controller
 */
sap.ui.define([
    "aliaksei/rakhmanko/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Sorter",
    "aliaksei/rakhmanko/model/Constants",
    "aliaksei/rakhmanko/model/formatter",
], function (BaseController, JSONModel, Filter, FilterOperator, MessageToast, MessageBox, Sorter, Constants, formatter) {
    "use strict";

    /**
     * Controller for the "StoreDetails" view, handling store details and product management.
     * @class
     * @extends aliaksei.rakhmanko.controller.BaseController
     */
    return BaseController.extend("aliaksei.rakhmanko.controller.StoreDetails", {
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
            this.getRouter().getRoute("StoreDetails").attachPatternMatched(this._onPatternMatched, this);

            this.setModel(new JSONModel({
                statuses: {},
                sortType: Constants.SORT_NONE,
                currentColumnId: "",
                bIsCreate: false
            }), "viewModel");
        },

        /**
         * Handles the pattern matched event, binds the store details, and fetches product statuses.
         * @param {sap.ui.base.Event} oEvent - The pattern matched event.
         * @private
         */
        _onPatternMatched: function (oEvent) {
            const sStoreId = oEvent.getParameter("arguments").storeId;
            const sPath = this.getModel().createKey("/Stores", {
                id: sStoreId
            });

            this.getView().bindElement({
                path: sPath
            });

            this.getStatuses()
        },

        /**
         * Fetches and updates product statuses based on the current store.
         * @param {sap.ui.base.Event} oEvent - The data event.
         * @public
         */
        getStatuses: function (oEvent) {
            if (oEvent) {
                const aProducts = oEvent.getParameter("data").results;
                const oStatuses = {
                    all: aProducts.length,
                    OK: 0,
                    STORAGE: 0,
                    OUT_OF_STOCK: 0
                };

                aProducts.forEach(oProduct => {
                    if (oProduct.Status in oStatuses) {
                        oStatuses[oProduct.Status] += 1
                    } else {
                        oStatuses[oProduct.Status] = 1
                    }
                });

                this.getModel("viewModel").setProperty("/statuses", oStatuses);
            }
        },

        /**
         * Navigates to the "StoresOverview" view.
         * @public
         */
        onNavToStoresOverview: function () {
            this.getRouter().navTo("StoresOverview");
        },

        /**
         * Navigates to the "ProductDetails" view based on the selected product.
         * @param {sap.ui.base.Event} oEvent - The press event.
         * @public
         */
        onNavToProductDetails: function (oEvent) {
            const sStoreId = oEvent.getSource().getBindingContext().getProperty("StoreId");
            const sProductId = oEvent.getSource().getBindingContext().getProperty("id");

            this.getRouter().navTo("ProductDetails", {
                storeId: sStoreId,
                productId: sProductId
            });
        },

        /**
         * Handles the search event for filtering products based on the query.
         * @param {sap.ui.base.Event} oEvent - The search event.
         * @public
         */
        onTableSearch: function (oEvent) {
            const sQuery = oEvent.getParameter("query");
            const oSearchFilter = this.createProductFilter(sQuery);

            this.byId("iconTabBarId").setSelectedKey(null);
            this.applyFilters(oSearchFilter);
        },

        /**
         * Creates a filter for searching products based on the query.
         * @param {string} sQuery - The search query.
         * @returns {sap.ui.model.Filter} The created filter.
         * @public
         */
        createProductFilter: function (sQuery) {
            const aFilters = [
                new Filter("Name", FilterOperator.Contains, sQuery),
                new Filter("Specs", FilterOperator.Contains, sQuery),
                new Filter("SupplierInfo", FilterOperator.Contains, sQuery),
                new Filter("MadeIn", FilterOperator.Contains, sQuery),
                new Filter("ProductionCompanyName", FilterOperator.Contains, sQuery)
            ];

            if (!!+sQuery) {
                aFilters.push(new Filter("Price", FilterOperator.EQ, +sQuery));
            };

            return new Filter({
                filters: aFilters,
                and: false
            });
        },

        /**
         * Handles the press event for filtering products by status.
         * @param {sap.ui.base.Event} oEvent - The press event.
         * @public
         */
        onFilterProductsByStatus: function (oEvent) {
            const sKey = oEvent.getParameter("key");
            const oStatusFilter = new Filter("Status", FilterOperator.EQ, sKey);

            if (sKey === "ALL") {
                this.applyFilters(null, false);
            } else{
                this.applyFilters(oStatusFilter, true);
            }
        },
        
        /**
         * Applies filters to the products table based on search and status filter.
         * @param {sap.ui.model.Filter} oNewFilter - The new filter to be applied.
         * @param {boolean} bStatusFilter - Indicates whether the filter is a status filter.
         * @public
         */
        applyFilters: function(oNewFilter, bStatusFilter = false) {       
            const oProductsTable = this.byId("productsTableId");
            const oItemsBinding = oProductsTable.getBinding('items');
            const oSearchInput = this.byId("searchInputId");
            const sSearchValue = oSearchInput.getValue();

            if (bStatusFilter && sSearchValue) {
                const sSearchValue = this.byId("searchInputId").getValue();
                
                oItemsBinding.filter(
                    new Filter({
                        filters: [oNewFilter, this.createProductFilter(sSearchValue)], 
                        and: true
                    }));
            } else if (bStatusFilter) {
                oItemsBinding.filter(oNewFilter);
            } else {
                oItemsBinding.filter(this.createProductFilter(sSearchValue));
            }
        },

        /**
         * Handles the press event for sorting products based on the selected column.
         * @param {sap.ui.base.Event} oEvent - The press event.
         * @public
         */
        onSortButtonPress: function (oEvent) {
            const oButton = oEvent.getSource();
            const sColumnName = oButton.data("columnNameData");
            const oViewModel = this.getModel("viewModel");
            const sSortType = oViewModel.getProperty("/sortType");

            const sortTypes = {
                [Constants.SORT_NONE]: Constants.SORT_ASC,
                [Constants.SORT_ASC]: Constants.SORT_DESC,
                [Constants.SORT_DESC]: Constants.SORT_ASC,
            };

            oViewModel.setProperty("/sortType", sortTypes[sSortType]);

            const oProductsTable = this.byId("productsTableId");
            const oItemsBinding = oProductsTable.getBinding("items");
            const bSortDesc = sSortType === Constants.SORT_DESC;
            const oSorter = new Sorter(sColumnName, bSortDesc);

            oItemsBinding.sort(oSorter);
            this.resetSortIcons();

            this.getModel("viewModel").setProperty("/currentColumnId", sColumnName);
            oButton.setIcon(formatter.formatSortType(sSortType));
        },

        /**
         * Resets sort icons for all columns.
         * @public
         */
        resetSortIcons: function () {
            const aColumnIds = ["Name", "Price", "Specs", "SupplierInfo", "MadeIn", "ProductionCompanyName", "Rating"];

            aColumnIds.forEach(sColumnId => {
                const oButton = this.byId(sColumnId);
                oButton?.setIcon("sap-icon://sort");
            });
        },

        /**
         * Opens the dialog for creating a new product.
         * @async
         * @public
         */
        onOpenCreateProductDialog: async function () {
            if (!this.oDialog) {
                this.oDialog = await this.loadFragment({
                    name: "aliaksei.rakhmanko.view.fragments.ProductDialog"
                });
            }
        
            const sStoreId = this.getView().getBindingContext().getProperty("id");
            const oODataModel = this.getModel();
            const oEntryCtx = oODataModel.createEntry("/Products", {
                properties: {
                    StoreId: sStoreId,
                    Status: "OK"
                }
            });
        
            this.oDialog.setBindingContext(oEntryCtx);
            this.oDialog.setModel(oODataModel);
            this.getModel("viewModel").setProperty("/bIsCreate", true);
            this.oDialog.open();
        },

        /**
         * Opens the dialog for editing an existing product.
         * @async
         * @param {sap.ui.base.Event} oEvent - The press event.
         * @public
         */
        onOpenEditProductDialog: async function (oEvent) {
            const oODataModel = this.getModel();
            const oCtx = oEvent.getSource().getBindingContext();

            if (!this.oDialog) {
                this.oDialog = await this.loadFragment({
                    name: "aliaksei.rakhmanko.view.fragments.ProductDialog"
                });
                this.getView().addDependent(this.oDialog);
            };

            const sKey = oODataModel.createKey("/Products", oCtx.getObject());
            this.oDialog.bindObject({
                path: sKey
            });

            const sStoreId = this.getView().getBindingContext().getProperty("id");
            const oEntryCtx = oODataModel.createEntry("/Products", {
                properties: {
                    id: sKey,
                    StoreId: sStoreId
                }
            });

            this.oDialog.setBindingContext(oEntryCtx);
            this.oDialog.setModel(oODataModel);
            this.getModel("viewModel").setProperty("/bIsCreate", false);
            this.oDialog.open();    
        },

        /**
         * Event handler for the live change event of input fields in the product dialog.
         * Validates the input value and sets the ValueState accordingly.
         * @param {sap.ui.base.Event} oEvent - The live change event object.
         * @public
         */
        onLiveChangeProduct: function (oEvent) {
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
         * Event handler for the "press" event of the "DialogProduct" button.
         * Submits changes to the OData model, shows a success message, and closes the dialog.
         * @function
         * @public
         */
        onDialogProductPress: function () {
            const aInputs = sap.ui.getCore().byFieldGroupId("productFieldGroup");

            aInputs.forEach((oControl) => {
                if (oControl instanceof sap.m.Input) {
                    if (!oControl.getValue()) {
                        oControl.setValueState(sap.ui.core.ValueState.Error);
                    }
                } else if (oControl instanceof sap.m.Select) {
                    if (!oControl.getSelectedKey()) {
                        oControl.setValueState(sap.ui.core.ValueState.Error);
                    }
                }
            });
        
            const hasValidationError = aInputs.some((oControl) => {
                if (oControl instanceof sap.m.Input) {
                    return oControl.getValueState() === sap.ui.core.ValueState.Error;
                }   
            });

            if (hasValidationError) {
                MessageBox.error(this.getResourceBundle().getText("formValidationFailed"));
            } else {
                this.submitProductForm();
            }
        },

        /**
         * Submits the form data for creating/updating a product.
         * Displays success/error messages accordingly.
         * @public
         */
        submitProductForm: function () {
            const oODataModel = this.getModel();
            const bIsCreate = this.getModel("viewModel").getProperty("/bIsCreate");
        
            oODataModel.submitChanges({
                success: function () {
                    MessageToast.show(this.getResourceBundle().getText(bIsCreate ? "productSuccessCreated" : "productSuccessUpdated"));
                },
                error: function () {
                    MessageBox.error(this.getResourceBundle().getText(bIsCreate ? "productErrorCreating" : "productErrorUpdating"));
                }
            });

            MessageToast.show(this.getResourceBundle().getText(bIsCreate ? "productSuccessCreated" : "productSuccessUpdated"));
            this.oDialog.close();
        },

        /**
         * Event handler for the "press" event of the "DialogCancelProduct" button.
         * Resets changes in the OData model and closes the dialog.
         * @function
         * @public
         */
        onDialogCancelProductPress: function () {
            this.getModel().resetChanges();
            this.oDialog.close();
        },

        /**
         * Event handler for the "afterClose" event of the dialog.
         * Destroys the dialog instance and sets it to null.
         * @function
         * @public
         */
        onAfterClose: function () {
            this.oDialog.destroy();
            this.oDialog = null;
        },

        /**
         * Event handler for opening the confirmation dialog to delete a store.
         * Shows a confirmation dialog and removes the store on user confirmation.
         * @function
         * @param {sap.ui.base.Event} oEvent The event object
         * @public
         */
        onOpenDeleteStoreConfirmation: function (oEvent) {
            const sStoreKey = oEvent.getSource().getBindingContext().sPath;
            const oResourceBundle = this.getResourceBundle();

            MessageBox.confirm(
                oResourceBundle.getText("confirmDeleteStore"),
                (oAction) => {
                    if (oAction !== "OK") {
                        return
                    }
                    const oODataModel = this.getModel();
                    oODataModel.remove(sStoreKey, {
                        success: () => {
                            MessageToast.show(oResourceBundle.getText("storeRemovedSuccess"));
                            this.onNavToStoresOverview();
                        },
                        error: () => {
                            MessageBox.error(oResourceBundle.getText("storeRemovedError"));
                        }
                    });
                }
            );
        },

        /**
         * Event handler for opening the confirmation dialog to delete a product.
         * Shows a confirmation dialog and removes the product on user confirmation.
         * @function
         * @param {sap.ui.base.Event} oEvent The event object
         * @public
         */
        onOpenDeleteProductConfirmation: function (oEvent) {
            const sProductKey = oEvent.getSource().getBindingContext().sPath;
            const oResourceBundle = this.getResourceBundle();

            MessageBox.confirm(
                oResourceBundle.getText("confirmDeleteProduct"),
                (oAction) => {
                    if (oAction !== "OK") {
                        return
                    }
                    const oODataModel = this.getModel();
                    oODataModel.remove(sProductKey, {
                        success: function () {
                            MessageToast.show(oResourceBundle.getText("productRemovedSuccess"));
                        },
                        error: function () {
                            MessageBox.error(oResourceBundle.getText("productRemovedError"));
                        }
                    });
                }
            );
        }
    })
});