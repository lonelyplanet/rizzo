module NavigationHelper

  def subnav_options(items)
    items.map do |item|
      h = item.clone
      h[:value] = h[:slug]
      h
    end
  end

  # used to repeating content_for through partials, flushes buffer each time.
  # Backport of content_for(:name, flush: true) from Rails4
  def single_content_for(name, content = nil, &block)
    @view_flow.set(name, ActiveSupport::SafeBuffer.new)
    content_for(name, content, &block)
  end
end
