require 'browser_support'
require 'host_support'

module GlobalResourcesHelper
  include BrowserSupport, HostSupport

  def primary_navigation_items
    [
      {style:'home', title:'Home', uri: www_url},
      {style:'destinations', title:'Destinations', uri: www_url("destinations")},
      {style:'forum', title:'Thorn Tree forum', uri: www_url("thorntree")},
      {style:'shop', title:'Shop', uri: shop_url},
      {style:'hotels', title:'Hotels', uri: hotels_url},
      {style:'flights', title:'Flights', uri: www_url("bookings/flights.do")},
      {style:'insurance', title:'Insurance', uri: www_url("bookings/insurance.do")}
    ]
  end
  
  def core_navigation_items
    [
      {title:'Destinations', uri: "//www.lonelyplanet.com/destinations"},
      {title:'Themes', uri: "//www.lonelyplanet.com/themes"},
      {title:'Shop', uri: "//shop.lonelyplanet.com"},
      {title:'Thorn Tree Forum', uri: "//www.lonelyplanet.com/thorntree"},
      {title:'Bookings', uri: "//http://hotels.lonelyplanet.com/"},
      {title:'Insurance', uri: "//www.lonelyplanet.com/travel-insurance"}
    ]
  end

  def default_secondary_nav

    [
      {:title=>'Need to know', :url=>'#'},
      {:title=>'In pictures', :url=>'#'},
      {:title=>'Things to do', :url=>'#'},
      {:title=>'Tips', :url=>'#'},
      {:title=>'Discussion', :url=>'#'},
      {:title=>'Guidebooks', :url=>'#'},
      {:title=>'Hotels', :url=>'#'},
      {:title=>'Flights', :url=>'#'}
    ]

  end

  def cart_item_element
    capture_haml do
      haml_tag(:li, class: 'globalCartHead') do
        haml_tag(:a, 'Cart: 0', href: 'http://shop.lonelyplanet.com/cart/view')
      end
    end
  end

  def secondary_nav_bar(args)
    render :partial=>'layouts/core/snippets/secondary_navigation_bar', :locals=>{:title=>args[:title], :collection=>args[:collection] || [], :current=> args[:current] || nil}
  end

  def membership_item_element
    capture_haml do
      haml_tag(:li, class: 'signInRegister cartDivider')
    end
  end

  def arrow_button(args)
    capture_haml do
      haml_tag(:div, class: "#{args[:color]}AngleButton") do
        haml_tag(:a, href: args[:href] || '#', class: "lpButton2010") { haml_tag(:span, args[:title]) }
      end
    end
  end

  def show_arrow(style)
    if style=='destinations' ||  style=='destinations current'
      capture_haml do
        haml_tag(:span, class: 'arrow')
      end
    end
  end
  
  def title_for(title_content,span_content='')
    capture_haml do
      haml_tag(:h1) do
        haml_tag(:span) { haml_concat title_content }
        haml_concat span_content
      end
    end
  end
  
  def breadcrumbs_nav(breadcrumb_content)
    render :partial=>'layouts/core/snippets/footer_breadcrumbs', locals: {breadcrumbs: breadcrumb_content || []}
  end
  
  def breadcrumb_for(breadcrumb_content=[])
    capture_haml do
      haml_tag(:div, id: 'breadcrumbWrap', class: 'posChange') do
        haml_tag(:ol, id: 'breadcrumb') do
          breadcrumb_content.each_with_index do |item, index|
            li_class = index == breadcrumb_content.size-1 ? "breadcrumb-item last" : "breadcrumb-item twoCol"
            if item[:slug].blank?
              haml_tag(:li, class: li_class) { haml_tag(:span, class: 'breadcrumb-item-title') { haml_concat item[:place] } }
            else
              haml_tag(:li, class: li_class) { haml_tag(:a, class: 'breadcrumb-item-title', href: "http://www.lonelyplanet.com/#{item[:slug]}") { haml_concat item[:place] } }
            end
          end
        end
      end
    end
  end  
  
end
