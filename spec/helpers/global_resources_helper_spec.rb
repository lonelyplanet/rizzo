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

    it "should get a list of navigation items" do
      helper.primary_navigation_items.map{|n|n[:title]}.should ==
        ['Home','Destinations','Thorn Tree forum','Shop','Hotels','Flights','Insurance']
    end

    it "should render the cart tab item" do
      helper.cart_item_element.should have_css('li[class="globalCartHead"]')
    end

    it "should render the membership tab" do
      helper.membership_item_element.should have_css('li[class="signInRegister cartDivider"]')
    end

    it "should render a white angle button" do
      arr = helper.arrow_button(color: 'white', title: 'Details and Booking')
      arr.should have_css('div[class="whiteAngleButton"]')
      arr.should have_css('a[class="lpButton2010"]', text: 'Details and Booking')
    end

  end

  context "secondary nav-bar" do

    before do
      class << helper
        include Haml, Haml::Helpers
      end
      helper.init_haml_helpers
      @args = {
        title: 'Lisbon',
        current: 'b',
        collection: [
          {title: 'a', url:'/a'},
          {title: 'b', url:'/b'},
          {title: 'c', url:'/c'},
          {title: 'd', url:'/d'}
          ]
      } 
    end

    it 'renders the secondary bar' do
      helper.secondary_nav_bar(@args).should have_css('div.row--secondary')
    end

    it "renders the secondary navigation" do
      helper.secondary_nav_bar(@args).should have_css('nav.nav--secondary')
    end

    it "renders a title section on the secondary nav-bar" do 
      helper.secondary_nav_bar(@args).should have_css('div.row--secondary h1[class="row__title--secondary"]')
    end

    it "renders a list of navigation anchors" do 
      helper.secondary_nav_bar(@args).should have_css("a[href='\/a']", text: 'a')
    end

    it "sets the current section" do 
      helper.secondary_nav_bar(@args).should have_css("a[class='current nav__item--secondary']", text: 'b')
      helper.secondary_nav_bar(@args).should_not have_css("a[class='current nav__item--secondary']", text: 'c')
    end


  end


end

