var chai = require('chai'),
    expect = chai.expect,
    should = chai.should(),
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
});
