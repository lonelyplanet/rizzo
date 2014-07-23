class GlobalResourcesController < GlobalController

  include LayoutSupport
  helper GlobalResourcesHelper

  layout nil

  def show
    render "custom_layouts/_#{params[:snippet]}", locals: get_layout_config(:"#{params[:route]}")
  end

  def legacy
    render '/global-nav/legacy', :layout=> false, locals: get_layout_config("legacy")
  end

end
