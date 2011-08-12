describe("CompositeView", function() {
  var orangeView = Support.CompositeView.extend({
    render: function() {
      var text = this.make("span", {}, "Orange!");
      $(this.el).append(text);
    }
  });

  beforeEach(function() {
    Helpers.setup();
    $("body").append("<div id='test'></div>");
  });

  afterEach(function() {
    Helpers.teardown();
  });

  it("removes elements and events when leave() is called", function() {
    var view = new orangeView();
    var spy = sinon.spy(view, "unbind");

    runs(function() {
      view.render();
      $("#test").append(view.el);
    });

    Helpers.sleep();

    runs(function() {
      expect($("#test").text()).toEqual("Orange!");
    });

    Helpers.sleep();

    runs(function() {
      view.leave();
    });

    Helpers.sleep();

    runs(function() {
      expect($("#test").text()).toEqual("");
      expect(spy.called).toBeTruthy();
    });
  });
});
