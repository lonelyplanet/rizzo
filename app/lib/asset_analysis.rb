class AssetAnalysis

  require 'open-uri'

  DAYS = ["today", "yesterday", "2 days ago", "3 days ago", "4 days ago", "5 days ago", "6 days ago", "last_week"]

  private

  def dates
    dates = {}
    DAYS.each_with_index do |day_of_week, index|
      dates[day_of_week] = index.day.ago.strftime("%Y-%m-%d")
    end
    dates
  end

  def compare_stats(current, previous)
    result = ((current.to_f/previous.to_f)*100 - 100).round(1)
    result == 0.0 ? result.round : result
  end

  def add_comparison_stats
    @stats['today'].each do |statistic|
      statistic['compare'] = {
        "yesterday" => compare_stats(statistic['sizes']['size'], (@stats['yesterday'].find {|y| y['id'] == statistic['id']})['sizes']['size']),
        "last_week" => compare_stats(statistic['sizes']['size'], (@stats['last_week'].find {|y| y['id'] == statistic['id']})['sizes']['size'])
      }
    end
  end

  def order_stats
    @stats['today'].sort { |x,y| y['sizes']['size'].to_i <=> x['sizes']['size'].to_i}
  end

  def fetch_stats(type)
    stats = {}
    DAYS.each do |day_of_week|
      suffix = dates[day_of_week]
      begin
        result = JSON.parse(open("http://assets.staticlp.com/perf/#{type}-analysis/result-#{suffix}.json").read)
        stats[day_of_week] = type == "js" ? result : result.map {|stat| decorated_stat(stat)}
      rescue
        stats[day_of_week] = []
      end
    end
    stats
  end

end
