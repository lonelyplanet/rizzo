require 'spec_helper'
require 'ip_support'

describe IpSupport do
  let(:request)        { double "request" }

  subject { Class.new { include IpSupport }.new }

  before do
    IpSupport.stub(:load_ip_ranges_yml => {"lp_offices" => ['65.216.115.1 - 65.216.115.10', '65.216.115.100', '72.32.192.0/24']})
  end

  
  describe "#is_lp_office?" do
    it "supports ip ranges" do
      subject.is_lp_office?('65.216.115.5').should eq true
      subject.is_lp_office?('65.216.115.11').should eq false
    end
    it "supports single ips" do
      subject.is_lp_office?('65.216.115.100').should eq true
      subject.is_lp_office?('65.216.115.101').should eq false
    end
    it "supports ip subnets" do
      subject.is_lp_office?('72.32.192.200').should eq true
      subject.is_lp_office?('72.32.191.200').should eq false
    end
    it "returns nil when given an invalid ip address" do
      subject.is_lp_office?('123.456.789.0').should eq nil
      subject.is_lp_office?('invalid').should eq nil
    end
  end
end
