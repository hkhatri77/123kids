var $ = require('jquery'),
	_ = require('underscore'),
	Backbone = require('backbone');

Backbone.$ = $




var ApplicationRouter = Backbone.Router.extend({
	initialize: function() {
		this.politionsCollection = new LegislatorsCollection();
		this.homeView = new HomePageView({vCollection: this.politionsCollection});
		Backbone.history.start();
	},

	routes: {
		'*default': 'showHome'
	},

	showHome: function() {
		console.log(this.homeView)

		this.politionsCollection.fetch().then(function(responseData){
			console.log(responseData)
			console.log(this.politionsCollection);

			this.homeView.vCollection = this.politionsCollection;
			this.homeView.render();
		}.bind(this))

	}

})

var HomePageView = Backbone.View.extend({
	el: '.container',

	template: function() {
		var listings = this.vCollection.models[0]
		
		return `

		`

	},

	render: function() {
		this.el.innerHTML = this.template()
	},
})

var Listing = Backbone.Model.extend({

})

var ListingCollection = Backbone.Collection.extend({
	
	model: Listing,

	key: 'Dcmz07el7YmH2SgHfCRwdQ', 
	secret: 'b3xadmEYI1yQgixG1yN5BuTF5XQ'
	token: 'XgTA-3HCsHUpBn-qeQNF1R-hIa_HgO5s'
	token_secret: 'GLF2oOns7-LqsbnAmNqH3SRzE_A'

	url: function(){
		return `http://congress.api.sunlightfoundation.com/legislators?apikey=${this.key}`
	},

	parse: function(yelp) {
		return yelp.results
	}

})

export default ApplicationRouter