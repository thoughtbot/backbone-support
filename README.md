# backbone-support

Helper and utility classes that fill out Backbone for serious development.

## dependencies

You'll need these, but chances are you already have them in your app:

* jQuery
* Underscore
* Backbone

## development

First:

    bundle

While TDD'ing:

    bundle exec rake jasmine

To not open tests a browser window:

    bundle exec rake jasmine:ci

## integrating

This hasn't been tried with Sprockets yet, but hopefully it's Rails 3.1 ready.
Meanwhile, for Jammit...

First off:

    rails plugin install git@github.com:thoughtbot/backbone-support.git

In your `config/application.rb`:

``` ruby
config.middleware.use Rack::Static, :urls => ['/vendor/plugins/backbone-support/lib/assets']
```

And in your `config/assets.yml`:

``` yaml
javascripts:
  common:
    - public/javascripts/vendor/underscore.js
    - public/javascripts/vendor/backbone.js
    - vendor/plugins/backbone-support/lib/assets/**/*.js
```

If you have evergreen tests, you will need to change your `require` statements since these files
live in `vendor/`. Change `config/evergreen.rb` to be this:

``` ruby
Evergreen.configure do |config|
  config.public_dir = '.'
end
```

Your individual specs will then need the full root path in `require`. For example:


``` js
requirePublic = function(path) {
  require("/public/javascripts/" + path);
};

requirePublic("vendor/underscore.js");
requirePublic("vendor/backbone.js");

require("/vendor/plugins/backbone-support/lib/assets/backbone-support.js");
require("/vendor/plugins/backbone-support/lib/assets/backbone-support/composite_view.js");
require("/vendor/plugins/backbone-support/lib/assets/backbone-support/swapping_router.js");
```

## license

Copyright 2011 thoughtbot. Please check LICENSE for more details.
