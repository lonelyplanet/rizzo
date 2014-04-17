require([ "public/assets/javascripts/lib/core/ad_manager_v2" ], function(AdManager) {

  describe("Ad Manager v2", function() {

    var instance;

    beforeEach(function() {
      loadFixtures("ad_iframe.html");

      window.lp = window.lp || {};

      window.lp.getCookie = function() {
        return [];
      };

      instance = new AdManager({
        networkID: "xxxx",
        template: "overview",
        theme: "family-holiday",
        layers: [ "lonelyplanet", "destinations" ]
      });
    });

    afterEach(function() {
      $(".adunit").removeData("googleAdUnit adUnit");
    });

    describe("._init()", function() {

      it("Loads and instantiates jQuery DFP", function() {

        spyOn(instance, "_adCallback").andReturn(null);
        spyOn(instance, "load").andReturn(null);

        runs(function() {
          instance._init();
        });

        waitsFor(function() {
          return $.hasOwnProperty("dfp");
        }, "DFP should be loaded", 250);

        runs(function() {
          expect(instance.load).toHaveBeenCalled();
          expect(instance.pluginConfig).toBeDefined();
        });

      });

    });

    describe(".formatKeywords()", function() {

      it("Should return the instance config formatted for jQuery.dfp targeting", function() {
        instance.config = {
          adThm: "honeymoons,world-food",
          adTnm: "overview,poi-list",
          layers: [],
          keyValues: {
            foo: "bar"
          }
        };

        var result = instance.formatKeywords();

        expect(result.thm).toEqual(instance.config.adThm);
        expect(result.tnm).toEqual(instance.config.adTnm.split(","));
        expect(result.foo).toEqual(instance.config.keyValues.foo);
      });
    });

    describe(".getNetworkID()", function() {

      it("Should return the default network ID if no cookie and no URL parameter are set", function() {
        spyOn(instance, "_networkCookie").andReturn(null);
        spyOn(instance, "_networkParam").andReturn(null);
        expect(instance.getNetworkID()).toBe(9885583);
      });

      it("Should return the network ID specified in a cookie", function() {
        spyOn(instance, "_networkCookie").andReturn(123456);
        spyOn(instance, "_networkParam").andReturn(null);
        expect(instance.getNetworkID()).toBe(123456);
      });

      it("Should return the network ID specified in the URL", function() {
        spyOn(instance, "_networkCookie").andReturn(null);
        spyOn(instance, "_networkParam").andReturn(78910);
        expect(instance.getNetworkID()).toBe(78910);
      });

    });

    describe(".load()", function() {

      it("Should load all ads", function() {

        runs(function() {
          spyOn(instance, "load").andCallThrough();
        });

        waitsFor(function() {
          return instance.load.callCount > 0;
        }, "DFP should instantiate ads", 250);

        runs(function() {
          expect($(".adunit").hasClass("display-none")).toBe(true);
        });

      });

      it("Should not reload already loaded ads", function() {

        runs(function() {
          $(".adunit").data("adUnit", true);
          spyOn(instance, "_adCallback").andReturn(null);
          spyOn(instance, "load").andCallThrough();
        });

        waitsFor(function() {
          return instance.load.callCount > 0;
        }, "DFP should instantiate ads", 250);

        runs(function() {
          expect(instance._adCallback).not.toHaveBeenCalled();
        });

      });

    });

    describe(".refresh()", function() {

      it("Should call the refresh method on ad units filtered by type", function() {
        var unit;

        function MockAdUnit(type) {
          this.type = type;
        }
        MockAdUnit.prototype.getType = function() {
          return this.type;
        };

        instance.$adunits = $([]);

        [ "leaderboard", "adSense", "mpu" ].forEach(function(type) {
          var mock = new MockAdUnit(type);
          mock.refresh = jasmine.createSpy("refresh");
          var $unit = $("<div>").data("adUnit", mock);
          instance.$adunits = instance.$adunits.add($unit);
        });

        instance.refresh("leaderboard");
        expect(instance.$adunits.eq(0).data("adUnit").refresh).toHaveBeenCalled();

        instance.refresh("adSense");
        expect(instance.$adunits.eq(1).data("adUnit").refresh).toHaveBeenCalled();

        instance.refresh("mpu");
        expect(instance.$adunits.eq(2).data("adUnit").refresh).toHaveBeenCalled();

        expect(instance.$adunits.eq(0).data("adUnit").refresh.callCount).toEqual(1);
        expect(instance.$adunits.eq(1).data("adUnit").refresh.callCount).toEqual(1);
        expect(instance.$adunits.eq(2).data("adUnit").refresh.callCount).toEqual(1);

      });

    });

  });

});
