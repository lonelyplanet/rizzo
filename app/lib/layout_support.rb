module LayoutSupport

  def layout_defaults
    {
      about:          true,
      ads_header:     true,
      ads_footer:     false,
      include_js:     true,
      languages:      true,
      nav_primary:    true,
      search:         true,
      nav_sitemap:    true,
      tynt:           true,
      user_nav:       true,
      responsive:     true,
      third_party:    false,
      legacy_lp:      false,
      app_core:       false
    }
  end

  def layout_options
    {
      india: {
        about:          false,
        ads_header:     false,
        include_js:     true,
        nav_primary:    false,
        search:         false,
        nav_sitemap:    false,
        user_nav:       false,
        tynt:           false,
        third_party:    true,
        app_core:       true
      },
      modern: {
        responsive:     false,
        app_core:       true
      },
      noscript: {
        include_js:     false,
        tynt:           false,
        legacy_lp:      true
      },
      secure: {
        tynt:           false,
        secure:         true,
        legacy_lp:      true
      },
      secure_noscript: {
        include_js:     false,
        tynt:           false,
        legacy_lp:      true,
        secure:         true
      },
      secure: {
        tynt: false
      },
      global: {
        tynt:           true
      },
      client_solutions: {
        include_js:     false,
        user_nav:       false,
        nav_sitemap:    false
      },
      styleguide: {
        tynt:           false
      },
      legacy: {
        responsive:     false,
        legacy_lp:      true
      }
    }
  end

  def get_layout_config(layout_type)
    if layout_options[:"#{layout_type}"]
      layout_defaults.merge(layout_options[:"#{layout_type}"])
    else
      layout_defaults
    end
  end

  def get_layout(route)
    if route == "core" ||  route == "responsive" || route == "minimal"
      return {
        layout: route,
        template: "/global-nav/#{route}"
      }
    end
    {
      layout: false,
      template: "custom_layouts/preview"
    }
  end

end
