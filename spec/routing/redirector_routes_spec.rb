require 'spec_helper'

describe "redirector routes" do
  it "routes /r/encrypted-url to the redirector controller" do
    get("/r/encrypted_url")
      .should route_to("redirector#show", :encrypted_url => "encrypted_url")
  end

  it "routes the named route redirector_path(encrypted_url)" do
    get(redirector_path("encrypted_url"))
      .should route_to(:controller => "redirector", :action => "show", :encrypted_url => "encrypted_url")
  end
end
