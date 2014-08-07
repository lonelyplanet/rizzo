require 'spec_helper'

describe AdHelper do

  describe "#ad_sense_properties" do

    it 'returns the correct dimensions for a default ad' do
      helper.ad_sense_properties("default").should == { width: 162, height: 312, ad_slot: 2903404846, id: "ca-pub-7817033512402772"}
    end

    it 'returns the correct dimensions for a leaderboard ad' do
      helper.ad_sense_properties("leaderboard").should == { width: 728, height: 90, ad_slot: 8090484046, id: "ca-pub-7817033512402772"}
    end

  end

end
