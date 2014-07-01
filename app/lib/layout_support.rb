module LayoutSupport

  def layout_options
    {
      modern: {
        about:          true,
        ads_header:     false,
        ads_footer:     false,
        show_js:        true,
        languages:      true,
        nav_primary:    true,
        search:         true,
        nav_sitemap:    true,
        tynt:           false,
        user_nav:       true
      },
      india: {
        about:          false,
        ads_header:     false,
        ads_footer:     false,
        show_js:        false,
        languages:      true,
        nav_primary:    false,
        search:         false,
        nav_sitemap:    false,
        tynt:           true,
        user_nav:       false
      },
      cs: {
        about:          true,
        ads_header:     false,
        ads_footer:     false,
        show_js:        false,
        languages:      false,
        nav_primary:    true,
        search:         true,
        nav_sitemap:    false,
        tynt:           false,
        user_nav:       false
      },
      no_scripts: {
        about:          true,
        ads_header:     true,
        ads_footer:     false,
        show_js:        false,
        languages:      true,
        nav_primary:    true,
        search:         true,
        nav_sitemap:    true,
        tynt:           false,
        user_nav:       true
      }
    }
  end

end
