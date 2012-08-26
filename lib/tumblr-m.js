exports.core = (function () {
    // Modules
    var vodevil = require('vodevil');

    var core = function () {};

    var __getter__ = function ( target, property ) {
        return target[ property ]; 
    };

    var __setter__ = function ( target, property, value ) {
        return target[ property ] = value;
    };

    var __setup__ = function ( config, property, args ) {
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

    var __slug__ = function ( options ) {
        return options.join('/');
    };

    var __param__ = function ( options ) {
        var output = '',
            param = options,
            counter = 0;

            for ( var key in param ) {
                if ( counter === 0 ) {
                    output += '?' + key + '=' + param[ key ];    
                } else if ( counter > 0 ) {
                    output += '&' + key + '=' + param[ key ];    
                }

                counter += 1;
            }

        return output;
    };

    var __query__ = function ( parameters ) {    
        var output = ''; 

        for ( var key in parameters ) {
            if ( 'slug' === key ) {
                output += __slug__( parameters['slug'] );
            } if ( 'param' === key ) {
                var param = parameters['param'];

                output += __param__( param );
            }
        }

        return output;
    };

    var config = {
        api: {
            URI: 'http://api.tumblr.com',
            version: 'v2',
            key: '',
        },

        blog: {
            hostname: '',
            custom: false,
        },

        perform: vodevil.set([
            'user',
            'blog',
            'tagged'
        ]),
    };

    core.prototype = {
        api: function () {
            var self = this,
                args = Array.prototype.slice.call( arguments ),
                output = undefined;

            output = __setup__( config, 'api', args ); 

            return output;
        },

        blog: function () {
            var self = this,
                args = Array.prototype.slice.call( arguments ),
                output = undefined;

            output = __setup__( config, 'blog', args ); 

            return output;
        },

        query: function ( url, parameters ) {
           var output = '';     

            if ( parameters ) {
                if ( url ) {
                    output = url + '/';
                    
                    output += __query__( parameters );
                } else if ( url === '' ) {
                    output = url;

                    output += __query__( parameters ).replace('?', '&');    
                }
            }

           return output;
        },

        consumption: function ( filename ) {
            var output = false,
                self = this,
                fs = require('fs');

            if ( filename ) {
                var config = JSON.parse(
                    fs.readFileSync(
                        filename,
                        'utf-8'
                    )
                );
                
                for ( var method in config ) {
                    var propertys = config[method];

                    for ( var property in propertys ) {
                        var value = propertys[ property ];

                        output = self[method]( property, value );
                    }
                }
            }

            return output;
        },

        perform: function ( method, action, fn, optional ) {
            var request = require('request'),
                output = {},
                self = this,
                fn = fn || function () {};

            var pre = {
                apiURI: self.api('URI') + '/' + self.api('version'),    
                requestURI: function () {
                    var output = '',
                        url = this.apiURI,
                        slug = vodevil.set([]),
                        param = {
                            api_key: self.api('key')    
                        },
                        hostname = (function () {
                            var output = self.blog('hostname');

                            if ( self.blog('custom') === false ) {
                                output += '.tumblr.com'    
                            } 

                            return output;
                        } ());    


                    if ( vodevil.in( config.perform, method ) ) {
                        slug.append( method, hostname, action );

                        var queryURL = self.query( url, {
                            slug: slug.object,
                            param: param
                        });

                        if ( optional ) {
                            queryURL += self.query('', {
                                param: optional 
                            });    
                        }

                        output = queryURL;
                    } 

                    return output;
                }
            };

            return request( 
                pre.requestURI(), 
                function ( error, response, data ) {
                    data = JSON.parse( data );

                    fn( error, data );

                    return;
            });
        }
    };

    return new core;
} ());
