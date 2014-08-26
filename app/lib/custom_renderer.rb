class CustomRenderer < Redcarpet::Render::HTML

  def header(text, header_level, section)
    "<h#{header_level} class='copy--h#{header_level}' id='#{text.downcase.split(" ").join("-")}'>#{text}</h#{header_level}>"
  end

  def block_code(code, language)
    "<pre class='styleguide copy--body language-#{language || 'ruby'}'>" +
      "<code>#{CGI.escapeHTML(code).strip}</code>" +
    "</pre>"
  end

end
