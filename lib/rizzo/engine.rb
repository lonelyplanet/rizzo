module Rizzo
  class Engine < Rails::Engine

    initializer "rizzo.configure_rails_initialization" do |app|

      app.config.assets.precompile += ['rizzo.js']

      Sass::Plugin.add_template_location File.join(Gem.loaded_specs['rizzo'].full_gem_path, '/app/assets/stylesheets')

      app.routes.prepend do
        match 'global_head'      => 'global_resources#head'
        match 'global_header'    => 'global_resources#header'
        match 'global_footer'    => 'global_resources#footer'
        match 'breadcrumb'       => 'global_resources#breadcrumb'
        
        match "r/:encrypted_url" => 'redirector#show', :as => :redirector
      end

    end

  end
end
