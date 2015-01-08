/** @module */

var Paginator = require('../../util/Paginator');
var Cart = require('../../cart/Cart');
var _ = require('lodash');

/**
 * CartRoutesController is the controller for the cart routes.
 *
 * @alias CartRoutesController
 * @param {EStore} store
 * @constructor
 * @extends {Controller}
 *
 */
function CartRoutesController() {
	CartRoutesController.$parent.apply(this, arguments);
}

/**
 * onRouteConfiguration will configure routes based on the theme.
 *
 * @method onRouteConfiguration
 * @return
 *
 */
CartRoutesController.prototype.onRouteConfiguration = function(app) {

	app.get(this.$routes.standard.cart.index,
		this.render('cart.html'));

	app.post(this.$routes.standard.cart.item,
		this.onAddItemToCartRequest.bind(this));

	app.put(this.$routes.standard.cart.item,
		this.onAddItemToCartRequest.bind(this));

	app.delete(this.$routes.standard.cart.item,
		this.onRemoveItemFromCartRequest.bind(this));

};

/**
 * onAddItemToCartRequest
 *
 * @method AddItemToCartRequest
 * @param {Object} req The express Request object.
 * @param {Object} res The express Response object.
 * @return
 *
 */
CartRoutesController.prototype.onAddItemToCartRequest = function(req, res, next) {

	var item = req.body;

	this.$data.getDataModel('Product').
	findOne({
		uuid: req.params[0]
	}).
	exec().
	then(null, function(err) {

		console.log(err);
		next();

	}).
	then(function(product) {

		if (!product)
			return next();


		item.uuid = req.params[0];
		Cart.createStandardAssistant(req.session.cart, res).
		addToCart(item, product);

	}).end();


};


/**
 * onRemoveItemFromCartRequest
 *
 * @param {Object} req The express Request object.
 * @param {Object} res The express Response object.
 */
CartRoutesController.prototype.onRemoveItemFromCartRequest = function(req, res, next) {

	Cart.createStandardAssistant(req.session.cart, res).
	removeFromCart(req.params[0]);

};

module.exports = {
	type: 'controller',
	name: 'CartRoutesController',
	controller: CartRoutesController
};
