require 'browser_support'
require 'host_support'

module GlobalResourcesHelper
  include BrowserSupport, HostSupport

  def primary_navigation_items
    [
      {style:'home', title:'Home', uri: www_url},
      {style:'destinations', title:'Destinations', uri: www_url("destinations")},
      {style:'themes', title:'Themes', uri: www_url("themes")},
      {style:'forum', title:'Thorn Tree forum', uri: www_url("thorntree")},
      {style:'shop', title:'Shop', uri: shop_url},
      {style:'hotels', title:'Hotels', uri: www_url("hotels")},
      {style:'flights', title:'Flights', uri: www_url("bookings/flights.do")},
      {style:'insurance', title:'Insurance', uri: www_url("bookings/insurance.do")}
    ]
  end
  
  def core_navigation_items
    [
      {title:'Destinations',
        uri: "http://www.lonelyplanet.com/destinations",
        submenu: [
          {title:'Africa', uri:'http://www.lonelyplanet.com/africa'},
          {title:'Antarctica', uri:'http://www.lonelyplanet.com/antarctica'},
          {title:'Asia', uri:'http://www.lonelyplanet.com/asia'},
          {title:'Caribbean', uri:'http://www.lonelyplanet.com/caribbean'},
          {title:'Central America', uri:'http://www.lonelyplanet.com/central-america'},
          {title:'Europe', uri:'http://www.lonelyplanet.com/europe'},
          {title:'Middle East', uri:'http://www.lonelyplanet.com/middle-east'},
          {title:'North America', uri:'http://www.lonelyplanet.com/north-america'},
          {title:'Pacific', uri:'http://www.lonelyplanet.com/pacific'},
          {title:'South America', uri:'http://www.lonelyplanet.com/south-america'}
        ]
      },
      {title:'Themes', uri: "http://www.lonelyplanet.com/themes"},
      {title:'Shop', uri: "http://shop.lonelyplanet.com"},
      {title:'Thorn Tree Forum', uri: "http://www.lonelyplanet.com/thorntree"},
      {title:'Bookings',
        uri: 'http://www.lonelyplanet.com/hotels/',
        submenu: [
          {title:'Hotels', uri:'http://www.lonelyplanet.com/hotels', style:'hotels'},
          {title:'Flights', uri:'http://www.lonelyplanet.com/flights/', style:'flights'},
          {title:'Adventure tours', uri:'http://www.lonelyplanet.com/adventure-tours/', style:'adventure-tours'},
          {title:'Sightseeing tours', uri:'http://www.lonelyplanet.com/sightseeing-tours/', style:'sightseeing-tours'}
        ]
      },
      {title:'Insurance', uri: "http://www.lonelyplanet.com/travel-insurance"}
    ]
  end

  def default_secondary_nav
    {
      title: 'Buenos Aires',
      section_name: 'Hotels',
      slug: 'buenos-aires',
      parent: 'Argentina',
      parent_slug: "argentina",
      collection: 
        [
          {:title=>'Overview', :url=>'#'},
          {:title=>'Things to do', :url=>'#'},
          {:title=>'Hotels', :url=>'#'},
          {:title=>'Tips & Articles', :url=>'#'},
          {:title=>'Images & Video', :url=>'#'}
        ]
    }
  end
  
  def default_breadcrumbs
    [
      {:place=>"South America", :slug=>"south-america"},
      {:place=>"Argentina", :slug=>"argentina"},
      {:place=>"Buenos Aires", :slug=>"buneos-aires"},
      {:place=>"Buenos Aires Hotels", "slug"=>nil}
    ]
  end

  def secondary_nav_bar(args)
    render :partial=>'layouts/core/snippets/secondary_navigation_bar', :locals=> args
  end

  def cart_item_element
    capture_haml do
      haml_tag(:a, 'Cart: 0', class: 'nav__item--cart js-user-cart', href: 'http://shop.lonelyplanet.com/cart/view')
    end
  end

  def membership_item_element
    capture_haml do
      haml_tag(:div, class: 'nav__item--user js-user--nav')
    end
  end

  def show_arrow(style)
    if style=='destinations' ||  style=='destinations current'
      capture_haml do
        haml_tag(:span, class: 'arrow')
      end
    end
  end

  def place_heading(title, section_name, slug, parent, parent_slug)
    
    capture_haml do
      haml_tag(:div, class: 'place-title') do
        haml_tag(:a, class: 'place-title-heading', href: "/#{slug}") do
          haml_concat(title)
        end
        unless section_name.nil?
          haml_tag(:span, class: 'accessibility') do
            haml_concat(" " + section_name)
          end
        end
        unless parent.nil?
          haml_tag(:a, class: 'place-title__parent', href: "/#{parent_slug}") do
            haml_concat(", " + parent)
          end
        end
      end
    end
  end
  
  def errbit_notifier
    unless params[:errbit] == 'false'
      haml_tag(:script, src:"//rizzo.lonelyplanet.com/assets/errbit_notifier.js")
      haml_tag :script do
        haml_concat "window.Airbrake = (typeof(Airbrake) == 'undefined' && typeof(Hoptoad) != 'undefined') ? Hoptoad : Airbrake;"
        haml_concat "window.Airbrake.setKey('#{Airbrake.configuration.js_api_key}');"
        haml_concat "window.Airbrake.setHost('#{Airbrake.configuration.host.dup}:#{Airbrake.configuration.port}');"
        haml_concat "window.Airbrake.setEnvironment('#{Airbrake.configuration.environment_name}');"
        haml_concat "window.Airbrake.setErrorDefaults({ url: '#{request.url}', component: '#{controller_name}', action: '#{action_name}' });"
      end
    end
  end

  def breadcrumbs_nav(breadcrumb_content)
    render :partial=>'layouts/core/snippets/footer_breadcrumbs', locals: {breadcrumbs: breadcrumb_content || []}
  end
  
  def breadcrumb_for(breadcrumb, last)
    capture_haml do
      if last == true
        haml_tag(:span, class: "nav__item js-nav-item nav__item--breadcrumbs current", itemprop: "url") { haml_concat breadcrumb[:place] }
      else
        haml_tag(:a, class: "nav__item js-nav-item nav__item--breadcrumbs", href: "http://www.lonelyplanet.com/#{breadcrumb[:slug]}", itemprop:"url") { haml_concat breadcrumb[:place] } 
      end
    end
  end
  
  def dns_prefetch_for(links)
    capture_haml do
      links.each do |link|
        haml_tag(:link, rel: "dns-prefetch", href: "//#{link}")
      end
    end
  end
end
