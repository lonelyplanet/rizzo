Rizzo::Application.routes.draw do

  get 'head'                         => 'head#index'
  get 'breadcrumb'                   => 'global_resources#breadcrumb'
  get "r/:encrypted_url"             => 'redirector#show', :as => :redirector
  get "redirector"                   => 'redirector#internal'

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

  get 'global'                           => 'global_resources#index'
  get 'secure/global'                    => 'global_resources#index', :defaults => { :secure => "true" }
  get 'legacy'                           => 'global_resources#legacy'
  get 'responsive'                       => 'global_resources#responsive'
  get 'homepage'                         => 'global_resources#homepage'

  # Styleguide
  get 'styleguide'                                => 'styleguide#colours'
  get 'styleguide/secondary-nav'                  => 'styleguide#secondaryNavigation'
  get 'styleguide/left-nav'                       => 'styleguide#leftNavigation'
  get 'styleguide/navigational_dropdown'          => 'styleguide#navigational_dropdown'
  get 'styleguide/cards'                          => 'styleguide#cards'
  get 'styleguide/buttons'                        => 'styleguide#buttons'
  get 'styleguide/badges'                         => 'styleguide#badges'
  get 'styleguide/page-title'                     => 'styleguide#pageTitle'
  get 'styleguide/typography'                     => 'styleguide#typography'
  get 'styleguide/colours'                        => 'styleguide#colours'
  get 'styleguide/ui-colours'                     => 'styleguide#uiColours'
  get 'styleguide/active-icons'                   => 'styleguide#activeIcons'
  get 'styleguide/pagination'                     => 'styleguide#pagination'
  get 'styleguide/proportional-grid'              => 'styleguide#proportionalGrid'
  get 'styleguide/cards-grid'                     => 'styleguide#cardsGrid'
  get 'styleguide/forms'                          => 'styleguide#forms'
  get 'styleguide/activity_list'                  => 'styleguide#activity_list'
  get 'styleguide/js-components'                  => 'styleguide#toggle_active'
  get 'styleguide/js-components/toggle-active'    => 'styleguide#toggle_active'
  get 'styleguide/js-components/proximity-loader' => 'styleguide#proximity_loader'
  get 'styleguide/js-components/asset-reveal'     => 'styleguide#asset_reveal'
  get 'styleguide/js-components/image-helper'     => 'styleguide#image_helper'
  get 'styleguide/alerts'                         => 'styleguide#alerts'
  get 'styleguide/tiles'                          => 'styleguide#tiles'

  #===== yeoman hook =====#
  # NB! The above line is required for our yeoman generator and should not be changed.

end if defined?(Rizzo::Application)
