module NavigationHelper

  def subnav_options(items)
    items.map do |item|
      h = item.clone
      h[:value] = h[:slug]
      h
    end
  end

end