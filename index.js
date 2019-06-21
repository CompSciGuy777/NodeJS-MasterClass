/*
* Pirples API 
*/

//dependancies
const http = require('http');
const https = require('https')
const url = require('url');
const {StringDecoder} = require('string_decoder');
const config = require('./config');
const fs = require('fs');
let _data = require('./lib/data');

//TESTING
//@NOTE delete this
_data.read('test', 'newfile', (err, data)=>{
    console.log("There was the error creating data:", err, "and this is the data", data);
});


//Instantiating the http server
const httpServer = http.createServer((req,res) => {
    unifiedServer(req, res)
});

//Start the http server
httpServer.listen( config.httpPort , () => {console.log(`The Server is listening on Port ${config.httpPort} on ${config.envName}`)});


//Instantiating the https server
const httpsServerOptions = {
    'key': fs.readFileSync('./https/-key.pem'),
    'cert': fs.readFileSync('./https/-cert.pem')
};
const httpsServer = https.createServer(httpsServerOptions, (req,res) => {
    unifiedServer(req, res)
});

//Start the https server
httpsServer.listen( config.httpsPort , () => {console.log(`The Server is listening on Port ${config.httpsPort} on ${config.envName}`)});



//generating the logic for both servers
const unifiedServer = (req, res) => {

    //Get url and parse it
    const parsedURL = url.parse(req.url, true);

    //Get the path
    const path = parsedURL.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //Get Query String params as object
    const queryString = parsedURL.query;

    
    //Get the HTTP Method
    const method = req.method.toLowerCase();

    //Get the Headers as an object
    const headerObject = req.headers

    //Get payload if there is any
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });
    req.on('end', () => {
        buffer += decoder.end()

        //Choose the handler the request should go to
        let choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        //construct the data object to send to the handler
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryString,
            'method' : method,
            'headers' : headerObject,
            'payload' : buffer
        };

        //route the request to the specified handler
        choosenHandler(data, (statusCode, payload) => {
            //use the status code called back by the handler or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            //use the payload called back by the handler or default to 
            payload = typeof(payload) == 'object' ? payload : {};

            //convert the payload to a string
            const payloadString = JSON.stringify(payload);

            //return the payload
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode);
            res.end(payloadString);
            
            //log the request path
            console.log("returning this response: ", statusCode, payloadString);
        });
    });
};

//defining a handler object
let handlers = {}

//Ping handler
handlers.ping = (data, callback) => {
    callback(200);
};

//Not Found
handlers.notFound = (data, callback) => {
    callback(404);
};

//defining a request router
const router = {
    'ping' : handlers.ping
};