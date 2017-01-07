var util = require('util');
var http = require('http');

// Http access error
function HttpError(status, message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, HttpError);

  this.status = status;
  this.message = message || http.STATUS_CODES[status] || "";
}
util.inherits(HttpError, Error);
HttpError.prototype.name = 'HttpError';

// User authentication error
function AuthError(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, AuthError);

  this.message = message;
}
util.inherits(AuthError, Error);
AuthError.prototype.name = 'AuthError';


exports.HttpError = HttpError;
exports.AuthError = AuthError;
