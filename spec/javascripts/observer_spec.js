describe('Support.Observer', function() {

  var normalView = Support.CompositeView.extend({
    render: function() {
      var text = $("<span>").html("Normal!");
      $(this.el).append(text);
    },
    leave: function() {
      this.unbindFromAll();
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

  describe("#bindTo", function() {
    var view, spy, source, callback;
    beforeEach(function() { Helpers.setup();
      view = new normalView();
      spy = sinon.spy(view, "listenTo");
      callback = sinon.spy();

      source = new Backbone.Model({
        title: 'Model or Collection'
      });
    });

    afterEach(function() {
      view, spy, source, callback = null;
    });

    it("calls listenTo on this", function() {
      view.bindTo(source, 'change:title', callback);
      expect(spy.called).toBeTruthy();
    });
  });

  describe("#unbindFromAll", function() {
    var view, spy, mock;

    beforeEach(function() {
      view = new normalView();
      spy = sinon.spy(view, 'unbindFromAll');
      stopListeningSpy = sinon.spy(view, 'stopListening');
      callback = sinon.spy();
      source = new Backbone.Model({
        title: 'Model or Collection'
      });

      view.render();
      view.bindTo(source, 'foo', callback);
      view.bindTo(source, 'bar', callback);

      view.leave();
    });

    it("calls the unbindFromAll method when leaving the view", function() {
      expect(spy.called).toBeTruthy();
    });

    it("calls stopListening on this", function() {
      expect(stopListeningSpy.called).toBeTruthy();
    });
  });

});
