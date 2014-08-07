class AssetAnalysis

  require 'open-uri'

  DAYS = {
    today: 0,
    yesterday: 1,
    two_days_ago: 2,
    three_days_ago: 3,
    four_days_ago: 4,
    five_days_ago: 5,
    six_days_ago: 6,
    last_week: 7,
    last_month: 30
  }

  private

  def dates
    dates = {}
    DAYS.each do |day_key, day_val|
      dates[:"#{day_key}"] = day_val.day.ago.strftime("%Y-%m-%d")
    end
    dates
  end

  def compare_stats(current, previous)
    result = ((current.to_f/previous.to_f)*100 - 100).round(1)
    result == 0.0 ? result.round : result
  end

  def add_comparison_stats
    @stats[:today].each do |statistic|
      statistic[:compare] = {
        yesterday: compare_stats(statistic[:sizes][:size], get_filesize(@stats[:yesterday].find {|y| y[:id] == statistic[:id]})),
        last_week: compare_stats(statistic[:sizes][:size], get_filesize(@stats[:last_week].find {|y| y[:id] == statistic[:id]})),
        last_month: compare_stats(statistic[:sizes][:size], get_filesize(@stats[:last_month].find {|y| y[:id] == statistic[:id]}))
      }
    end
  end

  def order_stats
    @stats[:today].sort { |x,y| y[:sizes][:size].to_i <=> x[:sizes][:size].to_i}
  end

  def fetch_stats(type)
    stats = {}
    DAYS.each do |day_key, day_val|
      suffix = dates[:"#{day_key}"]
      begin
        stats[:"#{day_key}"] = JSON.parse(open("http://assets.staticlp.com/perf/#{type}-analysis/result-#{suffix}.json").read).map do |stat|
          stat = stat.deep_symbolize_keys
          type == "css" && stat[:result].blank? ? nil : decorated_stat(stat)
        end.compact
      rescue
        stats[:"#{day_key}"] = []
      end
    end
    stats
  end

  def chart_data_for_file(file)
    days = DAYS.keys[0...-2]

    {
      key: file[:id],
      values: days.reverse.map do |day_key|
        {
          x: days.length - DAYS[day_key],
          y: get_filesize(@stats[:"#{day_key}"].find {|y| y[:id] == file[:id]})
        }
      end
    }
  end

  def get_filesize(stat)
    stat.present? ? stat[:sizes][:size] : 1
  end

end
