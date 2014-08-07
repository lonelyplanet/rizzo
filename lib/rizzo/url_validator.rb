require 'addressable/uri'

module Rizzo
  module UrlValidator
    class InvalidUrl < StandardError; end

    def self.validate(url = "")
      target = Addressable::URI.heuristic_parse(url)
      target.path = "/#{target.path}" unless target.path[0] == '/'
      target.host = ENV['APP_HOST'] || 'www.lonelyplanet.com'
      target.scheme = ENV['APP_SCHEME'] || ((target.scheme == 'http' || target.scheme == 'https') ? target.scheme : 'http')
      target.port = target.scheme == 'https' ? 443 : 80
      target.to_s
    rescue
      raise InvalidUrl
    end
  end
end
