class JSAnalysis < AssetAnalysis

  def fetch(file)
    @stats = fetch_stats("js")

    if file == "all"
      add_comparison_stats
      order_stats
    else
      @stats.find {|stat| stat[:id] == file}
    end

  end

end
