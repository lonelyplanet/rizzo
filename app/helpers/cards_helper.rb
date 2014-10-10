module CardsHelper

  def card_classes(props, variation=nil)
    class_names = [
      "card",
      "js-card",
      "card--#{props[:kind]}",
      "card--#{props[:short?] ? 'short' : 'tall'}",
      "card--#{props[:fixed?] ? 'fixed' : 'flexible'}",
      "card--#{props[:cover?] ? 'cover' : 'standard'}",
      "card--#{props[:double?] ? 'double' : 'single'}",
      "card--#{props[:image_url].present? ? 'has-img' : 'no-img'}",
      "card--#{props[:tags].present? || props[:price_tag].present? ? 'has-tags' : 'no-tags'}",
      "card--#{props[:button_text] || props[:author_name] || props[:post_date] || (variation == :simple && props[:context_locale]) ? 'has-footer' : 'no-footer'}"
    ]

    class_names.push("card--variation--#{variation}") if variation

    class_names
  end

  def card_href_for_test_variation(props, variation=nil)
    url = props[:url]

    if url.present? && variation.present?
      url += "#{props[:url].match(/\?/) ? '&' : '?'}abv=#{variation}"
    end

    url
  end

  def card_ab_test_variation(params)
    params[:ab_test_simplified_cards] if params.present?
  end

  def card_link_data(props)
    card_tracking_data(props).merge(card_layer_data(props))
  end

  def card_tracking_data(props)
    return {} unless props[:tracking].present?
    {
      lpa_category: props[:tracking][:category],
      lpa_action: props[:tracking][:action],
      lpa_label: props[:tracking][:label]
    }
  end

  def card_layer_data(props)
    return {} unless props[:layer?]
    {
      lightbox: {
        showpreloader: 'true',
        class: 'lightbox--layer'
      }
    }
  end

  def card_from_widget_data(data, index)
    {
      fixed?: true,
      cover?: true,
      short?: index > 2,
      double?: index.zero?,
      kind: 'flickr',
      url: data[:url],
      title: data[:image_title],
      image_url: data[:image_url],
      image_alt: data[:image_title],
      author_name: data[:owner_name],
      author_avatar: data[:owner_image],
      tags: { position: index + 1 }
    }
  end

  def card_icon(props)
    props[:kind] == 'need-to-know' ? 'information' : props[:kind]
  end

  def card_link_if(condition, *props)
    if condition
      haml_tag(:a, *props){ yield }
    else
      yield
    end
  end

  def card_datetime(date_str)
    date_str.to_date.strftime("%d %B %Y")
  end

end
