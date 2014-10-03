module GlobalResourcesHelper

  def core_navigation_items
    @core_navigation_items ||= (YAML.load(File.read(File.expand_path('../../data/layouts/primary_nav.yml', __FILE__))))
  end

  def user_navigation_items
    @user_navigation_items ||= (YAML.load(File.read(File.expand_path('../../data/layouts/user_nav.yml', __FILE__))))
  end

  def primary_navigation_items(responsive=true)
    return core_navigation_items if responsive

    core_navigation_items[1..-1].map do |item|
      item.delete(:icon_class)
      item
    end
  end

  def user_navigation_signed_out_items(type="wide-view")
    return user_navigation_items[:signed_out_links] if type == "mobile"

    nav_items = user_navigation_items[:signed_out_links].dup
    nav_items[-1][:extra_class] += " btn btn--small"
    nav_items.insert(1, { title: "or", extra_class: "or" }).reverse
  end

  def dns_prefetch_for(links)
    capture_haml do
      links.each do |link|
        haml_tag(:link, rel: "dns-prefetch", href: "//#{link}")
      end
    end
  end
end
