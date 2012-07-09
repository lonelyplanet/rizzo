require 'spec_helper'

describe RedirectorSupport do
  subject do
    Foo ||= Class.new do
      include RedirectorSupport
    end.new
  end

  let(:url) { "http://foo.bar.com/zip/zap" }
  
  before do
    Stats = double unless defined? Stats
    Stats.stub(:increment)
  end
  
  describe "#increment_stats_bucket_for_bad_redirected_url" do
    it "increments the redirector.bad_url stat" do
      Stats.should_receive(:increment).with("redirector.bad_url.#{url}")
      subject.increment_stats_bucket_for_bad_redirected_url(url)
    end
  end

  describe "#increment_stats_bucket_for_redirected_url" do
    it "increments the redirector stat, with one part for the host, and a part for each subpath" do
      Stats.should_receive(:increment).with("redirector.foo-bar-com.zip.zap")
      subject.increment_stats_bucket_for_redirected_url(url)
    end
  end

  describe "#increment_stats_bucket" do
    it "accepts an array of bucket parts, and increments a stats bucket named by the joined parts" do
      Stats.should_receive(:increment).with("foo.bar.zap")
      subject.increment_stats_bucket(%w(foo bar zap))
    end
  end
end
