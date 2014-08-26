class RizzoApp

  def initialize(path)
    @path = path
    @page_hopper_sections = flatten_page_hopper_sections
  end

  def page_title
    {
      title: active_section[:title],
      is_body_title: true,
      icon: "housekeeping"
    }
  end

  def primary_nav_items
    @primary_nav_items ||= (YAML.load(File.read(File.expand_path('../../data/styleguide/primary_nav.yml', __FILE__))))
  end

  def secondary_nav_items
    {
      items: sections.map do |section|
        {
          title: section[:title],
          slug: "#{root}#{section[:slug]}",
          current: section[:title] == active_section[:title],
          submenu: section[:submenu]
        }
      end
    }
  end

  def left_nav_items
    @left_nav ||= build_left_nav
  end

  def build_left_nav
    active_left_nav = {}
    preceding_slug = "#{root}#{active_section[:slug]}/"
    section_items = left_nav[:"#{active_section[:slug].gsub(/^\//, "").gsub(/[ -]/, "_")}"]
    if section_items
      active_left_nav[:groups] = section_items.map do |group|
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
    end
    active_left_nav
  end

  def page_hopper_sections
    { sections: @page_hopper_sections }
  end

  private

  def active_section
    section_from_slug = @path.match(/(performance|styleguide|documentation)\/([^\/]+)/)
    section_from_slug && sections.map do |section|
      if section[:slug].include? section_from_slug[2]
        return section
      end
    end
    sections[0]
  end

  def flatten_page_hopper_sections
    converted_sections = flatten_page_hopper_section(sg_sections[:left_nav])

    converted_sections.push({ title: "Style Guide", slug: "/styleguide" })
    converted_sections.push({ title: "Performance Monitoring", slug: "/performance" })

    converted_sections.concat flatten_page_hopper_section(sg_sections[:secondary_nav])
  end

  def flatten_page_hopper_section section
    section.inject([]) do |result, (k,v)|
      styleguide_slug = k.to_s
      v.each do |k2,v2|
        group_slug = k2.to_s.gsub('_', '-')

        if v2.nil?
          result << { title: "#{k2[:title]}", slug: File.join('', styleguide_slug, k2[:slug]) }
        else
          v2.each do |h|
            group_title = h[:title]
            h[:items].each do |h2|
              result << { title: "#{group_title} - #{h2[:name]}", slug: File.join('', styleguide_slug, group_slug, h2[:slug]) }
            end
          end
        end
      end

      result
    end
  end

  def sg_sections
    @sg_sections ||= {
      left_nav: {
        styleguide: load_yaml_file('data/styleguide/left_nav'),
        performance: load_yaml_file('data/performance-monitoring/left_nav')
      },
      secondary_nav: {
        styleguide: load_yaml_file('data/styleguide/secondary_nav'),
        performance: load_yaml_file('data/performance-monitoring/secondary_nav')
      }
    }
  end

  def load_yaml_file(relative_path)
    YAML.load_file(File.expand_path("../../#{relative_path}.yml", __FILE__))
  end

end
