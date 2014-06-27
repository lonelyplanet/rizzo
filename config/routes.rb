Rizzo::Application.routes.draw do

  get 'head'                         => 'head#index'
  get 'breadcrumb'                   => 'global_resources#breadcrumb'
  get "r/:encrypted_url"             => 'redirector#show', :as => :redirector
  get "redirector"                   => 'redirector#internal'

  # Core
  get 'client-solutions/global-head'        => 'global_resources#show', :defaults => { :snippet => "head", :cs => "true" }
  get 'client-solutions/global-body-header' => 'global_resources#show', :defaults => { :snippet => "body_header", :cs => "true" }
  get 'client-solutions/global-body-footer' => 'global_resources#show', :defaults => { :snippet => "body_footer", :cs => "true" }

  # Core for exposing modern layout as a service
  get 'modern/head'        => 'global_resources#show', :defaults => { :snippet => "head" }
  get 'modern/body-header' => 'global_resources#show', :defaults => { :snippet => "body_header" }
  get 'modern/body-footer' => 'global_resources#show', :defaults => { :snippet => "body_footer" }

  # Configurated routes :)
  get 'custom/:route/:snippet'   => 'layout#snippet'
  get 'custom/:route'            => 'layout#preview'

  # Legacy
  get 'global-head'                  => 'global_resources#show', :defaults => { :snippet => "head", :legacystyle => "true" }
  get 'global-head-thorntree'        => 'global_resources#show', :defaults => { :snippet => "head", :legacystyle => "true", :suppress_tynt => "true" }
  get 'global-body-header'           => 'global_resources#show', :defaults => { :snippet => "body_header", :legacystyle => "true" }
  get 'global-body-footer'           => 'global_resources#show', :defaults => { :snippet => "body_footer", :legacystyle => "true" }

  get 'noscript/global-head'         => 'global_resources#show', :defaults => { :snippet => "head", :noscript => "true"}
  get 'noscript/global-body-header'  => 'global_resources#show', :defaults => { :snippet => "body_header", :noscript => "true" }
  get 'noscript/global-body-footer'  => 'global_resources#show', :defaults => { :snippet => "body_footer", :noscript => "true"}

  get 'secure/global-head'           => 'global_resources#show', :defaults => { :snippet => "head", :secure => "true", :suppress_tynt => "true" }
  get 'secure/global-body-header'    => 'global_resources#show', :defaults => { :snippet => "body_header", :secure => "true" }
  get 'secure/global-body-footer'    => 'global_resources#show', :defaults => { :snippet => "body_footer", :secure => "true" }

  get 'secure/noscript/global-head'         => 'global_resources#show', :defaults => { :snippet => "head", :noscript => "true"}
  get 'secure/noscript/global-body-header'  => 'global_resources#show', :defaults => { :snippet => "body_header", :noscript => "true" }
  get 'secure/noscript/global-body-footer'  => 'global_resources#show', :defaults => { :snippet => "body_footer", :noscript => "true"}

  get 'global'                           => 'global_resources#index'
  get 'secure/global'                    => 'global_resources#index', :defaults => { :secure => "true" }
  get 'legacy'                           => 'global_resources#legacy'
  get 'modern'                           => 'global_resources#modern'
  get 'responsive'                       => 'global_resources#responsive'
  get 'minimal'                          => 'global_resources#minimal'

  # Styleguide
  root                              to: redirect('/styleguide/design-elements/colours')
  get 'styleguide/',                to: redirect('/styleguide/design-elements/colours')
  get 'styleguide/design-elements', to: redirect('/styleguide/design-elements/colours')
  get 'styleguide/ui-components',   to: redirect('/styleguide/ui-components/cards')
  get 'styleguide/js-components',   to: redirect('/styleguide/js-components/asset-reveal')
  get 'styleguide/css-utilities/',  to: redirect('/styleguide/css-utilities/proportional-grid')
  get 'styleguide/page-layout/',    to: redirect('/styleguide/page-layout/using-rizzo-layouts')

  get 'styleguide/*section' => 'styleguide#show'

  get 'performance/',                         to: redirect('/performance/css-analysis')

  get '/performance/css-analysis'             => 'performance#css_index'
  get '/performance/css-analysis/:stylesheet' => 'performance#css_show'

end if defined?(Rizzo::Application)
