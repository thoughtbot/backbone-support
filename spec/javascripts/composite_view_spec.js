describe("Support.CompositeView", function() {
  var orangeView = Support.CompositeView.extend({
    render: function() {
      var text = this.make("span", {}, "Orange!");
      $(this.el).append(text);
    },

    onLeave: function() {
      var text = this.make("span", {}, "onLeave!");
      $(this.el).append(text);
    }
  });

  var blankView = Support.CompositeView.extend({
    render: function() {
    }
  });

  var normalView = Backbone.View.extend({
    render: function() {
      var text = this.make("span", {}, "Normal!");
      $(this.el).append(text);
    }
  });

  beforeEach(function() {
    Helpers.setup();
    Helpers.append("test1");
    Helpers.append("test2");
  });

  afterEach(function() {
    Helpers.teardown();
  });

  describe("#renderChild", function() {
    it("renders children views", function() {
      var view = new blankView();
      view.renderChild(new orangeView({el: "#test1"}));
      view.renderChild(new orangeView({el: "#test2"}));

      expect($("#test1").text()).toEqual("Orange!");
      expect($("#test2").text()).toEqual("Orange!");
    });
  });
  
  describe("#renderChildInto", function() {
    it("renders child into the given element and replaces content there", function() {
      $("#test1").text("Replace this!");

      var view = new blankView({el: "#test"});
      view.renderChildInto(new orangeView(), "#test1");

      expect($("#test").text()).toEqual("");
      expect($("#test1").text()).toEqual("Orange!");
    });
  });

  describe("#appendChild", function() {
    it("renders and appends children views", function() {
      var view = new blankView({el: "#test"});
      view.appendChild(new orangeView());
      view.appendChild(new orangeView());

      expect($("#test").text()).toEqual("Orange!Orange!");
    });
  });

  describe("#appendChildTo", function() {
    it("appends child into the given element", function() {
      $("#test1").text("Append to this!");
  
      var view = new blankView({el: "#test"});
      view.appendChildTo(new orangeView(), "#test1");
  
      expect($("#test").text()).toEqual("");
      expect($("#test1").text()).toEqual("Append to this!Orange!");
    });
  });
  
  describe("#prependChild", function() {
    it("renders and prepends children views", function() {
      var view = new blankView({el: "#test"});
      view.prependChild(new orangeView());
      view.prependChild(new normalView());
  
      expect($("#test").text()).toEqual("Normal!Orange!");
    });
  });
  
  describe("#prependChildTo", function() {
    it("prepends child into the given element", function() {
      $("#test1").text("Prepend to this!");
  
      var view = new blankView({el: "#test"});
      view.prependChildTo(new orangeView(), "#test1");
  
      expect($("#test").text()).toEqual("");
      expect($("#test1").text()).toEqual("Orange!Prepend to this!");
    });
  });

  describe("#leave", function() {
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

    it("removes children views on leave", function() {
      var view = new blankView();
      view.renderChild(new orangeView({el: "#test1"}));
      view.renderChild(new orangeView({el: "#test2"}));

      view.leave();

      expect($("#test1").size()).toEqual(0);
      expect($("#test2").size()).toEqual(0);
    });

    it("doesn't fail on normal backbone views that may be children", function() {
      var view = new blankView();
      view.renderChild(new orangeView({el: "#test1"}));
      view.renderChild(new normalView({el: "#test2"}));

      view.leave();

      expect($("#test1").size()).toEqual(0);
      expect($("#test2").size()).toEqual(1);
    });

    it("removes self from parent if invoked on a child view", function() {
      var view = new blankView();
      var childView = new orangeView({el: "#test1"});
      view.renderChild(childView)
      view.renderChild(new orangeView({el: "#test2"}));

      expect($("#test1").size()).toEqual(1);
      expect($("#test2").size()).toEqual(1);
      expect(view.children.size()).toEqual(2);

      childView.leave();

      expect($("#test1").size()).toEqual(0);
      expect($("#test2").size()).toEqual(1);
      expect(view.children.size()).toEqual(1);
    });
  });

 describe("#onLeave", function() {
    it("fires callback onLeave before view is removed", function() {
      var view = new orangeView();
      var spy = sinon.spy(view, "onLeave");

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

 describe("#bindTo", function() {
    var view, spy, source, callback;
    beforeEach(function() { Helpers.setup();
      view = new orangeView();
      spy = sinon.spy(view, "bindTo");
      callback = sinon.spy();

      source = new Backbone.Model({
        title: 'Model or Collection'
      });
    });

    afterEach(function() {
      view, spy, source, callback = null;
    });

    it("should add the event to the bindings for the view", function() {
      view.bindTo(source, 'foobar', callback);
      expect(view.bindings.length).toEqual(1);
    });

    it("binds the event to the source object", function() {
      var mock = sinon.mock(source).expects('bind').once();

      view.bindTo(source, 'change:title', callback);

      mock.verify();
    });
  });

  describe("#unbindFromAll", function() {
    var view, spy, mock;
    beforeEach(function() {
      view = new orangeView();
      spy = sinon.spy(view, 'unbindFromAll');
      callback = sinon.spy();
      source = new Backbone.Model({
        title: 'Model or Collection'
      });
      unbindSpy = sinon.spy(source, 'unbind');

      runs(function() {
        view.render();
        view.bindTo(source, 'foo', callback);
        view.bindTo(source, 'bar', callback);
        expect(view.bindings.length).toEqual(2);
      });

      Helpers.sleep();

      runs(function() {
        view.leave();
      });

      Helpers.sleep();
    });

    it("calls the unbindFromAll method when leaving the view", function() {
      runs(function() {
        expect(spy.called).toBeTruthy();
      });
    });

    it("calls unbind on the source object", function() {
      runs(function() {
        expect(unbindSpy.calledTwice).toBeTruthy();
      });
    });

    it("removes all the views bindings attached with bindTo", function() {
      runs(function() {
        expect(view.bindings.length).toEqual(0);
      });
    });
  });

});
