class Document

  attr_reader :document, :slug

  def initialize(slug)
    @slug = slug
  end

  def raw
    @raw ||= DocumentDB.get("#{slug}.md")
  end

  def document
    @document ||= markdown.render(raw)
  end

  private

  def markdown
    @markdown ||= Redcarpet::Markdown.new(CustomRenderer, fenced_code_blocks: true)
  end

end
