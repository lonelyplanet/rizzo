/*!
 * jQuery DFP v2.4.2
 * http://github.com/coop182/jquery.dfp.js
 *
 * Copyright 2016 Matt Cooper
 * Released under the MIT license
 */

(function (window, undefined) {
    "use strict";

    /**
     * Make plugin UMD compatible
     * Uses CommonJS, AMD or browser globals to create plugin.
     */
    (function (factory) {
        if (typeof define === 'function' && define.amd) {
            // AMD. Register as an anonymous module.
            define(['jquery'], factory);
        } else if (typeof exports === 'object') {
            // Node/CommonJS
            factory(require('jquery'));
        } else {
            // Browser globals
            factory(window.jQuery || window.Zepto);
        }
    }(function ($) {

        var

        // Save Scope
        dfpScript = this || {};

        var
        // DFP account ID
        dfpID = '',

        // Init counters
        count = 0,
        uid = 0,
        rendered = 0,

        // Default DFP selector
        dfpSelector = '.adunit',

        adsCouldNeverBeInitilized = false,

        // Keep track of if we've already tried to load gpt.js before
        dfpIsLoaded = false,

        // Store adunit on div as:
        storeAs = 'googleAdUnit',

        /**
         * Init function sets required params and loads Google's DFP script
         * @param  String id       The DFP account ID
         * @param  String selector The adunit selector
         * @param  Object options  Custom options to apply
         */
        init = function (id, selector, options) {
            var $adCollection;

            // Reset counters on each call
            count = 0;
            rendered = 0;

            dfpID = id;
            $adCollection = $(selector);

            /**
             * @returns {boolean}
             */
            dfpScript.shouldCheckForAdBlockers = function(){
                return options ? typeof options.afterAdBlocked === 'function' : false;
            };

            // explicitly wait for loader to be completed, otherwise the googletag might not be available
            dfpLoader(options, $adCollection).then(function(){
                options = setOptions(options);
                dfpScript.dfpOptions = options;

                $(function () {
                    createAds(options, $adCollection);
                    displayAds(options, $adCollection);
                });
            });

        },

        /**
         * Set the options for DFP
         * @param Object options Custom options to apply
         * @return Object extended options
         */
        setOptions = function (options) {

            // Set default options
            var dfpOptions = {
                setTargeting: {},
                setCategoryExclusion: '',
                setLocation: '',
                enableSingleRequest: true,
                collapseEmptyDivs: 'original',
                refreshExisting: true,
                disablePublisherConsole: false,
                disableInitialLoad: false,
                setCentering: false,
                noFetch: false,
                namespace: undefined,
                sizeMapping: {}
            };

            if (typeof options.setUrlTargeting === 'undefined' || options.setUrlTargeting) {
                // Get URL Targeting
                var urlTargeting = getUrlTargeting(options.url);
                $.extend(true, dfpOptions.setTargeting, {
                    UrlHost: urlTargeting.Host,
                    UrlPath: urlTargeting.Path,
                    UrlQuery: urlTargeting.Query
                });
            }

            // Merge options objects
            $.extend(true, dfpOptions, options);

            // If a custom googletag is specified, use it.
            if (dfpOptions.googletag) {
                window.googletag.cmd.push(function () {
                    $.extend(true, window.googletag, dfpOptions.googletag);
                });
            }

            return dfpOptions;
        },

        /**
         * Find and create all Ads
         * @param Object dfpOptions options related to ad instantiation
         * @param jQuery $adCollection collection of ads
         * @return Array an array of ad units that have been created.
         */
        createAds = function (dfpOptions, $adCollection) {
            var googletag = window.googletag;
            // Loops through on page Ad units and gets ads for them.
            $adCollection.each(function () {
                var $adUnit = $(this);

                count++;

                // adUnit name
                var adUnitName = getName($adUnit, dfpOptions);

                // adUnit id - this will use an existing id or an auto generated one.
                var adUnitID = getID($adUnit, adUnitName);

                // get dimensions of the adUnit
                var dimensions = getDimensions($adUnit);

                // set existing content
                $adUnit.data('existingContent', $adUnit.html());

                // wipe html clean ready for ad and set the default display class.
                $adUnit.html('').addClass('display-none');

                // Push commands to DFP to create ads
                googletag.cmd.push(function () {

                    var googleAdUnit,
                        $adUnitData = $adUnit.data(storeAs);

                    if ($adUnitData) {

                        // Get existing ad unit
                        googleAdUnit = $adUnitData;

                    } else {

                        // Build slotName for loading
                        var slotName;
                        if (dfpID === '') {
                            slotName = adUnitName;
                        } else {
                            slotName = '/' + dfpID + '/' + adUnitName;
                        }

                        // Create the ad - out of page or normal
                        if ($adUnit.data('outofpage')) {
                            googleAdUnit = googletag.defineOutOfPageSlot(slotName, adUnitID);
                        } else {
                            googleAdUnit = googletag.defineSlot(slotName, dimensions, adUnitID);
                            if ($adUnit.data('companion')) {
                                googleAdUnit = googleAdUnit.addService(googletag.companionAds());
                            }
                        }

                        googleAdUnit = googleAdUnit.addService(googletag.pubads());

                    }

                    // Sets custom targeting for just THIS ad unit if it has been specified
                    var targeting = $adUnit.data('targeting');
                    if (targeting) {
                        $.each(targeting, function (k, v) {
                            googleAdUnit.setTargeting(k, v);
                        });
                    }

                    // Sets custom exclusions for just THIS ad unit if it has been specified
                    var exclusions = $adUnit.data('exclusions');
                    if (exclusions) {
                        var exclusionsGroup = exclusions.split(',');
                        var valueTrimmed;
                        $.each(exclusionsGroup, function (k, v) {
                            valueTrimmed = $.trim(v);
                            if (valueTrimmed.length > 0) {
                                googleAdUnit.setCategoryExclusion(valueTrimmed);
                            }
                        });
                    }

                    // Sets responsive size mapping for just THIS ad unit if it has been specified
                    var mapping = $adUnit.data('size-mapping');
                    if (mapping && dfpOptions.sizeMapping[mapping]) {
                        // Convert verbose to DFP format
                        var map = googletag.sizeMapping();
                        $.each(dfpOptions.sizeMapping[mapping], function (k, v) {
                            map.addSize(v.browser, v.ad_sizes);
                        });
                        googleAdUnit.defineSizeMapping(map.build());
                    }

                    // Store googleAdUnit reference
                    $adUnit.data(storeAs, googleAdUnit);

                    // Allow altering of the ad slot before ad load
                    if (typeof dfpOptions.beforeEachAdLoaded === 'function') {
                        dfpOptions.beforeEachAdLoaded.call(this, $adUnit);
                    }
                });

            });

            // Push DFP config options
            googletag.cmd.push(function () {

                var pubadsService = googletag.pubads();

                if (dfpOptions.enableSingleRequest) {
                    pubadsService.enableSingleRequest();
                }

                $.each(dfpOptions.setTargeting, function (k, v) {
                    pubadsService.setTargeting(k, v);
                });

                var setLocation = dfpOptions.setLocation;
                if (typeof setLocation === 'object') {
                    if (typeof setLocation.latitude === 'number' && typeof setLocation.longitude === 'number' &&
                        typeof setLocation.precision === 'number') {
                        pubadsService.setLocation(setLocation.latitude, setLocation.longitude, setLocation.precision);
                    } else if (typeof setLocation.latitude === 'number' && typeof setLocation.longitude === 'number') {
                        pubadsService.setLocation(setLocation.latitude, setLocation.longitude);
                    }
                }

                if (dfpOptions.setCategoryExclusion.length > 0) {
                    var exclusionsGroup = dfpOptions.setCategoryExclusion.split(',');
                    var valueTrimmed;

                    $.each(exclusionsGroup, function (k, v) {
                        valueTrimmed = $.trim(v);
                        if (valueTrimmed.length > 0) {
                            pubadsService.setCategoryExclusion(valueTrimmed);
                        }
                    });
                }

                if (dfpOptions.collapseEmptyDivs) {
                    pubadsService.collapseEmptyDivs();
                }

                if (dfpOptions.disablePublisherConsole) {
                    pubadsService.disablePublisherConsole();
                }

                if (dfpOptions.companionAds) {
                    googletag.companionAds().setRefreshUnfilledSlots(true);

                    if (!dfpOptions.disableInitialLoad) {
                        pubadsService.enableVideoAds();
                    }
                }

                if (dfpOptions.disableInitialLoad) {
                    pubadsService.disableInitialLoad();
                }

                if (dfpOptions.noFetch) {
                    pubadsService.noFetch();
                }

                if (dfpOptions.setCentering) {
                    pubadsService.setCentering(true);
                }

                // Setup event listener to listen for renderEnded event and fire callbacks.
                pubadsService.addEventListener('slotRenderEnded', function (event) {

                    rendered++;

                    var $adUnit = $('#' + event.slot.getSlotId().getDomId());

                    var display = event.isEmpty ? 'none' : 'block';

                    // if the div has been collapsed but there was existing content expand the
                    // div and reinsert the existing content.
                    var $existingContent = $adUnit.data('existingContent');
                    if (display === 'none' && $.trim($existingContent).length > 0 &&
                        dfpOptions.collapseEmptyDivs === 'original') {
                        $adUnit.show().html($existingContent);
                        display = 'block display-original';
                    }

                    $adUnit.removeClass('display-none').addClass('display-' + display);

                    // Excute afterEachAdLoaded callback if provided
                    if (typeof dfpOptions.afterEachAdLoaded === 'function') {
                        dfpOptions.afterEachAdLoaded.call(this, $adUnit, event);
                    }

                    // Excute afterAllAdsLoaded callback if provided
                    if (typeof dfpOptions.afterAllAdsLoaded === 'function' && rendered === count) {
                        dfpOptions.afterAllAdsLoaded.call(this, $adCollection);
                    }

                });

                // this will work with AdblockPlus
                if(dfpScript.shouldCheckForAdBlockers() && !googletag._adBlocked_) {
                    setTimeout(function () {
                        var slots = pubadsService.getSlots ? pubadsService.getSlots() : [];
                        if (slots.length > 0) {
                            $.get(slots[0].getContentUrl()).always(function (r) {
                                if (r.status !== 200) {
                                    $.each(slots, function () {
                                        var $adUnit = $('#' + this.getSlotId().getDomId());
                                        dfpOptions.afterAdBlocked.call(dfpScript, $adUnit, this);
                                    });
                                }
                            });
                        }
                    }, 0);
                }

                googletag.enableServices();

            });

        },

        /**
         * Display all created Ads
         * @param {Object} dfpOptions options related to ad instantiation
         * @param {jQuery} $adCollection collection of ads
         */
        displayAds = function (dfpOptions, $adCollection) {

            var googletag = window.googletag;
            // Check if google adLoader can be loaded, this will work with AdBlock
            if(dfpScript.shouldCheckForAdBlockers() && !googletag._adBlocked_) {
                if (googletag.getVersion) {
                    var script = '//partner.googleadservices.com/gpt/pubads_impl_' +
                        googletag.getVersion() + '.js';
                    $.getScript(script).always(function (r) {
                        if (r && r.statusText === 'error') {
                            $.each($adCollection, function () {
                                dfpOptions.afterAdBlocked.call(dfpScript, $(this));
                            });
                        }
                    });
                }

            }

            $adCollection.each(function () {

                var $adUnit = $(this),
                    $adUnitData = $adUnit.data(storeAs);

                if (googletag._adBlocked_) {
                    if(dfpScript.shouldCheckForAdBlockers()) {
                        dfpOptions.afterAdBlocked.call(dfpScript, $adUnit);
                    }
                }
                if (dfpOptions.refreshExisting && $adUnitData && $adUnit.hasClass('display-block')) {

                    googletag.cmd.push(function () { googletag.pubads().refresh([$adUnitData]); });

                } else {
                    googletag.cmd.push(function () { googletag.display($adUnit.attr('id')); });
                }

            });

        },

        /**
         * Create an array of paths so that we can target DFP ads to Page URI's
         * @return Array an array of URL parts that can be targeted.
         */
        getUrlTargeting = function (url) {

            // Get the url and parse it to its component parts using regex from RFC2396 Appendix-B (https://tools.ietf.org/html/rfc2396#appendix-B)
            var urlMatches = (url || window.location.toString()).match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/);
            var matchedAuthority = urlMatches[4] || '';
            var matchedPath = (urlMatches[5] || '').replace(/(.)\/$/, '$1');
            var matchedQuery = urlMatches[7] || '';

            // Get the query params for targeting against
            var params = matchedQuery.replace(/\=/ig, ':').split('&');

            return {
                Host: matchedAuthority,
                Path: matchedPath,
                Query: params
            };

        },

        /**
         * Get the id of the adUnit div or generate a unique one.
         * @param  Object $adUnit     The adunit to work with
         * @param  String adUnitName The name of the adunit
         * @return String             The ID of the adunit or a unique autogenerated ID
         */
        getID = function ($adUnit, adUnitName) {

            uid++;
            return $adUnit.attr('id') || $adUnit.attr('id', adUnitName.replace(/[^A-z0-9]/g, '_') + '-auto-gen-id-' + uid).attr('id');

        },

        /**
         * Get the name of the Ad unit, either use the div id or
         * check for the optional attribute data-adunit
         * @param  Object $adUnit The adunit to work with
         * @param  Object dfpOptions options related to ad instantiation
         * @return String        The name of the adunit, will be the same as inside DFP
         */
        getName = function ($adUnit, dfpOptions) {

            var adUnitName = $adUnit.data('adunit') || dfpOptions.namespace || $adUnit.attr('id') || '';
            if (typeof dfpOptions.alterAdUnitName === 'function') {
                adUnitName = dfpOptions.alterAdUnitName.call(this, adUnitName, $adUnit);
            }
            return adUnitName;

        },

        /**
         * Get the dimensions of the ad unit using the container div dimensions or
         * check for the optional attribute data-dimensions
         * @param  Object $adUnit The adunit to work with
         * @return Array         The dimensions of the adunit (width, height)
         */
        getDimensions = function ($adUnit) {

            var dimensions = [],
                dimensionsData = $adUnit.data('dimensions');

            // Check if data-dimensions are specified. If they aren't, use the dimensions of the ad unit div.
            if (dimensionsData) {

                var dimensionGroups = dimensionsData.split(',');

                $.each(dimensionGroups, function (k, v) {

                    var dimensionSet = v.split('x');
                    dimensions.push([parseInt(dimensionSet[0], 10), parseInt(dimensionSet[1], 10)]);

                });

            } else {

                dimensions.push([$adUnit.width(), $adUnit.height()]);

            }

            return dimensions;

        },

        /**
         * Call the google DFP script - there is a little bit of error detection in here to detect
         * if the dfp script has failed to load either through an error or it being blocked by an ad
         * blocker... if it does not load we execute a dummy script to replace the real DFP.
         *
         * @param {Object} options
         * @param {Array} $adCollection
         */
        dfpLoader = function (options, $adCollection) {

            function execBlockEvents() {
                if(dfpScript.shouldCheckForAdBlockers()) {
                    $.each($adCollection, function () {
                        options.afterAdBlocked.call(dfpScript, $(this));
                    });
                }
            }

            // make sure we don't load gpt.js multiple times
            dfpIsLoaded = dfpIsLoaded || $('script[src*="googletagservices.com/tag/js/gpt.js"]').length;
            if (dfpIsLoaded) {
                if(adsCouldNeverBeInitilized) {
                    execBlockEvents();
                }
                return $.Deferred().resolve();
            }

            var loaded = $.Deferred();

            window.googletag = window.googletag || {};
            window.googletag.cmd = window.googletag.cmd || [];

            var gads = document.createElement('script');
            gads.async = true;
            gads.type = 'text/javascript';

            // Adblock blocks the load of Ad scripts... so we check for that
            gads.onerror = function () {
                dfpBlocked();
                loaded.resolve();
                adsCouldNeverBeInitilized = true;
                execBlockEvents();
            };

            gads.onload = function() {
                // this will work with ghostery:
                if (!googletag._loadStarted_) {
                    googletag._adBlocked_ = true;
                    execBlockEvents();
                }
                loaded.resolve();
            };

            var useSSL = 'https:' === document.location.protocol;
            gads.src = (useSSL ? 'https:' : 'http:') +
            '//www.googletagservices.com/tag/js/gpt.js';
            var node = document.getElementsByTagName('script')[0];
            node.parentNode.insertBefore(gads, node);

            // Adblock plus seems to hide blocked scripts... so we check for that
            if (gads.style.display === 'none') {
                dfpBlocked();
            }

            return loaded;

        },

        /**
         * This function gets called if DFP has been blocked by an adblocker
         * it implements a dummy version of the dfp object and allows the script to excute its callbacks
         * regardless of whether DFP is actually loaded or not... it is basically only useful for situations
         * where you are laying DFP over existing content and need to init things like slide shows after the loading
         * is completed.
         */
        dfpBlocked = function () {
            var googletag = window.googletag;
            // Get the stored dfp commands
            var commands = googletag.cmd;

            var _defineSlot = function (name, dimensions, id, oop) {
                googletag.ads.push(id);
                googletag.ads[id] = {
                    renderEnded: function () { },
                    addService: function () { return this; }
                };

                return googletag.ads[id];
            };

            // overwrite the dfp object - replacing the command array with a function and defining missing functions
            googletag = {
                cmd: {
                    push: function (callback) {
                        callback.call(dfpScript);
                    }
                },
                ads: [],
                pubads: function () { return this; },
                noFetch: function () { return this; },
                disableInitialLoad: function () { return this; },
                disablePublisherConsole: function () { return this; },
                enableSingleRequest: function () { return this; },
                setTargeting: function () { return this; },
                collapseEmptyDivs: function () { return this; },
                enableServices: function () { return this; },
                defineSlot: function (name, dimensions, id) {
                    return _defineSlot(name, dimensions, id, false);
                },
                defineOutOfPageSlot: function (name, id) {
                    return _defineSlot(name, [], id, true);
                },
                display: function (id) {
                    googletag.ads[id].renderEnded.call(dfpScript);
                    return this;
                }

            };

            // Execute any stored commands
            $.each(commands, function (k, v) {
                googletag.cmd.push(v);
            });


        };


        /**
         * Add function to the jQuery / Zepto namespace
         * @param  String id      (Optional) The DFP account ID
         * @param  Object options (Optional) Custom options to apply
         */
        $.dfp = $.fn.dfp = function (id, options) {

            options = options || {};

            if (id === undefined) {
                id = dfpID;
            }

            if (typeof id === 'object') {
                options = id;
                id = options.dfpID || dfpID;
            }

            var selector = this;

            if (typeof this === 'function') {
                selector = dfpSelector;
            }

            init(id, selector, options);

            return this;

        };

    }));

})(window);
