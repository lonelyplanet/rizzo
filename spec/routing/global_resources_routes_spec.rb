require 'spec_helper'

describe "global service routes" do
  
  it "routes /global-head to global service" do
    get('/global-head').should route_to("global_resources#show", {:snippet=>'head', :legacystyle => "true", :show_js => true })
  end

  it "routes /global-body-header to global service" do
    get('/global-body-header').should route_to("global_resources#show", {:snippet=>'body_header', :legacystyle => "true", :show_js => true})
  end

  it "routes /global-body-footer to global service" do
    get('/global-body-footer').should route_to("global_resources#show", {:snippet=>'body_footer', :legacystyle => "true", :show_js => true})
  end

  it "routes /secure/global-head to global service" do
    get('/secure/global-head').should route_to("global_resources#show", {:snippet=>'head', :secure => "true", :tynt => "true", :show_js => true})
  end

  it "routes /secure/global-body-header to global service" do
    get('/secure/global-body-header').should route_to("global_resources#show", {:snippet=>'body_header', :secure => "true", :show_js => true})
  end

  it "routes /secure/global-body-footer to global service" do
    get('/secure/global-body-footer').should route_to("global_resources#show",  {:snippet=>'body_footer', :secure => "true", :show_js => true})
  end

end
