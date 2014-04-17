getUrlPathName = (path) ->
  link = document.createElement("a")
  link.href = path
  link.pathname

fetchNewContent = (path) ->
  $.ajax
    url: path
    error: (jqXHR, textStatus, errorThrown) ->
      msg = "Oops, something went wrong trying to get that page. #{errorThrown}"
      if (/(localhost|127\.0\.0\.1)/.test(location.hostname))
        msg += "<br>Are you sure you have your local Rizzo server running?"
      $error = $("<div class='alert alert--error icon--cross--before'>#{msg}</div>")
      $('.row--secondary').after($error)
      $error.slideUp(0).slideDown()
      setTimeout ->
        $('.row--secondary + .alert').slideUp ->
          $(@).remove()
      , 7500
    success: (result) ->
      $("#js-main-content").html result
      $("#js-left-nav").find(".js--item").removeClass "is-active"
      $("#js-left-nav").find("[href=\"" + getUrlPathName(path) + "\"]").addClass "is-active"
      window.history.pushState
        state: path
      , null, path


$("#js-left-nav").on "click", ".js--item", (e) ->
  e.preventDefault()
  fetchNewContent @href
