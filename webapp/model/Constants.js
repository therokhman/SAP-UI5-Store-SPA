/**
 * Module representing sorting constants for the application.
 * @namespace aliaksei.rakhmanko.model
 */
sap.ui.define([], function () {
    "use strict";

    /**
     * Sorting constants for the application.
     * @namespace
     */
    return {
        /**
         * Represents no sorting order.
         * @constant {string}
         * @default
         */
        SORT_NONE: "",
        /**
         * Represents ascending sorting order.
         * @constant {string}
         * @default
         */
        SORT_ASC: "ASC",
        /**
         * Represents descending sorting order.
         * @constant {string}
         * @default
         */
        SORT_DESC: "DESC",
        /**
         * Represents OK product status.
         * @constant {string}
         * @default
         */
        STATUS_OK: "OK",
        /**
         * Represents OUT_OF_STOCK product status.
         * @constant {string}
         * @default
         */
        STATUS_OUT_OF_STOCK: "OUT_OF_STOCK",
        /**
         * Represents STORAGE product status.
         * @constant {string}
         * @default
         */
        STATUS_STORAGE: "STORAGE"
    };
});