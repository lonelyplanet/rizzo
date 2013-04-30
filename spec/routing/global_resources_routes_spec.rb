require 'spec_helper'

describe "global service routes" do
  
  it "routes /global-head to global service" do
    get('/global-head').should route_to("global_resources#show", {:snippet=>'head'})
  end

  it "routes /global-body-header to global service" do
    get('/global-body-header').should route_to("global_resources#show", {:snippet=>'body_header', :scope => 'core'})
  end

  it "routes /global-body-footer to global service" do
    get('/global-body-footer').should route_to("global_resources#show", {:snippet=>'body_footer'})
  end

  it "routes /secure/global-head to global service" do
    get('/secure/global-head').should route_to("global_resources#show", {:snippet=>'head', :secure => "true"})
  end

  it "routes /secure/global-body-header to global service" do
    get('/secure/global-body-header').should route_to("global_resources#show", {:snippet=>'body_header', :secure => "true"})
  end

  it "routes /secure/global-body-footer to global service" do
    get('/secure/global-body-footer').should route_to("global_resources#show",  {:snippet=>'body_footer', :secure => "true"})
  end

end
