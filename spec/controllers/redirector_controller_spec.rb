require 'spec_helper'

describe RedirectorController do
  describe "get#show" do
    let(:encrypted_url) { "encrypted url" }
    let(:url)           { "http://foo.bar.com/zip/zap" }

    before do
      Rizzo::UrlEncryptor.stub(decrypt: url)
      controller.stub(:increment_stats_bucket_for_redirected_url)
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
        controller.should_receive(:increment_stats_bucket_for_redirected_url).with(url)
        get :show, encrypted_url: encrypted_url
      end

    end

    context "when there is an invalid encrypted_url" do
      before do
        Rizzo::UrlEncryptor.stub(:decrypt).and_raise(Rizzo::UrlEncryptor::BadUrl)
        controller.stub(:increment_stats_bucket_for_bad_redirected_url)
      end
      
      it "should fail" do
        get :show, encrypted_url: encrypted_url
        response.should_not be_success
      end

      it "increments the redirector.bad_url stat" do
        controller.should_receive(:increment_stats_bucket_for_bad_redirected_url).with(encrypted_url)
        get :show, encrypted_url: encrypted_url
      end
    end
  end

  describe "get#internal" do
    let(:url) { 'http://www.lonelyplanet.com/this-place' }

    it 'validates the url' do
      Rizzo::UrlValidator.should_receive(:validate).with(url).and_return(url)
      get :internal, url: url
      response.should redirect_to(url)
    end

    it 'supports legacy branch_id param instead of url' do
      Rizzo::UrlValidator.should_receive(:validate).with(url).and_return(url)
      get :internal, branch_id: url
      response.should redirect_to(url)
    end

    context 'invalid url' do
      before(:each) do
        Rizzo::UrlValidator.stub(:validate).and_raise(Rizzo::UrlValidator::InvalidUrl)
      end

      it 'should fail' do
        get :internal, url: url
        response.should_not be_success
      end

      it 'should give a 404' do
        get :internal, url: url
        response.status.should eq (404)
      end
    end
  end
end
