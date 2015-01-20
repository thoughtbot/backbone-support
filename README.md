# Backbone Support [![Build Status](https://travis-ci.org/thoughtbot/backbone-support.png?branch=master)](https://travis-ci.org/thoughtbot/backbone-support) [![Gem Version](https://badge.fury.io/rb/backbone-support.png)](https://rubygems.org/gems/backbone-support)

## Summary

Backbone Support provides a collection of utility classes for use with
[Backbone.js][]. There's no built-in garbage collection for Backbone’s event
bindings, and forgetting to unbind can cause bugs and memory leaks. Backbone
Support has you covered.

Backbone Support provides two utility classes, SwappingRouter and
CompositeView, which are extensions of Backbone's standard View and Router
objects. They provide methods that simplify creating and managing nested views
and automate the cleanup of events when switching between views.

Inspired by our projects and the [Backbone.js on Rails book][].

The book contains complete instructions and in-depth coverage of the internals
of CompositeView and SwappingRouter, and an example application that shows
their usage.

### SwappingRouter

A Router subclass the provides a standard way to swap one view for another.

This introduces a convention that all views have a `leave()` function,
responsible for unbinding and cleaning up the view. And the convention that
all actions underneath the same `Router` share the same root element, and
define it as `el` on the router. Additionally, the render method for every
view must return that view (a fairly standard backbone convention).

Now, a `SwappingRouter` can take advantage of the `leave()` function, and
clean up any existing views before swapping to a new one.  It swaps into a new
view by rendering that view into its own `el`:

``` js
swap: function(newView) {
  if (this.currentView && this.currentView.leave) {
    this.currentView.leave();
  }

  this.currentView = newView;
  $(this.el).empty().append(this.currentView.render().el);
}
```

An example SwappingRouter would look as follows:

``` js
Trajectory.Routers.Stories = Support.SwappingRouter.extend({
  initialize: function(options) {
    this.el = $("div.primary_content");
  },
  routes: {
    "stories": "index",
    "stories/new": "newStory"
  }
  index: function() {
    var view = new Trajectory.Views.StoriesIndex();
    this.swap(view);
  },
  newStory: function() {
    var view = new Trajectory.Views.StoryNew({ model: new Story() });
    this.swap(view);
  }
}
```

### CompositeView

CompositeView provides a convention for a parent view that has one or more
child views.

This introduces a convention that all views have a `leave()` function,
responsible for unbinding and cleaning up the view.

`CompositeView` provides methods for adding and removing children from the
parent view.

`CompositeView` maintains an array of its immediate children as
`this.children`. Using this reference, a parent view's `leave()`
method will invoke `leave()` on all its children, ensuring that an entire
tree of composed views is cleaned up properly.

For child views that can dismiss themselves, such as dialog boxes, children
maintain a back-reference at `this.parent`. This is used to reach up and call
`this.parent.removeChild(this)` for these self-dismissing views.

## Compatibility

Backbone Support is compatible with Backbone v0.5.3 and higher, including
Backbone v1.0 (as of Backbone Support v0.4.0).

## Dependencies

Backbone Support requires the following libraries:

* jQuery or Zepto
* Underscore
* Backbone

### Included Versions

For convenience, Backbone Support comes with a vendored copy of Backbone and
Underscore to get you up and running as quickly as possible. If you want to
use these included files, simply follow the instructions below in the
[Installation][] section. The current vendored versions are:

- Backbone v1.0.0
- Underscore v1.4.4

### Alternate Versions

If you require a different version of Backbone or Underscore than those
provided by this gem, simply put the script files in
`vendor/assets/javascripts` which has higher precedence than the versions
provided by the gem thanks to the ordering of the [search paths in the asset
pipeline][].

## Installation

We recommend you use Backbone-Support with Rails 3.1 or higher in order to take
advantage of the asset pipeline.

### With Rails 3.1 or higher

Add the gem to your Gemfile:

``` ruby
gem "backbone-support"
```

And then `bundle install`.

Before including any part of Backbone Support, you must include its
dependencies. In your application.js (or any other manifest file), add the
following to load in the needed dependencies:

    // jQuery is provided by the 'jquery-rails' gem, included with Rails
    //= require jquery
    //
    // Backbone Support includes Backbone and Underscore, or you can provides
    // alternate versions by placing them in vendor/assets/javascripts/
    //= require backbone
    //= require underscore

To require all of Backbone Support, add the following:

    //= require backbone-support

This should be _above_ any usage of SwappingController or SwappingRouter, but
below the inclusion of Backbone.js, Underscore, and jQuery.

If you do not wish to include all of backbone-support, you can include
individual pieces.  Require the support file and the individual assets you
wish to use:

    //= require backbone-support/support
    //= require backbone-support/swapping_router

or:

    //= require backbone-support/support
    //= require backbone-support/observer
    //= require backbone-support/composite_view

### With Jammit

First off:
    rails plugin install git@github.com:thoughtbot/backbone-support.git

In your `config/application.rb`:

``` ruby
config.middleware.use Rack::Static,
                      :urls => ['/vendor/plugins/backbone-support/lib/assets/javascripts']
```

And in your `config/assets.yml`:

``` yaml
javascripts:
  common:
    - public/javascripts/vendor/underscore.js
    - public/javascripts/vendor/backbone.js
    - vendor/plugins/backbone-support/lib/assets/**/*.js
```

If you have evergreen tests, you will need to change your `require` statements
since these files live in `vendor/`. Change `config/evergreen.rb` to be this:

``` ruby
Evergreen.configure do |config|
  config.public_dir = '.'
end
```

Your individual specs will then need the full root path in `require`. For
example:

``` js
requirePublic = function(path) {
  require("/public/javascripts/" + path);
};

requirePublic("vendor/underscore.js");
requirePublic("vendor/backbone.js");

require("/vendor/plugins/backbone-support/lib/assets/javascripts/backbone-support.js");
require("/vendor/plugins/backbone-support/lib/assets/javascripts/backbone-support/composite_view.js");
require("/vendor/plugins/backbone-support/lib/assets/javascripts/backbone-support/swapping_router.js");
```

## Development

First:

    bundle

While TDD'ing:

    bundle exec rake jasmine

To not open tests in a browser window:

    bundle exec rake jasmine:ci

## License

Copyright 2012 thoughtbot. Please check [LICENSE][] for more details.

[Installation]: https://github.com/thoughtbot/backbone-support#installation
[search paths in the asset pipeline]: http://edgeguides.rubyonrails.org/asset_pipeline.html#search-paths
[Backbone.js on Rails book]: https://learn.thoughtbot.com/products/1-backbone-js-on-rails
[Backbone.js]: http://backbonejs.org/
[LICENSE]: https://github.com/thoughtbot/backbone-support/blob/master/LICENSE
