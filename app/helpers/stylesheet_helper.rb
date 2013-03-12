module StylesheetHelper

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
end

