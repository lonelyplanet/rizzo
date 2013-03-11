class GlobalResourcesController < GlobalController
  
  include SnippetSupport
  helper GlobalResourcesHelper

  layout nil

  def show
    render template_for(params[:snippet], params[:secure], params[:noscript], params[:layout] == 'legacy' ? 'legacy' : 'core' ),  :locals => { :user_nav => user_nav?(params) }
  end

  def index
    render '/global/index', :layout=>params[:layout] == 'legacy' ? 'legacy' : 'core',  :locals => { :user_nav => user_nav?(params) }
  end

end
