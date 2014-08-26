# Naming

Naming things is hard but worth getting right. To make it somewhat simpler we use the BEM methodology within class names. BEM also helps us to avoid cross module collisions and to signify intent and relationships from the classnames.

Our version of BEM follows this syntax:

* .block {}
* .block__element {}
* .block--modifier {}

For example:

    <div class="gallery">
      <h1 class="gallery__title">Gallery</h1>
      <img class="gallery__image gallery__image--large" />
      <img class="gallery__image" />
      <img class="gallery__image" />
    </div>


## States

We use the `is-` prefix to show state:

    <div class="is-hidden">This element has state</div>


## Javascript hooks

    <div class="tab js-tab">This element can be reached by javascript</div>

 * These ensure that we maintain a distinction between content and functionality
 * They should *never* be styled

