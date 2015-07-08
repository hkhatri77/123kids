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
  parameters.push(['oauth_consumer_key', auth.consumerKey]);
  parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
  parameters.push(['oauth_token', auth.accessToken]);

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