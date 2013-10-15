module StyleguideHelper

  def left_nav
    {
      groups: [
        {
          title: "Colours",
          items: [
            {
              name: "Design palette",
              path: "/styleguide/colours",
              extra_style: "nav__item--delimited"
            },
            {
              name: "UI Colours",
              path: "/styleguide/ui-colours",
              extra_style: "nav__item--delimited"
            }
          ]
        },
        {
          title: "Navigation",
          items: [
            {
              name: "Secondary Nav",
              path: "/styleguide/secondary-nav",
              extra_style: "nav__item--delimited"
            },
            {
              name: "Left Nav",
              path: "/styleguide/left-nav",
              extra_style: "nav__item--delimited"
            },
          ]
        },
        {
          title: "Components",
          items: [
            {
              name: "Cards",
              path: "/styleguide/cards",
              extra_style: "nav__item--delimited"
            },
            {
              name: "Buttons",
              path: "/styleguide/buttons",
              extra_style: "nav__item--delimited"
            },
            {
              name: "Typography",
              path: "/styleguide/typography",
              extra_style: "nav__item--delimited"
            },
            {
              name: "Page title",
              path: "/styleguide/page-title",
              extra_style: "nav__item--delimited"
            },
            {
              name: "Pagination",
              path: "/styleguide/pagination",
              extra_style: "nav__item--delimited"
            },
            {
              name: "Forms",
              path: "/styleguide/forms",
              extra_style: "nav__item--delimited"
            }
          ]
        },
        {
          title: "Thorntree",
          items: [
            {
              name: "Activity List",
              path: "/styleguide/activity_list",
              extra_style: "nav__item--delimited"
            }
          ]
        }
      ]
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

    item_class = full_width ? "styleguide-block__item" : "styleguide-block__item--left"
    item_class += card_style ? " card styleguide-block__item--card" : ""
    item_class += count ? " styleguide-block__item--#{count}" : ""

    capture_haml do
      haml_tag(:div, class: "styleguide-block") do
        haml_tag(:div, class: item_class) do
          haml_concat ui_component(path, properties)
        end
        haml_concat render "styleguide/partials/description", component: path, full_width: full_width, properties: original_stub ? original_stub : properties[:properties]
      end
    end

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