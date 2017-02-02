// This is a template file for what will output to `rizzo-next.js`
import "babel-polyfill";
import "matchmedia-polyfill/matchMedia";
import "matchmedia-polyfill/matchMedia.addListener";

import header from "/Users/jonathanc/LonelyPlanet/repos/rizzo-next/src/components/header/index.js";
import topic from "/Users/jonathanc/LonelyPlanet/repos/rizzo-next/src/components/topic/index.js";
import search from "/Users/jonathanc/LonelyPlanet/repos/rizzo-next/src/components/search/index.js";
import login from "/Users/jonathanc/LonelyPlanet/repos/rizzo-next/src/components/login/index.js";
import footer from "/Users/jonathanc/LonelyPlanet/repos/rizzo-next/src/components/footer/index.js";

let rizzo = {};

rizzo["Header"] = header;
rizzo["Topic"] = topic;
rizzo["Search"] = search;
rizzo["Login"] = login;
rizzo["Footer"] = footer;

export default rizzo;
