# flamsteed.js

flamsteed.js is a tiny, speedy, and modular client-side event logger.
RUM is built-in.

### Usage

    // setup
    var fs = new _FS({
      url: "http://f.example.com"
    });

    // log something happened
    fs.log({
        d: "data"
    });

    // log something happened and when it happened
    fs.time({
        d: "event"
    });

flamsteed buffers logged events. The buffer is only flushed back to the
server (and logged events are sent) when:

* buffer size greater or equal to `log_min_size` and `max_log_interval` has passed
* buffer size greater or equal to `log_max_size`
* `unload` event is triggered when the visitor navigates away from
  the page

When flamsteed first initializes, it generates `session_id` and `fid` attributes.
These are sent back with every bunch of events, so it can be used to identify
all the events associated with a particular page impression.

These can be set on `new _FS`, e.g:

    var fs = new _FS({
      session_id: "rZeDeb14LcKdWcqLA9AnBzs4Nmms5bWG",
      page_impression_id: "rZeDeb14LcKdWcqLA9AnBzs4Nmms5bWG-1413212917346"
    });

    var fs = new _FS({
      u: "rZeDeb14LcKdWcqLA9AnBzs4Nmms5bWG",
      fid: "rZeDeb14LcKdWcqLA9AnBzs4Nmms5bWG-1413212917346"
    });

Each payload flushed back to the server looks like this:

    {
      fid: "rZeDeb14LcKdWcqLA9AnBzs4Nmms5bWG-1413212917346",
      session_id: "rZeDeb14LcKdWcqLA9AnBzs4Nmms5bWG",
      schema: "0.1",
      t: 1354880453288,
      d: [
        { some: "data" },
        { other: "event", t: 132 },
        // snip
      ]
    }

Given the following example:

    var fs = new _FS({
      session_id: "rZeDeb14LcKdWcqLA9AnBzs4Nmms5bWG"
    });

The `fid` generated would be the `session_id` and [`Date.now()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now) delimited with `-`, e.g:

    "rZeDeb14LcKdWcqLA9AnBzs4Nmms5bWG-1413223038373"

### Options

* `debug`: print to console events logged and flushed
* `events`: array of events to log immediately
* `log_max_interval`: polling interval
* `log_min_size`: smallest number of unsent logged events to send
* `log_max_size`: threshold of number of unsent logged events to trigger immediately sending
* `strategy`: either `"ajax"` (send data as JSON via Ajax POST) or
  `"pixel"` (send data serialized as URL params in GET to tracking pixel)
* `url`: url of AJAX endpoint or tracking pixel
* `session_id` | `u` (Optional, but recommended) - Unique identifier for the context user or session
* `page_impression_id` | `fid` (Optional) - Unique identifier for the Flamsteed page impression instance
* `schema` - Schema version to append to each event

### RUM (real user-monitoring)

RUM and `fs.time` is only available in browsers that are `windows.performance.timing`-capable.

#### Built-in timing

If the browser has
[navigation timing capability](https://developer.mozilla.org/en-US/docs/Navigation_timing),
flamsteed will automatically collect and send performance data from
two sources:

* `window.performance.timing`
* `chrome.loadTimes` (if available) (TODO: blocked by https://code.google.com/p/chromium/issues/detail?id=160547)

#### Custom "business" timing

The point at which the page is usuable or ready might not line up exactly within any of the
built-in timings. For example, you might have a whole bunch of
components, widgets, or ads lazy-loaded after `domComplete`, but
you're specifically interested in one of them (e.g. timeline for
Facebook).

flamsteed lets you time custom events, relative to the
`window.performance.timing.navigationStart` timestamp.

    fs.time({
        some: "data"
    });

NB: This is only as
accurate and precise as the JS clock, which is not always accurate or
precise. So flamsteed will discard timings that are less than 0, and
it's advisable that you treat custom timings as benchmarks not true,
accurate values.

### Goals

* speedy
* tiny
* modular

*Broad browser compatibility is not a current goal.*

### Compatibility

* FFX 7+
* Chrome 7+
* IE 9+
* Opera 11.6+, Safari 5.x+ (No RUM)

## Development

First of all, make sure you follow [this guide](http://gruntjs.com/getting-started) and have the grunt cli installed, then:

    $ npm install

One-shot test run:

    $ grunt

Continuous testing:

    $ grunt dev

## Related projects

* [boomerang](http://lognormal.github.com/boomerang/doc/)
* [piwik](http://piwik.org/)
* [snowplow](snowplowanalytics.com)
