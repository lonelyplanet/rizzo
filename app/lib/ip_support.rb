require "ipaddr"

module IpSupport

  def is_lp_office?(ip_string)
    begin
      ip = IPAddr.new(ip_string)
      IpSupport.ip_ranges['lp_offices'].each do |range|
        return true if range === ip
      end
      false
    rescue ArgumentError
    end
  end

  def true_client_ip(request)
    headers_list = ["True-Client-IP", "HTTP_TRUE_CLIENT_IP", "TRUE_CLIENT_IP", "X-Forwarded-For"]
    headers_list.map { |h| request.headers[h] }.compact.first || request.remote_ip
  end

  def self.ip_ranges
    unless @ip_ranges
      ranges = load_ip_ranges_yml
      @ip_ranges = {}
      ranges.each do |group, ips|
        @ip_ranges[group] = []
        ips.each do |ip|
          if ip =~ /([\d\.]+)\s*-\s*([\d\.]+)/
            ip1 = IPAddr.new($1)
            ip2 = IPAddr.new($2)
            @ip_ranges[group] << (ip1..ip2)
          else
            @ip_ranges[group] << IPAddr.new(ip)
          end
        end
      end
    end
    @ip_ranges
  end

  def self.load_ip_ranges_yml
    YAML.load_file("#{File.expand_path(File.dirname(__FILE__)+'../../..')}/config/ip_ranges.yml")
  end

end