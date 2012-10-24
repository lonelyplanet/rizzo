Rizzo::Application.routes.draw do

  match 'head'                         => 'head#index'  
  match 'global'                       => 'global_resources#index'
  match 'secure/global'                => 'global_resources#index', :defaults => { :secure => "true" }
  match 'breadcrumb'                   => 'global_resources#breadcrumb'
  match "r/:encrypted_url"             => 'redirector#show', :as => :redirector

  match 'global-head'                  => 'global_resources#show', :defaults => { :snippet => "head" }
  match 'global-body-header'           => 'global_resources#show', :defaults => { :snippet => "body_header" }
  match 'global-body-footer'           => 'global_resources#show', :defaults => { :snippet => "body_footer" }
  match 'secure/global-head'           => 'global_resources#show', :defaults => { :snippet => "head", :secure => "true" }
  match 'secure/global-body-header'    => 'global_resources#show', :defaults => { :snippet => "body_header", :secure => "true" }
  match 'secure/global-body-footer'    => 'global_resources#show', :defaults => { :snippet => "body_footer", :secure => "true" }

end if defined?(Rizzo::Application)
