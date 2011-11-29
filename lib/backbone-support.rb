module BackboneSupport
  if defined?(Rails)
    class Engine < ::Rails::Engine
      require 'backbone-support/engine'
    end
  end
end
