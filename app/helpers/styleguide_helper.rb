module StyleguideHelper

  def root
    "/styleguide"
  end

  def sections
    # Add new sections here.
    [
      {
        title: "UI Components",
        slug: "/ui-components"
      },
      {
        title: "JS Components",
        slug: "/js-components"
      },
      {
        title: "CSS Utilities",
        slug: "/css-utilities"
      }
    ]
  end

  def default_section
    sections[0]
  end

  def left_nav
    # NB! The below line is required for our yeoman generator and should not be changed.
    #===== yeoman begin-hook =====#
    {
      css_utilities: [
        {
          title: "Classes",
          items: [
            {
              name: "General",
              slug: "utility-classes"
            },
            {
              name: "Legacy Support",
              slug: "legacy"
            },
            {
              name: "No Javascript",
              slug: "no-js"
            },
            {
              name: "LP Specific",
              slug: "lp-specific-classes"
            },
            {
              name: "Responsive",
              slug: "responsive"
            }
          ]
        },
        {
          title: "Placeholders",
          items: [
            {
              name: "General",
              slug: "utility-placeholders"
            },
            {
              name: "LP Specific",
              slug: "lp-specific-placeholders"
            },
            {
              name: "Icons",
              slug: "icon-placeholders"
            }
          ]
        },
        {
          title: "Mixins",
          items: [
            {
              name: "Responsive",
              slug: "responsive-mixins"
            },
            {
              name: "Utility Mixins",
              slug: "utility-mixins"
            },
            {
              name: "Media",
              slug: "media-mixins"
            }
          ]
        }
      ],
      js_components: [
        {
          title: "Utils",
          items: [
            {
              name: "Toggle Active",
              slug: "toggle-active"
            },
            {
              name: "Proximity Loader",
              slug: "proximity-loader"
            },
            {
              name: "Asset Reveal",
              slug: "asset-reveal"
            },
            {
              name: "Image Helper",
              slug: "image-helper"
            },
            {
              name: "Konami",
              path: "konami"
            },
            {
              name: "Lightbox",
              slug: "lightbox"
            },
            {
              name: "Template",
              slug: "template"
            }
          ]
        }
      ],
      ui_components: [
        {
          title: "Design",
          items: [
            {
              name: "Design palette",
              slug: "colours"
            },
            {
              name: "UI Colours",
              slug: "ui-colours"
            },
            {
              name: "Icons",
              slug: "icons"
            },
            {
              name: "Typography",
              slug: "typography"
            }
          ]
        },
        {
          title: "Navigation",
          items: [
            {
              name: "Dropdown",
              slug: "navigational_dropdown"
            },
            {
              name: "Left Nav",
              slug: "left-nav"
            },
            {
              name: "Secondary Nav",
              slug: "secondary-nav"
            }
          ]
        },
        {
          title: "Helpers",
          items: [
            {
              name: "Proportional Grid",
              slug: "proportional-grid"
            },
            {
              name: "Cards Grid",
              slug: "cards-grid"
            }
          ]
        },
        {
          title: "Form Elements",
          items: [
            {
              name: "Inputs",
              slug: "inputs"
            },
            {
              name: "Dropdown",
              slug: "dropdown"
            },
            {
              name: "Range Slider",
              slug: "range-slider"
            }
          ]
        },
        {
          title: "Components",
          items: [
            {
              name: "Ad units",
              slug: "ad-units"
            },
            {
              name: "Alerts",
              slug: "alerts"
            },
            {
              name: "Badges",
              slug: "badges"
            },
            {
              name: "Buttons",
              slug: "buttons"
            },
            {
              name: "Cards",
              slug: "cards"
            },
            {
              name: "Tiles",
              path: "tiles"
            },
            {
              name: "Forms",
              path: "forms"
            },
            {
              name: "Page title",
              slug: "page-title"
            },
            {
              name: "Pagination",
              slug: "pagination"
            },
            {
              name: "Tags",
              slug: "tags"
            },
            {
              name: "Tooltips",
              slug: "tooltips"
            }
          ]
        }
      ]
    }
    #===== yeoman end-hook =====#
    # NB! The above line is required for our yeoman generator and should not be changed.
  end

  def left_nav_items
    active_left_nav = {}
    preceding_slug = "#{root}#{active_section[:slug]}/"
    active_left_nav[:groups] = left_nav[:"#{active_section[:slug].gsub(/^\//, "").gsub(/[ -]/, "_")}"].map do |group|
      group[:items].map do |item|
        item[:slug] = "#{preceding_slug}#{item[:slug]}"
        item[:active] = (item[:slug] == request.path) ? true : false
        if item[:name] == "Konami"
          item[:extra_style] = "nav--left__item--konami"
        end
        item
      end
      group
    end
    active_left_nav
  end

  def active_section
    # Check whether any of the sections above are currently in the url.
    section_from_slug = request.fullpath.match(/styleguide\/([^\/]+)/)
    section_from_slug && sections.map do |section|
      if section[:slug].include? section_from_slug[1]
        return section
      end
    end
    default_section
  end


  def page_title
    {
      title: active_section[:title],
      is_body_title: true,
      icon: "housekeeping"
    }
  end

  def secondary_nav_items
    {
      section_name: active_section[:title],
      items: sections.map do |section|
        {
          title: section[:title],
          slug: "#{root}#{section[:slug]}"
        }
      end
    }
  end

  def ui_component(slug, properties={})
    render "components/#{slug}", properties
  end

  def sg_component(slug, properties)
    card_style = properties.delete(:card_style)
    count = properties.delete(:count)
    full_width = properties.delete(:full_width)
    original_stub = properties.delete(:original_stub)
    anchor = properties.delete(:anchor)

    item_class = full_width ? "styleguide-block__item" : "styleguide-block__item--left"
    item_class += card_style ? " card styleguide-block__item--card" : ""
    item_class += count ? " styleguide-block__item--#{count}" : ""

    capture_haml do
      haml_tag(:div, class: "styleguide-block#{anchor.nil? ? '' : ' styleguide__anchor'}", id: anchor) do
        unless anchor.nil?
          haml_tag(:a, name: anchor, href: "##{anchor}", class: "icon--link icon--lp-blue")
        end
        haml_tag(:div, class: item_class) do
          haml_concat ui_component(slug, properties)
        end
        haml_concat render "styleguide/partials/description", component: slug, full_width: full_width, properties: original_stub ? original_stub : properties[:properties]
      end
    end

  end

  def get_icons(type)
    icons = []
    Dir["app/assets/images/icons/#{type}/*.svg"].each do |file_name|
      class_name = 'icon--' + File.basename(file_name, '.svg')
      icons.push(class_name)
    end
    icons
  end

  def description_from_snippet(snippet)
    decorated_snippet = {}
    snippet.split(/\[\/doc\]/).each_with_index do |section, index|
      if index == 0
        decorated_snippet[:title] = section.split("\n//\n// ").delete_if(&:empty?).first.gsub("\n//", "")
        decorated_snippet[:description] = section.split("\n//\n// ").delete_if(&:empty?)[1..-1].map do |line|
          line.gsub("\n//", "")
        end
      else
        decorated_snippet[:snippet] = section.split("\n").delete_if(&:empty?).delete_if do |line|
          line.index("//") == 0
        end[0].gsub("@mixin ", "+")
      end
    end
    decorated_snippet[:syntax_lang] = "sass"
    decorated_snippet
  end

  def get_css(file)
    sass = File.read(File.expand_path("../../assets/stylesheets/#{file}.sass", __FILE__))
    decorated_snippets = []
    sass.split(/\[doc\]/).each do |snippet|
      decorated_snippets.push(description_from_snippet(snippet)) unless snippet.index("//") == 0
    end
    decorated_snippets
  end

  def get_colours(file)
    colours = File.read(File.expand_path("../../assets/stylesheets/sass/variables/#{file}.sass", __FILE__))
    colours = colours.split("// -----------------------------------------------------------------------------\n")
    colours.delete_if(&:empty?)
    groups = []
    counter = -1

    colours.each do |section|
      if section[0..1] == "//"
        groups.push({title: section})
        counter = counter + 1
      else
        groups[counter][:body] = section
      end
    end
    groups
  end

  def extract_colour(contents, variable)
    matches = contents.match(/(#{Regexp.escape(variable)})\s*:\s*(#[a-fA-F0-9]{3,6})\s*(!default)?/)
    matches ? matches[2] : matches
  end

  def extract_variable(line)
    matches = line.match(/(\$[0-9a-zA-Z_-]+)\s*(!default)?/)
    matches ? matches[1] : matches
  end

  def get_colour_value(value, ref)
    @ref_colours ||= File.read(File.expand_path("../../assets/stylesheets/sass/variables/#{ref}.sass", __FILE__))

    variable = extract_variable(value)

    if variable
      value = extract_colour(@ref_colours, variable)
    end

    value
  end

  def get_luminance(hex)
    hex = "#{hex}#{hex.match(/[0-9A-Fa-f]{3}/)[0]}" if hex.length < 7
    rgb = hex.scan(/[0-9A-Fa-f]{2}/).collect { |i| i.to_i(16) }
    (0.2126*rgb[0]) + (0.7152*rgb[1]) + (0.0722*rgb[2])
  end

end
