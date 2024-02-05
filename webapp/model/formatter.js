/**
 * Module representing formatter functions for handling various formatting tasks in the application.
 * @namespace aliaksei.rakhmanko.model
 */
sap.ui.define([
    "sap/ui/core/format/DateFormat",
    "aliaksei/rakhmanko/model/Constants"
], function (DateFormat, Constants) {
    "use strict";

    /**
     * Formatter functions for handling various formatting tasks in the application.
     * @namespace
     */
    return {
        /**
         * Returns the color based on the product status.
         * @param {string} sStatus - Product status.
         * @returns {string} Color code corresponding to the status.
         * @public
         */
        statusColor: function (sStatus) {
            switch (sStatus) {
                case Constants.STATUS_OK:
                    return sap.ui.core.IndicationColor.Indication04;
                case Constants.STATUS_OUT_OF_STOCK:
                    return sap.ui.core.IndicationColor.Indication01;
                case Constants.STATUS_STORAGE:
                    return sap.ui.core.IndicationColor.Indication03;
                default:
                    return sap.ui.core.IndicationColor.Indication01;
            }
        },

        /**
         * Formats the product title using a resource bundle.
         * @param {string} sProductTitle - Product title to be formatted.
         * @returns {string} Formatted product title.
         * @public
         */
        formatProductTitle: function (sProductTitle) {
            return this.getResourceBundle().getText("productDetailsTitle", [sProductTitle]);
        },

        /**
         * Formats the product rating using a resource bundle.
         * @param {string} sRating - Product rating to be formatted.
         * @returns {string} Formatted product rating.
         * @public
         */
        formatRating: function (sRating) {
            return this.getResourceBundle().getText("productDetailsFeedListItemRating", [sRating]);
        },

        /**
         * Formats the timestamp into a readable date using a resource bundle.
         * @param {string} sTimestamp - Timestamp to be formatted.
         * @returns {string} Formatted date string.
         * @public
         */
        formatDate: function (sTimestamp) {
            const oDateFormat = DateFormat.getDateTimeInstance({ style: "medium" });
            const formattedDate = oDateFormat.format(new Date(sTimestamp));

            return this.getResourceBundle().getText("productDetailsFeedListItemPosted", [formattedDate]);
        },

        /**
         * Formats the sort type to the corresponding SAP icon.
         * @param {string} sSortType - The current sort type.
         * @returns {string} The SAP icon corresponding to the sort type.
         * @public
         */
        formatSortType: function (sSortType) {
            switch (sSortType) {
                case Constants.SORT_NONE: {
                    return "sap-icon://sort";
                }
                case Constants.SORT_ASC: {
                    return "sap-icon://sort-ascending";
                }
                case Constants.SORT_DESC: {
                    return "sap-icon://sort-descending";
                }
                default: {
                    return "sap-icon://sort";
                }
            }
        },
    };
});