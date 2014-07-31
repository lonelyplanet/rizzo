Then(/^the Preview route should be displayed$/) do
  page.should have_selector 'html.no-freight'
end

Then(/^the Modern route should be displayed$/) do
  page.should have_selector 'html.freight'
end

Then(/^the body should have a class of responsive$/) do
  page.should have_selector 'body.responsive'
end

Then(/^the body should not have a class of responsive$/) do
  page.should_not have_selector 'body.responsive'
end

Then(/^primary nav should not be present$/) do
  find('#js-nav--primary').all("*").length.should == 0
end

Then(/^user nav should not be present$/) do
  page.should_not have_selector '.js-user-nav'
end

Then(/^sitemap nav should not be present$/) do
  page.should_not have_selector '#js-footer-nav'
end

Then(/^about nav should not be present$/) do
  page.should_not have_selector '.row--footer--about'
end

Then(/^search should not be present$/) do
  page.should_not have_selector '.js-nav-search'
end

Then(/^the header ad should not be present$/) do
  page.should_not have_selector('.row--leaderboard--header')
end

Then(/^the header ad should be present$/) do
  page.should have_selector('.row--leaderboard--header')
end

Then(/^the footer ad should not be present$/) do
  page.should_not have_selector('.row--leaderboard--footer')
end

Then(/^the languages dropdown should not be present$/) do
  page.should_not have_selector('.form--international')
end
