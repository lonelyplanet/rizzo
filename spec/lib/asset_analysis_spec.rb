require 'spec_helper'

describe 'Asset Analysis' do

  let(:stats) { {
    "today" => [
      {"sizes" => {"size" => "10" }, "id" => "Hotels" },
      {"sizes" => {"size" => "20" }, "id" => "Search" },
      {"sizes" => {"size" => "30" }, "id" => "Flight" }
    ],
    "yesterday" => [
      {"sizes" => {"size" => "8" }, "id" => "Hotels" },
      {"sizes" => {"size" => "20" }, "id" => "Search" },
      {"sizes" => {"size" => "45" }, "id" => "Flight" }
    ],
    "last_week" => [
      {"sizes" => {"size" => "4" }, "id" => "Hotels" },
      {"sizes" => {"size" => "20" }, "id" => "Search" },
      {"sizes" => {"size" => "60" }, "id" => "Flight" }
    ]
  } }
  let(:result) { @dummy_class.fetch("all") }

  [CSSAnalysis, JSAnalysis].each do |asset_class|

    describe asset_class do

      before(:each) do
        @dummy_class = asset_class.new
        @dummy_class.stub(:fetch_stats) { stats }
      end

      describe '#fetch' do

        describe 'calculate percentages' do
          specify {
            hotels = result.find {|s| s["id"] == "Hotels"}
            hotels["compare"]["yesterday"].should eq(25.0)
            hotels["compare"]["last_week"].should eq(150.0)
          }
          specify {
            search = result.find {|s| s["id"] == "Search"}
            search["compare"]["yesterday"].should eq(0)
            search["compare"]["last_week"].should eq(0)
          }
          specify {
            flights = result.find {|s| s["id"] == "Flight"}
            flights["compare"]["yesterday"].should eq(-33.3)
            flights["compare"]["last_week"].should eq(-50.0)
          }
        end

        describe 'ordering results' do
          specify{ result[0]["id"].should eq "Flight"}
          specify{ result[1]["id"].should eq "Search"}
          specify{ result[2]["id"].should eq "Hotels"}
        end

      end

    end

  end

end
