require 'spec_helper'

describe 'components/widgets/_flickr.html.haml' do
  before do
    view.stub(properties: data)
    render
  end
  context 'with data' do
    let(:data) { load_data_fixture :flickr_widget }
    it 'renders the title' do
      rendered.should have_css('.copy--h1')
    end
    it 'renders the ranking' do
      rendered.should have_css('.card--double')
      rendered.should have_css('article.card--single:not(.card--mini)', count: 2)
      rendered.should have_css('article.card--mini', count: 2)
    end
  end

  context 'with missing data' do
    let(:data) { { data: nil, tag: 'TITLE' } }
    it 'renders the title' do
      rendered.should have_css('.copy--h1')
    end
    it 'renders a no content notice' do
      rendered.should have_css('.no--content', text: 'No content found, please try again later')
    end
  end

end
