require 'spec_helper'

describe JsHelper do
  let(:namespace) { "my.namespace" }
  
  describe "#configure_js" do
    let(:configuration) { Hash.new }
    let(:config)        { double "config object" }
    
    before do
      JsHelper::Config.stub(:new => config)
      config.stub(:add)
    end
    
    it "accepts a js namespace string and a hash" do
      helper.configure_js(namespace, {})
    end

    it "initializes a Config object with the default LP namespace the first time it is called" do
      JsHelper::Config.should_receive(:new).with("window.lp").and_return(config)
      helper.configure_js(namespace, configuration)
    end

    it "reuses the Config object on subsequent calls" do
      helper.configure_js("my.namespace", configuration)
      JsHelper::Config.should_not_receive(:new)
      config.should_receive(:add)
      helper.configure_js(namespace, configuration)
    end

    it "adds the namespace string and hash to the Config object" do
      config.should_receive(:add).with(namespace, configuration)
      helper.configure_js("my.namespace", configuration)
    end
  end

  describe "#js_configuration" do

    it 'output nil without configuration' do
      helper.js_configuration().should be_nil
    end
    
    it "output a script tag" do
      helper.configure_js('foo', {:bar=>'bizz'})
      helper.configure_js('bot', {:lot=>'op'})
      helper.js_configuration.should match(/script/)
      helper.js_configuration.should eq "<script type=\"text/javascript\">\n//<![CDATA[\nwindow.lp = {}; window.lp.foo = {\"bar\":\"bizz\"}; window.lp.bot = {\"lot\":\"op\"};\n//]]>\n</script>"
    end

  end

  describe ::JsHelper::Config do
    let(:configuration) { { :foo => :bar }}

    subject { JsHelper::Config.new(nil) }

    describe "#initialize" do
      it "stores the root namespace on the root_namespace attribute" do
        JsHelper::Config.new("foo").root_namespace.should eq "foo"
      end
    end
    
    describe "#configurations" do
      it "by default, returns a an empty hash for any key" do
        subject.configurations[:some_key].should eq({})
      end

      it "returns a hash of namespaces and configurations that have been #add-ed" do
        subject.add(namespace, configuration)
        subject.configurations.should eq(namespace => configuration)
      end
    end
    
    describe "#add" do
      it "stores the configuration against the namespace prepended with the root namespace" do
        subject.stub(:root_namespace => "my.root")
        subject.add(namespace, configuration)
        subject.configurations["my.root.#{namespace}"].should eq configuration
      end
    end

    describe "#namespaces_to_vivify" do
      let(:namespaces) { %w(foo.bar foo.bar.zap foo.bar.zip.quux blap.bar.quux) }

      before do
        namespaces.each { |n| subject.add(n, {}) }
      end
      
      it "returns a list of unique namespace parts to vivify" do
        subject.namespaces_to_vivify.should =~ %w(foo foo.bar foo.bar.zap foo.bar.zip foo.bar.zip.quux blap blap.bar blap.bar.quux)
      end
    end

  end

end
