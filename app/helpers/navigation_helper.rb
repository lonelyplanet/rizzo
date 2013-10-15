module NavigationHelper

  def subnav_options(items, current_page)
    items.map do |item|
      h = item.clone
      h[:value] = h[:slug]
      h[:selected] = current_page == h[:title] ? true : false
      h
    end
  end

end