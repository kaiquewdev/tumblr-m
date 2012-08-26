exports.core = (function () {
    var core = function () {};

    var __getter__ = function ( target, property ) {
        return target[ property ]; 
    };

    var __setter__ = function ( target, property, value ) {
        return target[ property ] = value;
    };

    var __config__ = function ( config, property, args ) {
        var output = undefined;

        if ( args.length === 1 ) {
            output = __getter__( 
                config[property], 
                args[0] 
            );
        } else if ( 
            args.length === 2 && 
            typeof config.blog[ args[0] ] !== undefined
        ) {
            __setter__( 
                config[property], 
                args[0], 
                args[1] 
            ); 

            if ( config[property][ args[0] ] === args[1] ) {
                output = true;    
            }
        }

        return output;
    };

    var config = {
        api: {
            URI: 'http://api.tumblr.com',
            version: 'v2',
        },

        blog: {
            hostname: ''
        }
    };

    core.prototype = {
        api: function () {
            var self = this,
                args = Array.prototype.slice.call( arguments ),
                output = undefined;

            output = __config__( config, 'api', args ); 

            return output;
        },

        blog: function () {
            var self = this,
                args = Array.prototype.slice.call( arguments ),
                output = undefined;

            output = __config__( config, 'blog', args ); 

            return output;
        },
    };

    return new core;
} ());
