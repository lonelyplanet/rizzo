module StyleguideHelper
  def styleguide_stubs(name)
    YAML.load(File.read(File.expand_path("#{Rails.root}/app/data/styleguide/#{name}_stubs.yml", __FILE__)))
  end
end
