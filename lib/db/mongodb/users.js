module.exports = (function() {
    'use strict';

    var mongoose = require('mongoose'),
        q = require('q'),
        error = require('../../utils/error'),
        async = require('async'),
        crud = require('./mixins/crud'),
        _ = require('lodash'),
        collectionName = 'users',
        filterFactory = require('./search/filterFactory'),
        schema = require('./schemas/user'),
        tokens = require('./tokens'),
        user;

    function handleUser(err, doc, deferred) {
        if (err) {
            deferred.reject(error(err));
        } else if (doc !== null) {
            deferred.resolve(doc);
        } else {
            deferred.reject(error(404));
        }
    }

    user = Object.create(crud, {
        model: {
            value: mongoose.model(collectionName, schema)
        },
        privateFields: {
            value: ['salt', 'pass_hash', 'identities']
        }
    });

    user.getByEmail = function(email) {
        var deferred = q.defer();

        this.model.findOne({
            email: email
        }, this.buildIncludes()).lean().exec(function(err, doc) {
            handleUser(err, doc, deferred);
        });

        return deferred.promise;
    };

    user.basicAuthentication = function(username, password) {
        var deferred = q.defer();

        this.model.findOne({
            'identities.basic.username': username
        }, function(err, doc) {
            var valid = (doc !== null) ? doc.basicAuthentication(password) : false;

            if (!valid) {
                handleUser(null, null, deferred);
            } else {
                handleUser(err, doc, deferred);
            }
        });

        return deferred.promise;
    };

    user.googleAuthentication = function(googleId) {
        var deferred = q.defer();

        this.model.findOne({
            'identities.google.id': googleId
        }, function(err, doc) {
            if (doc !== null && ! doc.enabled) {
                handleUser('This user is disabled', doc, deferred);
            } else {
                handleUser(err, doc, deferred);
            }
        });

        return deferred.promise;
    };

    user.savePermissions = function(userId, nodeid, role) {
        var deferred = q.defer();

        this.model.findOne({
            _id: userId
        }, function(err, doc) {
            if (err) {
                deferred.reject(error(err));
            } else {
                var permissions = (!doc.permissions) ? [] : _.filter(doc.permissions, function(permission) {
                    return permission.nodeid.toString() != nodeid;
                });

                permissions[permissions.length] = {
                    nodeid: nodeid,
                    role: role
                };

                doc.permissions = permissions;
                doc.save(function(err) {
                    if (err) {
                        deferred.reject(error(err));
                    } else {
                        deferred.resolve('Success');
                    }
                });
            }
        });

        return deferred.promise;
    };

    user.deletePermission = function(userId, nodeId) {
        var deferred = q.defer();

        this.model.findOne({
            _id: userId
        }, function(err, doc) {
            if (err) {
                deferred.reject(error(err));
            } else {
                doc.permissions = (!doc.permissions) ? [] : _.filter(doc.permissions, function(permission) {
                    return permission.nodeid.toString() != nodeId;
                });

                doc.save(function(err) {
                    if (err) {
                        deferred.reject(error(err));
                    } else {
                        deferred.resolve('Success');
                    }
                });
            }
        });

        return deferred.promise;
    };

    user.update = function(obj) {
        var primaryKey = _.extend({}, obj)._id,
            self = this,
            deferred = q.defer();

        delete obj._id;

        this.model.findById(primaryKey, function(err, doc) {
            var mergedObj = null,
                existingIdentities = doc.toJSON().identities;

            if (err) {
                deferred.reject(self.handleError(err));
                return;
            }

            if (doc) {
                mergedObj = _.merge({
                    identities: existingIdentities
                }, obj);

                _.each(_.keys(obj), function(key) {
                    try {
                        doc[key] = mergedObj[key];
                    } catch (ex) {
                        console.log(ex);
                    }
                });

                doc.save(function(err) {
                    if (err) {
                        deferred.reject(self.handleError(err));
                    } else {
                        self.getById(primaryKey)
                            .then(function(data) {
                                deferred.resolve(data);
                            })
                            .fail(function(err) {
                                deferred.reject(error(err));
                            });
                    }
                });
            } else {
                deferred.reject(error(404));
            }
        });

        return deferred.promise;
    };

    user.query = function(filters, options) {
        var qry = {},
            deferred = q.defer(),
            self = this;

        filterFactory.createQuery(filters, qry);

        async.parallel(
            [

                function(cb) {
                    self.model.find(qry, self.buildIncludes(options), options).lean().exec(function(err, data) {
                        if (err) {
                            cb(err);
                        } else {
                            cb(null, data);
                        }
                    });
                },
                function(cb) {
                    self.model.count(qry).lean().exec(function(err, data) {
                        if (err) {
                            cb(err);
                        } else {
                            cb(null, data);
                        }
                    });
                }
            ], function(err, results) {
                var result;

                if (err) {
                    deferred.reject(err);
                } else {

                    result = {
                        total: _.isUndefined(results[1]) ? 0 : results[1],
                        limit: options.limit,
                        skip: options.skip,
                        results: results[0]
                    };

                    deferred.resolve(result);
                }
            }
        );

        return deferred.promise;
    };

    user.linkIdentity = function(userId, key, options) {
        var deferred = q.defer(),
            self = this,
            updateOptions = {
                $addToSet: {
                    'linkedidentities': key
                }
            },
            identityString = 'identities.' + key;

        updateOptions[identityString] = options;

        this.model.findOne({
            _id: userId
        }, function(err, doc) {
            if (err) {
                deferred.reject(error(err));
            } else {
                if(doc.enabled) {
                    self.model.update({
                        _id: userId
                    }, updateOptions, {}, function(err) {
                        if (err) {
                            deferred.reject(error(err));
                        } else {
                            deferred.resolve('Success');
                        }
                    });
                } else {
                    deferred.reject('This user is disabled.');
                }
            }
        });

        return deferred.promise;
    };

    user.unLinkIdentity = function(userId, key) {
        var deferred = q.defer();

        this.model.findOne({
            _id: userId
        }, function(err, doc) {
            if (err) {
                deferred.reject(error(err));
            } else {

                if (_.has(doc.identities, key)) {
                    delete doc.identities[key];
                }

                // http://mongoosejs.com/docs/guide.html#toObject Calling to obj will remove a toObj method from the obj.
                doc.linkedidentities = _.keys(doc.identities);

                doc.save(function(err) {
                    if (err) {
                        deferred.reject(error(err));
                    } else {
                        tokens.deleteByUserIdAndType(userId, key)
                            .done(function() {
                                deferred.resolve('Success');
                            });
                    }
                });
            }
        });

        return deferred.promise;
    };

    return user;
})();