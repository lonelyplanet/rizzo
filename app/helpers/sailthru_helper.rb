module SailthruHelper
  # Generates the meta tags requires by Sailthru Horizon and adds the setup
  # script.
  #
  # Options:
  #
  # - title
  # - tags
  #
  def sailthru_tags(opts = {})
    title = if opts[:title]
      opts[:title]
    elsif content_for?(:head_title)
      yield(:head_title)
    else
      'Lonely Planet Travel Guides and Travel Information'
    end

    tags = if opts[:tags].kind_of?(Array)
      opts[:tags].join(', ')
    else
      opts[:tags]
    end

    content_for :meta do
      haml_tag(:meta, name: "sailthru.date",  content: Time.now)
      haml_tag(:meta, name: "sailthru.title", content: title)
      haml_tag(:meta, name: "sailthru.tags",  content: tags) if tags
    end
  end
end
