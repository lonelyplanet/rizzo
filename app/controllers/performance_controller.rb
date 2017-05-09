class PerformanceController < ActionController::Base

  include LayoutSupport
  layout "styleguide"

  before_action :setup

  def css_index
    css_analysis = CSSAnalysis.new
    @result = css_analysis.fetch("all")
    @chart_data = css_analysis.chart_data
    render '/performance/css-analysis/index', locals: get_layout_config(params[:route])
  end

  def css_show
    @result = CSSAnalysis.new.fetch(params[:stylesheet])
    render '/performance/css-analysis/stylesheet', locals: get_layout_config(params[:route])
  end

  def js_index
    js_analysis = JSAnalysis.new
    @result = js_analysis.fetch("all")
    @chart_data = js_analysis.chart_data
    render '/performance/js-analysis/index', locals: get_layout_config(params[:route])
  end

  def js_show
    @result = JSAnalysis.new.fetch(params[:javascript])
    render '/performance/js-analysis/show', locals: get_layout_config(params[:route])
  end

  def setup
    @app = PerformanceMonitoring.new(request.fullpath)
  end

end
