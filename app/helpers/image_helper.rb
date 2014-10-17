require 'resrcit'

module ImageHelper

  def safe_image_tag(image_url, opts={})
    return if image_url.blank?
    if lazyload = opts.delete(:lazyload)
      lazyloaded_image_tag(image_tag(image_url, opts))
    else
      image_tag(image_url, opts)
    end
  end

  def lazyloaded_image_tag(image)
    html = raw("<div data-uncomment=true>")
    html += raw("<!-- #{image.to_s} -->")
    html += raw("</div>")
    html.html_safe
  end

  def resrcit_url(opts={}, src)
    helper = src.is_a?(String) ? ResrcIt.new(opts, src) : src.dup

    helper = helper.crop(opts[:crop]) if opts[:crop]
    helper = helper.square_crop if opts[:square_crop]
    helper = helper.aspect_ratio({ ratio: opts[:aspect_ratio] }) if opts[:aspect_ratio]
    helper = helper.resize(opts[:resize]) if opts[:resize]
    helper = helper.optimize(opts[:optimize]) if opts[:optimize]

    helper.generated_url
  end

  def srcset_url(opts={}, src, retina)
    url = resrcit_url(opts, src)
    scale_factor = 1.5

    if retina
      retina_opts = opts.dup
      crop = retina_opts[:crop]
      resize = retina_opts[:resize]

      if resize
        resize[:width] = resize[:width].to_i * scale_factor if resize[:width]
        resize[:height] = resize[:height].to_i * scale_factor if resize[:height]
        retina_opts[:resize] = resize
      end

      if crop
        crop[:width] = crop[:width].to_i * scale_factor if crop[:width]
        crop[:height] = crop[:height].to_i * scale_factor if crop[:height]
        crop[:x_offset] = crop[:x_offset].to_i * scale_factor if crop[:x_offset]
        crop[:y_offset] = crop[:y_offset].to_i * scale_factor if crop[:y_offset]
        retina_opts[:crop] = crop
      end

      retina_opts[:quality] = 85

      url = "#{url}, #{resrcit_url(retina_opts, src)} 2x"
    end

    url
  end

end
