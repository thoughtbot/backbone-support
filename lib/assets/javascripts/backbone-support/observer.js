(function() {

  Support.Observer = function() {};

  // `console` is not defined when the Developer Tools are not open in older
  // versions of Internet Explorer
  function deprecate(message) {
    /* global console */
    if ( console && console.warn ) {
      console.warn(message);
    }
  }

  _.extend(Support.Observer.prototype, {
    bindTo: function(source, event, callback) {
      deprecate("Using #bindTo has been deprecated. Use #listenTo instead.");
      this.listenTo(source, event, callback);
    },

    unbindFromAll: function() {
      deprecate(
        "Using #unbindFromAll has been deprecated. Use #stopListening instead."
      );

      this.stopListening();
    }
  });
})();
