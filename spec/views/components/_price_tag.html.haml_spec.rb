require 'spec_helper'

describe 'components/_price_tag.html.haml' do

  describe 'sale price' do
    it 'shows retail price if on sale' do
      view.stub(properties: {on_sale?: true})
      render
      rendered.should have_css(".tag--price__retail")
    end

    it 'does not show retail price if not on sale' do
      view.stub(properties: {on_sale?: false})
      render
      rendered.should_not have_css(".tag--price__retail")
    end
  end

end
