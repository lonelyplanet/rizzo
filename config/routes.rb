Rizzo::Application.routes.draw do

  get 'head'                         => 'head#index'
  get 'breadcrumb'                   => 'global_resources#breadcrumb'
  get "r/:encrypted_url"             => 'redirector#show', :as => :redirector

  # Core
  get 'client-solutions/global-head'        => 'global_resources#show', :defaults => { :snippet => "head", :cs => "true" }
  get 'client-solutions/global-body-header' => 'global_resources#show', :defaults => { :snippet => "body_header", :cs => "true" }
  get 'client-solutions/global-body-footer' => 'global_resources#show', :defaults => { :snippet => "body_footer", :cs => "true" }

  # Legacy
  get 'global-head'                  => 'global_resources#show', :defaults => { :snippet => "head" }
  get 'global-head-thorntree'        => 'global_resources#show', :defaults => { :snippet => "head", :suppress_tynt => "true" }
  get 'global-body-header'           => 'global_resources#show', :defaults => { :snippet => "body_header", :scope => 'legacy' }
  get 'global-body-footer'           => 'global_resources#show', :defaults => { :snippet => "body_footer" }

  get 'noscript/global-head'         => 'global_resources#show', :defaults => { :snippet => "head", :noscript => "true"}
  get 'noscript/global-body-footer'  => 'global_resources#show', :defaults => { :snippet => "body_footer", :noscript => "true"}

  get 'secure/global-head'           => 'global_resources#show', :defaults => { :snippet => "head", :secure => "true", :suppress_tynt => "true" }
  get 'secure/global-body-header'    => 'global_resources#show', :defaults => { :snippet => "body_header", :secure => "true" }
  get 'secure/global-body-footer'    => 'global_resources#show', :defaults => { :snippet => "body_footer", :secure => "true" }

  get 'secure/noscript/global-head'         => 'global_resources#show', :defaults => { :snippet => "head", :noscript => "true"}
  get 'secure/noscript/global-body-footer'  => 'global_resources#show', :defaults => { :snippet => "body_footer", :noscript => "true"}

  get 'global'                       => 'global_resources#index'
  get 'secure/global'                => 'global_resources#index', :defaults => { :secure => "true" }
  get 'legacy'                       => 'global_resources#legacy'
  get 'responsive'                   => 'global_resources#responsive'
  get 'homepage'                     => 'global_resources#homepage'

  # Styleguide
  get 'styleguide'                   => 'styleguide#index'
  get 'styleguide/buttons'           => 'styleguide#buttons'
  get 'styleguide/navigation'        => 'styleguide#navigation'
  get 'styleguide/colours'           => 'styleguide#colours'
  get 'styleguide/ui-colours'        => 'styleguide#uiColours'

end if defined?(Rizzo::Application)
