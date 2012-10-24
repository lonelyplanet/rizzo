Then /^the global\-head should have the correct content$/ do
  page.should have_xpath("//meta", :content=>'width=1024', :name=>'viewport')
  page.should have_xpath("//link", :href=>'/assets/common_core.css?body=1')
  page.should have_xpath("//link", :href=>'http://static.lonelyplanet.com/static-ui/style/app-core-legacy.css')
  page.should have_xpath("//script", :href=>'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js')
  page.should have_xpath("//script", :href=>'http://static.lonelyplanet.com/static-ui/js/lp-js-library-legacy.js')
end

Then /^the global\-body\-header response should have the correct content$/ do
  page.should have_selector 'div.accessibility'
  page.should have_selector 'div.ad-leaderboard'
  page.should have_selector 'nav.global-nav'
  page.should have_selector 'div.search-box'
  page.should have_selector 'nav.user-nav'
end

Then /^the secure global\-body\-header response should have the correct content$/ do
  page.should have_selector 'div.accessibility'
  page.should have_selector 'nav.global-nav'
  page.should have_selector 'div.search-box'
  page.should_not have_selector 'div.ad-leaderboard'
  page.should have_selector 'nav.user-nav'
end

Then /^the global\-body\-footer should response have the correct content$/ do
  page.should have_selector 'div.js-config' 
  page.should have_xpath("//script", "data-main"=>"/assets/app_core_legacy", :src=>"/assets/require.js")
end

Then /^the secure global\-body\-footer response should have the correct content$/ do
  page.should have_selector 'div.js-config' 
  page.should_not have_xpath("//script", "data-main"=>"/assets/app_core_legacy", :src=>"/assets/require.js")
end

Then /^the global\-body\-header response should not have the user nav box$/ do
  page.should_not have_selector 'nav.user-nav'
end
