Helper and utility classes that fill out Backbone for serious development.

Inspired by our projects and the Backbone.js on Rails book:
http://workshops.thoughtbot.com/backbone-js-on-rails

The book contains complete instructions and in-depth coverage of the internals
of CompositeView and Swappingrouter, and an example application that shows
their usage.

### SwappingRouter

A Router subclass the provides a standard way to swap one view for another.

This introduces a convention that all views have a `leave()` function,
responsible for unbinding and cleaning up the view. And the convention that
all actions underneath the same `Router` share the same root element, and
define it as `el` on the router.

Now, a `SwappingRouter` can take advantage of the `leave()` function, and
clean up any existing views before swapping to a new one.  It swaps into a new
view by rendering that view into its own `el`:

    swap: function(newView) {
      if (this.currentView && this.currentView.leave) {
        this.currentView.leave();
      }

      this.currentView = newView;
      this.currentView.render();
      $(this.el).empty().append(this.currentView.el);
    }

An example SwappingRouter would look as follows:

    Trajectory.Routers.Stories = Support.SwappingRouter.extend({
      initialize: function(options) {
        this.el = $("div.primary_content");
      },
      routes: {
        "stories": "index",
        "stories/new": "newStory"
      }
      index: function(story_id) {
        var view = new Trajectory.Views.StoriesIndex();
        this.swap(view);
      },
      newStory: function() {
        var view = new Trajectory.Views.StoryNew({ model: new Story() });
        this.swap(view);
      }
    }

### CompositeView

CompositeView provides a convention for a parent view that has one or more
child views.

This introduces a convention that all views have a `leave()` function,
responsible for unbinding and cleaning up the view.

`CompositeView` provides methods for adding and removing children from the
parent view.

`CompositeView` maintains an array of its immediate children as
`this.children`.  With this reference in place, a parent view's `leave()`
method can invoke `leave()` on its children, ensuring that an entire tree of
composed views is cleaned up properly.

For child views that can dismiss themselves, such as dialog boxes, children
maintain a back-reference at `this.parent`. This is used to reach up and call
`this.parent.removeChild(this)` for these self-dismissing views.

## Dependencies

You'll need these, but chances are you already have them in your app:

* jQuery or Zepto
* Underscore
* Backbone

## Development

First:

    bundle

While TDD'ing:

    bundle exec rake jasmine

To not open tests a browser window:

    bundle exec rake jasmine:ci

## Installation

The recommended usage is with Rails 3.1.

### With Rails 3.1

Add the gem to your Gemfile

    gem "backbone-support"

And then `bundle install`

In your application.js, or in whatever file your backbone.js assets are
required in, add the following:

    //= require backbone-support

This should be _above_ any usage of SwappingController or SwappingRouter, but
below the inclusion of Backbone.js, Underscore, and jQuery.

If you do not wish to include all of backbone-support, you can include
individual pieces.  First, require the main support file:

    //= require backbone-support/support

Then require the individual assets you wish to use:

    //= require backbone-support/swapping_router
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

## License

Copyright 2011 thoughtbot. Please check LICENSE for more details.
