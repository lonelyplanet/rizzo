require 'spec_helper'
require 'global_resources_helper'

describe GlobalResourcesHelper do

  context "legacy global resources" do 

    before do
      class << helper
        include Haml, Haml::Helpers
      end
      helper.init_haml_helpers
    end

    it "gets a list of navigation items" do
      helper.primary_navigation_items.map{|n|n[:title]}.should ==
        ['Home','Destinations','Themes','Thorn Tree forum','Shop','Hotels','Flights','Insurance']
    end

    it "renders the cart tab item" do
      helper.cart_item_element.should have_css('a.nav__item--cart.js-user-cart')
    end

    it "renders the membership tab" do
      helper.membership_item_element.should have_css('div.nav__item--user.js-user--nav')
    end

  end

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

