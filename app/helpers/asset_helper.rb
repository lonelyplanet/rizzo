module AssetHelper

  def smart_stylesheet(stylesheet)
    result = ''
    result += raw("<!--[if (gt IE 8) | (IEMobile)]><!-->")
    result += stylesheet_link_tag "#{stylesheet}", :media => "all"
    result += raw("<!--<![endif]-->")
    result += raw("<!--[if (lt IE 9) & (!IEMobile)]>")
    result += stylesheet_link_tag "#{stylesheet}_ie", :media => "all"
    result += raw("<![endif]-->")
    result.html_safe
  end

  def static_ui_stylesheet (stylesheet, secure)
    if secure
      path = "https://secure.lonelyplanet.com/static-ui/style/#{stylesheet}.css"
    else
      path = "http://static.lonelyplanet.com/static-ui/style/#{stylesheet}.css"
    end
    capture_haml do
      haml_tag(:link, href: "#{path}", media: "screen,projection", rel: 'stylesheet')
    end
  end

  def static_ui_script (script, secure)
    if secure
      path = "https://secure.lonelyplanet.com/static-ui/js/#{script}.js"
    else
      path = "http://static.lonelyplanet.com/static-ui/js/#{script}.js"
    end
    capture_haml do
      haml_tag(:script, src: "#{path}")
    end
  end

  def safe_image_tag(image_url, opts={})
    return if image_url.blank?
    image_tag(image_url, opts)
  end

end

