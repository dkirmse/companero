function ArgumentException(message, extra) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    this.extra = extra;
};

function ConnectionException(message, extra) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    this.extra = extra;
};

module.exports.ArgumentException = ArgumentException
module.exports.ConnectionException = ConnectionException

require('util').inherits(ArgumentException, Error);
require('util').inherits(ConnectionException, Error);