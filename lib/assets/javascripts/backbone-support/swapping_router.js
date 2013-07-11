Support.SwappingRouter = function(options) {
  Backbone.Router.apply(this, [options]);
};

_.extend(Support.SwappingRouter.prototype, Backbone.Router.prototype, {
  swap: function(newView) {
    if (this.currentView && this.currentView.leave) {
      this.currentView.leave();
    }

    this.currentView = newView;
    $(this.el).html(this.currentView.render().el);

    if (this.currentView && this.currentView.swapped) {
      this.currentView.swapped();
    }
  }
});

Support.SwappingRouter.extend = Backbone.Router.extend;
