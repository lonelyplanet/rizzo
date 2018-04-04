require 'addressable/uri'

module Rizzo
  module UrlValidator
    class InvalidUrl < StandardError; end

    VALID_HOSTS = [
                    "www.lonelyplanet.com",
                    "www.lonelyplanet.in",
                    "www.lonelyplanet.de",
                    "www.lonelyplanet.fr",
                    "www.lonelyplanet.es",
                    "www.lonelyplanetitalia.it",
                    "www.lonelyplanet.ru",
                    "www.lonelyplanetbrasil.com.br",
                    "www.lonelyplanet.cz",
                    "www.lonelyplanet.co.kr"
                  ]

    def self.validate(url = "")
      target = Addressable::URI.heuristic_parse(url)

      if Rails.env.development?
        return target.to_s
      end

      target.path = "/#{target.path}" unless target.path[0] == '/'
      target.host = whitelisted_hosts(target.host) || ENV['APP_HOST'] || 'www.lonelyplanet.com'
      target.scheme = ((target.scheme == 'http' || target.scheme == 'https') ? target.scheme : 'https')
      target.port = target.scheme == 'https' ? 443 : 80
      target.to_s
    rescue => e
      Airbrake.notify(e) if defined?(Airbrake)
      raise InvalidUrl
    end

    private

    def self.whitelisted_hosts(url)
      url if VALID_HOSTS.include?(url)
    end
  end
end
