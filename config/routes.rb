Rizzo::Application.routes.draw do

  root to: redirect('/styleguide/ui-components/colours')

  get 'head'                         => 'head#index'
  get 'breadcrumb'                   => 'global_resources#breadcrumb'
  get "r/:encrypted_url"             => 'redirector#show', :as => :redirector
  get "redirector"                   => 'redirector#internal'

  # Core
  get 'client-solutions/global-head'        => 'global_resources#show', :defaults => { :snippet => "head", :cs => "true" }
  get 'client-solutions/global-body-header' => 'global_resources#show', :defaults => { :snippet => "body_header", :cs => "true" }
  get 'client-solutions/global-body-footer' => 'global_resources#show', :defaults => { :snippet => "body_footer", :cs => "true" }

  # Core for exposing modern layout
  get 'modern/global-head'        => 'global_resources#show', :defaults => { :snippet => "head" }
  get 'modern/global-body-header' => 'global_resources#show', :defaults => { :snippet => "body_header" }
  get 'modern/global-body-footer' => 'global_resources#show', :defaults => { :snippet => "body_footer" }

  # Legacy
  get 'global-head'                  => 'global_resources#show', :defaults => { :snippet => "head", :legacystyle => "true" }
  get 'global-head-thorntree'        => 'global_resources#show', :defaults => { :snippet => "head", :legacystyle => "true", :suppress_tynt => "true" }
  get 'global-body-header'           => 'global_resources#show', :defaults => { :snippet => "body_header", :legacystyle => "true" }
  get 'global-body-footer'           => 'global_resources#show', :defaults => { :snippet => "body_footer", :legacystyle => "true" }

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
  get 'styleguide/',               to: redirect('/styleguide/ui-components/colours')
  get 'styleguide/ui-components',  to: redirect('/styleguide/ui-components/colours')
  get 'styleguide/js-components',  to: redirect('/styleguide/js-components/toggle-active')
  get 'styleguide/css-utilities/', to: redirect('/styleguide/css-utilities/utility-classes')

  get 'styleguide/ui-components/colours'                  => 'styleguide#colours'
  get 'styleguide/ui-components/secondary-nav'            => 'styleguide#secondaryNavigation'
  get 'styleguide/ui-components/left-nav'                 => 'styleguide#leftNavigation'
  get 'styleguide/ui-components/navigational_dropdown'    => 'styleguide#navigational_dropdown'
  get 'styleguide/ui-components/cards'                    => 'styleguide#cards'
  get 'styleguide/ui-components/buttons'                  => 'styleguide#buttons'
  get 'styleguide/ui-components/badges'                   => 'styleguide#badges'
  get 'styleguide/ui-components/page-title'               => 'styleguide#pageTitle'
  get 'styleguide/ui-components/typography'               => 'styleguide#typography'
  get 'styleguide/ui-components/ui-colours'               => 'styleguide#uiColours'
  get 'styleguide/ui-components/icons'                    => 'styleguide#icons'
  get 'styleguide/ui-components/pagination'               => 'styleguide#pagination'
  get 'styleguide/ui-components/proportional-grid'        => 'styleguide#proportionalGrid'
  get 'styleguide/ui-components/cards-grid'               => 'styleguide#cardsGrid'
  get 'styleguide/ui-components/activity_list'            => 'styleguide#activity_list'
  get 'styleguide/ui-components/tags'                     => 'styleguide#tags'
  get 'styleguide/ui-components/inputs'                   => 'styleguide#inputs'
  get 'styleguide/ui-components/dropdown'                 => 'styleguide#dropdown'
  get 'styleguide/ui-components/range-slider'             => 'styleguide#rangeSlider'
  get 'styleguide/ui-components/alerts'                   => 'styleguide#alerts'
  get 'styleguide/ui-components/tooltips'                 => 'styleguide#tooltips'
  get 'styleguide/ui-components/ad-units'                 => 'styleguide#adUnits'

  get 'styleguide/js-components/toggle-active'            => 'styleguide#toggle_active'
  get 'styleguide/js-components/proximity-loader'         => 'styleguide#proximity_loader'
  get 'styleguide/js-components/asset-reveal'             => 'styleguide#asset_reveal'
  get 'styleguide/js-components/image-helper'             => 'styleguide#image_helper'
  get 'styleguide/js-components/lightbox'                 => 'styleguide#lightbox'
  get 'styleguide/js-components/konami'                   => 'styleguide#konami'

  get 'styleguide/css-utilities/utility-classes'          => 'styleguide#utilityClasses'
  get 'styleguide/css-utilities/legacy'                   => 'styleguide#legacy'
  get 'styleguide/css-utilities/no-js'                    => 'styleguide#noJs'
  get 'styleguide/css-utilities/lp-specific-classes'      => 'styleguide#lpSpecificClasses'
  get 'styleguide/css-utilities/responsive'               => 'styleguide#responsive'
  get 'styleguide/css-utilities/utility-placeholders'     => 'styleguide#utilityPlaceholders'
  get 'styleguide/css-utilities/lp-specific-placeholders' => 'styleguide#lpSpecificPlaceholders'
  get 'styleguide/css-utilities/icon-placeholders'        => 'styleguide#iconPlaceholders'
  get 'styleguide/css-utilities/responsive-mixins'        => 'styleguide#responsiveMixins'
  get 'styleguide/css-utilities/media-mixins'             => 'styleguide#mediaMixins'
  get 'styleguide/css-utilities/utility-mixins'           => 'styleguide#utilityMixins'
  #===== yeoman hook =====#
  # NB! The above line is required for our yeoman generator and should not be changed.

end if defined?(Rizzo::Application)
