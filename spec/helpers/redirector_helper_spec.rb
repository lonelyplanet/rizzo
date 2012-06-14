require 'spec_helper'

describe RedirectorHelper do
  describe "#redirector_path" do
    let(:url)           { "url" }
    let(:encrypted_url) { "encrypted url" }
    
    it "encrypts the url" do
      Rizzo::UrlEncryptor.should_receive(:encrypt).with(url).and_return(encrypted_url)
      helper.redirector_path(url)
    end

    it "returns a path to the redirector controller show action for the encrypted url" do
      helper.redirector_path(url).should =~ /\/r/#{url}/
    end
  end
end
