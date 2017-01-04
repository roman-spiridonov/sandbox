var fs = require('fs');
var url = require('url');
var mime = require('mime'); // https://www.npmjs.com/package/mime
const path = require('path');

var count = 0; // # of file requests
var STATIC_ROOT = path.join(__dirname, 'public');

/**
 * Handles request to a file, validates it and returns a file.
 * @param {Readable} req - input stream
 * @param {Writable} res - output stream
 */ 
function serveStatic(req, res) {
    try {
        var filepath = decodeURIComponent(url.parse(req.url).pathname);
        if(filepath === '/') {
            filepath = '/index.html';
        }
    } catch(e) {
        res.statusCode = 400;
        res.end('400 Bad request');
        return;
    }

    if(~filepath.indexOf('\0')) {  // if string starts with zero byte
        res.statusCode = 400;
        res.end('400 Bad request');
        return;
    }

    filepath = path.normalize(path.join(STATIC_ROOT, filepath));

    if(filepath.indexOf(STATIC_ROOT) != 0) {  // someone hacked path by using ../ segments, etc.
        res.statusCode = 404;
        res.end("File not found");
        return;
    }

    fs.stat(filepath, function(err, stats) {  // check that the file exists
        if(err || !stats.isFile()) {
            res.statusCode = 404;
            res.end("404 File not found");
            return;
        }

        sendFile(filepath, res);  // put into callback to make sure it is executed after all checks
            // note the rest of the checks above are in synchronous code
    });


}

/**
 * Sends file located at `path` to the open response stream. Closes response stream as a result.
 * @param {string} path - valid path to a file.
 * @param {Writable} res - response stream.
 */
function sendFile(filepath, res) {
    try {
        var mimeStr = mime.lookup(filepath);
    } catch(e) {
        console.error(e);
    }
    
    fs.readFile(filepath, function(err, data) {
        if(err) {
            res.statusCode = 500;
            res.end("500 Internal server error");
            throw err;  // if not handled, kills server
        } else {
            res.setHeader('Content-Type', mimeStr + '; charset: utf-8');
            res.end(data);
            console.log("Requests handled: ", ++count);
        }
    });
}

module.exports = serveStatic;

