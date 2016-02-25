function App () {

	var initializer = this.init.bind(this);
	$(document).ready(function() {
		initializer();
	});
};

App.prototype.init = function() {
	var cartJSON = this._loadProductJSON();
};

App.prototype._createCartEntity = function(data) {
	var cart = new ShoppingCart();
	for(var i=0;i<data.length;i++) {
		var datum = data[i];
		var price = new Price(datum.c_currency,datum.p_price);
		var coupons = new Coupon("CPN12",true,12);
		var product = new Product(datum.p_name,"apparel",datum.p_style,datum.p_selected_color.name,"T"+(i+1)+".jpg",price,datum.p_selected_size.code,[coupons,coupons,coupons,coupons]);
		cart.addOrder(new Order(product,datum.p_quantity));
		
	}

	cart.addCoupon(new Coupon("CPN12",true,12));		//valid
	cart.addCoupon(new Coupon("XHHDF",true,120));		//Invalid
	cart.addCoupon(new Coupon("XH2",false,120));		//Invalid
	cart.addCoupon(new Coupon("X1",false,120));		//Invalid

	cart.total();
	return cart;
};

App.prototype._getMergedHTML = function(orders) {
	var prodSectionHTML="";
	for(var i=0;i<orders.length;i++) {
		prodSectionHTML+= UIFactory.createProductHTML(orders[i].getProduct(),orders[i].getQuantity());
	}
	return prodSectionHTML;
};

var callbackFN = function(cartJSON, textStatus) {
	var cart = $.proxy(app._createCartEntity,app,cartJSON.productsInCart)();
	var html = $.proxy(app._getMergedHTML,app,cart.getOrders())();
	$("#productHolder").html(html);

	$(".editLink").on("click",function(e) {
		$("#modal" ).dialog({
		      resizable: false,
		      modal: true
		      // buttons: {
		      //   "Ok": function() {
		      //     $( this ).dialog( "close" );
		      //   }
		        
		      // }
		    });
	});
	$("#editButton").on("click", function(e) { $("#modal").dialog("close");})
};

App.prototype._loadProductJSON = function() {
	var that=this;
	// create script element for jsonp call
	var script = document.createElement('script');
	script.src = 'http://jsonp.afeld.me/?url=https://api.myjson.com/bins/19ynm&callback=callbackFN';
	// insert script to document and load content
	document.body.appendChild(script);
	
};


function UIFactory() {

};

UIFactory.createProductHTML=function(prod,quantity) {
	var html='<div class="column-prominent">'+
		'<div class="product"><div class="product_image"><img src="assets/'+prod.getImageLink()+'"alt="image" height="150" width="150"/></div>'+
		'<div class="product_description product_entry">'+
		' 	<p class="item-text item-bold">'+prod.getName()+'</p>'+
		' 	<p class="description">Style #: '+prod.getStyle()+'</p>'+
		' 	<p class="description">Colour: '+prod.getColour()+'</p></div>'+
		' 	<div class="product_actions">'+
		' 	<span class="item-text" style="cursor:pointer"><a class="editLink">EDIT</a> | X REMOVE | SAVE FOR LATER </span></div></div></div><div class="column column-prominent-offset-1">'+
		' 	<div class="product_size product_entry"><span class="item_text">'+prod.getSize()+'</span></div></div>'+
		' 	<div class="column column-prominent-offset-2"><div class="product_quantity item_text">'+quantity+'</div></div>'+
		' 	<div class="column column-prominent-offset-3"><div class="product_entry"><sup>'+prod.getPrice().getCurrency()+'</sup><span class="item_text product_price item_bold">'+prod.getPrice().getValue()+'</span></div></div><div class="hrule-prominent"></div>';

		return html;

};


var app = new App();
