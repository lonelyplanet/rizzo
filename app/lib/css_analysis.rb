module CSSAnalysis

  require 'open-uri'

  extend self

  def fetch(stylesheet)
    @stats ||= fetchStats(stylesheet)
    if stylesheet == "all"
      orderedStats
    else
      @stats.find {|stat| stat[:id] == stylesheet}
    end
  end

  private

  def fetchStats(stylesheet)
    @stats = JSON.parse(open("http://assets.staticlp.com/perf/css-analysis.json").read).map do |stat|
      removeCruft(stat)
      processStats(stat)
    end
  end

  def removeCruft(stat)
    stat.delete('paths')
    stat.delete('stylesheets')
    stat.delete('lowestCohesion')
    stat.delete('lowestCohesionSelector')
    stat.delete('mostIdentifier')
    stat.delete('simplicity')
    stat.delete('dataUriSize')
  end

  def processStats(stat)
    {
      core: {
        size: "#{stat.delete("size")/1000}",
        gzippedSize: "#{stat.delete("gzippedSize")/1000}"
      },
      groups: {
        uniqueFontSize: stat.delete("uniqueFontSize"),
        uniqueColor: stat.delete("uniqueColor"),
        propertiesCount: stat.delete("propertiesCount")
      },
      timestamp: stat.delete('published'),
      name: stat.delete('name'),
      id: stat.delete('id'),
      other: stat
    }
  end

  def orderedStats
    @stats.sort { |x,y| y[:core][:gzippedSize].to_i <=> x[:core][:gzippedSize].to_i}
  end

end
