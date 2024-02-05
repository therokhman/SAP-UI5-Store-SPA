/*global QUnit*/

sap.ui.define([
	"aliakseirakhmanko/leverx/controller/StoresOverview.controller"
], function (Controller) {
	"use strict";

	QUnit.module("StoresOverview Controller");

	QUnit.test("I should test the StoresOverview controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
