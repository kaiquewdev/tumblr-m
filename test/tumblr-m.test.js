var chai = require('chai'),
    expect = chai.expect,
    should = chai.should(),
    fs = require('fs'),
    TumblrM = require('../lib/tumblr-m').core;

describe('Tumblr-M Suite of Tests', function () {
    it('getter URI structure of api', function () {
        TumblrM.api('URI').should.equal('http://api.tumblr.com');    
    });

    it('getter version of api', function () {
        TumblrM.api('version').should.equal('v2');    
    });

    it('property of object not exists return undefined', function () {
        should.not.exist( TumblrM.api('zoltan') );    
    })

    it('setter for api URI structure', function () {
        expect(
            TumblrM.api( 'URI', 'http://api.tumblr.co' )
        ).to.be.true;
    });

    it('setter for api version structure', function () {
        expect(
            TumblrM.api('version', 'v3')
        ).to.be.true;    
    });

    it('Mount a url with your query based on slugs', function () {
        TumblrM.query('http://api.tumblr.com', {
            slug: [
                'v2',
                'blog',
                'cladecoders',
                'info'
            ]
        }).should.equal('http://api.tumblr.com/v2/blog/cladecoders/info'); 
    });

    it('Mount a url with one parameter', function () {
        TumblrM.query('http://api.tumblr.com', {
            param: {
                api_key: '1234567890'    
            }    
        }).should.equal('http://api.tumblr.com/?api_key=1234567890');    
    });

    it('Mount a url with more than one parameter', function () {
        TumblrM.query('http://api.tumblr.com', {
            param: {
                api_key: '123',
                other: 'testing'
            }
        }).should.equal(
            'http://api.tumblr.com/?api_key=123&other=testing'
        );    

        TumblrM.query('http://api.tumblr.com', {
            param: {
                api_key: '123',
                other: 'testing',
                another: 'huya'
            }    
        });
    });

    it('Mount a url with optiononal value', function () {
        TumblrM.query('http://api.tumblr.com', {
            slug: [
                'v2',
                'blog',
                'cladecoders',
                'info'
            ],

            param: {
                api_key: '12345'    
            }
        }).should.equal(
            'http://api.tumblr.com/v2/blog/cladecoders/info?api_key=12345'
        );
    });

    it('consumption of config file', function () {
        TumblrM.consumption(
            './test/consumption.json'
        ).should.equal( true );    
    });

    it('Perform blog info', function () {
        var output = {};

        TumblrM.consumption('./test/consumption.json');

        TumblrM.perform( 'blog', 'info', function ( error, data ) {
            output = data;
        }, {
                
        });

        setTimeout(function () {
            expect( output ).to.deep.equal(
                JSON.parse(
                    fs.readFileSync( 
                        __dirname + '/cases/cladecoders.json', 
                        'utf-8'
                    )
                )
            );
        }, 25000 );
    });
});
