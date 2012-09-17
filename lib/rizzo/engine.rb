module Rizzo
  class Engine < Rails::Engine

    initializer "rizzo.configure_rails_initialization" do |app|

      app.routes.prepend do
        match 'global'           => 'global_resources#index'
        match 'global_head'      => 'global_resources#head'
        match 'global_header'    => 'global_resources#header'
        match 'global_footer'    => 'global_resources#footer'
        match "r/:encrypted_url" => 'redirector#show', :as => :redirector
      end

    end

  end
end
