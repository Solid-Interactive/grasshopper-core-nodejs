'use strict';

var _ = require('lodash'),
    config = require('../../config'),
    db = require('../../db');

module.exports = query;

function query(kontx, next) {

    var options = kontx.args.options || {};

    if(!_.isUndefined(kontx.args)){
        options.limit = getListPageSize(options);
        options.skip = getListSkipSize(options);
    } else {
        options.limit = config.db.defaultPageSize;
        options.skip = 0;
    }

    db.content.query(kontx.args.nodes, kontx.args.types, kontx.args.filters, options)
        .then(function(value){
            kontx._content = value;
            next();
        })
        .fail(function(err){
            next(err);
        })
        .done();
}

function getListPageSize(options){
    return ( !_.isNull(options.limit) && !_.isUndefined(options.limit) && !_.isNaN(parseInt(options.limit, 10)) && _.isNumber(parseInt(options.limit, 10)) ) ?
        parseInt(options.limit, 10) : config.db.defaultPageSize;
}


function getListSkipSize(options){
    return ( !_.isNull(options.skip) && !_.isUndefined(options.skip) && !_.isNaN(parseInt(options.skip, 10)) && _.isNumber(parseInt(options.skip, 10)) ) ?
        parseInt(options.skip) : 0;
}