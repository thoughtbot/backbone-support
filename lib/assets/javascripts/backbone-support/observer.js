Support.Observer = function() {};

_.extend(Support.Observer.prototype, {
  bindTo: function(source, event, callback) {
    console.warn('Using #bindTo has been deprecated. Use #listenTo instead.');
    this.listenTo(source, event, callback);
  },

  unbindFromAll: function() {
    console.warn('Using #unbindFromAll has been deprecated. Use #stopListening instead.');
    this.stopListening();
  }
});
