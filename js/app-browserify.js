"use strict";

// es5 polyfills, powered by es5-shim
require("es5-shim")
// es6 polyfills, powered by babel
require("babel/register")

var Promise = require('es6-promise').Promise

var Pace = require("../bower_components/pace/pace.js")


//var AppRouter = require('./app0.js')
//var AppRouter = require('./app1.js')
//var AppRouter = require('./app2.js')
//var AppRouter = require('./yelp.js')


//window.addEventListener('load', app)

  var Oauth = { 
    consumerKey: 'Dcmz07el7YmH2SgHfCRwdQ', 
    consumerSecret: 'b3xadmEYI1yQgixG1yN5BuTF5XQ',
    accessToken: 'XgTA-3HCsHUpBn-qeQNF1R-hIa_HgO5s',
    accessTokenSecret: 'GLF2oOns7-LqsbnAmNqH3SRzE_A',
  };

  var terms = 'food';
  var near = 'San+Francisco';

  var accessor = {
    consumerSecret: Oauth.consumerSecret,
    tokenSecret: Oauth.accessTokenSecret
  };

  var parameters = [];
  parameters.push(['term', terms]);
  parameters.push(['location', near]);
  parameters.push(['oauth_consumer_key', Oauth.consumerKey]);
  parameters.push(['oauth_consumer_secret', Oauth.consumerSecret]);
  parameters.push(['oauth_token', Oauth.accessToken]);

  var message = { 
    'action': 'http://api.yelp.com/v2/search',
    'method': 'GET',
    'parameters': parameters 
  };

  OAuth.setTimestampAndNonce(message);  

  OAuth.SignatureMethod.sign(message, accessor);

  var parameterMap = OAuth.getParameterMap(message.parameters);
  parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)

  var url = OAuth.addToURL(message.action,parameterMap);
  var response = UrlFetchApp.fetch(url).getContentText();
  var responseObject = Utilities.jsonParse(response);