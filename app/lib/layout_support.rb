module LayoutSupport

  def layout_defaults
    {
      about:          true,
      ads_header:     true,
      ads_footer:     false,
      include_js:     true,
      languages:      true,
      omit_gtm_snippet: false,
      nav_primary:    true,
      search:         true,
      nav_sitemap:    true,
      user_nav:       true,
      responsive:     true,
      third_party:    false,
      legacy_lp:      false,
      app_core:       false,
      legacy_header:  false,
      default_title:  true
    }
  end

  def layout_options
    {
      india: {
        about:          false,
        ads_header:     true,
        include_js:     true,
        nav_primary:    false,
        search:         false,
        nav_sitemap:    false,
        user_nav:       false,
        third_party:    true,
        app_core:       true,
        default_title:  false,
        legacy_header:  true
      },
      modern: {
        app_core:       true,
        default_title:  false
      },
      external: {
        default_title:  false
      },
      responsive: {
        app_core:       true
      },
      noscript: {
        include_js:     false,
        legacy_lp:      true,
        responsive:     false,
        secure:         true
      },
      secure: {
        secure:         true,
        legacy_lp:      true,
        responsive:     false
      },
      secure_responsive: {
        secure:         true,
        legacy_lp:      true
      },
      client_solutions: {
        include_js:     false,
        user_nav:       false,
        nav_sitemap:    false,
        ads_header:     false
      },
      legacy: {
        secure:         true,
        responsive:     false,
        legacy_lp:      true
      },
      legacy_responsive: {
        secure:         true,
        legacy_lp:      true
      }
    }
  end

  def get_options_from_query_params(query_parameters)
    # only include key/value pair if key is present in query params
    # so as to not overwrite defaults/options when no query param was provided in the first place.
    # When present, these will overwrite both layout defaults & layout options.
    # Be sure to properly sanitize.
    {
      :omit_gtm_snippet => query_parameters.fetch("omit_gtm_snippet", "false").to_s == "true"
    }
    .select{ |key| query_parameters.key?(key.to_s) }
  end

  def get_layout_config(layout_type, query_parameters = {})
    layout_config = layout_defaults.clone
    if layout_options[:"#{layout_type}"]
      layout_config.merge!(layout_options[:"#{layout_type}"])
    end
    layout_config.merge(get_options_from_query_params(query_parameters))
  end

  def get_layout(route)
    if route == "responsive" || route == "minimal"
      return {
        layout: route,
        template: "layouts/examples/#{route}"
      }
    elsif route == "fixed-width"
      return {
        layout: 'responsive',
        template: "layouts/examples/responsive"
      }
    end

    {
      layout: false,
      template: "layouts/custom/preview"
    }
  end

end
