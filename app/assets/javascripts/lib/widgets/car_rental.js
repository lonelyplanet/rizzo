// ------------------------------------------------------------------------------
//
// Car App - Imported from Landing Pages
//
// ------------------------------------------------------------------------------
define([
  "jquery",
  "autocomplete",
  "data/car_rental_data",
  "data/countries",
  "data/currencies",
  "lib/utils/local_store",
  "picker",
  "pickerDate",
  "pickerLegacy"
], function($, AutoComplete, dataJSON, countries, currencies, LocalStore) {

  "use strict";

  var CarApp,
      $checkbox, $widget, $pickupTime, $pickupDate,
      $pickupLocation, $dropoffTime, $dropoffDate,
      $dropoffLocation, $currency, $currencyContainer,
      $residence, $residenceContainer,
      localStore, userCurrency;

  CarApp = function() {

    this.config = {
      pickupDate: "",
      pickupDateTime: "", // generated
      pickupLocationID: "",
      dropoffDate: "",
      dropoffDateTime: "", // generated
      dropoffLocationID: "",
      residencyID: "IE",
      currencyID: "GBP",
      CLIENT_ID: 502590,
      HEADER_CODE: "305E8A8B"
    };

    localStore = new LocalStore();
  };

  CarApp.prototype.init = function() {
    userCurrency = localStore.getCookie("lpCurrency");

    $checkbox = $("#js-dropoff-different");
    $widget = $(".js-car-rental-widget");
    $pickupTime = $("#js-pickup-time");
    $pickupDate = $("#js-pickup-date");
    $pickupLocation = $("#js-pickup-location");
    $dropoffTime = $("#js-dropoff-time");
    $dropoffDate = $("#js-dropoff-date");
    $dropoffLocation = $("#js-dropoff-location");
    $currency = $("#js-driver-currency");
    $currencyContainer = $currency.closest(".js-select-group-manager").find(".js-select-overlay");
    $residence = $("#js-driver-country");
    $residenceContainer = $residence.closest(".js-select-group-manager").find(".js-select-overlay");

    this.initDatepickers();
    this.initAutocompletes();
    this.handlers();
    this.setPickupTime();

    $(document).ready(function() {
      this.generateCountries();
      this.generateCurrencies();
    }.bind(this));
  };

  CarApp.prototype.generateCurrencies = function() {
    var options = "<option value=''>Currency</option>",
        currency;

    for (var i = 0; i < currencies.length; i++) {
      currency = currencies[i].code;
      options += "<option value='" + currency + "'" + ">" + currencies[i].name + "</option>";
    }
    $currency.html(options).trigger("change");
  };

  CarApp.prototype.generateCountries = function() {
    var options = "<option value=''>Country of Residence</option>",
        currency;

    for (var i = 0; i < countries.length; i++) {
      if (countries[i].hasOwnProperty("currency")) {
        currency = "data-currencycode='" + countries[i].currency + "'";
      } else {
        currency = "";
      }

      options += "<option value='" + countries[i].code + "' " + currency + ">" + countries[i].name + "</option>";
    }

    $residence.html(options).trigger("change");
  };

  CarApp.prototype.flagError = function(elem, type) {
    switch (type) {
      case "datepicker":
      case "text":
        elem.addClass("form--error");
        break;
      case "select":
        elem.closest(".js-select-group-manager").find(".js-select-overlay").addClass("form--error");
        break;
    }
  };

  CarApp.prototype.validate = function() {
    var errors = false,
        $errors;

    if ($pickupDate.val() === "") {
      this.flagError($pickupDate, "datepicker");
      errors = true;
    }

    if ($dropoffDate.val() === "") {
      this.flagError($dropoffDate, "datepicker");
      errors = true;
    }

    if ($pickupTime.val() === "Time") {
      this.flagError($pickupTime, "select");
      errors = true;
    }

    if ($dropoffTime.val() === "Time") {
      this.flagError($dropoffTime, "select");
      errors = true;
    }

    if ($residenceContainer.text().replace(/[ \n]/g, "") === "Countryofresidence") {
      this.flagError($residence, "select");
      errors = true;
    }

    if ($currencyContainer.text().replace(/[ \n]/g, "") === "Currency") {
      this.flagError($currency, "select");
      errors = true;
    }

    if ($pickupLocation.val() === "") {
      this.flagError($pickupLocation, "text");
      errors = true;
    }

    if ($checkbox.prop("checked") && $dropoffLocation.val() === "") {
      this.flagError($dropoffLocation, "text");
      errors = true;
    }

    // If there are errors, show an alerting div over the submit button
    // which will fade away after 2 seconds.
    $errors = $(".alert--error");
    if (errors && !$errors.is(":visible")) {

      $errors.show();

      setTimeout(function() {
        $errors.hide();
      }, 2000);
    }

    return !errors;
  };

  CarApp.prototype.handlers = function() {
    var _this = this;

    $dropoffDate.add($pickupDate).change(function() {
      _this._clearError($(this));
    });

    $pickupLocation.add($dropoffLocation).keyup(function() {
      _this._clearError($(this));
    });

    // checkbox click signifies a different return location
    $widget.on("click", "#js-dropoff-different", function() {
      // Clear any error styles on the drop off location input
      $dropoffLocation.removeClass("form--error");

      if (this.checked) {
        _this.showdropoffLocation();
      } else {
        _this.hidedropoffLocation();
      }
    });
    _this.hidedropoffLocation();

    $widget.on("change", "#js-driver-country", function() {
      var currency = $(this).find(":selected").data("currencycode") || "USD";

      $residenceContainer.removeClass("form--error"); // Clear error style

      $currency.children("[value=" + currency + "]").prop("selected", true);
      $currency.trigger("change");
    });

    $widget.on("change", "#js-driver-currency", function() {
      $currencyContainer.removeClass("form--error");  // Clear error style
    });

    // listen for a change in pickup time
    $widget.on("change", "#js-pickup-time", function() {
      _this.setdropoffTime();
    });

    // Form submission handler
    $widget.on("click", ".js-get-quote", function(e) {
      if (_this.validate()) {
        _this.config.pickupDateTime = _this.config.pickupDate + $pickupTime.val();
        _this.config.dropoffDateTime = _this.config.dropoffDate + $dropoffTime.val();
        _this.constructDeepLink();
      } else {
        e.preventDefault();
        return;
      }
    });
  };

  CarApp.prototype.initDatepickers = function() {
    var _this = this,
        today = new Date().getTime(); // store as UNIX timestamp

    $dropoffDate.pickadate({
      editable: false,
      format: "d mmm yyyy",
      onSet: function(context) {
        var date = _this.unixToDate(context.select);
        _this.config.dropoffDate = date + "T";
      }
    });

    $pickupDate.pickadate({
      editable: false,
      min: today,
      format: "d mmm yyyy",
      onStart: function() {
        this.set({ select: today });  // set today's date as the default
        _this.setDropoffDate(today);  // then trigger a change of the pickup date
      },
      onSet: function(context) {
        var date = _this.unixToDate(context.select),
            newStartDate = new Date(context.select),
            newMinimumEndDate = new Date(newStartDate.getTime() + 24 * 60 * 60 * 1000);

        $dropoffDate.pickadate("picker").set("min", newMinimumEndDate);

        _this.config.pickupDate = date + "T";
        _this.setDropoffDate(context.select);  // trigger when the user sets the pickup date
      }
    });

  };

  CarApp.prototype.initAutocompletes = function() {
    this.autoCompletePickup = new AutoComplete({
      el: "#js-pickup-location",
      limit: 0,
      threshold: 2,
      templates: {
        item: "{{n}}",
        value: "{{i}}"
      },
      fetch: this.fetchFilter,
      onItem: this._autoSelect
    });
  };

  CarApp.prototype.hidedropoffLocation = function() {
    $(".dropoff-area").hide();
    $dropoffLocation.attr("data-locationid","");
    $widget.removeClass("drop-off-visible");
  };

  CarApp.prototype.showdropoffLocation = function() {
    $(".dropoff-area").show();
    $widget.addClass("drop-off-visible");

    this.autoCompleteDropoff = new AutoComplete({
      el: "#js-dropoff-location",
      threshold: 2,
      templates: {
        item: "{{n}}",
        value: "{{i}}"
      },
      fetch: this.fetchFilter,
      onItem: this._autoSelect
    });
  };

  CarApp.prototype.setDropoffDate = function(unixDate) {
    var newDate = this.incrementUnixDate(unixDate),
        dropPicker = $dropoffDate.pickadate({
          format: "d mmm yyyy"
        }),
        picker = dropPicker.pickadate("picker"),
        realDate = this.unixToDate(newDate);

    this.config.dropoffDate = realDate + "T";

    picker.set({
      select: newDate
    });
  };

  CarApp.prototype.incrementUnixDate = function(unixDate) {
    var newDate = unixDate + 86400000;
    return newDate;
  };

  CarApp.prototype.setdropoffTime = function() {
    // get the index of the option that is selected
    var $pickupTimeIndex = $pickupTime[0].selectedIndex;

    // set the selected index of the drop-off el to match that of pick-up
    $dropoffTime[0].selectedIndex = $pickupTimeIndex;

    // call change method on select menu
    $dropoffTime.change();
  };

  CarApp.prototype.setPickupTime = function() {
    setTimeout(function() {
      $pickupTime.change();
    }, 1000);
  };

  CarApp.prototype.unixToDate = function(date) {
    var myDate = new Date(date);

    return myDate.getFullYear() + "-" + ("0" + (myDate.getMonth() + 1)).slice(-2) + "-" + ("0" + myDate.getDate()).slice(-2);
  };

  CarApp.prototype.constructDeepLink = function() {
    var dropoffDiff = $dropoffLocation.attr("data-locationid") || $pickupLocation.attr("data-locationid"),
        // string conatenation performs marginally better this way...
        url = "https://www.cartrawler.com/res/affiliate/?";
    url += "&tv=" + this.config.HEADER_CODE;
    url += "&clientId=" + this.config.CLIENT_ID;
    url += "&pickupLocationId=" + $pickupLocation.attr("data-locationid");
    if (dropoffDiff) {
      url += "&returnLocationId=" + dropoffDiff;
    }
    url += "&residencyId=" + $residence.find(":selected").val();
    url += "&currencyId=" + $currency.find(":selected").val();
    url += "&pickupDateTime=" + this.config.pickupDateTime;
    url += "&returnDateTime=" + this.config.dropoffDateTime;
    window.open(url);
    return url;
  };

  // -------------------------------------------------------------------------
  // Private Functions
  // -------------------------------------------------------------------------

  CarApp.prototype.fetchFilter = function(searchTerm, cb) {
    var results = [],
        term = searchTerm.toLowerCase();

    for (var i = 0; i < dataJSON.length; i++) {
      var hasAirport = dataJSON[i].hasOwnProperty("a"),
          hasCity = dataJSON[i].hasOwnProperty("c"),
          matchesAirport, matchesCity, matchesName;

      if (hasAirport) {
        matchesAirport = dataJSON[i].a.toLowerCase().indexOf(term) != -1;
      }
      if (hasCity) {
        matchesCity = dataJSON[i].c.toLowerCase().indexOf(term) != -1;
      }

      matchesName = dataJSON[i].n.toLowerCase().indexOf(term) != -1;

      if ((hasCity && matchesCity) || (hasAirport && matchesAirport) || matchesName) {
        results.push(dataJSON[i]);
      }
    }

    setTimeout(function() {
      cb(results);
    }, 1000);
  };

  CarApp.prototype._autoSelect = function(item) {
    var $item = $(item),
        $input = $item.closest(".autocomplete").find("input");

    $input.val($item.text()).attr("data-locationid", $item.data("value"));
  };

  CarApp.prototype._clearError = function($el) {
    $el.removeClass("form--error");
  };

  return CarApp;

});
