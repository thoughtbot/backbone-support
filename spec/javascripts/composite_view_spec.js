describe("Support.CompositeView", function() {
  var orangeView = Support.CompositeView.extend({
    render: function() {
      var text = $("<span>").html("Orange!");
      $(this.el).append(text);
    }
  });

  var blankView = Support.CompositeView.extend({
    render: function() {
    }
  });

  var normalView = Backbone.View.extend({
    render: function() {
      var text = $("<span>").html("Normal!");
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
      $("#test").append($("#test1"));

      var view = new blankView({el: "#test"});
      view.renderChildInto(new orangeView(), "#test1");

      expect($("#test1").text()).toEqual("Orange!");

      $("#test1").remove();
      expect($("#test").text()).toEqual("");
    });

    it("renders child into a sub-element of the view, even if it is not yet added to the document", function() {
      var view = new blankView({el: $('<div><div class="inside"></div></div>')});
      view.renderChildInto(new orangeView(), ".inside");

     expect($(view.el).find('.inside').text()).toEqual("Orange!"); 
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
      $("#test").append($("#test1"));

      var view = new blankView({el: "#test"});
      view.appendChildTo(new orangeView(), "#test1");

      expect($("#test1").text()).toEqual("Append to this!Orange!");
      
      $("#test1").remove();
      expect($("#test").text()).toEqual("");
    });

    it("appends child into a sub-element even if it is not added to the document", function() {
      var view = new blankView({el: $('<div><div class="inside">Append to this!</div></div>')});
      view.appendChildTo(new orangeView(), ".inside");

      expect($(view.el).find('.inside').text()).toEqual("Append to this!Orange!"); 
    });

    it("appends the element only to elements inside the view", function(){
      var view = new blankView({el: $('<div><div class="main">Append to this!</div></div>')});
      var div = $("<div class='main' id='outside'></div>");
      view.appendChildTo(new orangeView(), ".main");

      expect($(view.el).find('.main').text()).toEqual("Append to this!Orange!");
      expect($("#outside").text()).toEqual("");
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
      expect($("#test").text()).toEqual("");

      $("#test").append($("#test1"));
      view.prependChildTo(new orangeView(), "#test1");
  
      expect($("#test1").text()).toEqual("Orange!Prepend to this!");
    });

    it("prepends child into a sub-element even if it is not added to the document", function() {
      var view = new blankView({el: $('<div><div class="inside">Prepend to this!</div></div>')});
      view.prependChildTo(new orangeView(), ".inside");

      expect($(view.el).find('.inside').text()).toEqual("Orange!Prepend to this!");
    });
    
    it("prepends the element only to elements inside the view", function(){
      var view = new blankView({el: $('<div><div class="main">Prepend to this!</div></div>')});
      var div = $("<div class='main' id='outside'></div>");
      view.prependChildTo(new orangeView(), ".main");

      expect($(view.el).find('.main').text()).toEqual("Orange!Prepend to this!");
      expect($("#outside").text()).toEqual("");
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

    it("removes any bindings that were bound via bindTo", function() {
      var model1 = new Backbone.Model({}),
          model2 = new Backbone.Model({}),
          eventListener = sinon.spy(),
          bindToView = new (Support.CompositeView.extend({
            initialize: function(options) {
              this.bindTo(options.model1, 'change', eventListener);
              this.bindTo(options.model2, 'change', eventListener);
            }
          }))({
            model1: model1,
            model2: model2
          });

      bindToView.leave();
      model1.trigger('change');
      model2.trigger('change');

      expect(eventListener.called).toBeFalsy();
    });

    it("fires leave event", function() {
      var eventListener = sinon.spy();
      var view = new (Support.CompositeView.extend({
        initialize: function(options) {
          this.bindTo(this, 'leave', eventListener);
        }
      }))({model: {}});

      view.leave();

      expect(eventListener.called).toBeTruthy();
    });
  });

  describe("#swapped", function() {
    it("fires 'swapped' event", function() {
      var eventListener = sinon.spy()
      var view = new Support.CompositeView
      view.bind('swapped', eventListener)

      view.swapped();

      expect(eventListener.called).toBeTruthy();
    });
  });

  describe("#bindTo", function() {
    var view = new orangeView();
    var callback = sinon.spy();
    var source = new Backbone.Model({
        title: 'Model or Collection'
    });

    it("calls the unbindFromAll method when leaving the view", function() {
      view.bindTo(source, 'foobar', callback);
      expect(view.bindings.length).toEqual(1);
    });
  });

  describe("#unbindFromAll", function() {
    var view = new orangeView();
    var spy = sinon.spy(view, 'unbindFromAll');
    var callback = sinon.spy();
    var source = new Backbone.Model({
        title: 'Model or Collection'
    });

    runs(function() {
      view.render();
      view.bindTo(source, 'foo', callback);
      expect(view.bindings.length).toEqual(1);
    });

    Helpers.sleep();

    runs(function() {
      view.leave();
    });

    Helpers.sleep();

    it("calls the unbindFromAll method when leaving the view", function() {
      runs(function() {
        expect(spy.called).toBeTruthy();
      });
    });
  });
});
