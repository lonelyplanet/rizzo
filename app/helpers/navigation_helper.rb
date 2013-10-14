module NavigationHelper

  def subnav_options(items, current_page)
    items.each do |item|
      item[:value] = item[:slug]
      item[:selected] = current_page == item[:title] ? true : false
    end
  end

end