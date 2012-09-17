require 'spec_helper'
require 'global_resources_helper'

describe LayoutHelper do
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
    helper.secondary_nav_bar(@args).should have_css('div.secondary')
  end

  it "renders the secondary navigation" do
    helper.secondary_nav_bar(@args).should have_css('nav.secondary-nav')
  end

  it "renders a title section on the secondary nav-bar" do 
    helper.secondary_nav_bar(@args).should have_css('div.secondary h1[class="head-title"]')
  end

  it "renders a list of navigation anchors" do 
    helper.secondary_nav_bar(@args).should have_css("a[href='\/a']", text: 'a')
  end

  it "sets the current section" do 
    helper.secondary_nav_bar(@args).should have_css("a[class='current']", text: 'b')
    helper.secondary_nav_bar(@args).should_not have_css("a[class='current']", text: 'c')
  end


end
