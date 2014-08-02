/**
 * The identity middleware will take a token that is passed in and validate it in the system.
 * @param kontx
 * @param next
 */
module.exports = function identity(kontx, next){
    'use strict';

    var _ = require('lodash'),
        db = require('../db'),
        Strings = require('../strings'),
        strings = new Strings('en'),
        err = require('../utils/error')(401);

    if(_.isUndefined(kontx.token)){
        next(err);
        return;
    }

    db.tokens.getById(kontx.token).then(function(token){
        db.users.getById(token.uid).then(function(identity){
                kontx.user = identity;
                next();
            })
            .fail(function(err){
                next(err);
            }).done();

    }).fail(function(){
        next(err);
    }).done();
};