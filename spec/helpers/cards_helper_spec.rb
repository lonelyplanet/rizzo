require 'spec_helper'

describe CardsHelper do

  before do
    class << helper
      include Haml, Haml::Helpers
    end
    helper.init_haml_helpers
  end

  describe "#card_classes" do

    it "returns an array of structural class names for the given properties" do
      result = helper.card_classes(
        double?: true,
        cover?: true,
        kind: "article"
      )

      result.should include("card--double")
      result.should include("card--cover")
      result.should include("card--article")

      result = helper.card_classes(
        short?: true,
        cover?: true,
        fixed?: true
      )

      result.should include("card--single")
      result.should include("card--short")
      result.should include("card--fixed")
    end

    describe "returns an array of content class names for the given properties" do

      it "should add 'has' class names when given content" do
        result = helper.card_classes(
          image_url: "path/to/image",
          author_name: "Joe Bloggs",
          tags: {
            top_choice?: true
          }
        )

        result.should include("card--has-img")
        result.should include("card--has-footer")
        result.should include("card--has-tags")
      end

      it "should add 'no' class names when given no content" do
        result = helper.card_classes(
          image_url: nil,
          meta_description: nil
        )

        result.should include("card--no-img")
        result.should include("card--no-footer")
        result.should include("card--no-tags")
      end

    end

  end

  describe "#card_href_for_test_variation" do
    let(:var)   { nil }
    let(:url)   { "/path/to/thing" }
    let(:props) { { test_variation: var, url: url } }

    context "with no variation" do
      it "returns the original URL" do
        result = helper.card_href_for_test_variation(props, var)
        result.should eq(url)
      end
    end

    context "with test variation" do
      let(:var) { 1 }

      context "when the URL has no QS" do
        it "returns the URL appended with variation" do
          result = helper.card_href_for_test_variation(props, var)
          result.should eq("#{url}?abv=1")
        end
      end

      context "when the URL has a QS" do
        let(:url) { "/path/to/thing?foo=bar" }

        it "returns the URL appended with variation" do
          result = helper.card_href_for_test_variation(props, var)
          result.should eq("#{url}&abv=1")
        end
      end
    end

  end

  describe "#card_link_data" do
    let(:tracking_data) { { category: "lodgings" } }
    let(:lightbox_data) { { lightbox: true } }

    before(:each) do
      helper.stub(:card_tracking_data).and_return(tracking_data)
      helper.stub(:card_layer_data).and_return(lightbox_data)
    end

    it "should return tracking and lightbox data" do
      result = helper.card_link_data({})

      result.should eq(
        :category => tracking_data[:category],
        :lightbox => lightbox_data[:lightbox]
      )
    end
  end

  describe "#card_tracking_data" do

    let(:tracking_data) do
      {
        category: "lodgings",
        action: "view",
        label: "/path/to/lodging"
      }
    end

    it "should return properties for given tracking hash" do
      result = helper.card_tracking_data(tracking: tracking_data)

      result.should eq(
        lpa_category: tracking_data[:category],
        lpa_action: tracking_data[:action],
        lpa_label: tracking_data[:label]
      )
    end

  end

  describe "#card_link_if" do

    let(:link_url) { "path/to/thing" }

    it "should return an anchor element with given properties if condition is true" do
      result = helper.capture_haml do
        helper.card_link_if(true, href: link_url) {}
      end

      result.should eq "<a href='#{link_url}'>\n</a>\n"
    end

  end

  describe "#card_datetime" do

    let(:datetime) { "2014-09-08T16:39:00Z" }

    it "re-formats the given date to be more readable" do
      result = helper.card_datetime(datetime)
      result.should eq "08 September 2014"
    end

  end

end
