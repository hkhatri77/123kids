require('babel/register')

export var express = require('express'),
    http = require('http'),
    path = require('path'),
    app = express(),
    request = require('request'),
    session = require('express-session'),
    csrf = require('csurf'),
    override = require('method-override')

function startServer() {

    function querify(queryParamsObject) {
        return '?' + Object.keys(queryParamsObject).map(function(val, key) {
            return val + '=' + queryParamsObject[val]
        }).join('&')
    }

    // adds a new rule to proxy a localUrl -> webUrl
    // i.e. proxify ('/my/server/google', 'http://google.com/')
    function proxify(localUrl, webUrl) {
        app.get(localUrl, (req, res) => {
            var tokens = webUrl.match(/:(\w+)/ig)
            var remote = (tokens || []).reduce((a, t) => {
                return a.replace(new RegExp(t, 'ig'), req.params[t.substr(1)])
            }, webUrl)
            req.pipe(request(remote + querify(req.query))).pipe(res)
        })
    }

    // add your proxies here.
    //
    // examples:
    // proxify('/yummly/recipes', 'http://api.yummly.com/v1/api/recipes');
    // proxify('/brewery/styles', 'https://api.brewerydb.com/v2/styles');

    // all environments
    app.set('port', process.argv[3] || process.env.PORT || 3000)
    app.use(express.static(path.join(__dirname, '')))
    app.get('/yelp', function(req, res) {

        var yelp = require("yelp").createClient({
            consumer_key: "Dcmz07el7YmH2SgHfCRwdQ",
            consumer_secret: "b3xadmEYI1yQgixG1yN5BuTF5XQ",
            token: "XgTA-3HCsHUpBn-qeQNF1R-hIa_HgO5s",
            token_secret: "GLF2oOns7-LqsbnAmNqH3SRzE_A"
        });


        // See http://www.yelp.com/developers/documentation/v2/search_api


        yelp.search({
            term: req.param("term"),
            location: "Houston",
            sort: "1",
            is_claimed: "true",
            image_url: "true"


        }, function(error, data) {
            console.log(error);
            console.log(data);
            res.send(200, data);
        });

    });

    app.get('/eventful', function(req, res) {
        http.get("http://api.eventful.com/json/events/search?app_key=S2JXWfF9x67LXtpR&q=family", function(response) {
            console.log("Got response: " + response.statusCode);
            var ourdata = '';
            response.on('data', function(data) {
                response.setEncoding('utf8');
                console.log("Data: ");
                console.log(data);
                ourdata += data;
            });
            response.on('end', function() {
                res.send(200, ourdata);
            });
        }).on('error', function(e) {
            console.log("Got error: " + e.message);
            res.send(500, e.message);
        });

    });



    // SOME SECURITY STUFF
    // ----------------------------
    // more info: https://speakerdeck.com/ckarande/top-overlooked-security-threats-to-node-dot-js-web-applications
    // ----
    // remove some info so we don't divulge to potential
    // attackers what platform runs the website
    app.disable('x-powered-by')
        // change the generic session cookie name
    app.use(session({
            secret: 'some secret',
            key: 'sessionId',
            cookie: {
                httpOnly: true,
                secure: true
            }
        }))
        // enable overriding
    app.use(override("X-HTTP-Method-Override"))
        // enable CSRF protection
    app.use(csrf())
    app.use((req, res, next) => {
            res.locals.csrftoken = req.csrfToken() // send the token to the browser app
            next()
        })
        // ---------------------------

    http.createServer(app).listen(app.get('port'), function() {
        console.log('Express server listening on port ' + app.get('port'))
    })

}

module.exports.startServer = startServer
