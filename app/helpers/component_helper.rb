module ComponentHelper

  def ui_component(slug, properties={})
    render "components/#{slug}", properties
  end

  def styleguide_component(slug, properties)
    card_style = properties.delete(:card_style)
    count = properties.delete(:count)
    full_width = properties.delete(:full_width)
    original_stub = properties.delete(:original_stub)

    item_class = full_width ? "styleguide-block__item" : "styleguide-block__item--left"
    item_class += card_style ? " card styleguide-block__item--card" : ""

    item_id = count ? "styleguide-block__item--#{count}" : ""

    capture_haml do
      haml_tag(:div, class: "styleguide-block#{item_id.present? ? ' styleguide__anchor' : ''}", id: item_id) do
        if item_id.present?
          haml_tag(:a, name: item_id, href: "##{item_id}", class: "icon--link--after icon--lp-blue--after")
        end
        haml_tag(:div, class: item_class) do
          haml_concat ui_component(slug, properties)
        end
        haml_concat render "styleguide/partials/description", component: slug, full_width: full_width, properties: original_stub ? original_stub : properties[:properties]
      end
    end
  end

end
