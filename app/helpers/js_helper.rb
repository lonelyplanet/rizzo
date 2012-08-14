module JsHelper
  LP_DEFAULT_JS_NAMESPACE = "window.lp"
  
  class Config
    JS_OBJECT_SEPARATOR_CHAR = "."
    JS_ROOT_NAMESPACE        = "window"

    attr_reader :root_namespace
    
    def initialize(root_namespace = JS_ROOT_NAMESPACE)
      @root_namespace = root_namespace
    end
    
    def configurations
      @configurations ||= Hash.new { |h, k| h[k] = {} }
    end
    
    def add(namespace, configuration)
      namespace_with_root = [root_namespace, namespace].compact.join(JS_OBJECT_SEPARATOR_CHAR)
      self.configurations[namespace_with_root].merge!(configuration)
    end

    def namespaces_to_vivify
      configurations.keys.each_with_object([]) do |namespace, m|
        parts = namespace.split(/#{Regexp.escape(JS_OBJECT_SEPARATOR_CHAR)}/)
        parts.length.times do |i|
          m << parts[0, i + 1].join(JS_OBJECT_SEPARATOR_CHAR)
        end
      end.uniq
    end
  end
  
  def configure_js(namespace, config)
    # source url
    @js_config ||= Config.new(LP_DEFAULT_JS_NAMESPACE)
    @js_config.add(namespace, config)
  end

  def js_configuration
    return unless @js_config
    js_closure(:call => true) do
      @js_config
    end
  end

  def js_closure(opts, &blk)
    config = yield blk
    keys = config.configurations.keys
    output = keys.reduce("#{config.root_namespace} = {};") {|out, k| "#{out} #{k} = #{config.configurations[k].to_json};"}
    javascript_tag output
  end
end
