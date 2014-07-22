class GlobalResourcesController < GlobalController

  include SnippetSupport
  include LayoutSupport
  helper GlobalResourcesHelper

  layout nil

  def show
    render template_for(params[:snippet], params[:secure], params[:noscript], params[:cs], params[:legacystyle] ), locals: get_layout_config(:"#{params[:route]}")
  end

  def index
    render '/global-nav/index', :layout=> 'core', locals: get_layout_config(:index)
  end

  def modern
    render '/global-nav/modern', :layout=> false, locals: get_layout_config(:modern)
  end

  def legacy
    render '/global-nav/legacy', :layout=> false, locals: get_layout_config(:legacy)
  end

  def responsive
    render '/global-nav/responsive', :layout=> 'responsive', locals: get_layout_config(:responsive)
  end

  def minimal
    render '/global-nav/minimal', :layout=> 'minimal', locals: get_layout_config(:minimal)
  end

end
