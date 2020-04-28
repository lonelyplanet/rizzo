require 'fileutils'
class ApplicationController < ActionController::Base
  after_filter :save_response

  def save_response
    # Do not save if error, redirect, or already saved
    return if response.status != 200 || File.exist?(file_path)

    dirname = File.dirname(file_path)
    unless File.directory?(dirname)
      FileUtils.mkdir_p(dirname)
    end

    File.write(file_path, response.body)
  end

  def path
    request.path
  end

  def file_path
    # If the path has an extension, save it as is
    # Otherwise, save it as index.html, using the path as the directory
    return "output/#{path}" if path =~ /\w+\.\w{2,4}/
    "output#{path}/index.html"
  end
end
