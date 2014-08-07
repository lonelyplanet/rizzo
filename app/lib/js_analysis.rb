class JSAnalysis < AssetAnalysis

  def fetch(file)
    @stats ||= fetch_stats("js")

    if file == "all"
      add_comparison_stats
      order_stats
    else
      @stats.find {|stat| stat[:id] == file}
    end

  end

  def chart_data
    {
      perf: @stats[:today].map do |file|
        file[:id] == "car-rental" ? nil : chart_data_for_file(file)
      end.compact,
      upperRange: 300
    }
  end

  def decorated_stat(stat)
    stat[:sizes] = {
      size: stat[:sizes][:size]/1000,
      gzippedSize: stat[:sizes][:gzippedSize]/1000
    }
    stat
  end


end
