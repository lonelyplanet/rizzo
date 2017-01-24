define([ "jquery", "autocomplete" ], function($, Autocomplete) {

  "use strict";

  var savedSearchTerm = "";

  function NavSearch() {

    var $el = $(".js-primary-search");

    // switch search icon on click
    $el.on("focus", function() {
      $(".js-search-icon").addClass("active-search");
    }).on("blur", function() {
      $(".js-search-icon").removeClass("active-search");
    });

    new Autocomplete({
      el: $el,
      threshold: 2,
      limit: 10,
      templates: {
        item: "<div class='nav__icon nav__submenu__item__text icon--{{type}}--before'>{{name}}</div>",
        value: "{{url}}"
      },
      extraClasses: {
        wrapper: "primary-search-autocomplete",
        item: "nav__item nav__submenu__item"
      },
      fetch: function(searchTerm, callback) {
        savedSearchTerm = searchTerm;
        $.ajax({
          url: "//www.lonelyplanet.com/search.json?q=" + searchTerm,
          dataType: "json",
          success: function(data) {
            var schemeSeparator = "://",
            length = data.length,
            item, index;
            if (data && length) {
              while (length) {
                item = data[--length];
                index = item.slug.indexOf(schemeSeparator);
                item.url = index > -1 && index < 5  ? item.slug : "http://www.lonelyplanet.com/" + item.slug;
              }
            }
            callback(data);
            $el
              .next(".autocomplete__results")
              .find(".autocomplete__list")
              .append(
                "<div class='autocomplete__list__item'>" +
                  "<a class='btn btn--medium btn--linkblue btn--full-width'" +
                    " href='http://www.lonelyplanet.com/search?q=" + searchTerm + "'>" +
                    "See all results" +
                  "</a>" +
                "</div>"
              );
          }
        });
      },
      onItem: this.onItem
    });
  }

  NavSearch.prototype.onItem = function(item) {
    var url = $(item).data("value");

    window.lp.analytics.api.trackEvent({
      category: "search",
      action: "autocomplete",
      label: url
    });

    window.lp.fs.log({
      autocompleteTerm: savedSearchTerm,
      autocompleteURL: url
    });

    window.location = url;

  };

  $(document).ready(function() {
    new NavSearch;
  });

  return NavSearch;

});
