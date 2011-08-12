var Helpers = {
  sleep: function() {
    waits(10);
  },

  setup: function() {
    this.teardown();
    $("body").append("<div id='test'></div>");
  },

  teardown: function() {
    window.location.hash = "#"
    $("#test").remove();
  }
};
