class RedirectorController < ApplicationController
  include RedirectorSupport
  
  def show
    encrypted_url = params[:encrypted_url]
    url           = Rizzo::UrlEncryptor.decrypt(encrypted_url)

    increment_stats_bucket_for_redirected_url(url)
    redirect_to(url)
  rescue Rizzo::UrlEncryptor::BadUrl
    increment_stats_bucket_for_bad_redirected_url(encrypted_url)
    render :status => :bad_request, :nothing => true
  end

  def internal
    begin
      url = Rizzo::UrlValidator.validate(params[:url])
      redirect_to url
    rescue Rizzo::UrlValidator::InvalidUrl
      render text: 'Not Found', status: '404'
    end
  end
end
