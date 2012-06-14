module RedirectorHelper
  # Helper method for generating redirection links. 
  #
  # Usage:
  #     redirector_path("http://foo.bar/com?zap") # => "r/oin23o98c9jwhd982j398=23n9823nj"
  #
  # @param <String> target_url url to be redirected to. This will be encrypted.
  # @return <String> path to redirector controller #show action, with
  #   encrypted target_url 
  #
  #
  def redirector_path(target_url)
    super(:encrypted_url => Rizzo::UrlEncryptor.encrypt(target_url))
  end
end
