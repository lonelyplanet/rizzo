class StyleGuide < RizzoApp

  def get_icons(type)
    icons = []
    Dir["app/assets/images/icons/#{type}/*.svg"].each do |file_name|
      class_name = 'icon--' + File.basename(file_name, '.svg')
      icons.push(class_name)
    end
    icons
  end

  def get_css(file)
    sass = File.read(File.expand_path("../../assets/stylesheets/#{file}.sass", __FILE__))
    decorated_snippets = []
    sass.split(/\[doc\]/).each do |snippet|
      decorated_snippets.push(description_from_snippet(snippet)) unless snippet.index("//") == 0
    end
    decorated_snippets
  end

  def get_colours(file)
    colours = File.read(File.expand_path("../../assets/stylesheets/sass/variables/#{file}.sass", __FILE__))
    colours = colours.split("// -----------------------------------------------------------------------------\n")
    colours.delete_if(&:empty?)
    groups = []
    counter = -1

    colours.each do |section|
      if section[0..1] == "//"
        groups.push({title: section})
        counter = counter + 1
      else
        groups[counter][:body] = section
      end
    end
    groups
  end

  def get_colour_value(value, ref)
    @ref_colours ||= File.read(File.expand_path("../../assets/stylesheets/sass/variables/#{ref}.sass", __FILE__))

    variable = extract_variable(value)

    if variable
      value = extract_colour(@ref_colours, variable)
    end

    value
  end

  def get_luminance(hex)
    hex = "#{hex}#{hex.match(/[0-9A-Fa-f]{3}/)[0]}" if hex.length < 7
    rgb = hex.scan(/[0-9A-Fa-f]{2}/).collect { |i| i.to_i(16) }
    (0.2126*rgb[0]) + (0.7152*rgb[1]) + (0.0722*rgb[2])
  end

  def sections
    @sections ||= (YAML.load_file(File.expand_path('../../data/styleguide/secondary_nav.yml', __FILE__)))
  end

  private

  def root
    "/styleguide"
  end

  def left_nav
    @left_nav ||= (YAML.load_file(File.expand_path('../../data/styleguide/left_nav.yml', __FILE__)))
  end

  def description_from_snippet(snippet)
    decorated_snippet = {}
    snippet.split(/\[\/doc\]/).each_with_index do |section, index|
      if index == 0
        decorated_snippet[:title] = section.split("\n//\n// ").delete_if(&:empty?).first.gsub("\n//", "")
        decorated_snippet[:description] = section.split("\n//\n// ").delete_if(&:empty?)[1..-1].map do |line|
          line.gsub("\n//", "")
        end
      else
        decorated_snippet[:snippet] = section.split("\n").delete_if(&:empty?).delete_if do |line|
          line.index("//") == 0
        end[0].gsub("@mixin ", "+")
      end
    end
    decorated_snippet[:syntax_lang] = "sass"
    decorated_snippet
  end

  def extract_colour(contents, variable)
    matches = contents.match(/(#{Regexp.escape(variable)})\s*:\s*(#[a-fA-F0-9]{3,6})\s*(!default)?/)
    matches ? matches[2] : matches
  end

  def extract_variable(line)
    matches = line.match(/(\$[0-9a-zA-Z_-]+)\s*(!default)?/)
    matches ? matches[1] : matches
  end

end
