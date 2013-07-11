Support.Observer = function() {};

_.extend(Support.Observer.prototype, {
  bindTo: function(source, event, callback) {
    this.listenTo(source, event, callback);
  },

  unbindFromAll: function() {
    this.stopListening();
  }
});
