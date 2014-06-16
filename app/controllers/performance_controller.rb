class PerformanceController < GlobalController

  layout "styleguide"

  before_filter :setup

  def css_index
    @result = CSSAnalysis.fetch("all")
    render '/performance/css-analysis/index'
  end

  def css_show
    @result = CSSAnalysis.fetch(params[:stylesheet])
    render '/performance/css-analysis/stylesheet'
  end

  def setup
    @self = PerformanceMonitoring.new(request.fullpath)
  end

end
