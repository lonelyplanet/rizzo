class GlobalResourcesController < GlobalController

  include SnippetSupport
  include LayoutSupport
  helper GlobalResourcesHelper

  layout nil

  def show
    render template_for(params[:snippet], params[:secure], params[:noscript], params[:cs], params[:legacystyle] ), locals: get_layout_config(:"#{params[:route]}")
  end

  def legacy
    render '/global-nav/legacy', :layout=> false, locals: get_layout_config("legacy")
  end

end
