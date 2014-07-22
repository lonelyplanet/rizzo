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
      default: {
        # defaults only
      },
      india: {
        about:          false,
        ads_header:     false,
        include_js:        false,
        nav_primary:    false,
        search:         false,
        nav_sitemap:    false,
        tynt:           true,
        user_nav:       false
      },
      cs: {
        ads_header:     false,
        include_js:        false,
        languages:      false,
        nav_sitemap:    false,
        user_nav:       false
      },
      responsive: {
        # defaults only
      },
      global: {
        # defaults only
      }
    }
  end

  def legacy_options
    {
      index: {
        # defaults
      },
      modern: {
        responsive: false
      },
      legacy: {
        # defaults
      },
      responsive: {
        # defaults
      },
      minimal: {
        # defaults
      },
      noscript: {
        include_js: false
      },
      secure: {
        # defaults
      },
      secure_noscript: {
        include_js: false
      },
      global: {
        tynt: true
      },
      client_solutions: {
        include_js: false
      },
      styleguide: {
        tynt: true
      }
    }
  end

end
