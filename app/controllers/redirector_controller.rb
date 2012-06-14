class RedirectorController < ActionController::Base
  def show
    encrypted_url = params[:encrypted_url]
    url           = Rizzo::UrlEncryptor.decrypt(encrypted_url)

    increment_stats_bucket_for_redirected_url(url)
    redirect_to(url)
  rescue Rizzo::UrlEncryptor::BadUrl
    increment_stats_bucket_for_bad_redirected_url(encrypted_url)
    render :status => :bad_request, :nothing => true
  end

  private

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
