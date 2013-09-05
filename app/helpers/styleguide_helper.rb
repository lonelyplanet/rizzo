module StyleguideHelper

  def cards_stub
    [
      {
        kind: "ad_sense",
        slug: "#",
        double: false,
        title: "Hello",
        image_url: "stubs/article.jpg",
        strapline: "Just a little article about the many ways to say hello",
        subtitle: "Just a little blog about the many ways to say hello",
        place_name: "Paris"
      },
      {
        kind: "need_to_know",
        slug: "#",
        double: false,
        title: "Hello",
        links: [
          { url: "/", title: "What to take" },
          { url: "/", title: "When to go"},
          { url: "/", title: "Money"},
          { url: "/", title: "Weather"},
          { url: "/", title: "Getting there"},
          { url: "/", title: "Warnings"}
        ]
      },
      {
        kind: "collection",
        slug: "#",
        hero: false,
        title: "Top picks for Iceland",
        image_url: 'stubs/collection.jpg'
      },
      {
        kind: "collection",
        slug: "#",
        hero: true,
        title: "Four days in Argentina",
        image_url: 'stubs/itinerary-full.jpg'
      },
      {
        kind: "media",
        resized_image_url: "stubs/sight.jpg",
        resized_video_url: "stubs/video-thumb.jpg"
      },
      {
        kind: "place",
        slug: "#",
        double: false,
        title: "Paris",
        image_url: "stubs/article.jpg",
        strapline: "Some information about Paris and its environs"
      },
      {
        kind: "double_image",
        cards: [
          {
            slug: "#",
            double: false,
            resized_image_url: ""
          },
          {
            slug: "#",
            double: false,
            resized_image_url: ""
          }
        ]
      }
    ]
  end

  def link_cards
    [
      {
        kind: "link",
        slug: "#",
        hero: false,
        title: "Sights"
      },
      {
        kind: "link",
        slug: "#",
        hero: false,
        title: "Activities"
      },
      {
        kind: "link",
        slug: "#",
        hero: false,
        title: "Entertainment"
      },
      {
        kind: "link",
        slug: "#",
        hero: false,
        title: "Restaurants"
      },
      {
        kind: "link",
        slug: "#",
        hero: false,
        title: "Shopping"
      },
      {
        kind: "link",
        slug: "#",
        hero: false,
        title: "Sleep"
      },
      {
        kind: "link",
        slug: "#",
        hero: false,
        title: "Tours"
      }

    ]
  end

  def ad_config
    {hints: "", channels: ""}
  end

end