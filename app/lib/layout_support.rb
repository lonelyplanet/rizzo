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
      tynt:           false,
      user_nav:       true,
      responsive:     true
    }
  end

  def layout_options
    {
      india: {
        about:          false,
        ads_header:     false,
        include_js:     false,
        nav_primary:    false,
        search:         false,
        nav_sitemap:    false,
        user_nav:       false
      },
      cs: {
        ads_header:     false,
        include_js:     false,
        languages:      false,
        nav_sitemap:    false,
        user_nav:       false
      },
      modern: {
        responsive: false
      },
      noscript: {
        include_js: false
      },
      secure_noscript: {
        include_js: false
      },
      global: {
        tynt: true
      },
      client_solutions: {
        include_js: false,
        user_nav: false
      },
      styleguide: {
        tynt: true
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

end
