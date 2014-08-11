module UiHelper

  def ui_classes_alert_type(properties, classes = [])
    classes.push(properties[:subtle] ? "alert--subtle" : "alert--block")
    classes.push("alert alert--#{properties[:type].downcase}").join(" ")
  end

  def ui_classes_alert_icon(properties)
    "icon--#{alert_class_mapping[:"#{properties[:type].downcase}"]}--before"
  end

  private

  def alert_class_mapping
    {
      success: "tick",
      error: "cross",
      warning: "caution",
      announcement: "loudspeaker"
    }
  end

end
