var $ = require('jquery'),
  _ = require('underscore'),
  Backbone = require('backbone');

Backbone.$ = $




var ApplicationRouter = Backbone.Router.extend({
  initialize: function() {
    this.ListingCollection = new BusinessCollection();
    this.homeView = new HomePageView({vCollection: this.ListingCollection});
    Backbone.history.start();
  },

  routes: {
    '*default': 'showHome'
  },

  showHome: function() {
    console.log(this.homeView)

    this.ListingCollection.fetch().then(function(responseData){
      console.log(responseData)
      console.log(this.ListingCollection);

      this.homeView.vCollection = this.ListingCollection;
      this.homeView.render();
    }.bind(this))

  }

})

var HomePageView = Backbone.View.extend({
  el: '.container',

  template: function() {
    var oneGuy = this.vCollection.models[0]
    
    return `

    `

  },

  render: function() {
    this.el.innerHTML = this.template()
  },
})

var Business = Backbone.Model.extend({

})

var BusinessCollection = Backbone.Collection.extend({
  
  model: Business,

  UID: 'j1kNkn4Aq3vbUHBmdRHw-w', 

  url: function(){
    return `http://api.sandbox.yellowapi.com/FindBusiness/?what=Restaurants&where=Toronto&pgLen=5&pg=1&dist=1&fmt=JSON&lang=en&UID=xqtdecnfjw8hpmscrv3jaj8v&apikey=xqtdecnfjw8hpmscrv3jaj8v`
  },

  parse: function(yelpResponse) {
    return yelpResponse.results
  }

})

export default ApplicationRouter