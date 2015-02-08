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
      view = new normalView();
      spy = sinon.spy(view, 'unbindFromAll');
      callback = sinon.spy();
      source = new Backbone.Model({
        title: 'Model or Collection'
      });
      unbindSpy = sinon.spy(source, 'unbind');

      view.render();
      view.bindTo(source, 'foo', callback);
      view.bindTo(source, 'bar', callback);
      expect(view.bindings.length).toEqual(2);

      view.leave();
    });

    it("calls the unbindFromAll method when leaving the view", function() {
      expect(spy.called).toBeTruthy();
    });

    it("calls unbind on the source object", function() {
      expect(unbindSpy.calledTwice).toBeTruthy();
    });

    it("removes all the views bindings attached with bindTo", function() {
      expect(view.bindings.length).toEqual(0);
    });
  });

});
