Backbone.View.prototype.leave = function() {
  if (this.onLeave) {
    this.onLeave();
  }
};
