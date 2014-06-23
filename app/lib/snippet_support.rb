module SnippetSupport

  def template_for(snippet, secure=false, noscript=false, cs=false, legacystyle=false, partner=false)
    if secure
      "layouts/legacy/snippets/_secure_#{snippet}"
    elsif noscript
      "layouts/legacy/snippets/_noscript_#{snippet}"
    elsif cs
      "layouts/core/snippets/_cs_#{snippet}"
    elsif legacystyle
      "layouts/legacy/snippets/_#{snippet}"
    elsif partner
      "layouts/partners/#{partner}/_#{snippet}"
    else
      "layouts/core/snippets/_modern_#{snippet}"
    end
  end

  def user_nav?(args)
    if args[:displaySignonWidget] == 'false' || args[:user_nav] == 'false'
      false
    else
      true
    end
  end

  def responsive?(args)
    if args[:responsive] == 'false'
      false
    else
      true
    end
  end

end
