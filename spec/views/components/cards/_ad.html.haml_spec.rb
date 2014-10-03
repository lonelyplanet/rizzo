require 'spec_helper'

describe 'components/cards/_ad.html.haml' do

  let(:ad_size)       { 'mpu' }
  let(:ad_format)     { 'mpu' }
  let(:ad_partial)    { 'mpu' }
  let(:ad_position)   { nil }
  let(:ad_extension)  { nil }

  let(:ad_properties) do
    {
      size: {
        mapping: ad_size
      },
      targeting: {
        position: ad_position
      },
      extension: ad_extension
    }
  end

  let(:properties) do
    {
      double?: true,
      format: ad_format,
      label: 'Advertisement',
      partial_type: ad_partial,
      properties: ad_properties
    }
  end

  describe 'Ad unit properties' do

    it 'generates a card variation class' do
      view.stub(properties: properties)

      render

      rendered.should have_css(".card--sponsored--#{ad_format}")
    end

    it 'renders the ad unit sub-component' do
      view.stub(properties: properties)

      render

      rendered.should have_css(".adunit--#{ad_format}")
    end

    context 'double MPU' do

      let(:ad_size)       { 'mpu-double' }
      let(:ad_position)   { 'stack' }
      let(:ad_extension)  { 'stackMPU' }

      it 'decorates ad unit with given data' do
        view.stub(properties: properties)

        render

        rendered.should have_css("[data-targeting='#{ad_properties[:targeting].to_json}']")
        rendered.should have_css("[data-extension='#{ad_extension}']")
        rendered.should have_css("[data-size-mapping='#{ad_size}']")
      end

    end

  end

end
