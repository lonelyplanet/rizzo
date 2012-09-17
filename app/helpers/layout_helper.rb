module LayoutHelper

  def secondary_nav_bar(args)
    render :partial=>'layouts/core_partials/secondary', :locals=>{:title=>args[:title], :collection=>args[:collection] || [], :current=> args[:current] || nil}
  end

end
