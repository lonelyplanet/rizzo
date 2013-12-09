module StyleguideHelper

  def left_nav
    # NB! The below line is required for our yeoman generator and should not be changed.
    #===== yeoman begin-hook =====#
    {
      groups: [
        {
          title: "Colours",
          items: [
            {
              name: "Design palette",
              path: "/styleguide/colours"
            },
            {
              name: "UI Colours",
              path: "/styleguide/ui-colours"
            }
          ]
        },
        {
          title: "Icons",
          items: [
            {
              name: "Active",
              path: "/styleguide/active-icons"
            },
            {
              name: "Inactive",
              path: "/styleguide/inactive-icons"
            }
          ]
        },
        {
          title: "Navigation",
          items: [
            {
              name: "Dropdown",
              path: "/styleguide/navigational_dropdown"
            },
            {
              name: "Left Nav",
              path: "/styleguide/left-nav"
            },
            {
              name: "Secondary Nav",
              path: "/styleguide/secondary-nav"
            }
          ]
        },
        {
          title: "Helpers",
          items: [
            {
              name: "Proportional Grid",
              path: "/styleguide/proportional-grid"
            },
            {
              name: "Cards Grid",
              path: "/styleguide/cards-grid"
            }
          ]
        },
        {
          title: "Components",
          items: [
            {
              name: "Badges",
              path: "/styleguide/badges"
            },
            {
              name: "Buttons",
              path: "/styleguide/buttons"
            },
            {
              name: "Cards",
              path: "/styleguide/cards"
            },
            {
              name: "Forms",
              path: "/styleguide/forms"
            },
            {
              name: "Page title",
              path: "/styleguide/page-title"
            },
            {
              name: "Pagination",
              path: "/styleguide/pagination"
            },
            {
              name: "Typography",
              path: "/styleguide/typography"
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
    active_left_nav[:groups] = left_nav[:groups].map do |group|
      group[:items].map do |item|
        item[:active] = item[:path] == request.path ? true : false
        item
      end
      group
    end
    active_left_nav
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
          haml_tag(:a, name: anchor, href: "##{anchor}")
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
    File.read(File.expand_path("../../assets/stylesheets/icons/#{type}.svg.css", __FILE__)).split(/}/).each do |rule|
      class_name = rule.match(/^\.([^:, ]*)/)
      class_name && icons.push(class_name[1])
    end
    icons
 end

  def get_colours(file)
    colours = File.read(File.expand_path("../../assets/stylesheets/_variables/#{file}.sass", __FILE__))
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
