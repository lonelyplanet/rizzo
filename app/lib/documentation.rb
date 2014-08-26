class Documentation < RizzoApp

  # Monkey patched until the styleguide uses dir globbing for navs
  def left_nav_items
    items = left_nav.map{|i| i[:active] = (i[:slug] == @path) ? true : false; i}
    { groups: [ { items: items } ] }
  end

  private

  def root
    "/documentation"
  end

  def docs_root
    "app/docs"
  end

  def format_title(title)
    format_path(title, "#{docs_root}/").gsub("-", " ").capitalize
  end

  def format_path(path, root = "")
    path.sub(root, "").sub(".md", "")
  end

  def first_item(section)
    Dir["#{section}/*"][0]
  end

  def left_nav
    path = "#{docs_root}/#{active_section[:slug].match(/[^\/]+/)[0]}/"
    Dir["#{path}*"].map do |subsection|
      subsection = format_path(subsection, path)
      {
        name: format_title(subsection),
        slug: "#{root}#{active_section[:section_slug]}/#{subsection}"
      }
    end
  end

  def sections
    promote_sections( Dir["#{docs_root}/**"].map do |section|
      {
        title: format_title(section),
        slug: format_path(first_item(section), docs_root),
        section_slug: format_path(section, docs_root)
      }
    end)
  end

  def promote_sections(unordered_sections, ordered_sections = [])
    ["General", "Css", "Js"].each do |promoted|
      parts = unordered_sections.partition{|hash| hash[:title] == promoted}
      ordered_sections.push(parts[0])
      unordered_sections = parts[1]
    end
    ordered_sections.flatten + unordered_sections
  end

end
