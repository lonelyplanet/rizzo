require 'spec_helper'

describe LayoutController do
  describe '#snippet' do
    describe 'new nav bar' do
      render_views

      it 'returns the new header' do
        get :snippet, route: 'modern', snippet: 'header'

        response.body.should_not =~ /Basket/
        response.body.should =~ /lp-global-header/
      end
    end
  end
end
