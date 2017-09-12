require 'spec_helper'

describe SocialHelper do
  describe 'tweetify' do
    it 'returns a generic tweet' do
      helper.tweetify.should == 'https://www.lonelyplanet.com via @lonelyplanet'
    end

    it 'does something' do
      tweet = helper.tweetify(url: 'http://www.wow.com', title: 'Albert Samson Goes To Town')
      tweet.should == 'Albert Samson Goes To Town http://www.wow.com via @lonelyplanet'
    end

    it 'truncates long article names' do
      title = '!' * 140
      trunc_title = ('!' * 94) + '…'
      url = '.' * 25
      tweet = helper.tweetify(url: url, title: title)
      tweet.split.first.should == trunc_title
    end

    it 'adds an optional hashtag' do
      tweet = helper.tweetify(url: 'http://www.wow.com', title: 'Albert Samson Goes To Town', hashtags: ['hello'])
      tweet.should == 'Albert Samson Goes To Town http://www.wow.com via @lonelyplanet&hashtags=hello'
    end

    it 'adds multiple optional hashtags' do
      tweet = helper.tweetify(url: 'http://www.wow.com', title: 'Albert Samson Goes To Town', hashtags: %w(hello world))
      tweet.should == 'Albert Samson Goes To Town http://www.wow.com via @lonelyplanet&hashtags=hello,world'
    end
  end
end
