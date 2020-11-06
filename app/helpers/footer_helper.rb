module FooterHelper
  def footer_nav_destination_items
    [
      {title: 'Africa', url: 'africa'},
      {title: 'Antarctica', url: 'antarctica'},
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
      {title: 'Pictorial & gifts', url: 'categories/pictorials-reference'},
      {title: 'Phrasebooks', url: 'categories/phrasebooks'},
      {title: 'Lonely Planet Kids', url: 'pages/lonely-planet-kids'},
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
      {title:'Adventure travel', url:'inspiration/adventure-travel/'},
      {title:'Art and culture', url:'inspiration/art-and-culture/'},
      {title:'Backpacking', url:'inspiration/backpacking/'},
      {title:'Beaches, coasts and islands', url:'inspiration/beaches-coasts-and-islands/'},
      {title:'Family holidays', url:'inspiration/family-holidays/'},
      {title:'Festivals', url:'inspiration/festivals/'},
      {title:'Food and drink', url:'inspiration/food-and-drink/'},
      {title:'Honeymoon and romance', url:'inspiration/honeymoon-and-romance/'},
      {title:'Road trips', url:'inspiration/road-trips/'},
      {title:'Travel gear and tech', url:'inspiration/travel-gear-and-tech/'},
      {title:'Travel on a budget', url:'inspiration/travel-on-a-budget/'},
      {title:'Wildlife and nature', url:'inspiration/wildlife-and-nature/'}
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
