jQuery DFP - A jQuery implementation for Google DFP
======================================================

[![Build Status](https://travis-ci.org/coop182/jquery.dfp.js.png?branch=master)](https://travis-ci.org/coop182/jquery.dfp.js)

This script is a drop in solution for getting Double Click for Publishers (DFP) by Google working on your page. By including this script on your page and then initialising it in the ways described below you should find it very easy to get DFP working.

Do not include any of the generated DFP script tags from the DFP admin on your page, this script replaces them.

This script also works with [Zepto.js](http://zeptojs.com/) and [Tire.js](http://tirejs.com/)

Demo / Ad unit tester
---------------------

You can use [this page](http://coop182.github.io/jquery.dfp.js/dfptests/test.html?google_console=1&networkID=15572793&adunitID=Leader&dimensions=728x90) to test your DFP ads using the jquery.dfp.js script. There is some debug code included to help debug the ad delivery.

You can also use the [Google Console](https://support.google.com/dfp_sb/answer/181070?hl=en-GB) to debug your ad units. This is done by by adding a "google_console=1" or "google_debug=1" to the url, and toggling the console by pressing CTRL + F10.

Setup
-----

You can add ad units to your page in any location that you would like to display an ad.

By default this script will look for ad units with a class of `adunit` but you can of course use jQuery selectors as well.

The minimum information required for an ad unit to function is having the ad unit specified. To do this you can use the id parameter of the element, for example:

    <div class="adunit" id="Ad_unit_id"></div>

In the example above the ID of the div element will be used to look up a corresponding ad unit in DFP and the dimensions of the adunit will be set to the same dimensions of the div which could be defined in your CSS.

You can optionally specify the adunit name and dimensions in the following way:

    <div class="adunit" data-adunit="Ad_unit_id" data-dimensions="393x176"></div>

This method can be useful for including multiple copies of an ad unit with the same name which when part of a DFP placement will then pull in as many different creatives as possible.

You can also specify multiple dimensions sets:

    <div class="adunit" data-adunit="Ad_unit_id" data-dimensions="393x176,450x500"></div>

Also you can optionally specify custom targeting on a per ad unit basis in the following way:

    <div class="adunit" data-adunit="Ad_unit_id" data-dimensions="393x176" data-targeting='{"city_id":"1"}'></div>

Also you can optionally specify custom exclusion category on a per ad unit basis in the following way:

    <div class="adunit" data-adunit="Ad_unit_id" data-dimensions="393x176" data-exclusions="firstcategory,secondcategory"></div>

To create an out of page ad unit set the data-outofpage property on the ad unit. Dimensions are not required for out of page ad units.

    <div class="adunit" data-adunit="Ad_unit_id" data-outofpage="true"></div>

Usage
-----

Calling the script:

    <html>
    <head>
        <title>DFP TEST</title>
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
        <script src="jquery.dfp.min.js"></script>
    </head>
    <body>

        <div class="adunit" id="Middle_Feature" data-dimensions="393x176" data-targeting='{"city_id":"1"}'></div>

        <script>

            $.dfp({
                dfpID: 'xxxxxxxxx'
            });

        </script>

    </body>
    </html>

Using a bootstrap file (take a look at [example-bootstrap.js](https://github.com/coop182/jquery.dfp.js/blob/master/example-bootstrap.js)):

    <html>
    <head>
        <title>DFP TEST</title>
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
        <script src="example-bootstrap.js"></script>
    </head>
    <body>

        <div class="adunit" id="Middle_Feature" data-dimensions="393x176" data-targeting='{"city_id":"1"}'></div>

    </body>
    </html>

You can init the script in the following ways:

<pre>
$.dfp('xxxxxxxxx');
</pre>
<pre>
$.dfp({
    dfpID:'xxxxxxxxx'
});
</pre>
<pre>
$('selector').dfp({
    dfpID:'xxxxxxxxx'
});
</pre>

<pre>
$('selector').dfp({
    dfpID:'xxxxxxxxx',
    setCategoryExclusion: 'firstcategory, secondcategory'
});
</pre>
<pre>
$('selector').dfp({
    dfpID:'xxxxxxxxx',
    setLocation: { latitude: 34, longitude: -45.12, precision: 1000 }
});
</pre>
<pre>
$('selector').dfp({
    dfpID:'xxxxxxxxx',
    sizeMapping: {
        'my-default': [
        	{browser: [1024, 768], ad_sizes: [980, 185]},
	        {browser: [ 980, 600], ad_sizes: [[728, 90], [640, 480]]}
	        {browser: [   0,   0], ad_sizes: [88, 31]}
        ],
    }
});
</pre>

Available Options
-----------------

<table>
    <tr>
        <th>Option</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>dfpID</td>
        <td>This string is your unique DFP account ID.</td>
    </tr>
    <tr>
        <td>setTargeting</td>
        <td>This object is where you set custom targeting key value pairs. Also see the Default Targeting options that are set further down the page.</td>
    </tr>
    <tr>
        <td>setUrlTargeting</td>
        <td>This boolean specifies whether the targeting should include information found in the url of the current page. The default value of this option is true.</td>
    </tr>
    <tr>
        <td>setCategoryExclusion</td>
        <td>This comma separated list sets category exclusions globally (page level).</td>
    </tr>
    <tr>
        <td>setLocation</td>
        <td>This object sets geolocalization. String values are not valid. </td>
    </tr>

    <tr>
        <td>enableSingleRequest</td>
        <td>This boolean sets whether the page ads are fetched with a single request or not, you will need to set this to false it you want to call $.dfp() more than once, typically you would do this if you are loading ad units into the page after the initial load.</td>
    </tr>
    <tr>
        <td>collapseEmptyDivs</td>
        <td>This can be set to true, false or 'original'. If its set to true the divs will be set to display:none if no line item is found. False means that the ad unit div will stay visible no matter what. Setting this to 'original' (the default option) means that the ad unit div will be hidden if no line items are found UNLESS there is some existing content inside the ad unit div tags. This allows you to have fall back content in the ad unit in the event that no ads are found.</td>
    </tr>
    <tr>
        <td>refreshExisting</td>
        <td>This boolean controls what happens when dfp is called multiple times on ad units. By default it is set to true which means that if an already initialised ad is initialised again it will instead be refreshed.</td>
    </tr>
    <tr>
        <td>sizeMapping</td>
        <td>Defines named size maps that can be used with in combination with the data-size-mapping attribute to enable responsive ad sizing (https://support.google.com/dfp_premium/answer/3423562?hl=en).</td>
    </tr>
    <tr>
        <td>afterEachAdLoaded</td>
        <td>This is a call back function, see below for more information.</td>
    </tr>
    <tr>
        <td>afterAllAdsLoaded</td>
        <td>This is a call back function, see below for more information.</td>
    </tr>
    <tr>
        <td>beforeEachAdLoaded</td>
        <td>This is a call back function, see below for more information.</td>
    </tr>
</table>

Callbacks
---------

This script provides two callbacks which you can use to make working with DFP a little easier.

<table>
    <tr>
        <th>Callback</th>
        <th>Parameters</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>afterEachAdLoaded(adUnit)</td>
        <td>
            <ul>
                <li>adUnit - jQuery Object - the jQuery object</li>
            </ul>
        </td>
        <td>This is called after each ad unit has finished rendering.</td>
    </tr>
    <tr>
        <td>afterAllAdsLoaded(adUnits)</td>
        <td>
            <ul>
                <li>adUnits - jQuery Object - the jQuery object containing all selected ad units</li>
            </ul>
        </td>
        <td>This is called after all ad units have finished rendering.</td>
    </tr>
    <tr>
        <td>alterAdUnitName(adUnitName, adUnit)</td>
        <td>
            <ul>
                <li>adUnitName - String - the default ad unit name</li>
                <li>adUnit - jQuery Object - the jQuery object</li>
            </ul>
        </td>
        <td>Return the modified or overrided ad unit name.  This function is called once per ad unit.</td>
    </tr>
    <tr>
        <td>beforeEachAdLoaded(adUnit)</td>
        <td>
            <ul>
                <li>adUnit - jQuery Object - the jQuery object</li>
            </ul>
        </td>
        <td>This is called before each ad unit has started rendering.</td>
    </tr>
</table>

Please see the [example-bootstrap.js](https://github.com/coop182/jquery.dfp.js/blob/master/example-bootstrap.js) file for an example of how to use these.

Default URL Targeting
---------------------

The following targeting options are built into this script and should be setup in your DFP account ([within Inventory/Custom Targeting](https://support.google.com/dfp_sb/bin/answer.py?hl=en&answer=2983838)) to make full use of them. These targeting-parameters can be turned on/off with the setUrlTargeting option.

**Beware: The Targeting string has a 40 character limit!**

<table>
    <tr>
        <th>Key</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Domain</td>
        <td>This allows you to target different domains, for example you could test your ads on your staging environment before pushing them live by specifying a domain of staging.yourdomain.com within DFP, this script will take care of the rest.</td>
    </tr>
    <tr>
        <td>inURL</td>
        <td>This allows you to target URLs containing the segment you specify in DFP, for example you could set inURL to '/page1' on the targeting options of the DFP line item and it would then allow ads to show on any page that contains /page1 in its URL. e.g. http://www.yourdomain.com/page1 or http://www.yourdomain.com/page1/segment2 or http://www.yourdomain.com/section/page1</td>
    </tr>
    <tr>
        <td>URLIs</td>
        <td>This allows you to target the exact URL of the users browser, for example if you set URLIs to '/page1' on the targeting options of the DFP line item it would match http://www.yourdomain.com/page1 only and not http://www.yourdomain.com/page1/segment2.</td>
    </tr>
    <tr>
        <td>Query</td>
        <td>This allows you to target the query parameters of a page. For example if the URL was http://www.yourdomain.com/page1?param1=value1 you could target it with a DFP ad by specifying a Query targeting string of param1:value1</td>
    </tr>
</table>

One common issue that you may run into with using the above targeting is that URL paths that you might want to target can easily be above the 40 character limit. To get around this you can specify multiple inURL rules. For example if you are wanting to target a URL like http://www.yourdomain.com/this/url/is/much/too/long/to/fit-into/the-dfp-targeting-value-box you can break it up into multiple inURL AND rules.

![URL Targeting](https://raw.github.com/coop182/jquery.dfp.js/master/img/url-targetting.png)

Contributing
------------

Any and all contributions will be greatly appreciated.

If you wish to you can use [Grunt](http://gruntjs.com/) to enable a smooth contributing and build process.

Install Node.js by running `sudo apt-get install nodejs`

Install Grunt using: `npm install -g grunt-cli`

Once installed run `npm install` from inside the cloned repo directory.

You should now be able to make your changes to `jquery.dfp.js` and once you are finished simply run `grunt` if there are no errors then you can commit your changes and make a pull request and your feature/bug fix will be merged as soon as possible.

Please feel free to write tests which will test your new code, [Travis CI](https://travis-ci.org/) is used to test the code automatically once a pull request is generated.

Thanks a lot to these contributors:

<ul>
    <li>@crccheck - https://github.com/crccheck</li>
    <li>@larryaubstore - https://github.com/larryaubstore</li>
    <li>@MikeSilvis - https://github.com/MikeSilvis</li>
    <li>@soreng - https://github.com/soreng</li>
    <li>@i-like-robots - https://github.com/i-like-robots</li>
    <li>@pdbreen - https://github.com/pdbreen</li>
    <li>@yesnoio - https://github.com/yesnoio</li>
</ul>
