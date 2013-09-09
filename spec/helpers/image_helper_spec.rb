require 'spec_helper'

describe ImageHelper do

  describe "#safe_image_tag" do
    it 'returns nil when no image url' do
      helper.safe_image_tag(nil).should == nil
    end

    it 'returns an image_tag for a card when image url exists' do
      img = double
      helper.should_receive(:image_tag).with('http://www.google.com/image.jpg', {}).and_return(img)
      helper.safe_image_tag('http://www.google.com/image.jpg').should == img
    end

    it 'returns a commented image_tag for a card when lazyload is passed as an argument' do
      img = double
      helper.should_receive(:image_tag).with('http://www.google.com/image.jpg', {}).and_return(img)
      helper.safe_image_tag('http://www.google.com/image.jpg', lazyload: true).should == "<div data-uncomment=true><!-- " + img + " --></div>"
    end

    it 'passes through requested options' do
      opts = {class: 'my_class'}
      helper.should_receive(:image_tag).with('http://www.google.com/image.jpg', opts)
      helper.safe_image_tag('http://www.google.com/image.jpg', opts)
    end

    it 'doesnt pass through the lazyload option' do
      opts = {class: 'my_class', lazyload: false}
      helper.should_receive(:image_tag).with('http://www.google.com/image.jpg', {class: 'my_class'})
      helper.safe_image_tag('http://www.google.com/image.jpg', {class: 'my_class'})
    end

  end

end
