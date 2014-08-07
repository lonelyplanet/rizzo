require 'spec_helper'

describe Rizzo::UrlValidator do
  let(:expected_url)            { "http://www.lonelyplanet.com/africa" }
  let(:expected_url_with_port)  { "http://www.lonelyplanet.com:80/africa" }
  let(:expected_url_ssl)        { "https://www.lonelyplanet.com:443/africa" }
  subject { Rizzo::UrlValidator.validate(url) }

  describe 'validate' do
    let(:url) { expected_url }

    it { should eq(expected_url_with_port) }
  end

  context 'domain not specified' do
    let(:url) { 'africa' }

    it { should eq(expected_url_with_port) }
  end

  context 'url is nil' do
    let(:url) { nil }

    it "raises InvalidUrl exception" do
      expect { described_class.validate(url)}.to raise_error(Rizzo::UrlValidator::InvalidUrl)
    end
  end

  context 'different domain' do
    let(:url) { "http://www.google.com/africa" }

    it { should eq(expected_url_with_port) }
  end

  describe 'protocol' do
    context 'https' do
      let(:url) { "https://www.lonelyplanet.com/africa" }

      it { should eq(expected_url_ssl) }
    end

    context 'unsupported scheme' do
      let(:url) { "ftp://www.lonelyplanet.com/africa" }

      it { should eq(expected_url_with_port) }
    end

    context 'missing scheme' do
      let(:url) { "www.lonelyplanet.com/africa" }

      it { should eq(expected_url_with_port) }
    end

    context 'scheme specified by env' do
      let(:url) { 'http://www.lonelyplanet.com/africa' }

      before do
        ENV.stub(:[]).with('APP_SCHEME').and_return('https')
        ENV.stub(:[]).with('APP_HOST')
      end

      it { should eq(expected_url_ssl) }
    end
  end

  context 'ensures correct port' do
    let(:url) { "http://www.lonelyplanet.com:22/africa" }

    it { should eq(expected_url_with_port) }
  end

end
