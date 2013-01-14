
module FooterHelper
  def destination_nav_items
    [
      {:title=>'Africa', :url=>'africa'},
      {:title=>'Antarctica', :url=>'antarctica'},
      {:title=>'Asia', :url=>'asia'},
      {:title=>'Caribbean Islands', :url=>'caribbean'},
      {:title=>'Central America', :url=>'central-america'},
      {:title=>'Europe', :url=>'europe'},
      {:title=>'Middle East', :url=>'middle-east'},
      {:title=>'North America', :url=>'north-america'},
      {:title=>'Pacific', :url=>'pacific'},
      {:title=>'South America', :url=>'south-america'}
    ]
  end

  def shop_nav_items
    [
      {:title=>'Destination Guides', :url=>'destination-guides'},
      {:title=>'eBooks', :url=>'ebooks'},
      {:title=>'Pictorial & Gifts', :url=>'pictorials-and-gifts'},
      {:title=>'Phrase Books', :url=>'phrasebooks'},
      {:title=>'Activity Guides', :url=>'activity-guides'},
      {:title=>'Special Offers', :url=>'special-offers'}
    ]
  end

  def thorntree_nav_items
    [
      {:title=>'Departure Lounge', :url=>'category.jspa?categoryID=2'},
      {:title=>'Check in with Lonely Planet', :url=>'category.jspa?categoryID=11'}
    ]
  end

  def themes_nav_items
    [
      {:title=>'Adventure travel', :url=>'adventure-travel'},
      {:title=>'Big Trips', :url=>'big-trips'},
      {:title=>'Honeymoons', :url=>'honeymoons'},
      {:title=>'Photography', :url=>'photography'},
      {:title=>'Road Trips', :url=>'road-trips'},
      {:title=>'Value Travel', :url=>'value-travel'},
      {:title=>'Wildlife', :url=>'wildlife'},
      {:title=>'World food', :url=>'world-food'}
    ]
  end

  def travel_bookings_nav_items
    [
      {:title=>'Hotels', :url=>'hotels'},
      {:title=>'Flights', :url=>'flights'},
      {:title=>'Insurance', :url=>'insurance'}
    ]
  end
end