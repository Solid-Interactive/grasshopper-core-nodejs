var should = require('chai').should(),
    _ = require('lodash');

describe('Grasshopper core - contentTypes', function () {
    'use strict';

    var grasshopper = require('../lib/grasshopper').init(require('./fixtures/config')),
        path = require('path'),
        testContentTypeId = '524362aa56c02c0703000001',
        anotherTestContentTypeId = '524362aa56c02c0703000123',
        readerToken = '',
        adminToken = '',
        testCreatedContentTypeId = '';

    before(function (done) {
        grasshopper.auth('username', { username: 'apitestuseradmin', password: 'TestPassword' })
            .then(function (token) {
                adminToken = token;
                grasshopper.auth('username', { username: 'apitestuserreader', password: 'TestPassword' })
                    .then(function (token) {
                        readerToken = token;
                        done();
                    },
                    function (err) {
                        console.log('This aint mine yo');
                        console.log(err);
                    });
            });
    });

//    describe('getById', function () {
//        it('should return 401 because trying to access unauthenticated', function (done) {
//            grasshopper.request()
//                .contentTypes.getById(testContentTypeId)
//                .then(done)
//                .fail(function (err) {
//                    err.code.should.equal(401);
//                    done();
//                })
//                .catch(done)
//                .done();
//        });
//
//        it('should return an existing content type', function (done) {
//            grasshopper.request(adminToken)
//                .contentTypes.getById(testContentTypeId)
//                .then(function (payload) {
//                    payload._id.toString().should.equal(testContentTypeId);
//                    done();
//                })
//                .fail(done)
//                .catch(done)
//                .done();
//        });
//
//        it('should return 404 because test user id does not exist', function (done) {
//            grasshopper.request(adminToken)
//                .contentTypes.getById('5246e73d56c02c0744000004')
//                .then(done)
//                .fail(function (err) {
//                    err.code.should.equal(404);
//                    done();
//                })
//                .catch(done)
//                .done();
//        });
//    });

//    describe('get list', function () {
//        it('should return a list of content types with the default page size', function (done) {
//            grasshopper
//                .request(adminToken).contentTypes.list()
//                .then(function (payload) {
//                    payload.results.length.should.equal(13);
//                    done();
//                })
//                .fail(done)
//                .catch(done);
//        });
//        it('should a list of content types with the specified page size', function (done) {
//            grasshopper.request(adminToken)
//                .contentTypes.list({limit: 1})
//                .then(function (payload) {
//                    payload.results.length.should.equal(1);
//                    done();
//                })
//                .fail(done)
//                .catch(done);
//        });
//
//        it('should return an empty list if the page size and current requested items are out of bounds.', function (done) {
//            grasshopper.request(adminToken)
//                .contentTypes.list({limit: 20, skip: 100})
//                .then(function (payload) {
//                    payload.results.length.should.equal(0);
//                    done();
//                })
//                .fail(done)
//                .catch(done);
//        });
//
//        it('should return the results sorted alphabetically by label', function (done) {
//
//            var label = "aaaaaa",
//                newContentType = {
//                    "label": label,
//                    "fields": [
//                        {
//                            "label": label,
//                            "max": 1,
//                            "min": 1,
//                            "options": false,
//                            "type": "textbox",
//                            "validation": [],
//                            "_id": "title"
//                        },
//                        {
//                            "label": "Something",
//                            "max": 1,
//                            "min": 1,
//                            "options": false,
//                            "type": "textbox",
//                            "validation": [
//                                {
//                                    "type": "alpha",
//                                    "options": {
//                                        "min": "5",
//                                        "max": "5"
//                                    }
//                                }
//                            ],
//                            "_id": "something"
//                        }
//                    ]
//                };
//
//            grasshopper.request(adminToken).contentTypes.insert(newContentType)
//                .then(function () {
//                    grasshopper.request(adminToken)
//                        .contentTypes.list()
//                        .then(function (payload) {
//                            payload.results[0].label.should.equal(label);
//                            done();
//                        })
//                        .fail(done)
//                        .catch(function(err) {
//                            should.not.exist(err);
//                            done();
//                        });
//                });
//        });
//
//        it('should return a 401 because user is not authenticated', function(done) {
//            grasshopper.request()
//                .contentTypes.list()
//                .then(done)
//                .fail(function (err) {
//                    err.code.should.equal(401);
//                    done();
//                })
//                .catch(done);
//        });
//    });

//    describe('insert', function() {
//        it('should insert a new contentType with the new schema', function (done) {
//            var newContentType = {
//                "label": "Test Type",
//                "fields": [
//                    {
//                        "label": "Title",
//                        "max": 1,
//                        "min": 1,
//                        "options": false,
//                        "type": "textbox",
//                        "validation": [],
//                        "_id": "title"
//                    },
//                    {
//                        "label": "Something",
//                        "max": 1,
//                        "min": 1,
//                        "options": false,
//                        "type": "textbox",
//                        "validation": [
//                            {
//                                "type": "alpha",
//                                "options": {
//                                    "min": "5",
//                                    "max": "5"
//                                }
//                            }
//                        ],
//                        "_id": "something"
//                    }
//                ]
//            };
//
//            grasshopper.request(adminToken)
//                .contentTypes.insert(newContentType)
//                .then(function (payload) {
//                    payload.label.should.equal(newContentType.label);
//                    done();
//                })
//                .fail(done)
//                .catch(done);
//        });
//
//        it('should insert a content type', function (done) {
//            var newContentType = {
//                label: 'newtestsuitecontent',
//                fields: [
//                    {
//                        _id: 'testfield',
//                        label: 'Title',
//                        type: 'textbox',
//                        min: 1,
//                        max: 2
//                    }
//                ],
//                helpText: '',
//                description: ''
//            };
//            grasshopper.request(adminToken)
//                .contentTypes.insert(newContentType)
//                .then(function (payload) {
//                    payload.label.should.equal(newContentType.label);
//                    testCreatedContentTypeId = payload._id;
//                    done();
//                })
//                .fail(done)
//                .catch(done);
//        });
//
//        it('should return an error because we are missing a "label" field.', function (done) {
//            var newContentType = {
//                fields: [
//                    {
//                        _id : 'testid',
//                        label: 'Title',
//                        type: 'textbox',
//                        min: 1,
//                        max: 2
//                    }
//                ],
//                helpText: '',
//                description: ''
//            };
//            grasshopper.request(adminToken).contentTypes.insert(newContentType)
//                .then(doneError.bind(null, done))
//                .fail(function (err) {
//                    err.code.should.equal(400);
//                    err.message.should.equal('"label" is a required field.');
//                    done();
//                })
//                .catch(doneError.bind(null, done))
//                .done();
//        });
//
//        describe('the fields collection', function() {
//            it('should return an error when fields is not an array', function(done) {
//                var newContentType = {
//                    label: 'newtestsuitecontent',
//                    fields: [{
//                        yourMomma : 'true'
//                    }],
//                    helpText: '',
//                    description: ''
//                };
//
//                grasshopper.request(adminToken).contentTypes.insert(newContentType)
//                    .then(done)
//                    .fail(function (err) {
//                        console.log(err.message);
//                        err.code.should.equal(400);
//                        done();
//                    })
//                    .catch(done);
//            });
//
//            it('should turn an empty fields object into an array, so it does not break everything says Kaija', function(done) {
//                var newContentType = {
//                    label: 'newtestsuitecontent',
//                    fields: {},
//                    helpText: '',
//                    description: ''
//                };
//
//                grasshopper.request(adminToken).contentTypes.insert(newContentType)
//                    .then(function(response) {
//                        _.isArray(response.fields).should.be.ok;
//                        done();
//                    })
//                    .fail(done)
//                    .catch(done);
//            });
//
//            it('should return error when a malformed field id is passed in (_id has a space).', function (done) {
//                var newContentType = {
//                    label: 'newtestsuitecontent',
//                    fields: [
//                        {
//                            _id : 'this has a space',
//                            type: 'textbox',
//                            label: 'test',
//                            min: 1,
//                            max: 3
//                        }
//                    ],
//                    helpText: '',
//                    meta: [],
//                    description: ''
//                };
//
//                grasshopper.request(adminToken).contentTypes.insert(newContentType)
//                    .then(done)
//                    .fail(function (err) {
//                        err.code.should.equal(400);
//                        err.message.should.equal('Content Type Field id\'s cannot have any spaces.');
//                        done();
//                    })
//                    .catch(done);
//            });
//
//            it('should return error when a malformed field is passed in (missing _id).', function (done) {
//                var newContentType = {
//                    label: 'newtestsuitecontent',
//                    fields: [
//                        {
//                            type: 'textbox',
//                            label: 'test',
//                            min: 1,
//                            max: 3
//                        }
//                    ],
//                    helpText: '',
//                    meta: [],
//                    description: ''
//                };
//
//                grasshopper.request(adminToken).contentTypes.insert(newContentType)
//                    .then(done)
//                    .fail(function (err) {
//                        err.code.should.equal(400);
//                        err.message.should.equal('"_id" is a required field.');
//                        done();
//                    })
//                    .catch(done);
//            });
//
//            it('should return error when a malformed field is passed in (missing type).', function (done) {
//                var newContentType = {
//                    label: 'newtestsuitecontent',
//                    fields: [
//                        {
//                            _id: 'ThisIsOk',
//                            label: 'test',
//                            min: 1,
//                            max: 3
//                        }
//                    ],
//                    helpText: '',
//                    meta: [],
//                    description: ''
//                };
//
//                grasshopper.request(adminToken).contentTypes.insert(newContentType)
//                    .then(done)
//                    .fail(function (err) {
//                        err.code.should.equal(400);
//                        err.message.should.equal('"type" is a required field.');
//                        done();
//                    })
//                    .catch(done);
//            });
//
//            it('should add a unique id to each field.', function (done) {
//                var testContentType = {
//                    "label": "new test content type",
//                    "fields": [
//                        {
//                            "label": "Title",
//                            "dataType": "string",
//                            "defaultValue": "",
//                            "_id": "title",
//                            "validation": [],
//                            "type": "textbox",
//                            "options": false,
//                            "min": 1,
//                            "max": 1
//
//                        },
//                        {
//                            "label": "a date",
//                            "dataType": "date",
//                            "_id": "a-date",
//                            "validation": [],
//                            "type": "date",
//                            "options": false,
//                            "min": 1,
//                            "max": 1
//
//                        },
//                        {
//                            "label": "a radio",
//                            "dataType": "boolean",
//                            "_id": "a-radio",
//                            "validation": [],
//                            "type": "radio",
//                            "options": false,
//                            "min": 1,
//                            "max": 1
//
//                        }
//                    ]
//                };
//                grasshopper.request(adminToken).contentTypes.insert(testContentType)
//                    .then(function (payload) {
//                        _.each(payload.fields, function (field) {
//                            field.should.have.ownProperty('_uid');
//                        });
//
//                        done();
//                    })
//                    .fail(done)
//                    .catch(done);
//            });
//        });
//    });

    describe('update', function() {
//        before(function (done) {
//            grasshopper.request(adminToken).content.insert({
//                meta: {
//                    type: anotherTestContentTypeId,
//                    node: '526d5179966a883540000006',
//                    labelfield: 'label'
//                },
//                fields: {
//                    label: 'Generated title',
//                    testfield: 'testtest',
//                    alphanumfield: 'tes123fdsfafsdafdsafsdafasfdsaest'
//                }
//            }).then(
//                function () {
//                    done();
//                });
//        });

        xit('should return a 403 because user does not have permissions to access users', function (done) {
            var newContentType = {
                _id: testCreatedContentTypeId,
                label: 'updatedlabel',
                fields: [
                    {
                        _id: 'testfield',
                        required: true,
                        label: 'Title'
                    }
                ],
                helpText: '',
                description: ''
            };

            grasshopper.request(readerToken)
                .contentTypes.update(newContentType)
                .then(done)
                .fail(function (err) {
                    err.code.should.equal(403);
                    done();
                })
                .catch(done);
        });

        xit('should update a content type', function(done) {
            var newContentType = {
                _id: anotherTestContentTypeId,
                label: 'updatedlabel',
                fields: [
                    {
                        _id: 'testttt',
                        label: 'Test Field Label',
                        type: 'textbox',
                        min: 1,
                        max: 3
                    }
                ],
                helpText: '',
                description: ''
            };

            grasshopper.request(adminToken).contentTypes.update(newContentType)
                .then(function (payload) {
                    payload.label.should.equal(newContentType.label);
                    done();
                })
                .fail(done)
                .catch(done);
        });

        xit('should add a UID if any field is added or missing one.', function(done) {
            var newContentType = {
                _id: anotherTestContentTypeId,
                label: 'updatedlabel',
                fields: [
                    {
                        _id: 'testttt',
                        label: 'Test Field Label',
                        type: 'textbox'
                    }
                ],
                helpText: '',
                description: ''
            };

            grasshopper.request(adminToken).contentTypes.update(newContentType)
                .then(function (payload) {
                    payload.fields[0].should.ownProperty('_uid');
                    done();
                })
                .fail(done)
                .catch(done);
        });

        xit('should return error if content type is updated without a set "ID"', function(done) {
            var newContentType = {
                label: 'updatedlabel',
                fields: [
                    {
                        _id: 'testid',
                        label: 'Test Field Label',
                        type: 'textbox'
                    }
                ],
                helpText: '',
                description: ''
            };

            grasshopper.request(adminToken)
                .contentTypes.update(newContentType)
                .then(done)
                .fail(function (err) {
                    err.code.should.equal(404);
                    done();
                })
                .catch(done);
        });

        xit('should update content field ids on content if a contenttype field id is changed.', function(done) {
            var valueToLookFor = 'superfunky',
                valueToLookFor2 = 'wakka',
                valueToLookFor3 = 'testtest',
                contentToQueryId = '',
                createdContentType1 = '',
                testContentType = {
                    "label": "new test content type",
                    "fields": [
                        {
                            "dataType": "string",
                            "defaultValue": "",
                            "_id": "title",
                            "validation": [],
                            "type": "textbox",
                            "options": false,
                            "min": 1,
                            "max": 1,
                            "label": "Title"
                        },
                        {
                            "dataType": "date",
                            "_id": "a-date",
                            "validation": [],
                            "type": "date",
                            "options": false,
                            "min": 1,
                            "max": 1,
                            "label": "a date"
                        },
                        {
                            "dataType": "boolean",
                            "_id": "a-radio",
                            "validation": [],
                            "type": "radio",
                            "options": false,
                            "min": 1,
                            "max": 1,
                            "label": "a radio"
                        }
                    ]
                };

            grasshopper.request(adminToken).contentTypes.insert(testContentType)
                .then(function (createdContentType) {
                    var testContent = {
                        "fields": {
                            "a-radio": false,
                            "a-date": "2014-02-22T08:00:00.000Z",
                            "title": "jiggity"
                        },
                        "meta": {
                            "node": "53cece8de1c9ff0b00e6b4a3",
                            "type": createdContentType._id,
                            "labelfield": "title",
                            "typelabel": "new test content type",
                            "created": "2014-08-11T19:24:54.138Z",
                            "lastmodified": "2014-08-11T19:24:54.137Z"
                        }
                    };
                    createdContentType1 = createdContentType;
                    return grasshopper.request(adminToken).content.insert(testContent);
                })
                .then(function (createdContent) {
                    contentToQueryId = createdContent._id;
                    createdContentType1.fields[0]._id = valueToLookFor;
                    createdContentType1.fields[0].label = 'newLabel';
                    createdContentType1.fields[1]._id = valueToLookFor2;
                    createdContentType1.fields[2]._id = valueToLookFor3;
                    return grasshopper.request(adminToken).contentTypes.update(createdContentType1);
                })
                .then(function () {
                    return grasshopper.request(adminToken).content.getById(contentToQueryId);
                })
                .then(function (foundContent) {
                    _.has(foundContent.fields, valueToLookFor).should.be.ok;
                    _.has(foundContent.fields, valueToLookFor2).should.be.ok;
                    _.has(foundContent.fields, valueToLookFor3).should.be.ok;
                    done();
                })
                .fail(done)
                .catch(done);

        });

        xit('should update content field ids on embedded content if a contenttype field id is changed on a top level embedded type.', function(done) {
            var typeToEmbed = {
                    "label": "cooperembeddeep",
                    "fields": [
                        {
                            "dataType": "string",
                            "_id": "title",
                            "validation": [],
                            "type": "textbox",
                            "options": false,
                            "min": 1,
                            "max": 1,
                            "label": "Title"
                        },
                        {
                            "dataType": "date",
                            "_id": "date",
                            "validation": [],
                            "type": "date",
                            "options": false,
                            "min": 1,
                            "max": 1,
                            "label": "date"
                        }
                    ]
                },
                typeWithEmbed = {
                    "label": "cooperembed",
                    "fields": [
                        {
                            "dataType": "string",
                            "defaultValue": "",
                            "_id": "title",
                            "validation": [],
                            "type": "textbox",
                            "options": false,
                            "min": 1,
                            "max": 1,
                            "label": "Title"
                        },
                        {
                            "dataType": "ref",
                            "_id": "theembed",
                            "validation": [],
                            "type": "embeddedtype",
                            "min": 1,
                            "max": 1,
                            "options" : 'will be embedded with the typeToEmbed',
                            "label": "theembed"
                        }
                    ]
                },
                typeWithEmbedShallow = {
                    "label": "cooperembedshallow",
                    "fields": [
                        {
                            "dataType": "string",
                            "defaultValue": "",
                            "_id": "titlewakka",
                            "validation": [],
                            "type": "textbox",
                            "options": false,
                            "min": 1,
                            "max": 1,
                            "label": "Titlewakka"
                        },
                        {
                            "dataType": "ref",
                            "_id": "theshallowembed",
                            "validation": [],
                            "type": "embeddedtype",
                            "options": "will be embedded with the typeWithEmbed",
                            "min": 1,
                            "max": 1,
                            "label": "theshallowembed"
                        }
                    ]
                },
                content1 = {
                    "fields": {
                        "theshallowembed":{
                            "theembed": {
                                "date": "2014/08/12",
                                "title": "testingembedtitle"
                            },
                            "title": "maintitletest"
                        },
                        "titlewakka" : "some title"
                    },
                    "meta": {
                        "node": "53ecde8c54eae3173a09960f",
                        "type": "",
                        "labelfield": "titlewakka",
                        "typelabel": "cooperembed",
                        "created": "2014-08-14T16:08:15.323Z",
                        "lastmodified": "2014-08-14T16:08:15.323Z"
                    }
                };

            grasshopper.request(adminToken).contentTypes.insert(typeToEmbed)
                .then(function (createdContentType) {
                    typeToEmbed = createdContentType;
                    typeWithEmbed.fields[1].options = String(typeToEmbed._id).valueOf();
                    return grasshopper.request(adminToken).contentTypes.insert(typeWithEmbed);
                })
                .then(function (secondaryContentType) {
                    typeWithEmbed = secondaryContentType;
                    typeWithEmbedShallow.fields[1].options = String(typeWithEmbed._id).valueOf();
                    return grasshopper.request(adminToken).contentTypes.insert(typeWithEmbedShallow);
                })
                .then(function(createdTypeWithEmbedShallow){
                    typeWithEmbedShallow = createdTypeWithEmbedShallow;
                    content1.meta.type = typeWithEmbedShallow._id.toString();
                    return grasshopper.request(adminToken).content.insert(content1);
                })
                .then(function (createdContent1) {
                    content1 = createdContent1;
                })
                // Update a simple field and assert that it changed on content1
                .then(function() {
                    typeWithEmbedShallow.fields[0]._id = "sillytitle";
                    return grasshopper.request(adminToken).contentTypes.update(typeWithEmbedShallow);
                })
                .then(function () {
                    return grasshopper.request(adminToken).content.getById(content1._id);
                })
                .then(function (retrievedContent1) {
                    _.has(retrievedContent1.fields, 'sillytitle').should.be.ok;
                    retrievedContent1.fields.sillytitle.should.equal('some title');
                })
                .then(done)
                .fail(done)
                .catch(done);
        });

        it('should update content field ids on embedded content if a contenttype field id is changed on a deep level embedded type.', function(done) {
            var typeToEmbed = {
                    "label": "cooperembeddeep",
                    "fields": [
                        {
                            "dataType": "string",
                            "_id": "title",
                            "validation": [],
                            "type": "textbox",
                            "options": false,
                            "min": 1,
                            "max": 1,
                            "label": "Title"
                        },
                        {
                            "dataType": "date",
                            "_id": "date",
                            "validation": [],
                            "type": "date",
                            "options": false,
                            "min": 1,
                            "max": 1,
                            "label": "date"
                        }
                    ]
                },
                typeWithEmbed = {
                    "label": "cooperembed",
                    "fields": [
                        {
                            "dataType": "string",
                            "defaultValue": "",
                            "_id": "title",
                            "validation": [],
                            "type": "textbox",
                            "options": false,
                            "min": 1,
                            "max": 1,
                            "label": "Title"
                        },
                        {
                            "dataType": "ref",
                            "_id": "theembed",
                            "validation": [],
                            "type": "embeddedtype",
                            "min": 1,
                            "max": 1,
                            "options" : 'will be embedded with the typeToEmbed',
                            "label": "theembed"
                        }
                    ]
                },
                typeWithEmbedShallow = {
                    "label": "cooperembedshallow",
                    "fields": [
                        {
                            "dataType": "string",
                            "defaultValue": "",
                            "_id": "titlewakka",
                            "validation": [],
                            "type": "textbox",
                            "options": false,
                            "min": 1,
                            "max": 1,
                            "label": "Titlewakka"
                        },
                        {
                            "dataType": "ref",
                            "_id": "theshallowembed",
                            "validation": [],
                            "type": "embeddedtype",
                            "options": "will be embedded with the typeWithEmbed",
                            "min": 1,
                            "max": 1,
                            "label": "theshallowembed"
                        }
                    ]
                },
                content2 = {
                    "fields": {
                        "theshallowembed":{
                            "theembed": {
                                "date": "2014/08/12",
                                "title": "testingembedtitle"
                            },
                            "title": "maintitletest"
                        },
                        "titlewakka" : "some title"
                    },
                    "meta": {
                        "node": "53ecde8c54eae3173a09960f",
                        "type": "",
                        "labelfield": "titlewakka",
                        "typelabel": "cooperembed2",
                        "created": "2014-08-14T16:08:15.323Z",
                        "lastmodified": "2014-08-14T16:08:15.323Z"
                    }
                };

            grasshopper.request(adminToken).contentTypes.insert(typeToEmbed)
                .then(function (createdContentType) {
                    typeToEmbed = createdContentType;
                    typeWithEmbed.fields[1].options = typeToEmbed._id.toString();
                    return grasshopper.request(adminToken).contentTypes.insert(typeWithEmbed);
                })
                .then(function (secondaryContentType) {
                    typeWithEmbed = secondaryContentType;
                    typeWithEmbedShallow.fields[1].options = typeWithEmbed._id.toString();
                    return grasshopper.request(adminToken).contentTypes.insert(typeWithEmbedShallow);
                })
                .then(function(createdTypeWithEmbedShallow){
                    typeWithEmbedShallow = createdTypeWithEmbedShallow;
                })
                .then(function() {
                    content2.meta.type = typeWithEmbedShallow._id.toString();
                    return grasshopper.request(adminToken).content.insert(content2);
                })
                .then(function(createdContent2) {
                    content2 = createdContent2;
                })
                // Update a complex field and assert that it changed on content2
                .then(function() {
                    typeToEmbed.fields[0]._id = "abercrombie";
                    return grasshopper.request(adminToken).contentTypes.update(typeToEmbed);
                    // updated a property on the typeToEmbed
                })
                .then(function(resultOfupdate) {
                    return grasshopper.request(adminToken).content.getById(content2._id);
                    // get content2
                })
                .then(function(retrievedContent2) {
                    _.has(retrievedContent2.fields.theshallowembed.theembed, 'abercombie').should.be.ok;
                    retrievedContent2.fields.theshallowembed.theembed.abercrombie.should.equal('testingembedtitle');
                    // assert that content2 nested field changed.
                })
                .then(done)

                .fail(done)
                .catch(done);

        });

//        describe('updating the fields array on a content type', function () {
//
//            it('should update the meta.labelfield when the order of fields changed', function (done) {
//                var updatedContentType = {
//                    _id: anotherTestContentTypeId,
//                    label: 'updatedlabel',
//                    fields: [
//                        { // The order of these has been swapped.
//                            _id: "testeroni",
//                            required: true,
//                            instancing: 1,
//                            type: "textbox",
//                            label: "Title",
//                            min: 1,
//                            max: 2
//                        },
//                        {
//                            _id: "testfield",
//                            required: true,
//                            instancing: 1,
//                            type: "textbox",
//                            label: "Title",
//                            min: 1,
//                            max:2
//                        }
//                    ],
//                    helpText: '',
//                    description: ''
//                };
//
//                grasshopper.request(adminToken).contentTypes.update(updatedContentType)
//                    .then(function () {
//                        grasshopper.request(adminToken).content.getById('5246e73d56c02c0744000001')
//                            .then(function (payload) {
//                                payload.meta.labelfield.should.equal('testeroni');
//                                done();
//                            })
//                            .fail(done)
//                            .catch(done);
//                    })
//                    .fail(done)
//                    .catch(done);
//            });
//
//            it('should remove a field from a content type when you do a PUT without that field', function (done) {
//                var updatedContentType = {
//                    _id: anotherTestContentTypeId,
//                    label: 'updatedlabel',
//                    fields: [
//                        {
//                            _id: "testfield",
//                            required: true,
//                            instancing: 1,
//                            type: "textbox",
//                            label: "Title"
//                        }
//                    ],
//                    helpText: '',
//                    description: ''
//                };
//
//                grasshopper.request(adminToken).contentTypes.update(updatedContentType)
//                    .then(function (payload) {
//                        payload.fields.length.should.equal(1);
//                        done();
//                    })
//                    .fail(done)
//                    .catch(done);
//            });
//
//            it('should throw an error when attempting to remove all of the fields with a PUT', function (done) {
//                var updatedContentType = {
//                    _id: anotherTestContentTypeId,
//                    label: 'updatedlabel',
//                    fields: [], //empty fields object
//                    helpText: '',
//                    description: ''
//                };
//
//                grasshopper.request(adminToken).contentTypes.update(updatedContentType)
//                    .then(done)
//                    .fail(function (err) {
//                        err.code.should.equal(404);
//                        done();
//                    })
//                    .catch(done);
//            });
//
//        });

    });

//    describe('deleteById', function () {
//            before(function (done) {
//                grasshopper.request(adminToken).content.insert({
//                    "label": "Future deletee",
//                    "type": testCreatedContentTypeId,
//                    "fields": {
//                        "testfield": "test value"
//                    },
//                    "node": {
//                        "_id": '526d5179966a883540000006',
//                        "displayOrder": 1
//                    }
//                }).then(
//                    function (payload) {
//                        done();
//                    },
//                    function (err) {
//                        done();
//                    }
//                ).done();
//            });
//
//            it('should return a 403 because user does not have permissions to access content types', function (done) {
//                grasshopper.request(readerToken)
//                    .contentTypes.deleteById(testCreatedContentTypeId)
//                    .then(done)
//                    .fail(function (err) {
//                        err.code.should.equal(403);
//                        done();
//                    })
//                    .catch(done);
//            });
//
//            it('should delete a content type', function (done) {
//                grasshopper.request(adminToken)
//                    .contentTypes.deleteById(testCreatedContentTypeId)
//                    .then(function (payload) {
//                        payload.should.equal('Success');
//                        done();
//                    })
//                    .fail(done)
//                    .catch(done);
//            });
//
//            it('should return 200 when we try to delete a content type that doesn\'t exist', function (done) {
//                grasshopper.request(adminToken)
//                    .contentTypes.deleteById(testCreatedContentTypeId)
//                    .then(function (payload) {
//                        payload.should.equal('Success');
//                        done();
//                    })
//                    .fail(done)
//                    .catch(done);
//            });
//        });

    describe('get content types by embedded Id', function() {
        var typeToEmbed = {
                "label": "cooperembeddeep",
                "fields": [
                    {
                        "dataType": "string",
                        "_id": "title",
                        "validation": [],
                        "type": "textbox",
                        "options": false,
                        "min": 1,
                        "max": 1,
                        "label": "Title"
                    },
                    {
                        "dataType": "date",
                        "_id": "date",
                        "validation": [],
                        "type": "date",
                        "options": false,
                        "min": 1,
                        "max": 1,
                        "label": "date"
                    }
                ]
            },
            typeWithEmbed = {
                "label": "cooperembed",
                "fields": [
                    {
                        "dataType": "string",
                        "defaultValue": "",
                        "_id": "title",
                        "validation": [],
                        "type": "textbox",
                        "options": false,
                        "min": 1,
                        "max": 1,
                        "label": "Title"
                    },
                    {
                        "dataType": "ref",
                        "_id": "theembed",
                        "validation": [],
                        "type": "embeddedtype",
                        "min": 1,
                        "max": 1,
                        "options" : 'will be embedded with the typeToEmbed',
                        "label": "theembed"
                    }
                ]
            },
            typeWithEmbedShallow = {
                "label": "cooperembedshallow",
                "fields": [
                    {
                        "dataType": "string",
                        "defaultValue": "",
                        "_id": "titlewakka",
                        "validation": [],
                        "type": "textbox",
                        "options": false,
                        "min": 1,
                        "max": 1,
                        "label": "Titlewakka"
                    },
                    {
                        "dataType": "ref",
                        "_id": "theshallowembed",
                        "validation": [],
                        "type": "embeddedtype",
                        "options": "will be embedded with the typeWithEmbed",
                        "min": 1,
                        "max": 1,
                        "label": "theshallowembed"
                    }
                ]
            },
            content = {
                "fields": {
                    "theshallowembed":{
                        "theembed": {
                            "date": "2014/08/12",
                            "title": "testingembedtitle"
                        },
                        "title": "maintitletest"
                    },
                    "titlewakka" : "some title"
                },
                "meta": {
                    "node": "53ecde8c54eae3173a09960f",
                    "type": "",
                    "labelfield": "titlewakka",
                    "typelabel": "cooperembed2",
                    "created": "2014-08-14T16:08:15.323Z",
                    "lastmodified": "2014-08-14T16:08:15.323Z"
                }
            };

        grasshopper.request(adminToken).contentTypes.insert(typeToEmbed)
            .then(function(createdContentType) {
                typeToEmbed = createdContentType;
                typeWithEmbed.fields[1].options = typeToEmbed._id.toString();
            });
    });

});

function doneError (done, err) {
    'use strict';
    done(err);
}
