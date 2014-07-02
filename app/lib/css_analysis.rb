class CSSAnalysis < AssetAnalysis

  def fetch(file)
    @stats = fetch_stats("css")

    if file == "all"
      add_comparison_stats
      order_stats
    else
      @stats['today'].find {|stat| stat["id"] == file}
    end
  end

  def decorated_stat(stat)
    remove_cruft(stat)
    reformat_stats(stat)
  end

  private

  def remove_cruft(stat)
    stat['result'].delete('paths')
    stat['result'].delete('stylesheets')
    stat['result'].delete('lowestCohesion')
    stat['result'].delete('lowestCohesionSelector')
    stat['result'].delete('mostIdentifier')
    stat['result'].delete('simplicity')
    stat['result'].delete('dataUriSize')
  end

  def reformat_stats(stat)
    {
      "sizes" => {
        "size" => "#{stat['result'].delete("size")/1000}",
        "gzippedSize" => "#{stat['result'].delete("gzippedSize")/1000}"
      },
      "groups" => {
        "uniqueFontSize" => stat['result'].delete("uniqueFontSize"),
        "uniqueColor" => stat['result'].delete("uniqueColor"),
        "propertiesCount" => stat['result'].delete("propertiesCount")
      },
      "timestamp" => stat['result'].delete('published'),
      "name" => stat.delete('name'),
      "id" => stat.delete('id'),
      "other" => stat['result']
    }
  end

end
