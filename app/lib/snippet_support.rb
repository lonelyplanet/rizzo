module SnippetSupport

  def template_for(snippet, secure=false, noscript=false, cs=false, scope="legacy")
    if secure
      "layouts/legacy/snippets/_secure_#{snippet}"
    elsif noscript
      "layouts/legacy/snippets/_noscript_#{snippet}"
    elsif cs
      "layouts/core/snippets/_cs_#{snippet}"
    else
      "layouts/#{scope}/snippets/_#{snippet}"
    end
  end

  def user_nav?(args)
    if args[:displaySignonWidget] == 'false' || args[:user_nav] == 'false'
      false
    else
      true
    end
  end

end
