module LayoutSupport

  def layout_defaults
    {
      about:          true,
      ads_header:     true,
      ads_footer:     false,
      include_js:        true,
      languages:      true,
      nav_primary:    true,
      search:         true,
      nav_sitemap:    true,
      tynt:           false,
      user_nav:       true
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

end
