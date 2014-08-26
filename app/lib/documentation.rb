class Documentation < RizzoApp

  set_root("/documentation")

  DOCS_ROOT = "app/docs"

  # Monkey patched until the styleguide uses dir globbing for navs
  def left_nav_items
    { groups: [ { items: left_nav } ] }
  end

  private

  def format_title(title)
    format_path(title, "#{DOCS_ROOT}/").gsub("-", " ").capitalize
  end

  def format_path(path, root = "")
    path.sub(root, "").sub(".md", "")
  end

  def first_item(section)
    Dir["#{section}/*"][0]
  end

  def left_nav
    path = filesystem_path(active_section[:slug])
    Dir["#{path}*"].map do |subsection|
      subsection = format_path(subsection, path)
      subsection_slug = "#{root}#{active_section[:section_slug]}/#{subsection}"
      {
        name: format_title(subsection),
        slug: subsection_slug,
        active: subsection_slug == @path
      }
    end
  end

  def sections
    promote_sections( Dir["#{DOCS_ROOT}/*"].map do |section|
      {
        title: format_title(section),
        slug: format_path(first_item(section), DOCS_ROOT),
        section_slug: format_path(section, DOCS_ROOT)
      }
    end)
  end

  def promote_sections(unordered_sections, ordered_sections = [])
    ["general", "css", "js"].each do |promoted|
      ordered, unordered = unordered_sections.partition{|h| h[:title].downcase == promoted}
      ordered_sections.push(ordered)
      unordered_sections = unordered
    end
    ordered_sections.flatten + unordered_sections
  end

  def filesystem_path(section)
    "#{DOCS_ROOT}/#{section.match(/[^\/]+/)[0]}/"
  end

end
