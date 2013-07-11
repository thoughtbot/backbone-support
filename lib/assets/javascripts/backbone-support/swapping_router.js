Support.SwappingRouter = Backbone.Router.extend({
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
