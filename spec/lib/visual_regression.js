
/*
    Initialise CasperJs
*/

phantom.casperPath = './spec/helpers/phantomcss/CasperJs';
phantom.injectJs(phantom.casperPath + '/bin/bootstrap.js');

var casper = require('casper').create({
    viewportSize: {
        width: 1027,
        height: 800
    }
});

/*
    Require and initialise PhantomCSS module
*/

var phantomcss = require('./spec/helpers/phantomcss/phantomcss.js');
// var url = startServer('');

phantomcss.init({
    screenshotRoot: './spec/helpers/phantomcss/screenshots',
    failedComparisonsRoot: './spec/helpers/phantomcss/failures',
    libraryRoot: './spec/helpers/phantomcss'
});

/*
    The test scenario
*/

function getItems() {
    return document.querySelectorAll('.styleguide-block__item').length;
}

function getScreenShots(title) {
    items = this.evaluate(getItems);
    for (var i = 0; i < items; i++) {
        phantomcss.screenshot(".styleguide-block__item--" + i, title);
    }
}

casper.
    start("http://127.0.0.1:4000/styleguide").
    then(function(){
        getScreenShots.call(this, 'card')
        
    }).
    thenOpen("http://127.0.0.1:4000/styleguide/navigation", function() {
        getScreenShots.call(this, "navigation")
    }).
    thenOpen("http://127.0.0.1:4000/global", function() {
        phantomcss.screenshot("body", "core_nav");
    }).
    thenOpen("http://127.0.0.1:4000/legacy", function() {
        phantomcss.screenshot("body", "legacy_nav");
    }).
    thenOpen("http://127.0.0.1:4000/responsive", function() {
        phantomcss.screenshot("body", "responsive_nav");
    }).
    then(function(){
        this.viewport(480, 1000);
    }).
    thenOpen("http://127.0.0.1:4000/responsive", function() {
        phantomcss.screenshot("body", "responsive_nav");
    });


/*
    End tests and compare screenshots
*/

casper.
    then( function now_check_the_screenshots(){
        phantomcss.compareAll();
    }).
    run( function end_it(){
        console.log('\nTHE END.');
        phantom.exit(phantomcss.getExitStatus());
    });
