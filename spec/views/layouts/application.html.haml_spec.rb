require 'spec_helper'

describe "layouts/legacy" do

  before do 
    view.stub(:current_title, 'some')
    view.stub(:current_section, 'some')
  end

  it "yields the content for breadcrumbs" do
    tag = "breadcrumbs"
    view.content_for(:breadcrumbs){tag}
    render
    rendered.should include tag
  end

  it "yields the content for place_hotels_link" do
    tag = "place hotels link"
    view.content_for(:place_hotels_link){tag}
    render
    rendered.should include tag
  end

  it "yields the content for meta_content" do
    tag = "meta_content"
    view.content_for(:meta){tag}
    render
    rendered.should include tag
  end

  it "yields the content for scripts" do
    tag = "some_file.js"
    view.content_for(:scripts){tag}
    render
    rendered.should include tag
  end

  it "yields content for build" do
    content = "some info"
    view.content_for(:build) { content }
    render
    rendered.should include content
  end
end

