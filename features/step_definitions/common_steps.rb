Given /^(?:|I )am on (.+)$/ do |page_name|
  visit path_to(page_name)
end

When /^(?:|I )go to (.+)$/ do |page_name|
  if page_name.match(/^\"(.+)\"$/)
    visit $1
  else
    visit path_to(page_name)
  end
end
