Autocomplete
============

An autocomplete widget. Built to be as reusable as possible. Means a tiny bit more work for the instantiator, but hopefully flexible and simple enough to be used in different contexts.


Clone this repository. Run `npm install` and `bower install`. Then run `grunt`. This will start up a server at `localhost:8000` and will run jasmine tests. Navigate to /index.html and you'll be presented with a sample of this autocomplete (see screenshot). It is running on local data, and should give you a good feel of what this autocomplete does. Tailor it to your needs and use it in your own project!

![autocomplete](/autocomplete-example.png)

## Dependencies
* jQuery

## Usage
The AutoComplete widget is always instantiated with an html element. This element is expected to be an `input` element, as the user will type and be presented with a set of matched results. Other than the element, you will also want to set a threshold of character that must be typed before the Autocomplete will start fetching results. By default this is set at 2, but you can override that.

Essentially your code will look like this:

```js
new AutoComplete({
  el: "#myInputElement",
  threshold: 2,
  fetch: function(searchTerm, callback) {

  },
  template: function(results) {

  },
  onItem: function(el) {

  }
});
```
Once `new AutoComplete` is instantiated, it changes the original `<input type="text" />`. It wraps it in an '.autocomplete' div and appends a result div after.

```html
<div class="autocomplete">
  <input id="something" type="text" />
  <div class="autocomplete__results">
    <ul>
      <li>result 1</li>
      <li class="autocomplete__results--highlight">result 2</li>
      <li>result 3</li>
    </ul>
  </div>
</div>
```

## fetch(), template(), and onItem() Explained
There are three custom functions which must be passed to this widget for it to be useful. They are explained below.

### fetch()
As a user is typing, the widget takes the string of typed text and passes it to this fetch function. When instantiating this widget you should create your own custom fetch() function. This function receives two arguments: `searchTerm` and a `callback`. The searchTerm will come as a string and you do with it whatever you want (ping an endpoint with an XHR request, iterate through local data, up to you). Whenever you are satisfied and have results, simply use `callback()` and pass it the array of results in JSON format.

**Local Example:**
```js
new AutoComplete({
  ...
  fetch: myFetch,
  ...
});


var myFetch = function(searchTerm, callback) {
  var results = [],
      mydata = [{name: "David", age: 2}, {name: "Mark", age: 4}],
      searchString = searchTerm.toLowerCase();
  for(var i = 0; i < mydata.length; i++) {
    if(mydata[i].name.toLowerCase().indexOf(searchString) != -1) {
      results.push(mydata[i]);
    }
  }
  callback(results);
};
```

**XHR Example:**
```js
new AutoComplete({
  ...
  fetch: myFetch,
  ...
});

var myFetch = function(searchTerm, callback) {
  var results = [];
  $.ajax({
    url: "http://www.mysite.com/endpoint/search?q=" + searchTerm
  }).done(function(data) {
    callback(data);
  });
};
```

### template()
The template function (todo: make easier), is sent the results as an array. This array can be iterated over and the result set is created. You must return an html string of `li` elements.

**Example:**
```js
new AutoComplete({
  ...
  template: myTemplate,
  ...
});

var myTemplate = function(results) {
  var listitems = "";
  for(var i = 0, i < results.length; i++) {
    listitems += "<li>" + results[i] + "</li>";
  }
  return listitems;
}
```

That was the most basic example. More likely you would have extra data-* attributes, maybe a formatted list item, etc. It's entirely up to the user how these list items should be displayed.

### onItem()
Just as the first two functions basically give you full control of how the data is fetched, and how it is looked, this function gives you full control of what happens when a user **selects** a result in the autocomplete. The typical case is the input value is replaced by the value of the result. But sometimes you may want to do other things (set hidden variables in your form based on the data-id of the list item, navigate directly to a url, etc.).

This function is sent the DOM element (not the jQuery element, the actual DOM element) of the selected item. So you are receiving exactly **one** list item that will be formatted just as you specified in the myTemplate() function.

**Example:**
```js
new AutoComplete({
  ...
  template: myTemplate,
  ...
});

var myOnItem = function(el) {
  var selectedValue = $(el).text();
  $("#myInput").val(selectedValue);
}
```

## CSS
By default this should work without much styling, but here are some recommended styling options to set:

```css
.is-hidden {
  display: none;
}
.autocomplete__results {
  border: 1px solid #ccc;
  max-height: 200px;
  overflow-y: scroll;
}
.autocomplete__results ul {
  list-style: none;
  margin: 0px;
  padding: 0px;
}
.autocomplete__results ul li {
  border-bottom: 1px solid #ccc;
  padding: 3px;
  font-size: 0.8em;
}
.autocomplete__results ul li:last-child {
  border: 0px;
}
.autocomplete__results ul li:hover,
.autocomplete__results--highlight {
  background: #efefef;
}
```
