class GlobalResourcesController < GlobalController

  include SnippetSupport
  helper GlobalResourcesHelper

  layout nil

  def show
    render template_for(params[:snippet], params[:secure], params[:noscript], params[:cs], params[:legacystyle], params[:partner] ),  :locals => { :user_nav => user_nav?(params), :suppress_tynt => params[:suppress_tynt], :responsive => params[:responsive] }
  end

  def index
    render '/global-nav/index', :layout=> 'core',  :locals => { :user_nav => user_nav?(params) }
  end

  def modern
    render '/global-nav/modern', :layout=> false,  :locals => { :user_nav => true }
  end

  def partners
    render '/global-nav/partners', :layout=> false,  :locals => { :user_nav => user_nav?(params), :partner => params[:partner], :responsive => responsive?(params) }
  end

  def legacy
    render '/global-nav/legacy', :layout=> false,  :locals => { :user_nav => true }
  end

  def responsive
    render '/global-nav/responsive', :layout=> 'responsive'
  end

  def minimal
    render '/global-nav/minimal', :layout=> 'minimal'
  end

end
