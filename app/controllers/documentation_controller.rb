class DocumentationController < ApplicationController

  include LayoutSupport
  require "document_db"

  layout "styleguide"

  before_action :setup

  def setup
    @app = Documentation.new(request.fullpath)
    @content = Document.new(params[:section]).document
  end

  def show
    render "/documentation/show", locals: get_layout_config(:styleguide)
  end

end
