class PerformanceMonitoring < RizzoApp

  private

  def left_nav
    @left_nav ||= (YAML.load_file(File.expand_path('../../data/performance-monitoring/left_nav.yml', __FILE__)))
  end

  def sections
    @sections ||= (YAML.load_file(File.expand_path('../../data/performance-monitoring/secondary_nav.yml', __FILE__)))
  end

  def root
    "/performance"
  end

end
