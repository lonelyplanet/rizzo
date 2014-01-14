Then(/^the Core layout should be displayed$/) do
  page.should have_selector 'html.no-freight'
  page.should_not have_selector 'body.responsive'
  page.should_not have_selector 'body.homepage'
end

Then(/^the Legacy layout should be displayed$/) do
  page.should have_selector 'div.row--secondary'
  page.should have_content 'Buenos Aires'
end

Then(/^the Responsive layout should be displayed$/) do
  page.should have_selector 'body.responsive'
end

Then(/^the Homepage layout should be displayed$/) do
  page.should have_selector 'body.responsive.homepage'
end

Then /^the base global\-head content should be displayed$/ do
  page.should have_xpath("//meta[@content=\"width=1024\" and @name=\"viewport\"]")
  page.should have_xpath("//link[@href=\"/assets/common_core_overrides.css\"]")
  page.should have_xpath("//script[@src=\"//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js\"]")
end

Then /^the non-secure global\-head content should be displayed$/ do
  page.should have_xpath("//link[@href=\"http://static.lonelyplanet.com/static-ui/style/app-core-legacy.css\"]")
  page.should have_xpath("//script[@src=\"http://static.lonelyplanet.com/static-ui/js/lp-js-library-legacy.js\"]")
end

Then(/^the tynt tag should be displayed$/) do
  page.should have_content "http://tcr.tynt.com/ti.js"
end

Then(/^the tynt tag should not be displayed$/) do
  page.should_not have_content "http://tcr.tynt.com/ti.js"
end

Then /^the global\-body\-header response should have the correct content$/ do
  page.should have_selector 'div.accessibility'
  page.should have_selector 'div.row--leaderboard'
  page.should have_selector 'div.nav--primary'
  page.should have_selector 'form.search--primary'
  page.should have_selector 'div.nav--primary--user'
end

Then /^the secure global\-head content should be displayed$/ do
  page.should have_xpath("//link[@href=\"https://secure.lonelyplanet.com/static-ui/style/app-core-legacy.css\"]")
  page.should have_xpath("//script[@src=\"https://secure.lonelyplanet.com/static-ui/js/lp-js-library-legacy.js\"]")
end

Then /^the secure global\-body\-header response should have the correct content$/ do
  page.should have_selector 'div.accessibility'
  page.should have_selector 'div.nav--primary'
  page.should have_selector 'form.search--primary'
  page.should have_selector 'div.nav--primary--user'
end

Then /^the global\-body\-footer should response have the correct content$/ do
  page.should have_selector 'div.wrapper--footer'
  page.should have_selector 'div.row--sitemap'
  page.should have_selector 'div.row--footer--about'
  page.should have_selector 'div.row--smallprint'
  page.should have_selector 'div.js-config'
  page.should have_xpath("//script[@data-main=\"app_core_legacy\" and @src=\"/assets/require.js\"]")
end

Then /^the secure global\-body\-footer response should have the correct content$/ do
  page.should have_selector 'div.js-config' 
  page.should have_xpath("//script[@data-main=\"app_secure_core_legacy\" and @src=\"/assets/require.js\"]")
end

Then /^the global\-body\-header response should not have the user nav box$/ do
  page.should_not have_selector 'div.nav-primary--user'
end

Then /^the noscript global\-head should have the correct content$/ do
  page.should have_xpath("//meta[@content=\"width=1024\" and @name=\"viewport\"]")
  page.should have_xpath("//link[@href=\"/assets/common_core_overrides.css\"]")
  page.should have_xpath("//link[@href=\"https://secure.lonelyplanet.com/static-ui/style/app-core-legacy.css\"]")
  page.should_not have_xpath("//script[@src=\"//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js\"]")
  page.should_not have_xpath("//script[@src=\"https://secure.lonelyplanet.com/static-ui/js/lp-js-library-legacy.js\"]")
  page.should_not have_content "http://tcr.tynt.com/ti.js"
end

Then /^the secure noscript body\-footer response should have the correct content$/ do
  page.should have_selector 'div.wrapper--footer'
  page.should_not have_selector 'div.js-config'
end

Then(/^the global\-head should serve a secure static\-ui stylesheet$/) do
  page.should have_xpath("//link[@href=\"https://secure.lonelyplanet.com/static-ui/style/app-core-legacy.css\"]")
end

Then(/^the global\-head should serve a secure static\-ui script$/) do
  page.should have_xpath("//script[@src=\"https://secure.lonelyplanet.com/static-ui/js/lp-js-library-legacy.js\"]")
end

Given /^an external app$/ do
  @external_app = 'destinations'
end

When /^it requests the "(.*?)" snippet$/ do |url|
  visit "/#{url}"
end

Then(/^the client\-solutions global\-head should have the correct content$/) do
  page.should_not have_xpath("//meta[@content=\"width=1024\" and @name=\"viewport\"]")
  page.should have_xpath("//link[@href=\"/assets/common_core.css\"]")
end

Then(/^the client\-solutions global\-body\-header response should have the correct content$/) do
  page.should_not have_selector 'div.accessibility'
  page.should_not have_selector 'div.row--leaderboard'
  page.should have_selector 'div.nav--primary'
  page.should have_selector 'form.search--primary'
  page.should_not have_selector 'div.nav--primary--user'
end

Then(/^the client\-solutions body\-footer response should have the correct content$/) do
  page.should have_selector '.row--footer--about'
  page.should_not have_selector '.newsletter--footer'
  page.should_not have_selector 'div.js-config'
end

