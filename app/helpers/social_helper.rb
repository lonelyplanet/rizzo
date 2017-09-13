module SocialHelper
  def tweetify(args = {})
    # Max length is not 140 to allow RT without changing the text of the tweet
    max_length = args[:max_length] || 138
    short_url_length = args[:short_url_length] || 25

    title = args[:title] || ''
    emission = '…'
    url = args[:url] || 'https://www.lonelyplanet.com'
    suffix = args[:suffix] || 'via @lonelyplanet'
    if (hashtags = args[:hashtags]).is_a?(Array) && hashtags.any?
      hashtags = hashtags.join(',')
    end

    title = truncate(title.sub('\'', '%27'), length: max_length - short_url_length - suffix.length - (hashtags ? hashtags.length : 0) - emission.length, separator: ' ', omission: emission)

    out = "#{title} #{url} #{suffix}"

    if hashtags
      out += "&hashtags=#{hashtags}"
    end

    out.strip
  end
end
