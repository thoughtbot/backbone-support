# -*- encoding: utf-8 -*-
$:.push File.expand_path("../lib", __FILE__)
require "backbone-support/version"

Gem::Specification.new do |s|
  s.name        = 'backbone-support'
  s.version     = BackboneSupport::VERSION.dup
  s.authors     = ['Chad Pytel', 'Joe Ferris', 'Jason Morrison', 'Nick Quaranto']
  s.email       = ['support@thoughtbot.com']
  s.homepage    = 'http://github.com/thoughtbot/backbone-support'
  s.summary     = 'SwappingController and CompositeView for Backbone.js'
  s.description = 'SwappingController and CompositeView for Backbone.js'

  s.files         = `git ls-files`.split("\n")
  s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.executables   = `git ls-files -- bin/*`.split("\n").map{ |f| File.basename(f) }
  s.require_paths = ["lib"]

  s.add_development_dependency('jasmine', '~> 2.0')
  s.add_development_dependency('rake')
  s.add_development_dependency('headless')
end
