describe("SwappingRouter", function() {
  var router;

  beforeEach(function() {
    window.location.hash = "#";

    routerSubclass = Support.SwappingRouter.extend({
      routes: {
        "test": "index"
      },

      index: function() {
      }
    });
    router = new routerSubclass({});
    Backbone.history.start();
  });

  it("should be a backbone router", function() {
    var spy = sinon.spy();
    router.bind("route:index", spy);

    waits(50);

    runs(function() {
      window.location.hash = "#test"
    });

    waits(50);

    runs(function() {
      expect(spy.called).toBeTruthy();
    });
  });
});
