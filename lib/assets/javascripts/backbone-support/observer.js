Support.Observer = function() {};

_.extend(Support.Observer.prototype, {
  bindTo: function(source, event, callback) {
    source.bind(event, callback, this);
    this.bindings = this.bindings || [];
    this.bindings.push({ source: source, event: event, callback: callback });
  },

  unbindFromAll: function() {
    _.each(this.bindings, function(binding) {
      binding.source.unbind(binding.event, binding.callback);
    });
    this.bindings = []
  }
});
