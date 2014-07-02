class PerformanceController < GlobalController

  layout "styleguide"

  before_filter :setup

  def css_index
    @result = CSSAnalysis.new.fetch("all")
    render '/performance/css-analysis/index'
  end

  def css_show
    @result = CSSAnalysis.new.fetch(params[:stylesheet])
    render '/performance/css-analysis/stylesheet'
  end

  def js_index
    @result = JSAnalysis.new.fetch("all")
    render '/performance/js-analysis/index'
  end

  def js_show
    @result = JSAnalysis.new.fetch(params[:javascript])
    render '/performance/js-analysis/show'
  end

  def setup
    @app = PerformanceMonitoring.new(request.fullpath)
  end

end
