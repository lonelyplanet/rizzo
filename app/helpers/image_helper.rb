module ImageHelper

  def safe_image_tag(image_url, opts={})
    return if image_url.blank?
    if lazyload = opts.delete(:lazyload)
      lazyloaded_image_tag(image_tag(image_url, opts))
    else
      image_tag(image_url, opts)
    end
  end

  def lazyloaded_image_tag(image)
    html = raw("<div data-uncomment=true>")
    html += raw("<!-- #{image.to_s} -->")
    html += raw("</div>")
    html.html_safe
  end

end