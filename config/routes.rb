Rizzo::Application.routes.draw do

  get "r/:encrypted_url"             => 'redirector#show', :as => :redirector
  get "redirector"                   => 'redirector#internal'

  # Custom layouts
  get 'layouts/:route/:snippet'   => 'layout#snippet'
  get 'layouts/:route'            => 'layout#preview'
  get 'layouts',                  to: redirect('/styleguide/page-layout/core-layouts')

  # Styleguide
  root                              to: redirect('/styleguide/design-elements/colours')
  get 'styleguide/design-elements', to: redirect('/styleguide/design-elements/colours')
  get 'styleguide/ui-components',   to: redirect('/styleguide/ui-components/cards')
  get 'styleguide/js-components',   to: redirect('/styleguide/js-components/asset-reveal')
  get 'styleguide/css-utilities/',  to: redirect('/styleguide/css-utilities/proportional-grid')
  get 'styleguide/page-layout/',    to: redirect('/styleguide/page-layout/core-layouts')
  get 'styleguide/widgets/',        to: redirect('/styleguide/widgets/flickr')

  get 'styleguide/*section' => 'styleguide#show', defaults: { route: "styleguide" }

  get 'performance/css-analysis'             => 'performance#css_index', defaults: { route: "styleguide" }
  get 'performance/css-analysis/:stylesheet' => 'performance#css_show', defaults: { route: "styleguide" }

  get 'performance/js-analysis'             => 'performance#js_index', defaults: { route: "styleguide" }
  get 'performance/js-analysis/:javascript' => 'performance#js_show', defaults: { route: "styleguide" }

  get 'documentation/*section' => 'documentation#show', defaults: { route: "styleguide" }


  # This should all be removed over time

  # Core
  get 'client-solutions/global-head'        => 'layout#snippet', defaults: { snippet: "head", route: "client_solutions" }
  get 'client-solutions/global-body-header' => 'layout#snippet', defaults: { snippet: "header", route: "client_solutions" }
  get 'client-solutions/global-body-footer' => 'layout#snippet', defaults: { snippet: "footer", route: "client_solutions" }

  # Core for exposing modern layout as a service
  get 'modern/head'        => 'layout#snippet', defaults: { snippet: "head", route: "modern",  }
  get 'modern/body-header' => 'layout#snippet', defaults: { snippet: "header", route: "modern" }
  get 'modern/body-footer' => 'layout#snippet', defaults: { snippet: "footer", route: "modern" }

  # Legacy
  get 'global-head'                  => 'layout#snippet', defaults: { snippet: "head", route: "legacy" }
  get 'global-body-header'           => 'layout#snippet', defaults: { snippet: "header", route: "legacy" }
  get 'global-body-footer'           => 'layout#snippet', defaults: { snippet: "footer", route: "legacy" }

  get 'noscript/global-head'         => 'layout#snippet', defaults: { snippet: "head", route: "noscript" }
  get 'noscript/global-body-header'  => 'layout#snippet', defaults: { snippet: "header", route: "noscript" }
  get 'noscript/global-body-footer'  => 'layout#snippet', defaults: { snippet: "footer", route: "noscript" }

  get 'secure/global-head'           => 'layout#snippet', defaults: { snippet: "head", route: "secure",  }
  get 'secure/global-body-header'    => 'layout#snippet', defaults: { snippet: "header", route: "secure" }
  get 'secure/global-body-footer'    => 'layout#snippet', defaults: { snippet: "footer", route: "secure" }

end if defined?(Rizzo::Application)
