module StyleguideHelper

  def sections
    # Add new sections here.
    ["JS Components", "UI Components"]
  end

  def default_section
    "UI Components"
  end

  def left_nav
    # NB! The below line is required for our yeoman generator and should not be changed.
    #===== yeoman begin-hook =====#
    {
      js_components: [
        {
          title: "Utils",
          items: [
            {
              name: "Toggle Active",
              path: "toggle-active"
            },
            {
              name: "Proximity Loader",
              path: "proximity-loader"
            },
            {
              name: "Asset Reveal",
              path: "asset-reveal"
            },
            {
              name: "Image Helper",
              path: "image-helper"
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
              path: "colours"
            },
            {
              name: "UI Colours",
              path: "ui-colours"
            },
            {
              name: "Icons",
              path: "icons"
            },
            {
              name: "Typography",
              path: "typography"
            }
          ]
        },
        {
          title: "Navigation",
          items: [
            {
              name: "Dropdown",
              path: "navigational_dropdown"
            },
            {
              name: "Left Nav",
              path: "left-nav"
            },
            {
              name: "Secondary Nav",
              path: "secondary-nav"
            }
          ]
        },
        {
          title: "Helpers",
          items: [
            {
              name: "Proportional Grid",
              path: "proportional-grid"
            },
            {
              name: "Cards Grid",
              path: "cards-grid"
            }
          ]
        },
        {
          title: "Form Elements",
          items: [
            {
              name: "Inputs",
              path: "inputs"
            },
            {
              name: "Dropdown",
              path: "dropdown"
            },
            {
              name: "Slider",
              path: "slider"
            },
          ]
        },
        {
          title: "Components",
          items: [
            {
              name: "Alerts",
              path: "alerts"
            },
            {
              name: "Badges",
              path: "badges"
            },
            {
              name: "Buttons",
              path: "buttons"
            },
            {
              name: "Cards",
              path: "cards"
            },
            {
              name: "Page title",
              path: "page-title"
            },
            {
              name: "Pagination",
              path: "pagination"
            },
            {
              name: "Tags",
              path: "tags"
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
    preceding_slug = (active_section == default_section) ? "/styleguide/" : "/styleguide/#{active_section}/"

    active_left_nav[:groups] = left_nav[:"#{active_section.downcase.gsub(/[ -]/, "_")}"].map do |group|
      group[:items].map do |item|
        item[:path] = "#{preceding_slug}#{item[:path]}"
        item[:active] = (item[:path] == request.path) ? true : false
        item
      end
      group
    end
    active_left_nav
  end

  def active_section
    # Check whether any of the sections above are currently in the url.
    section_from_slug = request.fullpath.match(/styleguide\/([^\/]+)/)

    if section_from_slug && (sections.map {|s| s.downcase.strip.gsub(' ', '-') }.include? section_from_slug[1])
      section_from_slug[1]
    else
      default_section
    end
  end

  def secondary_nav_items
    {
      section_name: active_section,
      items: sections.map do |s|
          {
            title: s,
            slug: s == default_section ? '/styleguide' : '/styleguide/'+s.downcase.strip.gsub(' ', '-')
          }
        end
    }
  end

  def ad_config
    {hints: "", channels: ""}
  end

  def ui_component(path, properties={})
    render "components/#{path}", properties
  end

  def sg_component(path, properties)
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
          haml_concat ui_component(path, properties)
        end
        haml_concat render "styleguide/partials/description", component: path, full_width: full_width, properties: original_stub ? original_stub : properties[:properties]
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

  def get_luminance(hex)
    hex = "#{hex}#{hex.match(/[0-9A-Fa-f]{3}/)[0]}" if hex.length < 7
    rgb = hex.scan(/[0-9A-Fa-f]{2}/).collect { |i| i.to_i(16) }
    (0.2126*rgb[0]) + (0.7152*rgb[1]) + (0.0722*rgb[2])
  end

end
