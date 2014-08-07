module AdHelper

  AD_SENSE_ID = "ca-pub-7817033512402772"

  def ad_sense_properties(type)
    if type == "leaderboard"
      return { height: 90, width: 728, ad_slot: 8090484046, id: AD_SENSE_ID }
    end
    { height: 312, width: 162, ad_slot: 2903404846, id: AD_SENSE_ID }
  end

end
