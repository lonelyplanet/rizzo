require 'spec_helper'

describe SnippetSupport do
  
  subject { Class.new { include SnippetSupport }.new }

  context ', checking a template snippet' do 

    it ' returns the default snippet' do
      subject.template_for(:head).should eq('layouts/core/snippets/_modern_head')
    end

    it ' returns the secure snippet' do
      subject.template_for(:head, true).should eq('layouts/legacy/snippets/_secure_head')
    end

  end

  context ', user box within primary navigation bar' do

    it 'sets it visible by default' do
      subject.user_nav?({}).should be true
    end

    it 'flags it true the displaySignonWidget param' do
      subject.user_nav?({ :displaySignonWidget => "false" }).should be false
    end

    it 'flags it false with the user_nav param' do
      subject.user_nav?({ :user_nav => "false" }).should be false
    end

  end

end
