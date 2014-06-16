class PerformanceMonitoring < RizzoApp

  private

  def left_nav
    @left_nav ||= (YAML.load(File.read(File.expand_path('../../data/performance-monitoring/left_nav.yml', __FILE__))))
  end

  def sections
    [
      {
        title: "CSS Analysis",
        slug: "/css-analysis"
      }
    ]
  end

  def root
    "/performance"
  end

end
