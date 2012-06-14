require 'spec_helper'

describe Rizzo::UrlEncryptor do
  let(:message_encryptor)    { double "message_encryptor" }
  let(:encrypted_url)        { "encrypted url" }
  let(:decrypted_url)        { "decrypted url" }
  let(:encoded_url)          { "encoded url" }
  let(:decoded_url)          { "decoded url" }
  let(:url)                  { "http://foo.bar.com?zip=zap" }
  let(:redirector_url)       { "sancsaocnoewqnjcoewqijfdow" }
  
  subject { Rizzo::UrlEncryptor }
  
  before do
    subject.stub(:encryptor => message_encryptor)
  end
  
  describe ".decrypt" do
    context "generally" do      
      before do
        message_encryptor.stub(:decrypt => decrypted_url)
        URI.stub(:decode => decoded_url, :parse => URI(url))
      end

      it "URL-decodes the redirected url" do
        URI.should_receive(:decode).with(redirector_url).and_return(decoded_url)
        subject.decrypt(redirector_url)
      end
      
      it "decrypts the decoded url" do
        message_encryptor.should_receive(:decrypt).with(decoded_url).and_return(decrypted_url)
        subject.decrypt(redirector_url)
      end

      context "when the url is valid" do
        it "returns the decrypted, decoded url" do
          subject.decrypt(redirector_url).should eq decrypted_url
        end
      end

    end

    shared_examples "bad url" do |bad_url|
      let(:bad_url) { bad_url }
      
      before do
        message_encryptor.stub(:decrypt => bad_url)
      end
      
      it "raises UrlEncryptor::BadUrl" do
        lambda { subject.decrypt(bad_url) }.should raise_error(Rizzo::UrlEncryptor::BadUrl)
      end
    end

    context "when the url does not have a scheme" do
      it_behaves_like "bad url", "foo.bar.com"
    end
    
    context "when the url does not have a host" do
      it_behaves_like "bad url", "http://"
    end
    
    context "when the url cannot be parsed as a URI at all" do
      it_behaves_like "bad url", "lka q39n woi3"
    end
  end

  describe ".encrypt" do
    before do
      message_encryptor.stub(:encrypt_and_sign => encrypted_url)
      URI.stub(:encode => encoded_url)
    end
    
    it "encrypts the url" do
      message_encryptor.should_receive(:encrypt_and_sign).with(url).and_return(encrypted_url)
      subject.encrypt(url)
    end

    it "URL-encodes the encrypted to url" do
      URI.should_receive(:encode).with(encrypted_url).and_return(encoded_url)
      subject.encrypt(url)
    end

    it "returns the URL-encoded, encrypted url" do
      subject.encrypt(url).should eq encoded_url
    end
  end
end
