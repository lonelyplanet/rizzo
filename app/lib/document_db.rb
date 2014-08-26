class DocumentDB

  DIR = Pathname.new("app/docs")

  include Singleton
  extend SingleForwardable

  def_delegators :instance, :get, :all

  def initialize
    @db = Hash.new do |h,k|
      h[k] = load(k)
    end
  end

  def get(slug)
    @db[slug]
  end

  def all
    @db.values
  end

  def load(slug)
    File.read(DIR.join(slug))
  end

end
