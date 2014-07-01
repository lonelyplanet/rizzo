Rizzo::Application.routes.draw do

  get 'breadcrumb'                   => 'global_resources#breadcrumb'
  get "r/:encrypted_url"             => 'redirector#show', :as => :redirector
  get "redirector"                   => 'redirector#internal'

  # Custom layouts
  get 'layouts/:route/:snippet'   => 'layout#snippet'
  get 'layouts/:route'            => 'layout#preview'

  # Styleguide
  root                              to: redirect('/styleguide/design-elements/colours')
  get 'styleguide/',                to: redirect('/styleguide/design-elements/colours')
  get 'styleguide/design-elements', to: redirect('/styleguide/design-elements/colours')
  get 'styleguide/ui-components',   to: redirect('/styleguide/ui-components/cards')
  get 'styleguide/js-components',   to: redirect('/styleguide/js-components/asset-reveal')
  get 'styleguide/css-utilities/',  to: redirect('/styleguide/css-utilities/proportional-grid')
  get 'styleguide/page-layout/',    to: redirect('/styleguide/page-layout/using-rizzo-layouts')
  get 'styleguide/widgets/',        to: redirect('/styleguide/widgets/flickr')

  get 'styleguide/*section' => 'styleguide#show'

  get 'performance/',                         to: redirect('/performance/css-analysis')
  get '/performance/css-analysis'             => 'performance#css_index'
  get '/performance/css-analysis/:stylesheet' => 'performance#css_show'

  get '/performance/js-analysis'             => 'performance#js_index'
  get '/performance/js-analysis/:javascript' => 'performance#js_show'

  # This should all be removed over time

  # Core
  get 'client-solutions/global-head'        => 'global_resources#show', :defaults => { :snippet => "head", :cs => "true", :show_js => false }
  get 'client-solutions/global-body-header' => 'global_resources#show', :defaults => { :snippet => "body_header", :cs => "true", :show_js => false }
  get 'client-solutions/global-body-footer' => 'global_resources#show', :defaults => { :snippet => "body_footer", :cs => "true", :show_js => false }

  # Core for exposing modern layout as a service
  get 'modern/head'        => 'global_resources#show', :defaults => { :snippet => "head", :show_js => true }
  get 'modern/body-header' => 'global_resources#show', :defaults => { :snippet => "body_header", :show_js => true }
  get 'modern/body-footer' => 'global_resources#show', :defaults => { :snippet => "body_footer", :show_js => true }

  # Legacy
  get 'global-head'                  => 'global_resources#show', :defaults => { :snippet => "head", :legacystyle => "true", :show_js => true }
  get 'global-body-header'           => 'global_resources#show', :defaults => { :snippet => "body_header", :legacystyle => "true", :show_js => true }
  get 'global-body-footer'           => 'global_resources#show', :defaults => { :snippet => "body_footer", :legacystyle => "true", :show_js => true }

  get 'noscript/global-head'         => 'global_resources#show', :defaults => { :snippet => "head", :show_js => false, :noscript => "true" }
  get 'noscript/global-body-header'  => 'global_resources#show', :defaults => { :snippet => "body_header", :show_js => false, :noscript => "true" }
  get 'noscript/global-body-footer'  => 'global_resources#show', :defaults => { :snippet => "body_footer", :show_js => false, :noscript => "true" }

  get 'secure/global-head'           => 'global_resources#show', :defaults => { :snippet => "head", :secure => "true", :tynt => "true", :show_js => true }
  get 'secure/global-body-header'    => 'global_resources#show', :defaults => { :snippet => "body_header", :secure => "true", :show_js => true }
  get 'secure/global-body-footer'    => 'global_resources#show', :defaults => { :snippet => "body_footer", :secure => "true", :show_js => true }

  get 'secure/noscript/global-head'         => 'global_resources#show', :defaults => { :snippet => "head", :show_js => false}
  get 'secure/noscript/global-body-header'  => 'global_resources#show', :defaults => { :snippet => "body_header", :show_js => false }
  get 'secure/noscript/global-body-footer'  => 'global_resources#show', :defaults => { :snippet => "body_footer", :show_js => false}

  get 'global'                           => 'global_resources#index'
  get 'secure/global'                    => 'global_resources#index', :defaults => { :secure => "true" }
  get 'legacy'                           => 'global_resources#legacy'
  get 'modern'                           => 'global_resources#modern'
  get 'responsive'                       => 'global_resources#responsive'
  get 'minimal'                          => 'global_resources#minimal'

end if defined?(Rizzo::Application)
