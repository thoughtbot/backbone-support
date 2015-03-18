describe("Support.SwappingRouter", function() {
  var historyStarted = false;

  var redView = Backbone.View.extend({
    render: function() {
      $(this.el).text("Red!");
      return this;
    }
  });

  var blueView = Backbone.View.extend({
    render: function() {
      $(this.el).text("Blue!");
      return this;
    }
  });

  var leaveView = Backbone.View.extend({
    leave: function() {},
    swapped: function() {},
  });
  var leaveViewInstance = new leaveView();

  var routerSubclass = Support.SwappingRouter.extend({
    routes: {
      "test": "index",
      "red": "red",
      "blue": "blue",
      "leave": "leave"
    },

    index: function() {
    },

    red: function() {
      this.swap(new redView());
    },

    blue: function() {
      this.swap(new blueView());
    },

    leave: function() {
      this.swap(leaveViewInstance);
    }
  });
  var router = new routerSubclass({});

  beforeEach(function() {
    Helpers.setup();

    if(!historyStarted) {
      historyStarted = true;
      Backbone.history.start();
    }
    router.el = "#test";
  });

  afterEach(function() {
    Helpers.teardown();
  });

  it("should be a backbone router", function(done) {
    var spy = sinon.spy();
    router.bind("route:index", spy);

    window.location.hash = "#test";

    setTimeout(function() {
      expect(spy.called).toBeTruthy();
      done();
    }, 30);
  });

  it("renders and swaps backbone views", function(done) {
    window.location.hash = "#red";

    setTimeout(function() {
      expect($("#test").text()).toEqual("Red!");

      window.location.hash = "#blue";

      setTimeout(function() {
        expect($("#test").text()).toEqual("Blue!");

        done();
      }, 30);
    }, 30);
  });

  it("calls leave if it exists on a view", function(done) {
    var spy = sinon.spy(leaveViewInstance, "leave");

    window.location.hash = "#leave";

    setTimeout(function() {
      window.location.hash = "#red";

      setTimeout(function() {
        expect(spy.called).toBeTruthy();
        expect($("#test").text()).toEqual("Red!");

        done();
      }, 30);
    }, 30);
  });

  it("calls .swapped on the view after swapping", function(done) {
    var spy = sinon.spy(leaveViewInstance, "swapped");

    window.location.hash = "#leave";

    setTimeout(function() {
      expect(spy.called).toBeTruthy()

      done();
    });
  });

  it("is instanceof Router", function() {
    expect(router instanceof Backbone.Router).toBeTruthy();
  });
});
