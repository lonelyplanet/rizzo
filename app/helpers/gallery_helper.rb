module GalleryHelper
  def gallery_breadcrumb_for(breadcrumb, last)
    capture_haml do
      if last == true
        haml_tag(:span, class: "gallery__breadcrumb-item gallery__breadcrumb-item--current", itemprop: "url") { haml_concat breadcrumb[:place] }
      elsif breadcrumb[:slug].blank?
        haml_tag(:span, class: "gallery__breadcrumb-item", itemprop: "url") { haml_concat breadcrumb[:place] }
      else
        haml_tag(:a, class: "gallery__breadcrumb-item", href: "https://www.lonelyplanet.com/#{breadcrumb[:slug]}", itemprop:"url") { haml_concat breadcrumb[:place] }
      end
    end
  end
end
