describe("SwappingRouter", function() {
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

  var routerSubclass = Support.SwappingRouter.extend({
    routes: {
      "test": "index",
      "red": "red",
      "blue": "blue"
    },

    index: function() {
    },

    red: function() {
      this.swap(new redView());
    },

    blue: function() {
      this.swap(new blueView());
    }
  });
  var router = new routerSubclass({});

  beforeEach(function() {
    window.location.hash = "#";
    $("#test").remove();

    if(!historyStarted) {
      historyStarted = true;
      Backbone.history.start();
    }
    $("body").append("<div id='test'></div>");
    router.el = $("#test");
  });

  it("should be a backbone router", function() {
    var spy = sinon.spy();
    router.bind("route:index", spy);

    runs(function() {
      window.location.hash = "#test"
    });

    waits(50);

    runs(function() {
      expect(spy.called).toBeTruthy();
    });
  });

  it("renders and swaps backbone views", function() {
    runs(function() {
      window.location.hash = "#red"
    });

    waits(50);

    runs(function() {
      expect($("#test").text()).toEqual("Red!");
    });

    waits(50);

    runs(function() {
      window.location.hash = "#blue"
    });

    waits(50);

    runs(function() {
      expect($("#test").text()).toEqual("Blue!");
    });
  });
});
