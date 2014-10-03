/**
 * jQuery DFP v1.1.4
 * http://github.com/coop182/jquery.dfp.js
 *
 * Copyright 2014 Matt Cooper
 * Released under the MIT license
 */
(function ($, window, undefined) {

    'use strict';

    var

    // Save Scope
    dfpScript = this,

    // DFP account ID
    dfpID = '',

    // Init counters
    count = 0,
    uid = 0,
    rendered = 0,

    // Default DFP selector
    dfpSelector = '.adunit',

    // DFP options object
    dfpOptions = {},

    // Keep track of if we've already tried to load gpt.js before
    dfpIsLoaded = false,

    // Collection of ads
    $adCollection,

    // Store adunit on div as:
    storeAs = 'googleAdUnit',

    /**
     * Init function sets required params and loads Google's DFP script
     * @param  String id       The DFP account ID
     * @param  String selector The adunit selector
     * @param  Object options  Custom options to apply
     */
    init = function (id, selector, options) {

        // Reset counters on each call
        count = 0;
        rendered = 0;

        dfpID = id;
        $adCollection = $(selector);

        dfpLoader();
        setOptions(options);

        $(function () {
            createAds();
            displayAds();
        });

    },

    /**
     * Set the options for DFP
     * @param Object options Custom options to apply
     */
    setOptions = function (options) {

        // Set default options
        dfpOptions = {
            setTargeting: {},
            setCategoryExclusion: '',
            setLocation: '',
            enableSingleRequest: true,
            collapseEmptyDivs: 'original',
            refreshExisting: true,
            disablePublisherConsole: false,
            disableInitialLoad: false,
            noFetch: false,
            namespace: undefined,
            sizeMapping: {}
        };

        if (typeof options.setUrlTargeting === 'undefined' || options.setUrlTargeting)
        {
            // Get URL Targeting
            var urlTargeting = getUrlTargeting();
            $.extend(true, dfpOptions.setTargeting, { inURL: urlTargeting.inURL, URLIs: urlTargeting.URLIs, Query: urlTargeting.Query, Domain: window.location.host });
        }

        // Merge options objects
        $.extend(true, dfpOptions, options);

        // If a custom googletag is specified, use it.
        if (dfpOptions.googletag) {
            window.googletag.cmd.push(function () {
                $.extend(true, window.googletag, dfpOptions.googletag);
            });
        }
    },

    /**
     * Find and create all Ads
     * @return Array an array of ad units that have been created.
     */
    createAds = function () {

        // Loops through on page Ad units and gets ads for them.
        $adCollection.each(function () {

            var $adUnit = $(this);

            count++;

            // adUnit name
            var adUnitName = getName($adUnit);

            // adUnit id - this will use an existing id or an auto generated one.
            var adUnitID = getID($adUnit, adUnitName);

            // get dimensions of the adUnit
            var dimensions = getDimensions($adUnit);

            // set existing content
            $adUnit.data('existingContent', $adUnit.html());

            // wipe html clean ready for ad and set the default display class.
            $adUnit.html('').addClass('display-none');

            // Push commands to DFP to create ads
            window.googletag.cmd.push(function () {

                var googleAdUnit,
                    $adUnitData = $adUnit.data(storeAs);

                if ($adUnitData) {

                    // Get existing ad unit
                    googleAdUnit = $adUnitData;

                } else {

                    // Create the ad - out of page or normal
                    if ($adUnit.data('outofpage')) {
                        googleAdUnit = window.googletag.defineOutOfPageSlot('/' + dfpID + '/' + adUnitName, adUnitID).addService(window.googletag.pubads());
                    } else {
                        googleAdUnit = window.googletag.defineSlot('/' + dfpID + '/' + adUnitName, dimensions, adUnitID).addService(window.googletag.pubads());
                    }

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
                    var map = window.googletag.sizeMapping();
                    $.each(dfpOptions.sizeMapping[mapping], function(k, v) {
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
        window.googletag.cmd.push(function () {

            if (dfpOptions.enableSingleRequest) {
                window.googletag.pubads().enableSingleRequest();
            }
            $.each(dfpOptions.setTargeting, function (k, v) {
                window.googletag.pubads().setTargeting(k, v);
            });

            if (typeof dfpOptions.setLocation === 'object') {
                if (typeof dfpOptions.setLocation.latitude === 'number' && typeof dfpOptions.setLocation.longitude === 'number' && typeof dfpOptions.setLocation.precision === 'number') {
                    window.googletag.pubads().setLocation(dfpOptions.setLocation.latitude, dfpOptions.setLocation.longitude, dfpOptions.setLocation.precision);
                } else if (typeof dfpOptions.setLocation.latitude === 'number' && typeof dfpOptions.setLocation.longitude === 'number') {
                    window.googletag.pubads().setLocation(dfpOptions.setLocation.latitude, dfpOptions.setLocation.longitude);
                }
            }

            if (dfpOptions.setCategoryExclusion.length > 0) {
                var exclusionsGroup = dfpOptions.setCategoryExclusion.split(',');
                var valueTrimmed;
                $.each(exclusionsGroup, function (k, v) {
                    valueTrimmed = $.trim(v);
                    if (valueTrimmed.length > 0) {
                        window.googletag.pubads().setCategoryExclusion(valueTrimmed);
                    }
                });
            }
            if (dfpOptions.collapseEmptyDivs) {
                window.googletag.pubads().collapseEmptyDivs();
            }

            if (dfpOptions.disablePublisherConsole) {
                window.googletag.pubads().disablePublisherConsole();
            }

            if (dfpOptions.disableInitialLoad) {
                window.googletag.pubads().disableInitialLoad();
            }

            if (dfpOptions.noFetch) {
                window.googletag.pubads().noFetch();
            }

            // Setup event listener to listen for renderEnded event and fire callbacks.
            window.googletag.pubads().addEventListener('slotRenderEnded', function(event) {

                rendered++;

                var $adUnit = $('#' + event.slot.getSlotId().getDomId());

                var display = event.isEmpty ? 'none' : 'block';

                // if the div has been collapsed but there was existing content expand the
                // div and reinsert the existing content.
                var $existingContent = $adUnit.data('existingContent');
                if (display === 'none' && $.trim($existingContent).length > 0 && dfpOptions.collapseEmptyDivs === 'original') {
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

            window.googletag.enableServices();

        });

    },

    /**
     * Display all created Ads
     */
    displayAds = function () {

        // Display each ad
        $adCollection.each(function () {

            var $adUnit = $(this),
                $adUnitData = $adUnit.data(storeAs);

            if (dfpOptions.refreshExisting && $adUnitData && $adUnit.hasClass('display-block')) {

                window.googletag.cmd.push(function () { window.googletag.pubads().refresh([$adUnitData]); });

            } else {

                window.googletag.cmd.push(function () { window.googletag.display($adUnit.attr('id')); });

            }

        });

    },

    /**
     * Create an array of paths so that we can target DFP ads to Page URI's
     * @return Array an array of URL parts that can be targeted.
     */
    getUrlTargeting = function () {

        // Get the paths for targeting against
        var paths = window.location.pathname.replace(/\/$/, ''),
            patt = new RegExp('\/([^\/]*)', 'ig'),
            pathsMatches = paths.match(patt),
            targetPaths = ['/'],
            longestpath = '';

        if (pathsMatches && paths !== '/') {
            var target = '',
                size = pathsMatches.length;
            if (size > 0) {
                for (var i = 0; i < size; i++) {
                    target = pathsMatches[i];
                    targetPaths.push(target);
                    for (var j = i + 1; j < size; j++) {
                        target += pathsMatches[j];
                        targetPaths.push(target);
                    }
                    if (i === 0) {
                        targetPaths.splice(-1, 1);
                        longestpath = target;
                    }
                }
            }
            targetPaths.push(longestpath);
        }

        targetPaths = targetPaths.reverse();

        // Get the query params for targeting against
        var url = window.location.toString().replace(/\=/ig, ':').match(/\?(.+)$/),
            params = RegExp.$1.split('&');

        return {
            inURL: targetPaths,
            URLIs: targetPaths[0],
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
     * @return String        The name of the adunit, will be the same as inside DFP
     */
    getName = function ($adUnit) {

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
     */
    dfpLoader = function () {

        // make sure we don't load gpt.js multiple times
        dfpIsLoaded = dfpIsLoaded || $('script[src*="googletagservices.com/tag/js/gpt.js"]').length;
        if (dfpIsLoaded) {
            return;
        }

        window.googletag = window.googletag || {};
        window.googletag.cmd = window.googletag.cmd || [];

        var gads = document.createElement('script');
        gads.async = true;
        gads.type = 'text/javascript';

        // Adblock blocks the load of Ad scripts... so we check for that
        gads.onerror = function () {
            dfpBlocked();
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

    },

    /**
     * This function gets called if DFP has been blocked by an adblocker
     * it implements a dummy version of the dfp object and allows the script to excute its callbacks
     * regardless of whether DFP is actually loaded or not... it is basically only useful for situations
     * where you are laying DFP over existing content and need to init things like slide shows after the loading
     * is completed.
     */
    dfpBlocked = function () {

        // Get the stored dfp commands
        var commands = window.googletag.cmd;

        // SetTimeout is a bit dirty but the script does not execute in the correct order without it
        setTimeout(function () {

            var _defineSlot = function (name, dimensions, id, oop) {
                window.googletag.ads.push(id);
                window.googletag.ads[id] = {
                    renderEnded: function () { },
                    addService: function () { return this; }
                };
                return window.googletag.ads[id];
            };

            // overwrite the dfp object - replacing the command array with a function and defining missing functions
            window.googletag = {
                cmd: {
                    push: function (callback) {
                        callback.call(dfpScript);
                    }
                },
                ads: [],
                pubads: function () { return this; },
                noFetch:function () { return this; },
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
                    window.googletag.ads[id].renderEnded.call(dfpScript);
                    return this;
                }

            };

            // Execute any stored commands
            $.each(commands, function (k, v) {
                window.googletag.cmd.push(v);
            });

        }, 50);

    };

    /**
     * Add function to the jQuery / Zepto / tire namespace
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

})(window.jQuery || window.Zepto || window.tire, window);
