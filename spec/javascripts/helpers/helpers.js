var Helpers = {
  setup: function() {
    this.teardown();
    this.append("test");
  },

  teardown: function() {
    window.location.hash = "#"
    $(".test").remove();
  },

  append: function(id) {
    $("body").append("<div class='test' id='" + id + "'></div>");
  }
};
