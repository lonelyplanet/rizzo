require 'spec_helper'

describe AssetHelper do

  describe "#normalised_asset_path" do

    it 'returns the correct path for rails 3' do
      helper.should_receive(:asset_path).with('foo/test.js').and_return("/assets/foo/test.js")
      helper.normalised_asset_path('foo/test.js').should == "/assets/foo/test.js"
    end

    it 'returns the correct fully formed url for rails 3' do
      helper.should_receive(:asset_path).with('foo/test.js').and_return("http://example.com/assets/foo/test.js")
      helper.normalised_asset_path('foo/test.js').should == "http://example.com/assets/foo/test.js"
    end

    it 'returns the correct path for rails 4' do
      helper.should_receive(:asset_path).with('foo/test.js').and_return("foo/test.js")
      helper.normalised_asset_path('foo/test.js').should == "/assets/foo/test.js"
    end

    it 'returns the correct fully formed url for rails 4' do
      helper.should_receive(:asset_path).with('foo/test.js').and_return("http://example.com/foo/test.js")
      helper.normalised_asset_path('foo/test.js').should == "http://example.com/assets/foo/test.js"
    end

  end

end
