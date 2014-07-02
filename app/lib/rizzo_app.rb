class RizzoApp

  def initialize(path)
    @path = path
  end

  def page_title
    {
      title: active_section[:title],
      is_body_title: true,
      icon: "housekeeping"
    }
  end

  def primary_nav_items
    @primary_nav_items ||= (YAML.load(File.read(File.expand_path('../../data/primary_nav.yml', __FILE__))))
  end

  def secondary_nav_items
    {
      items: sections.map do |section|
        {
          title: section[:title],
          slug: "#{root}#{section[:slug]}",
          current: section[:title] == active_section[:title]
        }
      end
    }
  end

  def left_nav_items
    active_left_nav = {}
    preceding_slug = "#{root}#{active_section[:slug]}/"
    active_left_nav[:groups] = left_nav[:"#{active_section[:slug].gsub(/^\//, "").gsub(/[ -]/, "_")}"].map do |group|
      group[:items].map do |item|
        item[:slug] = "#{preceding_slug}#{item[:slug]}"
        item[:active] = (item[:slug] == @path) ? true : false
        if item[:name] == "Konami"
          item[:extra_style] = "nav--left__item--konami"
        end
        item
      end
      group
    end
    active_left_nav
  end

  private

  def active_section
    section_from_slug = @path.match(/(performance|styleguide)\/([^\/]+)/)
    section_from_slug && sections.map do |section|
      if section[:slug].include? section_from_slug[2]
        return section
      end
    end
    sections[0]
  end

end
