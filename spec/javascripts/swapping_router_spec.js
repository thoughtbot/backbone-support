describe("SwappingRouter", function() {
  var router;

  beforeEach(function() {
    routerSubclass = Support.SwappingRouter.extend({
      routes: {
        "test": "someMethod"
      }
    });
    router = new routerSubclass({});
  });

  it("should be a backbone router", function() {
    expect(router.routes.test).toEqual("someMethod");
  });
});
