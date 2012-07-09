module RedirectorSupport
  def increment_stats_bucket_for_bad_redirected_url(url = "blank")
    increment_stats_bucket("redirector", "bad_url", url)
  end

  def increment_stats_bucket_for_redirected_url(url)
    uri  = URI.parse(url)
    host = uri.hostname.gsub(/\./, "-")
    path = uri.path.gsub(/\//, ".")
    increment_stats_bucket("redirector", "#{host}#{path}")
  end

  def increment_stats_bucket(*bucket_parts)
    Stats.increment(bucket_parts.join(".")) if defined?(Stats)
  end
end
