class GlobalResourcesController < GlobalController
  
  include SnippetSupport
  helper GlobalResourcesHelper

  layout nil

  def show
    render template_for(params[:snippet], params[:secure], params[:noscript], params[:cs], params[:scope] || "legacy"),  :locals => { :user_nav => user_nav?(params), :suppress_tynt => params[:suppress_tynt] }
  end

  def index
    render '/global/index', :layout=> 'core',  :locals => { :user_nav => user_nav?(params) }
  end
  
  def legacy
    render '/global/legacy', :layout=> false,  :locals => { :user_nav => true }
  end

  def responsive
    render '/global/responsive', :layout=> 'responsive'
  end

end
