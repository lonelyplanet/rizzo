class LayoutController < GlobalController

  layout nil

  include LayoutSupport

  def snippet
    render "custom/_#{params[:snippet]}", :locals => { :options => layout_options[:"#{params[:route]}"] }
  end

  def preview
    render "custom/preview", :locals => { :options => layout_options[:"#{params[:route]}"] }
  end

end
