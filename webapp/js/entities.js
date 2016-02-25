/**
* Price Model
*/

function Price(currency,value) {
	var currency = currency;
	var value=value;

	this.getCurrency = function() {
		return currency;
	}
	this.getValue = function() {
		return value;
	}
	this.setValue = function(newValue) {
		value = newValue;

	}

};

Price.prototype.changeCurrencyBy = function(changeAmount) {
	this.setValue(this.getValue()+changeAmount);
};


function Product (name,type,style,colour,linkToImage,pricePerUnit,size, applicableCoupons) {
	var name=name;
	var type=type;
	var colour=colour;
	var linkToImage = linkToImage;
	var pricePerUnit=pricePerUnit;		//instance of Price.
	var size = size;
	var style = style;
	var validCoupons = applicableCoupons;	//array of coupons

	this.getName = function() {
		return name;
	};

	this.getType = function() { return type; };
	this.getColour = function() { return colour; };
	this.getImageLink = function() { return linkToImage;};
	this.getPrice = function() { return pricePerUnit;};
	this.getSize = function() { return size;};
	this.getApplicableCoupons = function() {return validCoupons;};
	this.getStyle = function() { return style;};

};


function Order (product,qty) {
	var product=product;
	var qty = qty;

	this.getProduct = function() { return product;};
	this.getQuantity = function() { return qty;};
};

function ShoppingCart () {
	var orders = [];
	var coupons = [];
	var cartValue =0;
	var cartDiscount =0;

	this.getOrders = function() {
		return orders;
	};
	this.getCoupons = function() {
		return coupons;
	};
	this.getCartValue = function() {
		return cartValue;
	};
	this.getCartDiscount = function() {
		return cartDiscount;
	};
	this.setCartValue = function(value) {
		cartValue = value;
	};
	this.setCartDiscount = function(discount) {
		cartDiscount = discount;
	};

};

ShoppingCart.prototype.applyCoupons = function() {		//used in case of coupon based discount system...
	var allOrders = this.getOrders();
	var allCoupons = this.getCoupons();

	var cumulativeDiscounts = 0;

	for(var i=0;i<allOrders.length;i++) {
		cumulativeDiscounts+= DiscountFactory.getDiscount(allOrders[i].getProduct(),allCoupons[i],allOrders[i].getQuantity());
	}

	this.setCartDiscount(cumulativeDiscounts);
	this.setCartValue(this.getCartValue()-cumulativeDiscounts);

};

ShoppingCart.prototype.total = function() {
	var sum=0;
	var orders = this.getOrders();
	var qty=0;
	//sum up all
	for (var i=0;i<orders.length;i++) {
		sum+= orders[i].getProduct().getPrice().getValue();
		qty = orders[i].getQuantity();
	}
	var discount = DiscountFactory.getDiscount(qty,sum);
	this.setCartValue(sum-discount);
	// this.applyCoupons();

};

ShoppingCart.prototype.addOrder = function(order) {
	this.getOrders().push(order);
};

ShoppingCart.prototype.removeOrder = function(index) {
	this.getOrders().splice(index,1);
};

ShoppingCart.prototype.addCoupon = function(coupon) {
	this.getCoupons().push(coupon);
};

ShoppingCart.prototype.removeCoupon	 = function(index) {
	this.getCoupons().splice(index,1);
};

/**
** Coupon model
**/
function Coupon (code,isValid,percentage) {
	var code = code;
	var isValid = isValid;
	var percentage = percentage;

	this.getCode = function() {
		return code;
	};

	this.getValidity = function() {
		return isValid;
	};

	this.getPercentage = function() {
		return percentage;
	};

};

/** 
* Factory to find the applicable discount
*/
function DiscountFactory() {
	
};

DiscountFactory.getEnabled = function() {
	return true;
};

DiscountFactory.getDiscount = function(numberOfOrders,cartValue) {
	if(numberOfOrders===3) {
		return 0.05 * cartValue;
	}
	if(numberOfOrders>3 && numberOfOrders<=6) {
		return 0.1 * cartValue;
	}
	return 0.25 * cartValue;
};


function CouponDiscountFactory () {		//extends DiscountFactory
	DiscountFactory.call(this);		//super
};

CouponDiscountFactory.prototype = Object.create(DiscountFactory.prototype, {
	getDiscount :function(product,coupon) {
		if(this.getEnabled()===false || coupon.getValidity()===false) {
				return 0;
		}
		var prodCoupons = product.getApplicableCoupons();
		var discount=0;
		for(var i=0;i<prodCoupons.length;i++) {
			if(coupon.code==prodCoupons[i].code) {
				var price = product.getPrice();
				discount+= price.getValue() * coupon.getPercentage()/100.0;
			}
		}
		return discount;
	}
});

CouponDiscountFactory.prototype.constructor=CouponDiscountFactory;	//restore constructor







