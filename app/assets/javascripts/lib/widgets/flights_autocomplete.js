// ------------------------------------------------------------------------------
//
// FlightsWidgetAutocomplete
//
// ------------------------------------------------------------------------------

define([
  "jquery",
  "data/countries2",
  "autocomplete",
  "lib/utils/local_store"
], function($, countries, AutoComplete, LocalStore) {

  "use strict";

  function FlightsWidgetAutocomplete(args) {
    this.$currency        = args.$currency;
    this.$fromAirport     = args.$fromAirport;
    this.$fromCity        = args.$fromCity;
    this.$toAirport       = args.$toAirport;
    this.$toCity          = args.$toCity;
    this.localStore       = new LocalStore();
  }

  FlightsWidgetAutocomplete.prototype.init = function() {
    this.getAndSetCurrency();
    this.getCountryCode().done(this.getAndSetCurrency.bind(this));
    this.setupAutocomplete(this.$fromCity);
    this.setupAutocomplete(this.$toCity);
  };

  FlightsWidgetAutocomplete.prototype.getCountryCode = function() {
    return $.ajax({
      type: "GET",
      url: "https://www.lonelyplanet.com",
      success: function(data, textStatus, request) {
          this.countryCode = request.getResponseHeader("X-GeoIP-CountryCode") || "US";
        }.bind(this)
    });
  };

  FlightsWidgetAutocomplete.prototype.getAndSetCurrency = function() {
    if (!this.userCurrency) {
      this.userCurrency = this.localStore.getCookie("lpCurrency") || countries[this.countryCode];
      if (this.userCurrency) {
        this._userCurrencySelect();
      }
    }
  };

  // -------------------------------------------------------------------------
  // Private
  // -------------------------------------------------------------------------

  FlightsWidgetAutocomplete.prototype._userCurrencySelect = function() {
    this.$currency.val(this.userCurrency);
    this.$currency.prev().html(" " + this.userCurrency + " ");
  };

  FlightsWidgetAutocomplete.prototype.setupAutocomplete = function($el) {
    new AutoComplete({
      el: $el,
      threshold: 3,
      limit: 4,
      fetch: this._fetchCountries.bind(this),
      onItem: this._onSelectCity.bind(this),
      templates: {
        item: "<div class='{{isCity}}'>" + "<span class='autocomplete_place-name'>{{PlaceName}}</span>" + "<span class='autocomplete_country-name'>{{CountryName}}</span>" + "</div>",
        value: "{{PlaceId}}"
      }
    });
  };

  FlightsWidgetAutocomplete.prototype._fetchCountries = function(searchTerm, callback) {
    $.ajax({
      type: "get",
      dataType: "json",
      url: this._buildUrl(searchTerm)
    }).done(function(data) {
      var city, places;
      places = data.filter(function(el) {
        return el.CityId !== "-sky";
      });
      city = "";
      $.each(places, function(i, place) {
        place.PlaceName += place.PlaceId === place.CityId ? " (Any)" : " (" + (place.PlaceId.slice(0, -4)) + ")";
        place.isCity = city === place.CityId ? "child" : (city = place.CityId, "parent");
      });
      return callback(places);
    });
  };

  FlightsWidgetAutocomplete.prototype._buildUrl = function(searchTerm) {
    return "https://www.lonelyplanet.com/skyscanner/location-autosuggest?" + "user_currency=" + this.userCurrency + "&user_locale=en-GB" + "&user_country_code=" + this.countryCode + "&location_name=" + searchTerm;
  };

  FlightsWidgetAutocomplete.prototype._onSelectCity = function($item) {
    var fromTo, isFrom, selectedCode, selectedValue;
    selectedCode = $item.data("value").slice(0, -4);
    selectedValue = $item.text();
    selectedValue = selectedValue.substring(0, selectedValue.indexOf(")"));
    isFrom = $item.parent().parent().parent().find("#js-from-city").length;
    fromTo = isFrom ? "from" : "to";
    this["$" + fromTo + "Airport"].val(selectedCode);
    this["$" + fromTo + "City"].val(selectedValue + ")");
  };

  return FlightsWidgetAutocomplete;

});
