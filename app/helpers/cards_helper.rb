module CardsHelper

  def card_classes(props, variation=nil)
    [
      "card",
      "js-card",
      "card--#{props[:kind]}",
      "card--#{props[:short?] ? 'short' : 'tall'}",
      "card--#{props[:fixed?] ? 'fixed' : 'flexible'}",
      "card--#{props[:cover?] ? 'cover' : 'standard'}",
      "card--#{props[:double?] ? 'double' : 'single'}",
      "card--#{props[:image_url].present? ? 'has-img' : 'no-img'}",
      "card--#{props[:price_tag].present? ? 'has-price' : 'no-price'}",
      "card--#{props[:author_name].present? || props[:context_locale].present? || card_ab_test_show_tag(props, variation) ? 'has-footer' : 'no-footer'}"
    ]
  end

  def card_ab_test_variation(params)
    params[:ab_test_reviewed_tag] if params.present?
  end

  def card_ab_test_show_tag(props, variation)
    variation == :with_reviewed_tag && props[:tags].present? && props[:tags][:lp_reviewed?]
  end

  def card_href_for_test_variation(props, variation=nil)
    url = props[:url]

    if url.present? && variation
      url += "#{props[:url].match(/\?/) ? '&' : '?'}rte=#{variation}"
    end

    url
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

  def card_grid_helper(card_index=0, is_double=false, is_mpu=false, grid_columns=5, reset=false)
    class_str = ['col--one-whole']

    @grid_helper_doubles = 0 if card_index == 0 || reset
    @grid_helper_doubles += 1 if is_double

    if is_double || is_mpu
      class_str << 'col--right' if is_mpu
      class_str << 'mv--col--two-thirds' if grid_columns >= 3
      class_str << 'lv--col--one-half' if grid_columns >= 4
      class_str << 'wv--col--two-fifths' if grid_columns >= 5
    else
      class_str << 'nv--col--one-half' if grid_columns >= 2
      class_str << 'mv--col--one-third' if grid_columns >= 3
      class_str << 'lv--col--one-quarter' if grid_columns >= 4
      class_str << 'wv--col--one-fifth' if grid_columns >= 5
    end

    position_index = card_index + @grid_helper_doubles

    if card_index > 0
      class_str << 'nv--clear' if position_index % 2 == 0 && grid_columns >= 2
      class_str << 'mv--clear' if position_index % 3 == 0 && grid_columns >= 3
      class_str << 'lv--clear' if position_index % 4 == 0 && grid_columns >= 4
      class_str << 'wv--clear' if position_index % 5 == 0 && grid_columns >= 5
    end

    class_str
  end

end
