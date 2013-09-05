class GlobalResourcesController < GlobalController

  include SnippetSupport
  helper GlobalResourcesHelper

  layout nil

  def show
    render template_for(params[:snippet], params[:secure], params[:noscript], params[:cs], params[:scope] || "legacy"),  :locals => { :user_nav => user_nav?(params), :suppress_tynt => params[:suppress_tynt] }
  end

  def index
    render '/global-nav/index', :layout=> 'core',  :locals => { :user_nav => user_nav?(params) }
  end

  def legacy
    render '/global-nav/legacy', :layout=> false,  :locals => { :user_nav => true }
  end

  def responsive
    render '/global-nav/responsive', :layout=> 'responsive'
  end

  def homepage
    render '/global-nav/homepage', :layout=> 'homepage'
  end

  def styleguide
    render '/styleguide/index', :layout=> 'styleguide'
  end

end
