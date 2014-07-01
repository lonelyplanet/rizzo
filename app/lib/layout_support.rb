module LayoutSupport

  def layout_options
    {
      modern: {
        no_scripts: false,
        suppress_tynt: false
      },
      india: {
        user_nav: false,
        search: false,
        menu: false,
        no_scripts: false,
        suppress_tynt: false,
        ads: false

      },
      france: {
        search: true
      }
    }
  end

end
