Then /^the global\-head should have the correct content$/ do
  page.should have_xpath("//meta", :content=>'width=1024', :name=>'viewport')
  page.should have_xpath("//link", :href=>'/assets/common_core_overrides.css?body=1"')
  page.should have_xpath("//link", :href=>'http://static.lonelyplanet.com/static-ui/style/app-core-legacy.css')
  page.should have_xpath("//script", :href=>'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js')
  page.should have_xpath("//script", :href=>'http://static.lonelyplanet.com/static-ui/js/lp-js-library-legacy.js')
end

Then /^the global\-body\-header response should have the correct content$/ do
  page.should have_selector 'div.accessibility'
  page.should have_selector 'div.row--leaderboard'
  page.should have_selector 'nav.nav--primary'
  page.should have_selector 'div.search--primary'
  page.should have_selector 'nav.nav-primary--user'
end

Then /^the secure global\-body\-header response should have the correct content$/ do
  page.should have_selector 'div.accessibility'
  page.should have_selector 'nav.nav--primary'
  page.should have_selector 'div.search--primary'
  page.should have_selector 'nav.nav-primary--user'
end

Then /^the global\-body\-footer should response have the correct content$/ do
  page.should have_selector 'div.js-config' 
  page.should have_xpath("//script", "data-main"=>"/assets/app_core", :src=>"/assets/require.js")
end

Then /^the secure global\-body\-footer response should have the correct content$/ do
  page.should have_selector 'div.js-config' 
  page.should have_xpath("//script", "data-main"=>"/assets/app_secure_core", :src=>"/assets/require.js")
end

Then /^the global\-body\-header response should not have the user nav box$/ do
  page.should_not have_selector 'nav.nav-primary--user'
end

Then /^the noscript global\-head should have the correct content$/ do
  page.should have_xpath("//meta", :content=>'width=1024', :name=>'viewport')
  page.should have_xpath("//link", :href=>'/assets/common_core_overrides.css?body=1"')
  page.should have_xpath("//link", :href=>'http://static.lonelyplanet.com/static-ui/style/app-core-legacy.css')
  page.should_not have_xpath("//script", :href=>'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js')
  page.should_not have_xpath("//script", :href=>'http://static.lonelyplanet.com/static-ui/js/lp-js-library-legacy.js')
end

Then /^the secure noscript body\-footer response should have the correct content$/ do
  page.should have_selector 'div.wrap--footer'
  page.should_not have_selector 'div.js-config'
end

Given /^an external app$/ do
  @external_app = 'destinations'
end

When /^it requests the "(.*?)" snippet$/ do |url|
  visit "/#{url}"
end

Then /^the response should contain the "(.*?)" script$/ do |arg1|
  page.should have_content "errbit.lonelyplanet.com" 
end

Then /^the response should not contain the "(.*?)" script$/ do |arg1|
  page.should_not have_content "errbit.lonelyplanet.com" 
end

