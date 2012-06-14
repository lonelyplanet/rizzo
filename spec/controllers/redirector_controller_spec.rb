require 'spec_helper'

describe RedirectorController do
  describe "get#show" do
    let(:encrypted_url) { "encrypted url" }
    let(:url)           { "http://foo.bar.com/zip/zap" }

    before do
      Rizzo::UrlEncryptor.stub(decrypt: url)
      Stats = double unless defined? Stats
      Stats.stub(:increment)
    end
    
    it "decrypts the encrypted url" do
      Rizzo::UrlEncryptor.should_receive(:decrypt).with(encrypted_url).and_return(url)
      get :show, encrypted_url: encrypted_url
    end
    
    context "when there is a valid encrypted_url" do
      it "redirects to the target url" do
        get :show, encrypted_url: encrypted_url
        response.should redirect_to(url)
      end

      it "increments the redirector url stat" do
        Stats.should_receive(:increment).with("redirector.foo-bar-com.zip.zap")
        get :show, encrypted_url: encrypted_url
      end

    end

    context "when there is an invalid encrypted_url" do
      before do
        Rizzo::UrlEncryptor.stub(:decrypt).and_raise(Rizzo::UrlEncryptor::BadUrl)
      end
      
      it "should fail" do
        get :show, encrypted_url: encrypted_url
        response.should_not be_success
      end

      it "increments the redirector.bad_url stat" do
        Stats.should_receive(:increment).with("redirector.bad_url.#{encrypted_url}")
        get :show, encrypted_url: encrypted_url
      end
    end
  end
end
