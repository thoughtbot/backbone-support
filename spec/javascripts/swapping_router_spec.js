describe("Support.SwappingRouter", function() {
  var historyStarted = false;

  var redView = Backbone.View.extend({
    render: function() {
      $(this.el).text("Red!");
    }
  });

  var blueView = Backbone.View.extend({
    render: function() {
      $(this.el).text("Blue!");
    }
  });

  var leaveView = Backbone.View.extend({
    leave: function() {
    }
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

  it("should be a backbone router", function() {
    var spy = sinon.spy();
    router.bind("route:index", spy);

    runs(function() {
      window.location.hash = "#test"
    });

    Helpers.sleep();

    runs(function() {
      expect(spy.called).toBeTruthy();
    });
  });

  it("renders and swaps backbone views", function() {
    runs(function() {
      window.location.hash = "#red"
    });

    Helpers.sleep();

    runs(function() {
      expect($("#test").text()).toEqual("Red!");
    });

    Helpers.sleep();

    runs(function() {
      window.location.hash = "#blue"
    });

    Helpers.sleep();

    runs(function() {
      expect($("#test").text()).toEqual("Blue!");
    });
  });

  it("calls leave if it exists on a view", function() {
    var spy = sinon.spy(leaveViewInstance, "leave");

    runs(function() {
      window.location.hash = "#leave"
    });

    Helpers.sleep();

    runs(function() {
      window.location.hash = "#red"
    });

    Helpers.sleep();

    runs(function() {
      expect($("#test").text()).toEqual("Red!");
      expect(spy.called).toBeTruthy();
    });
  });
});
