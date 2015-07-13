"use strict";

// es5 polyfills, powered by es5-shim
require("es5-shim")
// es6 polyfills, powered by babel
require("babel/register")

var Promise = require('es6-promise').Promise
var $ = require('jquery')
var Backbone = require('backbone')




function doMagic() {
    var yelp =  JSON.parse(httpGet("http://localhost:3000/yelp?term={term}&location={location}"));
    var obj = yelp.businesses;
    var tbl = $("<table/>").attr("id", "mytable");
    $("#div1").append(tbl);
    for (var i = 0; i < obj.length; i++) {
        var tr = "<tr>";
        var td1 = "<td class='test'>" + obj[i]["name"] + "</td>";
        var td2 = "<td>" + obj[i]["phone"] + "</td>";
        var td3 = "<td>" + obj[i]["rating"] + "</td></tr>";

        $("#mytable").append(tr + td1 + td2 + td3);

    }

    console.log(yelp);
}

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

