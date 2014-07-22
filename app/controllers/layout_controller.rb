class LayoutController < GlobalController

  layout nil

  include LayoutSupport

  def snippet
    render "custom_layouts/_#{params[:snippet]}", locals: get_layout_config(:"#{params[:route]}")
  end

  def preview
    render "custom_layouts/preview", locals: get_layout_config(:"#{params[:route]}")
  end

  def show_nav_section(section)
    (defined?(section) && section == true) || (!defined? section)
  end
  helper_method :show_nav_section

end
