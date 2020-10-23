module FooterHelper
  def footer_nav_destination_items
    [
      {title: 'Africa', url: 'africa'},
      {title: 'Antarctica', url: 'antarctica-1007062'},
      {title: 'Asia', url: 'asia'},
      {title: 'Caribbean Islands', url: 'caribbean'},
      {title: 'Central America', url: 'central-america'},
      {title: 'Europe', url: 'europe'},
      {title: 'Middle East', url: 'middle-east'},
      {title: 'North America', url: 'north-america'},
      {title: 'Pacific', url: 'pacific'},
      {title: 'South America', url: 'south-america'}
    ]
  end

  def footer_nav_shop_items
    [
      {title: 'Destination guides', url: 'pages/guide-books'},
      {title: 'eBooks', url: 'categories/ebooks'},
      {title: 'Pictorial & gifts', url: 'categories/pictorials-reference'},
      {title: 'Phrasebooks', url: 'categories/phrasebooks'},
      {title: 'Lonely Planet Kids', url: 'pages/lonely-planet-kids'},
      {title: 'Special offers', url: 'pages/deals'}
    ]
  end

  def footer_nav_thorntree_items
    [
      {title: 'Country forums', url: 'categories/country-forums'},
      {title: 'Interest forums', url: 'categories/interest-forums'},
      {title: 'Talk to Lonely Planet', url: 'categories/talk-to-lonely-planet'}
    ]
  end

  def footer_nav_interests_items
    [
      {title:'Adventure travel', url:'adventure-travel/'},
      {title:'Art and culture', url:'art-and-culture/'},
      {title:'Backpacking', url:'backpacking/'},
      {title:'Beaches, coasts and islands', url:'beaches-coasts-and-islands/'},
      {title:'Family holidays', url:'family-holidays/'},
      {title:'Festivals', url:'festivals/'},
      {title:'Food and drink', url:'food-and-drink/'},
      {title:'Honeymoon and romance', url:'honeymoon-and-romance/'},
      {title:'Road trips', url:'road-trips/'},
      {title:'Travel gear and tech', url:'travel-gear-and-tech/'},
      {title:'Travel on a budget', url:'travel-on-a-budget/'},
      {title:'Wildlife and nature', url:'wildlife-and-nature/'}
    ]
  end

  def footer_nav_travel_bookings_items
    [
      {title: 'Hotels', url: 'hotels'},
      {title: 'Flights', url: 'flights'},
      {title: 'Insurance', url: 'travel-insurance'}
    ]
  end

  def social_media_nav
    [
      {title: 'twitter', url: 'https://twitter.com/lonelyplanet'},
      {title: 'facebook', url: 'https://www.facebook.com/lonelyplanet'},
      {title: 'pinterest', url: 'http://pinterest.com/lonelyplanet/'},
      {title: 'flipboard', url: 'https://flipboard.com/@LonelyPlanet?utm_source=LonelyPlanet&utm_medium=follow&utm_campaign=tools'},
    ]
  end

  def footer_nav_about_items
    [
      {title: 'About us', url: '/about/'},
      {title: 'Work for us', url: '/about/careers/'},
      {title: 'Contact us', url: '/contact/'},
      {title: 'Press, trade &amp; advertising', url: '/press-trade-advertising/'},
      {title: 'Blog', url: '/blog'},
      {title: 'Terms &amp; conditions', url: '/legal/website-terms/'},
      {title: 'Privacy policy', url: '/legal/privacy-policy/'}
    ]
  end

  def language_options
    [
      ["https://www.lonelyplanet.com", "English"],
      ["http://www.lonelyplanet.in", "English (India)"],
      ["https://www.lonelyplanet.de", "Deutsch"],
      ["https://www.lonelyplanet.fr", "Fran&#231;ais"],
      ["https://www.lonelyplanet.es", "Espa&#241;ol"],
      ["http://www.lonelyplanetitalia.it", "Italiano"],
      ["http://www.lonelyplanet.ru", "&#x420;&#x443;&#x441;&#x441;&#x43A;&#x438;&#x439;"],
      ["http://www.lonelyplanetbrasil.com.br", "Portugu&ecirc;s"],
      ["https://www.lonelyplanet.cz", "&#268;esky"],
      ["https://www.lonelyplanet.co.kr", "&#xD55C;&#xAD6D;&#xC5B4;"],
      ["https://www.lonelyplanet.nl", "Nederlands"]
    ]
  end

end
