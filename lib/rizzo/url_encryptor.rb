require 'uri'

module Rizzo
  module UrlEncryptor
    class BadUrl < StandardError; end

    # token used for encrypting redirected links
    # TODO: enable configuration on a per-app basis
    SECRET = "akhd29283hdiwfch39823hfnjdsvcknjwoifuh32r9ih2foijqlkwdjalkjndoiauenhfdr928r9hfrncdoiuh398fd2h3"
    
    def self.encrypt(url = "")
      URI.encode(encryptor.encrypt_and_sign(url))
    end
    
    def self.decrypt(encoded_encrypted_url = "")
      encryptor.decrypt(URI.decode(encoded_encrypted_url)).tap do |clean_url|
        validate_url(clean_url)
      end
    end

    private

    def self.validate_url(url)
      parsed_uri = URI.parse(url)
      raise BadUrl unless parsed_uri.scheme.present? && parsed_uri.host.present?
    rescue URI::InvalidURIError
      raise BadUrl
    end

    def self.encryptor
      @encryptor ||= ActiveSupport::MessageEncryptor.new(SECRET)
    end
  end
end
