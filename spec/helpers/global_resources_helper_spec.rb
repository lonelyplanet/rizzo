require 'spec_helper'
require 'global_resources_helper'

describe GlobalResourcesHelper do

  context "dns-prefetch" do

    before do
      class << helper
        include Haml, Haml::Helpers
      end
      helper.init_haml_helpers
      @args = ["test.com", "test2.com"]
    end

    it 'returns link elements' do
      helper.dns_prefetch_for(@args).should have_css('link[rel="dns-prefetch"]')
    end

    it 'returns link elements' do
      helper.dns_prefetch_for(@args).should have_css('link[href="//test.com"]')
      helper.dns_prefetch_for(@args).should have_css('link[href="//test2.com"]')
    end

  end

end

