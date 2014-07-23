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

  get 'styleguide/*section' => 'styleguide#show', defaults: { route: "styleguide" }

  get 'performance/',                         to: redirect('/performance/css-analysis')
  get '/performance/css-analysis'             => 'performance#css_index', defaults: { route: "styleguide" }
  get '/performance/css-analysis/:stylesheet' => 'performance#css_show', defaults: { route: "styleguide" }

  get '/performance/js-analysis'             => 'performance#js_index', defaults: { route: "styleguide" }
  get '/performance/js-analysis/:javascript' => 'performance#js_show', defaults: { route: "styleguide" }

  # This should all be removed over time

  # Core
  get 'client-solutions/global-head'        => 'global_resources#show', defaults: { snippet: "head", route: "client_solutions" }
  get 'client-solutions/global-body-header' => 'global_resources#show', defaults: { snippet: "header", route: "client_solutions" }
  get 'client-solutions/global-body-footer' => 'global_resources#show', defaults: { snippet: "footer", route: "client_solutions" }

  # Core for exposing modern layout as a service
  get 'modern/head'        => 'global_resources#show', defaults: { snippet: "head", route: "modern",  }
  get 'modern/body-header' => 'global_resources#show', defaults: { snippet: "header", route: "modern" }
  get 'modern/body-footer' => 'global_resources#show', defaults: { snippet: "footer", route: "modern" }

  # Legacy
  get 'global-head'                  => 'global_resources#show', defaults: { snippet: "head", route: "legacy" }
  get 'global-body-header'           => 'global_resources#show', defaults: { snippet: "header", route: "legacy" }
  get 'global-body-footer'           => 'global_resources#show', defaults: { snippet: "footer", route: "legacy" }

  get 'noscript/global-head'         => 'global_resources#show', defaults: { snippet: "head", route: "noscript" }
  get 'noscript/global-body-header'  => 'global_resources#show', defaults: { snippet: "header", route: "noscript" }
  get 'noscript/global-body-footer'  => 'global_resources#show', defaults: { snippet: "footer", route: "noscript" }

  get 'secure/global-head'           => 'global_resources#show', defaults: { snippet: "head", route: "secure",  }
  get 'secure/global-body-header'    => 'global_resources#show', defaults: { snippet: "header", route: "secure" }
  get 'secure/global-body-footer'    => 'global_resources#show', defaults: { snippet: "footer", route: "secure" }

  get 'secure/noscript/global-head'         => 'global_resources#show', defaults: { snippet: "head", route: "secure_noscript" }
  get 'secure/noscript/global-body-header'  => 'global_resources#show', defaults: { snippet: "header", route: "secure_noscript" }
  get 'secure/noscript/global-body-footer'  => 'global_resources#show', defaults: { snippet: "footer", route: "secure_noscript" }

end if defined?(Rizzo::Application)
