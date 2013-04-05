Rizzo::Application.routes.draw do

  match 'head'                         => 'head#index'  
  match 'breadcrumb'                   => 'global_resources#breadcrumb'
  match "r/:encrypted_url"             => 'redirector#show', :as => :redirector

  match 'global-head'                  => 'global_resources#show', :defaults => { :snippet => "head" }
  match 'global-body-header'           => 'global_resources#show', :defaults => { :snippet => "body_header" }
  match 'global-body-footer'           => 'global_resources#show', :defaults => { :snippet => "body_footer" }

  match 'client-solutions/global-head'        => 'global_resources#show', :defaults => { :snippet => "head", :cs => "true" }
  match 'client-solutions/global-body-header' => 'global_resources#show', :defaults => { :snippet => "body_header", :cs => "true" }
  match 'client-solutions/global-body-footer' => 'global_resources#show', :defaults => { :snippet => "body_footer", :cs => "true" }

  match 'noscript/global-head'         => 'global_resources#show', :defaults => { :snippet => "head", :noscript => "true"}
  match 'noscript/global-body-footer'  => 'global_resources#show', :defaults => { :snippet => "body_footer", :noscript => "true"}

  match 'secure/global-head'           => 'global_resources#show', :defaults => { :snippet => "head", :secure => "true" }
  match 'secure/global-body-header'    => 'global_resources#show', :defaults => { :snippet => "body_header", :secure => "true" }
  match 'secure/global-body-footer'    => 'global_resources#show', :defaults => { :snippet => "body_footer", :secure => "true" }

  match 'secure/noscript/global-head'         => 'global_resources#show', :defaults => { :snippet => "head", :noscript => "true"}
  match 'secure/noscript/global-body-footer'  => 'global_resources#show', :defaults => { :snippet => "body_footer", :noscript => "true"}  

  match 'legacy/global-head'                  => 'global_resources#show', :defaults => { :snippet => "head", :layout=>'legacy' }
  match 'legacy/global-body-header'           => 'global_resources#show', :defaults => { :snippet => "body_header", :layout=>'legacy' }
  match 'legacy/global-body-footer'           => 'global_resources#show', :defaults => { :snippet => "body_footer", :layout=>'legacy' }
  match 'legacy/secure/global-head'           => 'global_resources#show', :defaults => { :snippet => "head", :secure => "true", :layout=>'legacy' }
  match 'legacy/secure/global-body-header'    => 'global_resources#show', :defaults => { :snippet => "body_header", :secure => "true", :layout=>'legacy' }
  match 'legacy/secure/global-body-footer'    => 'global_resources#show', :defaults => { :snippet => "body_footer", :secure => "true", :layout=>'legacy' }
  
  match 'global'                       => 'global_resources#index'
  match 'secure/global'                => 'global_resources#index', :defaults => { :secure => "true" }
  match 'legacy/global'                => 'global_resources#index', :defaults => { :layout=>'legacy'}
  match 'legacy/secure/global'         => 'global_resources#index', :defaults => { :secure => "true", :layout=>'legacy'}

end if defined?(Rizzo::Application)
