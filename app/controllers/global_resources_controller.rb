class GlobalResourcesController < GlobalController

  include SnippetSupport
  include LayoutSupport
  helper GlobalResourcesHelper

  layout nil

  def show
    render template_for(params[:snippet], params[:secure], params[:noscript], params[:cs], params[:legacystyle] ), locals: layout_defaults.merge(legacy_options[:"#{params[:route]}"])
  end

  def index
    render '/global-nav/index', :layout=> 'core', locals: layout_defaults.merge(legacy_options[:index]).merge({ user_nav: user_nav?(params)})
  end

  def modern
    render '/global-nav/modern', :layout=> false, locals: layout_defaults.merge(legacy_options[:modern])
  end

  def legacy
    render '/global-nav/legacy', :layout=> false, locals: layout_defaults.merge(legacy_options[:legacy])
  end

  def responsive
    render '/global-nav/responsive', :layout=> 'responsive', locals: layout_defaults.merge(legacy_options[:responsive])
  end

  def minimal
    render '/global-nav/minimal', :layout=> 'minimal', locals: layout_defaults.merge(legacy_options[:minimal])
  end

end
