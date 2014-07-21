class PerformanceController < GlobalController

  include LayoutSupport
  layout "styleguide"

  before_filter :setup

  def css_index
    css_analysis = CSSAnalysis.new
    @result = css_analysis.fetch("all")
    @chart_data = css_analysis.chart_data
    render '/performance/css-analysis/index', locals: layout_defaults.merge(legacy_options[:"#{params[:route]}"])
  end

  def css_show
    @result = CSSAnalysis.new.fetch(params[:stylesheet])
    render '/performance/css-analysis/stylesheet', locals: layout_defaults.merge(legacy_options[:"#{params[:route]}"])
  end

  def js_index
    js_analysis = JSAnalysis.new
    @result = js_analysis.fetch("all")
    @chart_data = js_analysis.chart_data
    render '/performance/js-analysis/index', locals: layout_defaults.merge(legacy_options[:"#{params[:route]}"])
  end

  def js_show
    @result = JSAnalysis.new.fetch(params[:javascript])
    render '/performance/js-analysis/show', locals: layout_defaults.merge(legacy_options[:"#{params[:route]}"])
  end

  def setup
    @app = PerformanceMonitoring.new(request.fullpath)
  end

end
