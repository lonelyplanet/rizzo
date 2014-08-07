module DataFixturesHelper

  def load_data_fixture name
    YAML.load_file(File.expand_path("../../fixtures/#{name}_data.yml", __FILE__)).with_indifferent_access
  end

end
