getUrlPathName = (path) ->
  link = document.createElement("a")
  link.href = path
  link.pathname

fetchNewContent = (path) ->
  $.ajax
    url: path
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