# encoding: UTF-8
require 'spec_helper'

describe "components/_pagination.html.haml" do

  default_properties = {
    :total_results => 25,
    :results_per_page => 5,
    :current_page => 1,
    :visible_pages => 5,
    :path => "/?page=%i",
    :nofollow_page_number => 2
  }

  describe 'pagination container' do
    describe "rel links in head" do
      before(:each) do
        stub_template 'layouts/application.html.erb' => <<-VIEW
          <html>
            <head><%= yield :pagination_links_rels %></head>
            <body><%= yield %></body>
          </html>
        VIEW
      end

      it "adds next and prev rel links to head if next and prev page exists" do
        view.stub(properties: default_properties.merge(current_page: 2))

        render template: 'components/_pagination', layout: 'layouts/application'

        rendered.should have_css('head link[rel="prev"]')
        rendered.should have_css('head link[rel="next"]')
      end

      it "adds only next rel link on first page" do
        view.stub(properties: default_properties.merge(current_page: 1))

        render template: 'components/_pagination', layout: 'layouts/application'

        rendered.should_not have_css('head link[rel="prev"]')
        rendered.should have_css('head link[rel="next"]')
      end

      it "add only prev rel link on last page" do
        view.stub(properties: default_properties.merge(current_page: 5))

        render template: 'components/_pagination', layout: 'layouts/application'

        rendered.should have_css('head link[rel="prev"]')
        rendered.should_not have_css('head link[rel="next"]')
      end
    end

    it 'adds any passed in classes' do
      view.stub(properties: default_properties.merge( :classes => 'foo bar' ))

      render

      rendered.should have_css('.pagination.foo.bar')

    end

  end

  describe 'backward links' do

    it 'renders previous and first page links when not on the first page' do

      view.stub(properties: default_properties.merge( :current_page => 2 ))

      render

      rendered.should have_css('.pagination__backwards')
      rendered.should have_css('.pagination__link--prev')
      rendered.should have_css('.pagination__link--first')

    end

    it 'does not render previous page link when on the first page' do

      view.stub(properties: default_properties)

      render

      rendered.should_not have_css('.pagination__backwards .pagination__link')
      rendered.should_not have_css('.pagination__link--prev')
    end

  end

  describe 'forward links' do

    it 'renders next and last page links when not on the last page' do

      view.stub(properties: default_properties)

      render

      rendered.should have_css('.pagination__forwards')
      rendered.should have_css('.pagination__link--next')
      rendered.should have_css('.pagination__link--last')

    end

    it 'does not render next page link when on the last page' do

      view.stub(properties: default_properties.merge( :current_page => 5 ))

      render

      rendered.should_not have_css('.pagination__forwards .pagination__link')
      rendered.should_not have_css('.pagination__link--next')

    end

  end

  describe 'rel=nofollow attribute' do

    it 'is added if :nofollow_page_number property is set' do

      view.stub(properties: default_properties.merge( :current_page => 2 ))

      render

      (Capybara.string(rendered).find('.pagination__link--prev')[:rel]).should eq('nofollow')
      (Capybara.string(rendered).find('.pagination__link--next')[:rel]).should eq('nofollow')
      (Capybara.string(rendered).find('.pagination__link--first')[:rel]).should eq(nil)
      (Capybara.string(rendered).find('.pagination__link--last')[:rel]).should eq('nofollow')
    end

    it 'is not added if :nofollow_page_number property is not set' do

      view.stub(properties: default_properties.merge( :current_page => 2, :nofollow_page_number => nil ))

      render

      (Capybara.string(rendered).find('.pagination__link--prev')[:rel]).should eq(nil)
      (Capybara.string(rendered).find('.pagination__link--next')[:rel]).should eq(nil)
      (Capybara.string(rendered).find('.pagination__link--first')[:rel]).should eq(nil)
      (Capybara.string(rendered).find('.pagination__link--last')[:rel]).should eq(nil)
    end
  end

  describe 'pagination numbers' do

    it 'renders pagination numbers given a total > results per page' do

      view.stub(properties: default_properties)

      render

      rendered.should have_css('.pagination__numbers')

    end

    it 'does not render pagination given a total <= results per page' do

      view.stub(properties: default_properties.merge( :total_results => 4 ))

      render

      rendered.should_not have_css('.pagination__numbers')

    end

    it 'renders selected variation for the current page number' do

      view.stub(properties: default_properties)

      render

      rendered.should have_css('.pagination__numbers .pagination__link.pagination__link--current:nth-child(1)')

    end

    it 'renders numbers 1-6 & 20 given a total of 100 results and current page number of 2' do

      view.stub(properties: default_properties.merge( :total_results => 100, :current_page => 2 ))

      render

      links = Capybara.string(rendered).all('.pagination__numbers .pagination__link').map { |el| el.text }
      links.should eq( ['1', '2', '3', '4', '5', '6', '20'] )

    end

    it 'renders numbers 1, 8-12 & 20 given a total of 100 results and current page number of 10' do

      view.stub(properties: default_properties.merge( :total_results => 100, :current_page => 10 ))

      render

      links = Capybara.string(rendered).all('.pagination__numbers .pagination__link').map { |el| el.text }
      links.should eq( ['1', '8', '9', '10', '11', '12', '20'] )

    end

    it 'renders numbers 1 & 15-20 given a total of 100 results and current page number of 19' do

      view.stub(properties: default_properties.merge( :total_results => 100, :current_page => 19 ))

      render

      links = Capybara.string(rendered).all('.pagination__numbers .pagination__link').map { |el| el.text }
      links.should eq( ['1', '15', '16', '17', '18', '19', '20'] )

    end

    it 'renders rel=nofollow attributes for pages above provided limit' do

      view.stub(properties: default_properties.merge( :total_results => 25, :current_page => 2, :nofollow_page_number => 3 ))

      render

      links = Capybara.string(rendered).all('.pagination__numbers .pagination__link')
      links.map { |el| el.text }.should eq( ['1', '2', '3', '4', '5'] )
      links.map { |el| el[:rel] }.should eq( [nil, nil, nil, 'nofollow', 'nofollow'] )

    end

  end

  describe 'pagination ellipsis' do

    describe 'left' do

      it 'is rendered if current page number is above 2' do

        view.stub(properties: default_properties.merge( :total_results => 100, :current_page => 3 ))

        render

        rendered.should have_css('.pagination__numbers .pagination__ellipsis--left')

      end

      it 'is not rendered if current page number is below or equal 2' do

        view.stub(properties: default_properties.merge( :total_results => 100, :current_page => 2 ))

        render

        rendered.should_not have_css('.pagination__ellipsis--left')

      end

      it 'has "mv--hidden" class if 1st visible page number is succeeding 1st page number' do

        view.stub(properties: default_properties.merge( :total_results => 100, :current_page => 3 ))

        render

        rendered.should have_css('.pagination__ellipsis--left.mv--hidden')

      end

      it 'does not have "mv--hidden" class if 1st visible page number is not succeeding 1st page number' do

        view.stub(properties: default_properties.merge( :total_results => 100, :current_page => 14 ))

        render

        rendered.should_not have_css('.pagination__ellipsis--left.mv--hidden')

      end

    end

    describe 'right' do

      it 'is rendered if current page number is below pre-last page number' do

        view.stub(properties: default_properties.merge( :total_results => 100, :current_page => 4 ))

        render

        rendered.should have_css('.pagination__numbers .pagination__ellipsis--right')

      end

      it 'is not rendered if current page number is last page or one before' do

        view.stub(properties: default_properties.merge( :total_results => 100, :current_page => 19 ))

        render

        rendered.should_not have_css('.pagination__ellipsis--right')

      end

      it 'has "mv--hidden" class if the last of visible pages is preceding last page' do

        view.stub(properties: default_properties.merge( :total_results => 100, :current_page => 17 ))

        render

        rendered.should have_css('.pagination__ellipsis--right.mv--hidden')

      end

      it 'does not have "mv--hidden" class if the last of visible pages is not preceding last page' do

        view.stub(properties: default_properties.merge( :total_results => 100, :current_page => 8 ))

        render

        rendered.should_not have_css('.pagination__ellipsis--right.mv--hidden')

      end

    end

  end

  describe 'pagination link URLs' do

    it 'formats the given path string for the correct number' do

      view.stub(properties: default_properties)

      render

      # The current page is not a link
      links = Capybara.string(rendered).all('.pagination__numbers a.pagination__link').map { |el| el[:href] }
      links.should eq( ['/?page=2', '/?page=3', '/?page=4', '/?page=5'] )

    end

    it 'appends the given URL parameter if it does not already exist in the path' do

      view.stub(properties: default_properties.merge( :path => '/path/to/page?foo=bar&baz=qux', :param => 'page' ))

      render

      links = Capybara.string(rendered).all('.pagination__numbers a.pagination__link').map { |el| el[:href] }

      links.should eq( [
        '/path/to/page?foo=bar&baz=qux&page=2',
        '/path/to/page?foo=bar&baz=qux&page=3',
        '/path/to/page?foo=bar&baz=qux&page=4',
        '/path/to/page?foo=bar&baz=qux&page=5'
      ] )

    end

    it 'replaces the given URL parameter if it already exists in the path' do

      view.stub(properties: default_properties.merge( :path => '/path/to/page?foo=bar&baz=qux&page=5', :param => 'page' ))
      # view.stub(properties: default_properties.merge( :path => '/path/to/page?foo=bar&page=5&baz=qux', :param => 'page' ))
      # view.stub(properties: default_properties.merge( :path => '/path/to/page?page=5&foo=bar&baz=qux', :param => 'page' ))

      render

      links = Capybara.string(rendered).all('.pagination__numbers a.pagination__link').map { |el| el[:href] }
      links.should eq( [
        '/path/to/page?foo=bar&baz=qux&page=2',
        '/path/to/page?foo=bar&baz=qux&page=3',
        '/path/to/page?foo=bar&baz=qux&page=4',
        '/path/to/page?foo=bar&baz=qux&page=5'
      ] )

    end

  end

  describe 'page input' do

    it 'is rendered instead current page number when :show_page_input property is set' do
      view.stub(properties: default_properties.merge( :show_page_input => true ))

      render

      rendered.should have_css('.pagination__link--current form.pagination__page-input__form')
      rendered.should have_css('form input[type=number].pagination__page-input__number')
      rendered.should have_css('form input[type=submit].pagination__page-input__submit')
      rendered.should have_css('form .pagination__page-input__icon')
    end

    it 'has properly configured form element' do
      view.stub(properties: default_properties.merge( :show_page_input => true, :path => '/foo' ))

      render

      form = Capybara.string(rendered).find('form')

      form[:action].should eq('/foo')
      form[:method].should eq('get')
    end

    it 'has properly configured number input element' do
      view.stub(properties: default_properties.merge( :show_page_input => true, :current_page => 3 ))

      render

      number_input = Capybara.string(rendered).find('.pagination__page-input__number')

      (number_input[:name]).should eq('page')
      (number_input[:min]).should eq('1')
      (number_input[:max]).should eq('5')
      (number_input[:value]).should eq('3')
      (number_input[:step]).should eq('1')
    end

  end

  describe 'detailed position' do

    it 'displays detailed position information' do
      view.stub(properties: default_properties.merge( :show_detailed => true ))

      render

      rendered.should include('Showing 1–5 of 25')

    end

    it 'displays correct detailed position for second page' do

      view.stub(properties: default_properties.merge( :show_detailed => true, :current_page => 2 ))

      render

      rendered.should include('Showing 6–10 of 25')

    end

    it 'displays correct detailed position when there are fewer items' do

      view.stub(properties: default_properties.merge( :show_detailed => true, :total_results => 4 ))

      render

      rendered.should include('Showing 1–4 of 4')

    end

    it 'displays correct detailed position when there are fewer items' do

      view.stub(properties: default_properties.merge( :show_detailed => true, :total_results => 7, :current_page => 2 ))

      render

      rendered.should include('Showing 6–7 of 7')

    end

  end

end
