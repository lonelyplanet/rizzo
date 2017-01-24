  var ck_duration = 30; //in days please
  var ck_exp = new Date; ck_exp.setDate(ck_exp.getDate() + ck_duration);
  var adv = adv || {};

  // parseUri 1.2.2
  // (c) Steven Levithan <stevenlevithan.com>
  // MIT License
  function parseUri(d){for(var a=parseUri.options,d=a.parser[a.strictMode?"strict":"loose"].exec(d),c={},b=14;b--;)c[a.key[b]]=d[b]||"";c[a.q.name]={};c[a.key[12]].replace(a.q.parser,function(d,b,e){b&&(c[a.q.name][b]=e)});return c}
  parseUri.options={strictMode:!1,key:"source protocol authority userInfo user password host port relative path directory file query anchor".split(" "),q:{name:"queryKey",parser:/(?:^|&)([^&=]*)=?([^&]*)/g},parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/}};

  window.landinguri = parseUri(document.URL);
  if(document.referrer !== ""){
    window.refuri = parseUri(document.referrer);
  }else{
    window.refuri = false;
  }

  function getSubDomain(){
    var full = window.location.host;
    var parts = full.split('.');
    return parts[0];
  }

  function getURLChannel(){
    var full = window.location.href;
    var parts = full.split('/');
    return parts[3];
  }

  /* SiteCatalyst code version: H.25.4.
     Copyright 1996-2012 Adobe, Inc. All Rights Reserved
     More info available at http://www.omniture.com */

  var s_account="lonelyplanet-global";
  switch(getSubDomain()){
    case "shop":
      s_account = "lonelyplanet-global,lonelyplanet-shop";
      break;
    case "secure":
      s_account = "lonelyplanet-global,lonelyplanet-shop";
      break;
    case "hotels":
      s_account = "lonelyplanet-global,lonelyplanet-lphotels";
      break;
  }
  /* */
  if(getURLChannel() == "bookings"){
    s_account = "lonelyplanet-bookingservices,lonelyplanet-global";
  }else if(getURLChannel() == "campaigns" || getURLChannel() == "competitions" || getURLChannel() == "advertorial" ){
    s_account = "lonelyplanetmicrosites,lonelyplanet-global";
  }else if(getURLChannel() == "groups"){
    s_account = "lonelyplanet-groups,lonelyplanet-global";
  }else if(getURLChannel() == "blog"){
    s_account = "lonelyplanet-blogs,lonelyplanet-global";
  }else if(getURLChannel() == "hotels"){
    s_account = "lonelyplanet-global,lonelyplanet-lphotels";
  } /* */

  if(getSubDomain() == 'secure' && (getURLChannel() == 'sign-in' || getURLChannel() == 'members')){
    s_account = "lonelyplanet-global,lonelyplanet-profile";
    s_account = "lonelyplanet-global,lonelyplanet-profile";
  }

  var s=s_gi(s_account);
  /************************** CONFIG SECTION **************************/
  /* You may add or alter any code config here. */
  s.charSet="UTF-8";
  /* Conversion Config */
  s.currencyCode="AUD";
  /* Link Tracking Config */
  s.trackDownloadLinks=true;
  s.trackExternalLinks=true;
  s.trackInlineStats=true;
  s.linkDownloadFileTypes="exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx";
  s.linkInternalFilters="javascript:,.lonelyplanet.com,//lonelyplanet.com,www.lonelyplanet.tv,load.lpo";
  s.linkLeaveQueryString=false;
  s.linkTrackVars="None";
  s.linkTrackEvents="None";

  s.server=window.location.host;

  if(typeof setupOmnitureUserInfo == 'function'){
    setupOmnitureUserInfo(s);
  }

  /* WARNING: Changing any of the below variables will cause drastic
     changes to how your visitor data is collected.  Changes should only be
     made when instructed to do so by your account manager.*/
  s.visitorNamespace="lonelyplanet";
  s.trackingServer="om.lonelyplanet.com";
  s.trackingServerSecure="oms.lonelyplanet.com";




  /* Scripts to run Post-Plugins */
  function s_postPlugins(s) {
    /* this gets run after standard doPlugins routines */

    if(getURLChannel() == "blog"){
      s.channel = "blogs";
      s.eVar2 = s.channel;

      s.prop1 = "inside digital";
      s.eVar3 = s.prop1;

      tmp = document.title.toLowerCase();

      s.prop11 = tmp;
      s.eVar7 = s.prop11;

      s.pageName = s.channel + " : " + s.prop1 + " : " + tmp;

      // Populate Entry Section
      s.eVar18 = s.eVar2;
    }


    if(s.channel == "lpHotels"){
      s.eVar3 = s.prop1;

      // Populate content type variables
      if(!s.prop7){
      s.prop7 = s.prop1;
    }
    if(!s.eVar12){
        s.eVar12 = s.prop1;
    }
    }

    // 2013-06-23 Fixed `toLowercase() on undefined` bug when channel isn't defined.
    if(s.channel && s.channel.toLowerCase() == "thorntree"){
      // Populate content type variables
      if(!s.prop7){
      s.prop7 = s.prop1;
    }
    if(!s.eVar12){
        s.eVar12 = s.prop1;
    }
    }

    /* Code to clear out the referrer when clicking on the Flash applications */
    if (s.prop26 == 'Flash Carousel' || s.prop26 == 'Flash Destination Map')
    {
      s.referrer = "http://www.lonelyplanet.com/";
    }

    /* Code to trim the Flash Carousel link name and modify the logging of prop27 to enable easier filtering of data  */
    if (s.prop26 == 'Flash Carousel')
    {
      // Trim any trailing space from this variable
      var tmp27 = s.prop27;
      s.prop27 = tmp27.replace(/\s+$/,"");
      // Rework the pagename to include Flash Carousel and therefore enable easier filtering of data
      s.prop27 = s.prop26 + " : " + s.prop27;
      s.eVar32 = s.prop27;
    }

    /*  Code to clear out old WG continent variable on the search page, as this is now being re-used for another purpose */
    if (s.pageName == 'search : results : guided results')
    {
      s.eVar10 = "";
      s.prop5 = "";
      // Also clear out country filter variables
      s.eVar11 = "";
      s.prop6 = "";
      // Also clear out the section filter values
      s.eVar19 = "";
      s.prop14 = "";

    }else /* Code to populate the custom events for Groups actions */
      if (s.pageName == 'groups : groups created')
      {
        /* Populate the Create Group event */
        if(s.events == null || s.events == "") {
          s.events="event35";
        }
        else {
          s.events= s.events + ",event35";
        }
      }

    if (s.pageName == 'groups : groups message created')
    {
      /* Populate the Create Group Message event */
      if(s.events == null || s.events == "") {
        s.events="event36";
      }
      else {
        s.events= s.events + ",event36";
      }
    }

    if (s.pageName == 'groups : groups photo created')
    {
      /* Populate the Create Group Photo event */
      if(s.events == null || s.events == "") {
        s.events="event37";
      }
      else {
        s.events= s.events + ",event37";
      }
    }

    // Populate Entry Section
    s.eVar18 = s.eVar2;

    // Populate previous section
    varPrevSection = s.getPreviousValue(s.eVar2,'gpv_v2');
    if (typeof(varPrevSection) != "undefined")
    {
      if (s.eVar2 == varPrevSection)
      {
        // The values are the same - so don't log the previous section eVar
      }
      else if (varPrevSection == "")
      {
        // There is no previous value set - set to entered site
        s.eVar34 = "Entered Site : " + s.eVar2;
      }
      else
      {
        // The values are different - set to the new values
        s.eVar34 = varPrevSection + " : " + s.eVar2;
      }
    }
    // Fetch URL path and convert to lower case for URL path tracking
    varPathName = document.location.pathname;
    s.prop41 = varPathName.toLowerCase();


    /* Code to populate the last level of the pagename in destinations */
    if(s.channel == "dest" || s.channel == "thorntree"  || s.channel == "lphotels" ){
      if (!(s.prop8=='video') && !(s.prop8=='photo') && !(s.prop9=='best in travel') && s_objectID == undefined)
      {
        if (s.prop7==null) {
          // Do nothing
        }
        else if (s.prop8==null) {
          s.pageName = s.pageName + " : " + s.prop7;
        }
        else if (s.prop9==null) {
          s.pageName = s.pageName + " : " + s.prop8;
        }
        else if (s.prop9.length > 0) {
          s.pageName = s.pageName + " : " + s.prop9;
        }

        // Code to modify logging of homepage variable to represent continent vs country vs region
        if (s.prop7=="homepage") {
          if (s.prop1==null) {
            // Do nothing
          }
          else if (s.prop2==null) {
            s.prop7 = "continent " + s.prop7;
          }
          else if (s.prop3==null) {
            s.prop7 = "country " + s.prop7;
          }
          else if (s.prop3.length > 0) {
            s.prop7 = "region " + s.prop7;
          }
          s.eVar12 = s.prop7;
        }

        // Code to log content type variable on the destinations homepage
        if (s.pageName == "dest : homepage")
        {
          s.prop7 = "dest homepage";
            s.eVar12 = s.prop7;
        }

        // Code to modify logging of the tips and articles pagename to enable easier reporting for sponsored articles
        if (s.prop8=="Tips and Articles Detail") {
          s.pageName = s.channel + " : " + s.prop8 + " : " + s.prop11;
        }
      }

      if(s.events == null || s.events == "" || s.events == "event4" ) {
        s.events="event4";
      }
      else {
        s.events= s.events + ",event4";
      }
    }
  }

  /* Plugin Config */
  s.usePlugins=true;
  function s_doPlugins(s) {
    /* Add calls to plugins here */

    /* Global nav linkstacking */
    s.prop70 = s.eVar70 = s.getlinkstack();

    if(s.eVar4){
      s.eVar4 = s.eVar4.replace("hh","");
    }

    if(s.getQueryParam("lpaffil") != 'undefined'){
      s.eVar1=s.getQueryParam("lpaffil");  //External Campaigns
    }

    if(s.getQueryParam("et_cid") != 'undefined'){
      s.eVar57=s.getQueryParam('et_cid');  //exact target
    }

    s.campaign=s.getQueryParam('affil');  //Internal Campaigns
    s.eVar10=s.getQueryParam('intaffil');  //Intra-site Campaigns

    /* ExactTarget */
    s.eVar20=s.getQueryParam("et_rid");
    if (window.s_postPlugins) { s_postPlugins(s); }

    /* clickPast */
    s.SEMvar = s.getQueryParam('s_kwcid');
    s.SEMvar = s.getValOnce(s.SEMvar,'SEM_var',0);
    //s.clickPast('s_kwcid','event59','event60');
    s.clickThruQuality('s_kwcid','event59','event60');

    /* manageQueryParam v1.2 */
    s.pageURL=s.manageQueryParam('s_kwcid',1,1);

    try { if(typeof(_vis_opt_settings_loaded) == "boolean"){

      var _combination = _vis_opt_readCookie('_vis_opt_exp_'+_vis_opt_experiment_id+'_combi');
      if(typeof(_vis_opt_comb_name[_combination]) != "undefined"){
        s.eVar11= _vis_opt_experiment_id + ':' + _vis_opt_comb_name[_combination]  + ':' + s.eVar4  + ':' + s.eVar5;  }

    } } catch(err) { }

    adv.doCampaignManagement(ck_exp);

  }


  s.doPlugins=s_doPlugins;



  /************************** PLUGINS SECTION *************************/
  /* You may insert any plugins you wish to use here.                 */

  /*
   * Plugin: manageQueryParam v1.2 - correct parameters in query string
   */
  s.manageQueryParam=new Function("p","w","e","u",""
      +"var s=this,x,y,i,qs,qp,qv,f,b;u=u?u:(s.pageURL?s.pageURL:''+s.wd.lo"
      +"cation);u=u=='f'?''+s.gtfs().location:u+'';x=u.indexOf('?');qs=x>-1"
      +"?u.substring(x,u.length):'';u=x>-1?u.substring(0,x):u;x=qs.indexOf("
      +"'?'+p+'=');if(x>-1){y=qs.indexOf('&');f='';if(y>-1){qp=qs.substring"
      +"(x+1,y);b=qs.substring(y+1,qs.length);}else{qp=qs.substring(1,qs.le"
      +"ngth);b='';}}else{x=qs.indexOf('&'+p+'=');if(x>-1){f=qs.substring(1"
      +",x);b=qs.substring(x+1,qs.length);y=b.indexOf('&');if(y>-1){qp=b.su"
      +"bstring(0,y);b=b.substring(y,b.length);}else{qp=b;b='';}}}if(e&&qp)"
      +"{y=qp.indexOf('=');qv=y>-1?qp.substring(y+1,qp.length):'';var eui=0"
      +";while(qv.indexOf('%25')>-1){qv=unescape(qv);eui++;if(eui==10)break"
      +";}qv=s.rep(qv,'+',' ');qv=escape(qv);qv=s.rep(qv,'%25','%');qv=s.re"
      +"p(qv,'%7C','|');qv=s.rep(qv,'%7c','|');qp=qp.substring(0,y+1)+qv;}i"
      +"f(w&&qp){if(f)qs='?'+qp+'&'+f+b;else if(b)qs='?'+qp+'&'+b;else qs='"
      +"?'+qp}else if(f)qs='?'+f+'&'+qp+b;else if(b)qs='?'+qp+'&'+b;else if"
      +"(qp)qs='?'+qp;return u+qs;");

  /*
   * Plugin: clickPast - version 1.0
   */
  s.clickPast=new Function("scp","ct_ev","cp_ev","cpc",""
      +"var s=this,scp,ct_ev,cp_ev,cpc,ev,tct;if(s.p_fo(ct_ev)==1){if(!cpc)"
      +"{cpc='s_cpc';}ev=s.events?s.events+',':'';if(scp){s.events=ev+ct_ev"
      +";s.c_w(cpc,1,0);}else{if(s.c_r(cpc)>=1){s.events=ev+cp_ev;s.c_w(cpc"
      +",0,0);}}}");
  s.p_fo=new Function("n",""
      +"var s=this;if(!s.__fo){s.__fo=new Object;}if(!s.__fo[n]){s.__fo[n]="
      +"new Object;return 1;}else {return 0;}");
  /*
   * Plugin clickThruQuality v1.0 - Bounce Rate
   */
  s.clickThruQuality =new Function("scp","tcth_ev","cp_ev","cff_ev","cf_th",""
      +"var s=this;if(s.p_fo('clickThruQuality')==1){var ev=s.events?s.even"
      +"ts+',':'';if(s.getQueryParam&&s.getQueryParam(scp)){s.events=ev+tct"
      +"h_ev;if(s.c_r('cf')){var tct=parseInt(s.c_r('cf'))+1;s.c_w('cf',tct"
      +",0);if(tct==cf_th&&cff_ev){s.events=s.events+','+cff_ev;}}else {s.c"
      +"_w('cf',1,0);}}else {if(s.c_r('cf')>=1){s.c_w('cf',0,0);s.events=ev"
      +"+cp_ev;}}}");
  s.p_fo=new Function("n",""
      +"var s=this;if(!s.__fo){s.__fo=new Object;}if(!s.__fo[n]){s.__fo[n]="
      +"new Object;return 1;}else {return 0;}");
  /*
   * Plugin: getValOnce_v1.0
   */
  s.getValOnce=new Function("v","c","e",""
      +"var s=this,a=new Date,v=v?v:v='',c=c?c:c='s_gvo',e=e?e:0,k=s.c_r(c"
      +");if(v){a.setTime(a.getTime()+e*86400000);s.c_w(c,v,e?a:0);}return"
      +" v==k?'':v");

  /*
   * Plugin: getPreviousValue_v1.0 - return previous value of designated
   *   variable (requires split utility)
   */
  s.getPreviousValue=new Function("v","c","el",""
      +"var s=this,t=new Date,i,j,r='';t.setTime(t.getTime()+1800000);if(el"
      +"){if(s.events){i=s.split(el,',');j=s.split(s.events,',');for(x in i"
      +"){for(y in j){if(i[x]==j[y]){if(s.c_r(c)) r=s.c_r(c);v?s.c_w(c,v,t)"
      +":s.c_w(c,'no value',t);return r}}}}}else{if(s.c_r(c)) r=s.c_r(c);v?"
      +"s.c_w(c,v,t):s.c_w(c,'no value',t);return r}");

  /*
   * Plugin: getQueryParam 2.3
   */
  s.getQueryParam=new Function("p","d","u",""
      +"var s=this,v='',i,t;d=d?d:'';u=u?u:(s.pageURL?s.pageURL:s.wd.locati"
      +"on);if(u=='f')u=s.gtfs().location;while(p){i=p.indexOf(',');i=i<0?p"
      +".length:i;t=s.p_gpv(p.substring(0,i),u+'');if(t){t=t.indexOf('#')>-"
      +"1?t.substring(0,t.indexOf('#')):t;}if(t)v+=v?d+t:t;p=p.substring(i="
      +"=p.length?i:i+1)}return v");
  s.p_gpv=new Function("k","u",""
      +"var s=this,v='',i=u.indexOf('?'),q;if(k&&i>-1){q=u.substring(i+1);v"
      +"=s.pt(q,'&','p_gvf',k)}return v");
  s.p_gvf=new Function("t","k",""
      +"if(t){var s=this,i=t.indexOf('='),p=i<0?t:t.substring(0,i),v=i<0?'T"
      +"rue':t.substring(i+1);if(p.toLowerCase()==k.toLowerCase())return s."
      +"epa(v)}return ''");

  /*
   * Plugin: getValOnce 0.2 - get a value once per session or number of days
   */
  s.getValOnce=new Function("v","c","e",""
      +"var s=this,k=s.c_r(c),a=new Date;e=e?e:0;if(v){a.setTime(a.getTime("
      +")+e*86400000);s.c_w(c,v,e?a:0);}return v==k?'':v");

  /*
   * Plugin: trackas 1.0 - call to track the availability search.  Refer to separate documentation
   * Written by Tom Marianczak of Adversitement BV
   * Last updated 2012/12/14
   */
  s.trackas = function(asobj)
  {
    //default the params if necessary
    var eventstotrack = [], varstotrack = [];
    varstotrack.push('events','products');
    asobj.linktracktype = asobj.linktracktype || 'o'; //default to other
    asobj.product_name = asobj.product_name || asobj.type;
    incrementor = "";

    if(asobj.type === 'hotel')
    {
      //is hotel - lets set the events
      switch(asobj.sub_type){
        case 'list':
          eventstotrack.push('event31');
        break;
        case 'details':
          eventstotrack.push('event32');
        break;
        case 'landing-page':
          eventstotrack.push('event30');
        break;
      }

      s.eVar39 = asobj.booking_duration;
      s.eVar61 = asobj.booking_start;
      s.eVar62 = asobj.booking_people;
      varstotrack.push('eVar39','eVar61','eVar62');
    }

    //these items are common to all search types
    s.eVar3 = asobj.location_region;
    s.eVar4 = asobj.location_country;
    s.eVar5 = asobj.location_city;
    s.eVar38 = asobj.booking_currency;
    varstotrack.push('eVar3', 'eVar4', 'eVar5', 'eVar38');

    //now we need to create a link name for the tracklink Function
    linkname = "lp:availability-search:"+asobj.type+":"+asobj.sub_type;

    //now setup the actual link tracking
    s.linkTrackVars = varstotrack.join();
    s.linkTrackEvents = s.events = eventstotrack.join();
    //and send the tracking event
    s.tl(this,asobj.linktracktype,linkname);

    //so we've set everything and sent the tracking call
    //lets return true so that the system continues to work
    return true;
  }

  /**************************************
  *
  * Custom Navigation Link Stacking functions is a suite of functions
  * that processes multiple navigation link clicks into a trackable value
  *   in sitecatalyst
  *
  * @params linkname (the link tracking object)
  *   @returns boolean true (ensures that subsequent functionality is not broken)
  *
  ****************************************/

  s.linkstacker = function(linkname)
  {
      var maxstk = 5; //change for different stack size
      var ckduration = 30; //number of days to keep cookie for
      var curr_lnkstk = s.c_r("s_lnkstkr").split("|") || [];
      var lastlnk = curr_lnkstk.pop();  //pop off the last item added
      var strt = 0;
      s.expiry=new Date();
      var ct=s.expiry.getTime();  //expiry of cookie
      s.expiry.setTime(ct+ckduration*24*60*60*1000);

      if(lastlnk !== linkname){
          curr_lnkstk.push(lastlnk);  //add the last item back if not the same as new item
      }

      curr_lnkstk.push(linkname);  //add the new item.

      if(curr_lnkstk.length-maxstk > 0){
          strt = curr_lnkstk.length-maxstk;
      }

      curr_lnkstk = curr_lnkstk.slice(strt, curr_lnkstk.length);  //only use the latest 5

      if(curr_lnkstk[1]){
          lnkstk = curr_lnkstk.join("|");
      }else{
          lnkstk = curr_lnkstk[0];
      }

      s.c_w("s_lnkstkr", lnkstk, s.expiry);
      s.c_w("s_trklnkstk", "true", s.expiry);
  }

  s.clearlinkstack = function(){
      s.c_w("s_lnkstkr", "");
      s.c_w("s_trklnkstk", "");
      return true;
  }

  s.getlinkstack = function(){
      //returns the link stack for tracking usage.
      //checks for the send tracking flag and returns the complete stack if found.

      if(s.c_r("s_trklnkstk") === "true"){
          s.c_w("s_trklnkstk", "");
          return s.c_r("s_lnkstkr");
      }

      return "";
  }
  /**********Campaign management plugin *********************/

  adv.getCampaignChannel = function(landinguri, campcode, refuri){
      //setup the different campaign channels available
      var channels = {
          "seo":"seo",
          "ppc":"sem",
      "sem":"sem",
          "soc":"social",
          "soc_other":"social",
          "eml":"email",
          "pns":"partnership",
          "aff":"affiliate",
          "qr":"qr-code",
          "pdf":"pdf-code",
          "pub":"publishing-code",
          "cs":"cs-microsite-code",
          "us":"us-paid-other",
          "uk":"uk-paid-other",
          "au":"au-paid-other",
          "other_ref":"other-referring-domain",
          "other":"unknown-paid",
      "dem":"dem",
          "direct":"direct"
      }

      if(campcode){
          //derive channel from campcode
          var ccparts = [], i=0;

      var separators = ["|", "-", "_", ":"];

      while(ccparts.length < 2 && i < separators.length){
        ccparts = campcode.toLowerCase().split(separators[i]);
        i++;
      }

      if(channels[ccparts[0]]){
              return channels[ccparts[0]];
          }else if(landinguri.queryKey.s_kwcid || landinguri.queryKey.mckv){
              //covers the anomoly
              if(landinguri.queryKey.mckv && landinguri.queryKey.mckv.match(/^dem/i)){
          return channels.dem;
        }else{
          return channels.sem;
        }

          }else{
              return channels.other;
          }
      }else if(refuri && refuri.host != "" && !refuri.host.match(/lonelyplanet./i)){
          //look at referrer etc
          if(refuri.host.match(/google\.|bing\.|yahoo\.|ask\.|aol\./i)){
              return channels.seo;
          }else if(refuri.host.match(/facebook\.|linkedin\.|twitter\.|myspace\.|youtube\.|ning\.|^t\.co|xanga\./i)){
              return channels.soc;
          }else if(refuri.host.match(/orkut\.|friendster\.|vimeo\.com|bebo\.com|hi5\.com|yuku\.com|cafemom\.com|xanga\.com|livejournal\.com|blogspot\.com|wordpress\.com|myspace\.com|digg\.com|reddit\.com|stumbleupon\.com|twine\.com|yelp\.com|mixx\.com|chime\.in|delicious\.com|tumblr\.com|disqus\.com|intensedebate\.com|plurk\.com|slideshare\.net|backtype\.com|netvibes\.com|mister-wong\.com|diigo\.com|flixster\.com|12seconds\.tv|zooomr\.com|identi\.ca|jaiku\.com|flickr\.com|imeem\.com|dailymotion\.com|photobucket\.com|fotolog\.com|smugmug\.com|classmates\.com|myyearbook\.com|mylife\.com|tagged\.com|brightkite\.com|hi5\.com|yuku\.com|cafemom\.com|plus\.google\.com|instagram\.com|prezi\.com|newsvine\.com|pinterest\.com|wiebo\.com|nevkontakte\.com|qzone\.qq\.com|cloob\.com/i)){
              return channels.soc_other
          }else{
              //no matching referrer
              return channels.other_ref;
          }
      }else{
          //no camp code nor ref uri
          return channels.direct;
      }
  }


  adv.stackCampaignChannel = function(channel){
      // this function stacks the channels
      var channel_stk = s.c_r("chan_stk") || "", channels;
      if(channel_stk !== ""){
          channels = channel_stk.replace(/%3E/gi,">").split(">");
      }else{
          channels = [];
      }

      if(channels[channels.length-1] != channel && (channel !== "direct" || channels.length < 1)){
          channels.push(channel);
      }

      var slicestart = 0;
      if(channels.length-5 > 0){
          slicestart = channels.length-5;
      }

      return channels.slice(slicestart,channels.length).join(">");
  }

  adv.saveCampaignData = function(campaign, channel_stk, channel, ck_exp){
       //campaign
      var camp_ck = s.c_r("cam") || "";
      if(camp_ck === "direct" || camp_ck === ""){
          s.c_w("cam", campaign, ck_exp);
      }else{
          if(campaign !== "direct"){
              s.c_w("cam", campaign, ck_exp);
          }
      }
    s.campaign = decodeURIComponent(s.c_r("cam"));

    //campaign channel
      var camp_chan_ck = s.c_r("cam_chan") || "";
      if(camp_chan_ck === "direct" || camp_chan_ck === ""){
          s.c_w("cam_chan", channel, ck_exp);
      }else{
          if(channel !== "direct"){
              s.c_w("cam_chan", channel, ck_exp);
          }
      }
    s.eVar58 = s.c_r("cam_chan");

      // channel stack
      s.c_w("chan_stk", channel_stk, ck_exp);
  }

  adv.getCampaignCode = function(refuri, channel){
      if(channel == "direct"){
          return s.c_r("cam") || "direct";
      }else{
          return channel+"_"+refuri.host.replace("www.","");
      }

  }

  adv.doCampaignManagement = function(ck_exp){
      /*
          s.campaign = campaign code
          s.eVar58 = campaign channel
          s.eVar59 = stacked campaign channel
          if campaign code not explicit then "direct" or "{campaignChannel}_{referring_domain}"
      /* */
      // is there's a campaign, then add the campaign ID
      if(landinguri.queryKey.mckv || landinguri.queryKey.affil){
          //is a campaign code
          s.campaign = landinguri.queryKey.affil || landinguri.queryKey.mckv;
      if((!landinguri.queryKey.affil && landinguri.queryKey.mckv)){
        if(landinguri.queryKey.mckv.match(/^dem/i)){
          s.eVar58 = 'dem';
        }else{
          s.eVar58 = 'sem';
        }
      }else{
        s.eVar58 = adv.getCampaignChannel(landinguri, s.campaign, refuri);
      }
      }else{
          //no campaign code
          if(refuri){
              //is a referrer
              s.eVar58 = adv.getCampaignChannel(landinguri, false, refuri);
              s.campaign = adv.getCampaignCode(refuri, s.eVar58);

          }else{
              //no referrer
              s.campaign = s.eVar58 = "direct";
          }
      }

      s.eVar59 = adv.stackCampaignChannel(s.eVar58);

      adv.saveCampaignData(s.campaign, s.eVar59, s.eVar58, ck_exp);

      //end campaign management
  }



  /************* DO NOT ALTER ANYTHING BELOW THIS LINE ! **************/
  var s_code='',s_objectID;function s_gi(un,pg,ss){var c="s.version='H.26';s.an=s_an;s.logDebug=function(m){var s=this,tcf=new Function('var e;try{console.log(\"'+s.rep(s.rep(s.rep(m,\"\\\\\",\"\\\\\\"
  +"\\\"),\"\\n\",\"\\\\n\"),\"\\\"\",\"\\\\\\\"\")+'\");}catch(e){}');tcf()};s.cls=function(x,c){var i,y='';if(!c)c=this.an;for(i=0;i<x.length;i++){n=x.substring(i,i+1);if(c.indexOf(n)>=0)y+=n}return "
  +"y};s.fl=function(x,l){return x?(''+x).substring(0,l):x};s.co=function(o){return o};s.num=function(x){x=''+x;for(var p=0;p<x.length;p++)if(('0123456789').indexOf(x.substring(p,p+1))<0)return 0;retur"
  +"n 1};s.rep=s_rep;s.sp=s_sp;s.jn=s_jn;s.ape=function(x){var s=this,h='0123456789ABCDEF',f=\"+~!*()'\",i,c=s.charSet,n,l,e,y='';c=c?c.toUpperCase():'';if(x){x=''+x;if(s.em==3){x=encodeURIComponent(x)"
  +";for(i=0;i<f.length;i++) {n=f.substring(i,i+1);if(x.indexOf(n)>=0)x=s.rep(x,n,\"%\"+n.charCodeAt(0).toString(16).toUpperCase())}}else if(c=='AUTO'&&('').charCodeAt){for(i=0;i<x.length;i++){c=x.subs"
  +"tring(i,i+1);n=x.charCodeAt(i);if(n>127){l=0;e='';while(n||l<4){e=h.substring(n%16,n%16+1)+e;n=(n-n%16)/16;l++}y+='%u'+e}else if(c=='+')y+='%2B';else y+=escape(c)}x=y}else x=s.rep(escape(''+x),'+',"
  +"'%2B');if(c&&c!='AUTO'&&s.em==1&&x.indexOf('%u')<0&&x.indexOf('%U')<0){i=x.indexOf('%');while(i>=0){i++;if(h.substring(8).indexOf(x.substring(i,i+1).toUpperCase())>=0)return x.substring(0,i)+'u00'+"
  +"x.substring(i);i=x.indexOf('%',i)}}}return x};s.epa=function(x){var s=this,y,tcf;if(x){x=s.rep(''+x,'+',' ');if(s.em==3){tcf=new Function('x','var y,e;try{y=decodeURIComponent(x)}catch(e){y=unescap"
  +"e(x)}return y');return tcf(x)}else return unescape(x)}return y};s.pt=function(x,d,f,a){var s=this,t=x,z=0,y,r;while(t){y=t.indexOf(d);y=y<0?t.length:y;t=t.substring(0,y);r=s[f](t,a);if(r)return r;z"
  +"+=y+d.length;t=x.substring(z,x.length);t=z<x.length?t:''}return ''};s.isf=function(t,a){var c=a.indexOf(':');if(c>=0)a=a.substring(0,c);c=a.indexOf('=');if(c>=0)a=a.substring(0,c);if(t.substring(0,"
  +"2)=='s_')t=t.substring(2);return (t!=''&&t==a)};s.fsf=function(t,a){var s=this;if(s.pt(a,',','isf',t))s.fsg+=(s.fsg!=''?',':'')+t;return 0};s.fs=function(x,f){var s=this;s.fsg='';s.pt(x,',','fsf',f"
  +");return s.fsg};s.mpc=function(m,a){var s=this,c,l,n,v;v=s.d.visibilityState;if(!v)v=s.d.webkitVisibilityState;if(v&&v=='prerender'){if(!s.mpq){s.mpq=new Array;l=s.sp('webkitvisibilitychange,visibi"
  +"litychange',',');for(n=0;n<l.length;n++){s.d.addEventListener(l[n],new Function('var s=s_c_il['+s._in+'],c,v;v=s.d.visibilityState;if(!v)v=s.d.webkitVisibilityState;if(s.mpq&&v==\"visible\"){while("
  +"s.mpq.length>0){c=s.mpq.shift();s[c.m].apply(s,c.a)}s.mpq=0}'),false)}}c=new Object;c.m=m;c.a=a;s.mpq.push(c);return 1}return 0};s.si=function(){var s=this,i,k,v,c=s_gi+'var s=s_gi(\"'+s.oun+'\");s"
  +".sa(\"'+s.un+'\");';for(i=0;i<s.va_g.length;i++){k=s.va_g[i];v=s[k];if(v!=undefined){if(typeof(v)!='number')c+='s.'+k+'=\"'+s_fe(v)+'\";';else c+='s.'+k+'='+v+';'}}c+=\"s.lnk=s.eo=s.linkName=s.link"
  +"Type=s.wd.s_objectID=s.ppu=s.pe=s.pev1=s.pev2=s.pev3='';\";return c};s.c_d='';s.c_gdf=function(t,a){var s=this;if(!s.num(t))return 1;return 0};s.c_gd=function(){var s=this,d=s.wd.location.hostname,"
  +"n=s.fpCookieDomainPeriods,p;if(!n)n=s.cookieDomainPeriods;if(d&&!s.c_d){n=n?parseInt(n):2;n=n>2?n:2;p=d.lastIndexOf('.');if(p>=0){while(p>=0&&n>1){p=d.lastIndexOf('.',p-1);n--}s.c_d=p>0&&s.pt(d,'.'"
  +",'c_gdf',0)?d.substring(p):d}}return s.c_d};s.c_r=function(k){var s=this;k=s.ape(k);var c=' '+s.d.cookie,i=c.indexOf(' '+k+'='),e=i<0?i:c.indexOf(';',i),v=i<0?'':s.epa(c.substring(i+2+k.length,e<0?"
  +"c.length:e));return v!='[[B]]'?v:''};s.c_w=function(k,v,e){var s=this,d=s.c_gd(),l=s.cookieLifetime,t;v=''+v;l=l?(''+l).toUpperCase():'';if(e&&l!='SESSION'&&l!='NONE'){t=(v!=''?parseInt(l?l:0):-60)"
  +";if(t){e=new Date;e.setTime(e.getTime()+(t*1000))}}if(k&&l!='NONE'){s.d.cookie=k+'='+s.ape(v!=''?v:'[[B]]')+'; path=/;'+(e&&l!='SESSION'?' expires='+e.toGMTString()+';':'')+(d?' domain='+d+';':'');"
  +"return s.c_r(k)==v}return 0};s.eh=function(o,e,r,f){var s=this,b='s_'+e+'_'+s._in,n=-1,l,i,x;if(!s.ehl)s.ehl=new Array;l=s.ehl;for(i=0;i<l.length&&n<0;i++){if(l[i].o==o&&l[i].e==e)n=i}if(n<0){n=i;l"
  +"[n]=new Object}x=l[n];x.o=o;x.e=e;f=r?x.b:f;if(r||f){x.b=r?0:o[e];x.o[e]=f}if(x.b){x.o[b]=x.b;return b}return 0};s.cet=function(f,a,t,o,b){var s=this,r,tcf;if(s.apv>=5&&(!s.isopera||s.apv>=7)){tcf="
  +"new Function('s','f','a','t','var e,r;try{r=s[f](a)}catch(e){r=s[t](e)}return r');r=tcf(s,f,a,t)}else{if(s.ismac&&s.u.indexOf('MSIE 4')>=0)r=s[b](a);else{s.eh(s.wd,'onerror',0,o);r=s[f](a);s.eh(s.w"
  +"d,'onerror',1)}}return r};s.gtfset=function(e){var s=this;return s.tfs};s.gtfsoe=new Function('e','var s=s_c_il['+s._in+'],c;s.eh(window,\"onerror\",1);s.etfs=1;c=s.t();if(c)s.d.write(c);s.etfs=0;r"
  +"eturn true');s.gtfsfb=function(a){return window};s.gtfsf=function(w){var s=this,p=w.parent,l=w.location;s.tfs=w;if(p&&p.location!=l&&p.location.host==l.host){s.tfs=p;return s.gtfsf(s.tfs)}return s."
  +"tfs};s.gtfs=function(){var s=this;if(!s.tfs){s.tfs=s.wd;if(!s.etfs)s.tfs=s.cet('gtfsf',s.tfs,'gtfset',s.gtfsoe,'gtfsfb')}return s.tfs};s.mrq=function(u){var s=this,l=s.rl[u],n,r;s.rl[u]=0;if(l)for("
  +"n=0;n<l.length;n++){r=l[n];s.mr(0,0,r.r,r.t,r.u)}};s.flushBufferedRequests=function(){};s.mr=function(sess,q,rs,ta,u){var s=this,dc=s.dc,t1=s.trackingServer,t2=s.trackingServerSecure,tb=s.trackingS"
  +"erverBase,p='.sc',ns=s.visitorNamespace,un=s.cls(u?u:(ns?ns:s.fun)),r=new Object,l,imn='s_i_'+s._in+'_'+un,im,b,e;if(!rs){if(t1){if(t2&&s.ssl)t1=t2}else{if(!tb)tb='2o7.net';if(dc)dc=(''+dc).toLower"
  +"Case();else dc='d1';if(tb=='2o7.net'){if(dc=='d1')dc='112';else if(dc=='d2')dc='122';p=''}t1=un+'.'+dc+'.'+p+tb}rs='http'+(s.ssl?'s':'')+'://'+t1+'/b/ss/'+s.un+'/'+(s.mobile?'5.1':'1')+'/'+s.versio"
  +"n+(s.tcn?'T':'')+'/'+sess+'?AQB=1&ndh=1'+(q?q:'')+'&AQE=1';if(s.isie&&!s.ismac)rs=s.fl(rs,2047)}if(s.d.images&&s.apv>=3&&(!s.isopera||s.apv>=7)&&(s.ns6<0||s.apv>=6.1)){if(!s.rc)s.rc=new Object;if(!"
  +"s.rc[un]){s.rc[un]=1;if(!s.rl)s.rl=new Object;s.rl[un]=new Array;setTimeout('if(window.s_c_il)window.s_c_il['+s._in+'].mrq(\"'+un+'\")',750)}else{l=s.rl[un];if(l){r.t=ta;r.u=un;r.r=rs;l[l.length]=r"
  +";return ''}imn+='_'+s.rc[un];s.rc[un]++}if(s.debugTracking){var d='AppMeasurement Debug: '+rs,dl=s.sp(rs,'&'),dln;for(dln=0;dln<dl.length;dln++)d+=\"\\n\\t\"+s.epa(dl[dln]);s.logDebug(d)}im=s.wd[im"
  +"n];if(!im)im=s.wd[imn]=new Image;im.s_l=0;im.onload=new Function('e','this.s_l=1;var wd=window,s;if(wd.s_c_il){s=wd.s_c_il['+s._in+'];s.bcr();s.mrq(\"'+un+'\");s.nrs--;if(!s.nrs)s.m_m(\"rr\")}');if"
  +"(!s.nrs){s.nrs=1;s.m_m('rs')}else s.nrs++;im.src=rs;if(s.useForcedLinkTracking||s.bcf){if(!s.forcedLinkTrackingTimeout)s.forcedLinkTrackingTimeout=250;setTimeout('if(window.s_c_il)window.s_c_il['+s"
  +"._in+'].bcr()',s.forcedLinkTrackingTimeout);}else if((s.lnk||s.eo)&&(!ta||ta=='_self'||ta=='_top'||ta=='_parent'||(s.wd.name&&ta==s.wd.name))){b=e=new Date;while(!im.s_l&&e.getTime()-b.getTime()<50"
  +"0)e=new Date}return ''}return '<im'+'g sr'+'c=\"'+rs+'\" width=1 height=1 border=0 alt=\"\">'};s.gg=function(v){var s=this;if(!s.wd['s_'+v])s.wd['s_'+v]='';return s.wd['s_'+v]};s.glf=function(t,a){"
  +"if(t.substring(0,2)=='s_')t=t.substring(2);var s=this,v=s.gg(t);if(v)s[t]=v};s.gl=function(v){var s=this;if(s.pg)s.pt(v,',','glf',0)};s.rf=function(x){var s=this,y,i,j,h,p,l=0,q,a,b='',c='',t;if(x&"
  +"&x.length>255){y=''+x;i=y.indexOf('?');if(i>0){q=y.substring(i+1);y=y.substring(0,i);h=y.toLowerCase();j=0;if(h.substring(0,7)=='http://')j+=7;else if(h.substring(0,8)=='https://')j+=8;i=h.indexOf("
  +"\"/\",j);if(i>0){h=h.substring(j,i);p=y.substring(i);y=y.substring(0,i);if(h.indexOf('google')>=0)l=',q,ie,start,search_key,word,kw,cd,';else if(h.indexOf('yahoo.co')>=0)l=',p,ei,';if(l&&q){a=s.sp("
  +"q,'&');if(a&&a.length>1){for(j=0;j<a.length;j++){t=a[j];i=t.indexOf('=');if(i>0&&l.indexOf(','+t.substring(0,i)+',')>=0)b+=(b?'&':'')+t;else c+=(c?'&':'')+t}if(b&&c)q=b+'&'+c;else c=''}i=253-(q.len"
  +"gth-c.length)-y.length;x=y+(i>0?p.substring(0,i):'')+'?'+q}}}}return x};s.s2q=function(k,v,vf,vfp,f){var s=this,qs='',sk,sv,sp,ss,nke,nk,nf,nfl=0,nfn,nfm;if(k==\"contextData\")k=\"c\";if(v){for(sk "
  +"in v)if((!f||sk.substring(0,f.length)==f)&&v[sk]&&(!vf||vf.indexOf(','+(vfp?vfp+'.':'')+sk+',')>=0)&&(!Object||!Object.prototype||!Object.prototype[sk])){nfm=0;if(nfl)for(nfn=0;nfn<nfl.length;nfn++"
  +")if(sk.substring(0,nfl[nfn].length)==nfl[nfn])nfm=1;if(!nfm){if(qs=='')qs+='&'+k+'.';sv=v[sk];if(f)sk=sk.substring(f.length);if(sk.length>0){nke=sk.indexOf('.');if(nke>0){nk=sk.substring(0,nke);nf="
  +"(f?f:'')+nk+'.';if(!nfl)nfl=new Array;nfl[nfl.length]=nf;qs+=s.s2q(nk,v,vf,vfp,nf)}else{if(typeof(sv)=='boolean'){if(sv)sv='true';else sv='false'}if(sv){if(vfp=='retrieveLightData'&&f.indexOf('.con"
  +"textData.')<0){sp=sk.substring(0,4);ss=sk.substring(4);if(sk=='transactionID')sk='xact';else if(sk=='channel')sk='ch';else if(sk=='campaign')sk='v0';else if(s.num(ss)){if(sp=='prop')sk='c'+ss;else "
  +"if(sp=='eVar')sk='v'+ss;else if(sp=='list')sk='l'+ss;else if(sp=='hier'){sk='h'+ss;sv=sv.substring(0,255)}}}qs+='&'+s.ape(sk)+'='+s.ape(sv)}}}}}if(qs!='')qs+='&.'+k}return qs};s.hav=function(){var "
  +"s=this,qs='',l,fv='',fe='',mn,i,e;if(s.lightProfileID){l=s.va_m;fv=s.lightTrackVars;if(fv)fv=','+fv+','+s.vl_mr+','}else{l=s.va_t;if(s.pe||s.linkType){fv=s.linkTrackVars;fe=s.linkTrackEvents;if(s.p"
  +"e){mn=s.pe.substring(0,1).toUpperCase()+s.pe.substring(1);if(s[mn]){fv=s[mn].trackVars;fe=s[mn].trackEvents}}}if(fv)fv=','+fv+','+s.vl_l+','+s.vl_l2;if(fe){fe=','+fe+',';if(fv)fv+=',events,'}if (s."
  +"events2)e=(e?',':'')+s.events2}for(i=0;i<l.length;i++){var k=l[i],v=s[k],b=k.substring(0,4),x=k.substring(4),n=parseInt(x),q=k;if(!v)if(k=='events'&&e){v=e;e=''}if(v&&(!fv||fv.indexOf(','+k+',')>=0"
  +")&&k!='linkName'&&k!='linkType'){if(k=='timestamp')q='ts';else if(k=='dynamicVariablePrefix')q='D';else if(k=='visitorID')q='vid';else if(k=='pageURL'){q='g';if(v.length>255){s.pageURLRest=v.substr"
  +"ing(255);v=v.substring(0,255);}}else if(k=='pageURLRest')q='-g';else if(k=='referrer'){q='r';v=s.fl(s.rf(v),255)}else if(k=='vmk'||k=='visitorMigrationKey')q='vmt';else if(k=='visitorMigrationServe"
  +"r'){q='vmf';if(s.ssl&&s.visitorMigrationServerSecure)v=''}else if(k=='visitorMigrationServerSecure'){q='vmf';if(!s.ssl&&s.visitorMigrationServer)v=''}else if(k=='charSet'){q='ce';if(v.toUpperCase()"
  +"=='AUTO')v='ISO8859-1';else if(s.em==2||s.em==3)v='UTF-8'}else if(k=='visitorNamespace')q='ns';else if(k=='cookieDomainPeriods')q='cdp';else if(k=='cookieLifetime')q='cl';else if(k=='variableProvid"
  +"er')q='vvp';else if(k=='currencyCode')q='cc';else if(k=='channel')q='ch';else if(k=='transactionID')q='xact';else if(k=='campaign')q='v0';else if(k=='resolution')q='s';else if(k=='colorDepth')q='c'"
  +";else if(k=='javascriptVersion')q='j';else if(k=='javaEnabled')q='v';else if(k=='cookiesEnabled')q='k';else if(k=='browserWidth')q='bw';else if(k=='browserHeight')q='bh';else if(k=='connectionType'"
  +")q='ct';else if(k=='homepage')q='hp';else if(k=='plugins')q='p';else if(k=='events'){if(e)v+=(v?',':'')+e;if(fe)v=s.fs(v,fe)}else if(k=='events2')v='';else if(k=='contextData'){qs+=s.s2q('c',s[k],f"
  +"v,k,0);v=''}else if(k=='lightProfileID')q='mtp';else if(k=='lightStoreForSeconds'){q='mtss';if(!s.lightProfileID)v=''}else if(k=='lightIncrementBy'){q='mti';if(!s.lightProfileID)v=''}else if(k=='re"
  +"trieveLightProfiles')q='mtsr';else if(k=='deleteLightProfiles')q='mtsd';else if(k=='retrieveLightData'){if(s.retrieveLightProfiles)qs+=s.s2q('mts',s[k],fv,k,0);v=''}else if(s.num(x)){if(b=='prop')q"
  +"='c'+n;else if(b=='eVar')q='v'+n;else if(b=='list')q='l'+n;else if(b=='hier'){q='h'+n;v=s.fl(v,255)}}if(v)qs+='&'+s.ape(q)+'='+(k.substring(0,3)!='pev'?s.ape(v):v)}}return qs};s.ltdf=function(t,h){"
  +"t=t?t.toLowerCase():'';h=h?h.toLowerCase():'';var qi=h.indexOf('?');h=qi>=0?h.substring(0,qi):h;if(t&&h.substring(h.length-(t.length+1))=='.'+t)return 1;return 0};s.ltef=function(t,h){t=t?t.toLower"
  +"Case():'';h=h?h.toLowerCase():'';if(t&&h.indexOf(t)>=0)return 1;return 0};s.lt=function(h){var s=this,lft=s.linkDownloadFileTypes,lef=s.linkExternalFilters,lif=s.linkInternalFilters;lif=lif?lif:s.w"
  +"d.location.hostname;h=h.toLowerCase();if(s.trackDownloadLinks&&lft&&s.pt(lft,',','ltdf',h))return 'd';if(s.trackExternalLinks&&h.indexOf('#')!=0&&h.indexOf('about:')!=0&&h.indexOf('javascript:')!=0"
  +"&&(lef||lif)&&(!lef||s.pt(lef,',','ltef',h))&&(!lif||!s.pt(lif,',','ltef',h)))return 'e';return ''};s.lc=new Function('e','var s=s_c_il['+s._in+'],b=s.eh(this,\"onclick\");s.lnk=this;s.t();s.lnk=0;"
  +"if(b)return this[b](e);return true');s.bcr=function(){var s=this;if(s.bct&&s.bce)s.bct.dispatchEvent(s.bce);if(s.bcf){if(typeof(s.bcf)=='function')s.bcf();else if(s.bct&&s.bct.href)s.d.location=s.b"
  +"ct.href}s.bct=s.bce=s.bcf=0};s.bc=new Function('e','if(e&&e.s_fe)return;var s=s_c_il['+s._in+'],f,tcf,t,n,nrs,a,h;if(s.d&&s.d.all&&s.d.all.cppXYctnr)return;if(!s.bbc)s.useForcedLinkTracking=0;else "
  +"if(!s.useForcedLinkTracking){s.b.removeEventListener(\"click\",s.bc,true);s.bbc=s.useForcedLinkTracking=0;return}else s.b.removeEventListener(\"click\",s.bc,false);s.eo=e.srcElement?e.srcElement:e."
  +"target;nrs=s.nrs;s.t();s.eo=0;if(s.nrs>nrs&&s.useForcedLinkTracking&&e.target){a=e.target;while(a&&a!=s.b&&a.tagName.toUpperCase()!=\"A\"&&a.tagName.toUpperCase()!=\"AREA\")a=a.parentNode;if(a){h=a"
  +".href;if(h.indexOf(\"#\")==0||h.indexOf(\"about:\")==0||h.indexOf(\"javascript:\")==0)h=0;t=a.target;if(e.target.dispatchEvent&&h&&(!t||t==\"_self\"||t==\"_top\"||t==\"_parent\"||(s.wd.name&&t==s.w"
  +"d.name))){tcf=new Function(\"s\",\"var x;try{n=s.d.createEvent(\\\\\"MouseEvents\\\\\")}catch(x){n=new MouseEvent}return n\");n=tcf(s);if(n){tcf=new Function(\"n\",\"e\",\"var x;try{n.initMouseEven"
  +"t(\\\\\"click\\\\\",e.bubbles,e.cancelable,e.view,e.detail,e.screenX,e.screenY,e.clientX,e.clientY,e.ctrlKey,e.altKey,e.shiftKey,e.metaKey,e.button,e.relatedTarget)}catch(x){n=0}return n\");n=tcf(n"
  +",e);if(n){n.s_fe=1;e.stopPropagation();if (e.stopImmediatePropagation) {e.stopImmediatePropagation();}e.preventDefault();s.bct=e.target;s.bce=n}}}}}');s.oh=function(o){var s=this,l=s.wd.location,h="
  +"o.href?o.href:'',i,j,k,p;i=h.indexOf(':');j=h.indexOf('?');k=h.indexOf('/');if(h&&(i<0||(j>=0&&i>j)||(k>=0&&i>k))){p=o.protocol&&o.protocol.length>1?o.protocol:(l.protocol?l.protocol:'');i=l.pathna"
  +"me.lastIndexOf('/');h=(p?p+'//':'')+(o.host?o.host:(l.host?l.host:''))+(h.substring(0,1)!='/'?l.pathname.substring(0,i<0?0:i)+'/':'')+h}return h};s.ot=function(o){var t=o.tagName;if(o.tagUrn||(o.sc"
  +"opeName&&o.scopeName.toUpperCase()!='HTML'))return '';t=t&&t.toUpperCase?t.toUpperCase():'';if(t=='SHAPE')t='';if(t){if((t=='INPUT'||t=='BUTTON')&&o.type&&o.type.toUpperCase)t=o.type.toUpperCase();"
  +"else if(!t&&o.href)t='A';}return t};s.oid=function(o){var s=this,t=s.ot(o),p,c,n='',x=0;if(t&&!o.s_oid){p=o.protocol;c=o.onclick;if(o.href&&(t=='A'||t=='AREA')&&(!c||!p||p.toLowerCase().indexOf('ja"
  +"vascript')<0))n=s.oh(o);else if(c){n=s.rep(s.rep(s.rep(s.rep(''+c,\"\\r\",''),\"\\n\",''),\"\\t\",''),' ','');x=2}else if(t=='INPUT'||t=='SUBMIT'){if(o.value)n=o.value;else if(o.innerText)n=o.inner"
  +"Text;else if(o.textContent)n=o.textContent;x=3}else if(o.src&&t=='IMAGE')n=o.src;if(n){o.s_oid=s.fl(n,100);o.s_oidt=x}}return o.s_oid};s.rqf=function(t,un){var s=this,e=t.indexOf('='),u=e>=0?t.subs"
  +"tring(0,e):'',q=e>=0?s.epa(t.substring(e+1)):'';if(u&&q&&(','+u+',').indexOf(','+un+',')>=0){if(u!=s.un&&s.un.indexOf(',')>=0)q='&u='+u+q+'&u=0';return q}return ''};s.rq=function(un){if(!un)un=this"
  +".un;var s=this,c=un.indexOf(','),v=s.c_r('s_sq'),q='';if(c<0)return s.pt(v,'&','rqf',un);return s.pt(un,',','rq',0)};s.sqp=function(t,a){var s=this,e=t.indexOf('='),q=e<0?'':s.epa(t.substring(e+1))"
  +";s.sqq[q]='';if(e>=0)s.pt(t.substring(0,e),',','sqs',q);return 0};s.sqs=function(un,q){var s=this;s.squ[un]=q;return 0};s.sq=function(q){var s=this,k='s_sq',v=s.c_r(k),x,c=0;s.sqq=new Object;s.squ="
  +"new Object;s.sqq[q]='';s.pt(v,'&','sqp',0);s.pt(s.un,',','sqs',q);v='';for(x in s.squ)if(x&&(!Object||!Object.prototype||!Object.prototype[x]))s.sqq[s.squ[x]]+=(s.sqq[s.squ[x]]?',':'')+x;for(x in s"
  +".sqq)if(x&&(!Object||!Object.prototype||!Object.prototype[x])&&s.sqq[x]&&(x==q||c<2)){v+=(v?'&':'')+s.sqq[x]+'='+s.ape(x);c++}return s.c_w(k,v,0)};s.wdl=new Function('e','var s=s_c_il['+s._in+'],r="
  +"true,b=s.eh(s.wd,\"onload\"),i,o,oc;if(b)r=this[b](e);for(i=0;i<s.d.links.length;i++){o=s.d.links[i];oc=o.onclick?\"\"+o.onclick:\"\";if((oc.indexOf(\"s_gs(\")<0||oc.indexOf(\".s_oc(\")>=0)&&oc.ind"
  +"exOf(\".tl(\")<0)s.eh(o,\"onclick\",0,s.lc);}return r');s.wds=function(){var s=this;if(s.apv>3&&(!s.isie||!s.ismac||s.apv>=5)){if(s.b&&s.b.attachEvent)s.b.attachEvent('onclick',s.bc);else if(s.b&&s"
  +".b.addEventListener){if(s.n&&((s.n.userAgent.indexOf('WebKit')>=0&&s.d.createEvent)||(s.n.userAgent.indexOf('Firefox/2')>=0&&s.wd.MouseEvent))){s.bbc=1;s.useForcedLinkTracking=1;s.b.addEventListene"
  +"r('click',s.bc,true)}s.b.addEventListener('click',s.bc,false)}else s.eh(s.wd,'onload',0,s.wdl)}};s.vs=function(x){var s=this,v=s.visitorSampling,g=s.visitorSamplingGroup,k='s_vsn_'+s.un+(g?'_'+g:''"
  +"),n=s.c_r(k),e=new Date,y=e.getYear();e.setYear(y+10+(y<1900?1900:0));if(v){v*=100;if(!n){if(!s.c_w(k,x,e))return 0;n=x}if(n%10000>v)return 0}return 1};s.dyasmf=function(t,m){if(t&&m&&m.indexOf(t)>"
  +"=0)return 1;return 0};s.dyasf=function(t,m){var s=this,i=t?t.indexOf('='):-1,n,x;if(i>=0&&m){var n=t.substring(0,i),x=t.substring(i+1);if(s.pt(x,',','dyasmf',m))return n}return 0};s.uns=function(){"
  +"var s=this,x=s.dynamicAccountSelection,l=s.dynamicAccountList,m=s.dynamicAccountMatch,n,i;s.un=s.un.toLowerCase();if(x&&l){if(!m)m=s.wd.location.host;if(!m.toLowerCase)m=''+m;l=l.toLowerCase();m=m."
  +"toLowerCase();n=s.pt(l,';','dyasf',m);if(n)s.un=n}i=s.un.indexOf(',');s.fun=i<0?s.un:s.un.substring(0,i)};s.sa=function(un){var s=this;if(s.un&&s.mpc('sa',arguments))return;s.un=un;if(!s.oun)s.oun="
  +"un;else if((','+s.oun+',').indexOf(','+un+',')<0)s.oun+=','+un;s.uns()};s.m_i=function(n,a){var s=this,m,f=n.substring(0,1),r,l,i;if(!s.m_l)s.m_l=new Object;if(!s.m_nl)s.m_nl=new Array;m=s.m_l[n];i"
  +"f(!a&&m&&m._e&&!m._i)s.m_a(n);if(!m){m=new Object,m._c='s_m';m._in=s.wd.s_c_in;m._il=s._il;m._il[m._in]=m;s.wd.s_c_in++;m.s=s;m._n=n;m._l=new Array('_c','_in','_il','_i','_e','_d','_dl','s','n','_r"
  +"','_g','_g1','_t','_t1','_x','_x1','_rs','_rr','_l');s.m_l[n]=m;s.m_nl[s.m_nl.length]=n}else if(m._r&&!m._m){r=m._r;r._m=m;l=m._l;for(i=0;i<l.length;i++)if(m[l[i]])r[l[i]]=m[l[i]];r._il[r._in]=r;m="
  +"s.m_l[n]=r}if(f==f.toUpperCase())s[n]=m;return m};s.m_a=new Function('n','g','e','if(!g)g=\"m_\"+n;var s=s_c_il['+s._in+'],c=s[g+\"_c\"],m,x,f=0;if(s.mpc(\"m_a\",arguments))return;if(!c)c=s.wd[\"s_"
  +"\"+g+\"_c\"];if(c&&s_d)s[g]=new Function(\"s\",s_ft(s_d(c)));x=s[g];if(!x)x=s.wd[\\'s_\\'+g];if(!x)x=s.wd[g];m=s.m_i(n,1);if(x&&(!m._i||g!=\"m_\"+n)){m._i=f=1;if((\"\"+x).indexOf(\"function\")>=0)x"
  +"(s);else s.m_m(\"x\",n,x,e)}m=s.m_i(n,1);if(m._dl)m._dl=m._d=0;s.dlt();return f');s.m_m=function(t,n,d,e){t='_'+t;var s=this,i,x,m,f='_'+t,r=0,u;if(s.m_l&&s.m_nl)for(i=0;i<s.m_nl.length;i++){x=s.m_"
  +"nl[i];if(!n||x==n){m=s.m_i(x);u=m[t];if(u){if((''+u).indexOf('function')>=0){if(d&&e)u=m[t](d,e);else if(d)u=m[t](d);else u=m[t]()}}if(u)r=1;u=m[t+1];if(u&&!m[f]){if((''+u).indexOf('function')>=0){"
  +"if(d&&e)u=m[t+1](d,e);else if(d)u=m[t+1](d);else u=m[t+1]()}}m[f]=1;if(u)r=1}}return r};s.m_ll=function(){var s=this,g=s.m_dl,i,o;if(g)for(i=0;i<g.length;i++){o=g[i];if(o)s.loadModule(o.n,o.u,o.d,o"
  +".l,o.e,1);g[i]=0}};s.loadModule=function(n,u,d,l,e,ln){var s=this,m=0,i,g,o=0,f1,f2,c=s.h?s.h:s.b,b,tcf;if(n){i=n.indexOf(':');if(i>=0){g=n.substring(i+1);n=n.substring(0,i)}else g=\"m_\"+n;m=s.m_i"
  +"(n)}if((l||(n&&!s.m_a(n,g)))&&u&&s.d&&c&&s.d.createElement){if(d){m._d=1;m._dl=1}if(ln){if(s.ssl)u=s.rep(u,'http:','https:');i='s_s:'+s._in+':'+n+':'+g;b='var s=s_c_il['+s._in+'],o=s.d.getElementBy"
  +"Id(\"'+i+'\");if(s&&o){if(!o.l&&s.wd.'+g+'){o.l=1;if(o.i)clearTimeout(o.i);o.i=0;s.m_a(\"'+n+'\",\"'+g+'\"'+(e?',\"'+e+'\"':'')+')}';f2=b+'o.c++;if(!s.maxDelay)s.maxDelay=250;if(!o.l&&o.c<(s.maxDel"
  +"ay*2)/100)o.i=setTimeout(o.f2,100)}';f1=new Function('e',b+'}');tcf=new Function('s','c','i','u','f1','f2','var e,o=0;try{o=s.d.createElement(\"script\");if(o){o.type=\"text/javascript\";'+(n?'o.id"
  +"=i;o.defer=true;o.onload=o.onreadystatechange=f1;o.f2=f2;o.l=0;':'')+'o.src=u;c.appendChild(o);'+(n?'o.c=0;o.i=setTimeout(f2,100)':'')+'}}catch(e){o=0}return o');o=tcf(s,c,i,u,f1,f2)}else{o=new Obj"
  +"ect;o.n=n+':'+g;o.u=u;o.d=d;o.l=l;o.e=e;g=s.m_dl;if(!g)g=s.m_dl=new Array;i=0;while(i<g.length&&g[i])i++;g[i]=o}}else if(n){m=s.m_i(n);m._e=1}return m};s.voa=function(vo,r){var s=this,l=s.va_g,i,k,"
  +"v,x;for(i=0;i<l.length;i++){k=l[i];v=vo[k];if(v||vo['!'+k]){if(!r&&(k==\"contextData\"||k==\"retrieveLightData\")&&s[k])for(x in s[k])if(!v[x])v[x]=s[k][x];s[k]=v}}};s.vob=function(vo){var s=this,l"
  +"=s.va_g,i,k;for(i=0;i<l.length;i++){k=l[i];vo[k]=s[k];if(!vo[k])vo['!'+k]=1}};s.dlt=new Function('var s=s_c_il['+s._in+'],d=new Date,i,vo,f=0;if(s.dll)for(i=0;i<s.dll.length;i++){vo=s.dll[i];if(vo)"
  +"{if(!s.m_m(\"d\")||d.getTime()-vo._t>=s.maxDelay){s.dll[i]=0;s.t(vo)}else f=1}}if(s.dli)clearTimeout(s.dli);s.dli=0;if(f){if(!s.dli)s.dli=setTimeout(s.dlt,s.maxDelay)}else s.dll=0');s.dl=function(v"
  +"o){var s=this,d=new Date;if(!vo)vo=new Object;s.vob(vo);vo._t=d.getTime();if(!s.dll)s.dll=new Array;s.dll[s.dll.length]=vo;if(!s.maxDelay)s.maxDelay=250;s.dlt()};s.gfid=function(){var s=this,d='012"
  +"3456789ABCDEF',k='s_fid',fid=s.c_r(k),h='',l='',i,j,m=8,n=4,e=new Date,y;if(!fid||fid.indexOf('-')<0){for(i=0;i<16;i++){j=Math.floor(Math.random()*m);h+=d.substring(j,j+1);j=Math.floor(Math.random("
  +")*n);l+=d.substring(j,j+1);m=n=16}fid=h+'-'+l;}y=e.getYear();e.setYear(y+2+(y<1900?1900:0));if(!s.c_w(k,fid,e))fid=0;return fid};s.applyADMS=function(){var s=this,vb=new Object;if(s.wd.ADMS&&!s.vis"
  +"itorID&&!s.admsc){if(!s.adms)s.adms=ADMS.getDefault();if(!s.admsq){s.visitorID=s.adms.getVisitorID(new Function('v','var s=s_c_il['+s._in+'],l=s.admsq,i;if(v==-1)v=0;if(v)s.visitorID=v;s.admsq=0;if"
  +"(l){s.admsc=1;for(i=0;i<l.length;i++)s.t(l[i]);s.admsc=0;}'));if(!s.visitorID)s.admsq=new Array}if(s.admsq){s.vob(vb);vb['!visitorID']=0;s.admsq.push(vb);return 1}else{if(s.visitorID==-1)s.visitorI"
  +"D=0}}return 0};s.track=s.t=function(vo){var s=this,trk=1,tm=new Date,sed=Math&&Math.random?Math.floor(Math.random()*10000000000000):tm.getTime(),sess='s'+Math.floor(tm.getTime()/10800000)%10+sed,y="
  +"tm.getYear(),vt=tm.getDate()+'/'+tm.getMonth()+'/'+(y<1900?y+1900:y)+' '+tm.getHours()+':'+tm.getMinutes()+':'+tm.getSeconds()+' '+tm.getDay()+' '+tm.getTimezoneOffset(),tcf,tfs=s.gtfs(),ta=-1,q=''"
  +",qs='',code='',vb=new Object;if(s.mpc('t',arguments))return;s.gl(s.vl_g);s.uns();s.m_ll();if(!s.td){var tl=tfs.location,a,o,i,x='',c='',v='',p='',bw='',bh='',j='1.0',k=s.c_w('s_cc','true',0)?'Y':'N"
  +"',hp='',ct='',pn=0,ps;if(String&&String.prototype){j='1.1';if(j.match){j='1.2';if(tm.setUTCDate){j='1.3';if(s.isie&&s.ismac&&s.apv>=5)j='1.4';if(pn.toPrecision){j='1.5';a=new Array;if(a.forEach){j="
  +"'1.6';i=0;o=new Object;tcf=new Function('o','var e,i=0;try{i=new Iterator(o)}catch(e){}return i');i=tcf(o);if(i&&i.next){j='1.7';if(a.reduce){j='1.8';if(j.trim){j='1.8.1';if(Date.parse){j='1.8.2';i"
  +"f(Object.create)j='1.8.5'}}}}}}}}}if(s.apv>=4)x=screen.width+'x'+screen.height;if(s.isns||s.isopera){if(s.apv>=3){v=s.n.javaEnabled()?'Y':'N';if(s.apv>=4){c=screen.pixelDepth;bw=s.wd.innerWidth;bh="
  +"s.wd.innerHeight}}s.pl=s.n.plugins}else if(s.isie){if(s.apv>=4){v=s.n.javaEnabled()?'Y':'N';c=screen.colorDepth;if(s.apv>=5){bw=s.d.documentElement.offsetWidth;bh=s.d.documentElement.offsetHeight;i"
  +"f(!s.ismac&&s.b){tcf=new Function('s','tl','var e,hp=0;try{s.b.addBehavior(\"#default#homePage\");hp=s.b.isHomePage(tl)?\"Y\":\"N\"}catch(e){}return hp');hp=tcf(s,tl);tcf=new Function('s','var e,ct"
  +"=0;try{s.b.addBehavior(\"#default#clientCaps\");ct=s.b.connectionType}catch(e){}return ct');ct=tcf(s)}}}else r=''}if(s.pl)while(pn<s.pl.length&&pn<30){ps=s.fl(s.pl[pn].name,100)+';';if(p.indexOf(ps"
  +")<0)p+=ps;pn++}s.resolution=x;s.colorDepth=c;s.javascriptVersion=j;s.javaEnabled=v;s.cookiesEnabled=k;s.browserWidth=bw;s.browserHeight=bh;s.connectionType=ct;s.homepage=hp;s.plugins=p;s.td=1}if(vo"
  +"){s.vob(vb);s.voa(vo)}s.fid=s.gfid();if(s.applyADMS())return '';if((vo&&vo._t)||!s.m_m('d')){if(s.usePlugins)s.doPlugins(s);if(!s.abort){var l=s.wd.location,r=tfs.document.referrer;if(!s.pageURL)s."
  +"pageURL=l.href?l.href:l;if(!s.referrer&&!s._1_referrer){s.referrer=r;s._1_referrer=1}s.m_m('g');if(s.lnk||s.eo){var o=s.eo?s.eo:s.lnk,p=s.pageName,w=1,t=s.ot(o),n=s.oid(o),x=o.s_oidt,h,l,i,oc;if(s."
  +"eo&&o==s.eo){while(o&&!n&&t!='BODY'){o=o.parentElement?o.parentElement:o.parentNode;if(o){t=s.ot(o);n=s.oid(o);x=o.s_oidt}}if(!n||t=='BODY')o='';if(o){oc=o.onclick?''+o.onclick:'';if((oc.indexOf('s"
  +"_gs(')>=0&&oc.indexOf('.s_oc(')<0)||oc.indexOf('.tl(')>=0)o=0}}if(o){if(n)ta=o.target;h=s.oh(o);i=h.indexOf('?');h=s.linkLeaveQueryString||i<0?h:h.substring(0,i);l=s.linkName;t=s.linkType?s.linkTyp"
  +"e.toLowerCase():s.lt(h);if(t&&(h||l)){s.pe='lnk_'+(t=='d'||t=='e'?t:'o');s.pev1=(h?s.ape(h):'');s.pev2=(l?s.ape(l):'')}else trk=0;if(s.trackInlineStats){if(!p){p=s.pageURL;w=0}t=s.ot(o);i=o.sourceI"
  +"ndex;if(o.dataset&&o.dataset.sObjectId){s.wd.s_objectID=o.dataset.sObjectId;}else if(o.getAttribute&&o.getAttribute('data-s-object-id')){s.wd.s_objectID=o.getAttribute('data-s-object-id');}else if("
  +"s.useForcedLinkTracking){s.wd.s_objectID='';oc=o.onclick?''+o.onclick:'';if(oc){var ocb=oc.indexOf('s_objectID'),oce,ocq,ocx;if(ocb>=0){ocb+=10;while(ocb<oc.length&&(\"= \\t\\r\\n\").indexOf(oc.cha"
  +"rAt(ocb))>=0)ocb++;if(ocb<oc.length){oce=ocb;ocq=ocx=0;while(oce<oc.length&&(oc.charAt(oce)!=';'||ocq)){if(ocq){if(oc.charAt(oce)==ocq&&!ocx)ocq=0;else if(oc.charAt(oce)==\"\\\\\")ocx=!ocx;else ocx"
  +"=0;}else{ocq=oc.charAt(oce);if(ocq!='\"'&&ocq!=\"'\")ocq=0}oce++;}oc=oc.substring(ocb,oce);if(oc){o.s_soid=new Function('s','var e;try{s.wd.s_objectID='+oc+'}catch(e){}');o.s_soid(s)}}}}}if(s.gg('o"
  +"bjectID')){n=s.gg('objectID');x=1;i=1}if(p&&n&&t)qs='&pid='+s.ape(s.fl(p,255))+(w?'&pidt='+w:'')+'&oid='+s.ape(s.fl(n,100))+(x?'&oidt='+x:'')+'&ot='+s.ape(t)+(i?'&oi='+i:'')}}else trk=0}if(trk||qs)"
  +"{s.sampled=s.vs(sed);if(trk){if(s.sampled)code=s.mr(sess,(vt?'&t='+s.ape(vt):'')+s.hav()+q+(qs?qs:s.rq()),0,ta);qs='';s.m_m('t');if(s.p_r)s.p_r();s.referrer=s.lightProfileID=s.retrieveLightProfiles"
  +"=s.deleteLightProfiles=''}s.sq(qs)}}}else s.dl(vo);if(vo)s.voa(vb,1);s.abort=0;s.pageURLRest=s.lnk=s.eo=s.linkName=s.linkType=s.wd.s_objectID=s.ppu=s.pe=s.pev1=s.pev2=s.pev3='';if(s.pg)s.wd.s_lnk=s"
  +".wd.s_eo=s.wd.s_linkName=s.wd.s_linkType='';return code};s.trackLink=s.tl=function(o,t,n,vo,f){var s=this;s.lnk=o;s.linkType=t;s.linkName=n;if(f){s.bct=o;s.bcf=f}s.t(vo)};s.trackLight=function(p,ss"
  +",i,vo){var s=this;s.lightProfileID=p;s.lightStoreForSeconds=ss;s.lightIncrementBy=i;s.t(vo)};s.setTagContainer=function(n){var s=this,l=s.wd.s_c_il,i,t,x,y;s.tcn=n;if(l)for(i=0;i<l.length;i++){t=l["
  +"i];if(t&&t._c=='s_l'&&t.tagContainerName==n){s.voa(t);if(t.lmq)for(i=0;i<t.lmq.length;i++){x=t.lmq[i];y='m_'+x.n;if(!s[y]&&!s[y+'_c']){s[y]=t[y];s[y+'_c']=t[y+'_c']}s.loadModule(x.n,x.u,x.d)}if(t.m"
  +"l)for(x in t.ml)if(s[x]){y=s[x];x=t.ml[x];for(i in x)if(!Object.prototype[i]){if(typeof(x[i])!='function'||(''+x[i]).indexOf('s_c_il')<0)y[i]=x[i]}}if(t.mmq)for(i=0;i<t.mmq.length;i++){x=t.mmq[i];i"
  +"f(s[x.m]){y=s[x.m];if(y[x.f]&&typeof(y[x.f])=='function'){if(x.a)y[x.f].apply(y,x.a);else y[x.f].apply(y)}}}if(t.tq)for(i=0;i<t.tq.length;i++)s.t(t.tq[i]);t.s=s;return}}};s.wd=window;s.ssl=(s.wd.lo"
  +"cation.protocol.toLowerCase().indexOf('https')>=0);s.d=document;s.b=s.d.body;if(s.d.getElementsByTagName){s.h=s.d.getElementsByTagName('HEAD');if(s.h)s.h=s.h[0]}s.n=navigator;s.u=s.n.userAgent;s.ns"
  +"6=s.u.indexOf('Netscape6/');var apn=s.n.appName,v=s.n.appVersion,ie=v.indexOf('MSIE '),o=s.u.indexOf('Opera '),i;if(v.indexOf('Opera')>=0||o>0)apn='Opera';s.isie=(apn=='Microsoft Internet Explorer'"
  +");s.isns=(apn=='Netscape');s.isopera=(apn=='Opera');s.ismac=(s.u.indexOf('Mac')>=0);if(o>0)s.apv=parseFloat(s.u.substring(o+6));else if(ie>0){s.apv=parseInt(i=v.substring(ie+5));if(s.apv>3)s.apv=pa"
  +"rseFloat(i)}else if(s.ns6>0)s.apv=parseFloat(s.u.substring(s.ns6+10));else s.apv=parseFloat(v);s.em=0;if(s.em.toPrecision)s.em=3;else if(String.fromCharCode){i=escape(String.fromCharCode(256)).toUp"
  +"perCase();s.em=(i=='%C4%80'?2:(i=='%U0100'?1:0))}if(s.oun)s.sa(s.oun);s.sa(un);s.vl_l='timestamp,dynamicVariablePrefix,visitorID,fid,vmk,visitorMigrationKey,visitorMigrationServer,visitorMigrationS"
  +"erverSecure,ppu,charSet,visitorNamespace,cookieDomainPeriods,cookieLifetime,pageName,pageURL,referrer,contextData,currencyCode,lightProfileID,lightStoreForSeconds,lightIncrementBy,retrieveLightProf"
  +"iles,deleteLightProfiles,retrieveLightData';s.va_l=s.sp(s.vl_l,',');s.vl_mr=s.vl_m='timestamp,charSet,visitorNamespace,cookieDomainPeriods,cookieLifetime,contextData,lightProfileID,lightStoreForSec"
  +"onds,lightIncrementBy';s.vl_t=s.vl_l+',variableProvider,channel,server,pageType,transactionID,purchaseID,campaign,state,zip,events,events2,products,linkName,linkType';var n;for(n=1;n<=75;n++){s.vl_"
  +"t+=',prop'+n+',eVar'+n;s.vl_m+=',prop'+n+',eVar'+n}for(n=1;n<=5;n++)s.vl_t+=',hier'+n;for(n=1;n<=3;n++)s.vl_t+=',list'+n;s.va_m=s.sp(s.vl_m,',');s.vl_l2=',tnt,pe,pev1,pev2,pev3,resolution,colorDept"
  +"h,javascriptVersion,javaEnabled,cookiesEnabled,browserWidth,browserHeight,connectionType,homepage,pageURLRest,plugins';s.vl_t+=s.vl_l2;s.va_t=s.sp(s.vl_t,',');s.vl_g=s.vl_t+',trackingServer,trackin"
  +"gServerSecure,trackingServerBase,fpCookieDomainPeriods,disableBufferedRequests,mobile,visitorSampling,visitorSamplingGroup,dynamicAccountSelection,dynamicAccountList,dynamicAccountMatch,trackDownlo"
  +"adLinks,trackExternalLinks,trackInlineStats,linkLeaveQueryString,linkDownloadFileTypes,linkExternalFilters,linkInternalFilters,linkTrackVars,linkTrackEvents,linkNames,lnk,eo,lightTrackVars,_1_refer"
  +"rer,un';s.va_g=s.sp(s.vl_g,',');s.pg=pg;s.gl(s.vl_g);s.contextData=new Object;s.retrieveLightData=new Object;if(!ss)s.wds();if(pg){s.wd.s_co=function(o){return o};s.wd.s_gs=function(un){s_gi(un,1,1"
  +").t()};s.wd.s_dc=function(un){s_gi(un,1).t()}}",
  w=window,l=w.s_c_il,n=navigator,u=n.userAgent,v=n.appVersion,e=v.indexOf('MSIE '),m=u.indexOf('Netscape6/'),a,i,j,x,s;if(un){un=un.toLowerCase();if(l)for(j=0;j<2;j++)for(i=0;i<l.length;i++){s=l[i];x=s._c;if((!x||x=='s_c'||(j>0&&x=='s_l'))&&(s.oun==un||(s.fs&&s.sa&&s.fs(s.oun,un)))){if(s.sa)s.sa(un);if(x=='s_c')return s}else s=0}}w.s_an='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  w.s_sp=new Function("x","d","var a=new Array,i=0,j;if(x){if(x.split)a=x.split(d);else if(!d)for(i=0;i<x.length;i++)a[a.length]=x.substring(i,i+1);else while(i>=0){j=x.indexOf(d,i);a[a.length]=x.subst"
  +"ring(i,j<0?x.length:j);i=j;if(i>=0)i+=d.length}}return a");
  w.s_jn=new Function("a","d","var x='',i,j=a.length;if(a&&j>0){x=a[0];if(j>1){if(a.join)x=a.join(d);else for(i=1;i<j;i++)x+=d+a[i]}}return x");
  w.s_rep=new Function("x","o","n","return s_jn(s_sp(x,o),n)");
  w.s_d=new Function("x","var t='`^@$#',l=s_an,l2=new Object,x2,d,b=0,k,i=x.lastIndexOf('~~'),j,v,w;if(i>0){d=x.substring(0,i);x=x.substring(i+2);l=s_sp(l,'');for(i=0;i<62;i++)l2[l[i]]=i;t=s_sp(t,'');d"
  +"=s_sp(d,'~');i=0;while(i<5){v=0;if(x.indexOf(t[i])>=0) {x2=s_sp(x,t[i]);for(j=1;j<x2.length;j++){k=x2[j].substring(0,1);w=t[i]+k;if(k!=' '){v=1;w=d[b+l2[k]]}x2[j]=w+x2[j].substring(1)}}if(v)x=s_jn("
  +"x2,'');else{w=t[i]+' ';if(x.indexOf(w)>=0)x=s_rep(x,w,t[i]);i++;b+=62}}}return x");
  w.s_fe=new Function("c","return s_rep(s_rep(s_rep(c,'\\\\','\\\\\\\\'),'\"','\\\\\"'),\"\\n\",\"\\\\n\")");
  w.s_fa=new Function("f","var s=f.indexOf('(')+1,e=f.indexOf(')'),a='',c;while(s>=0&&s<e){c=f.substring(s,s+1);if(c==',')a+='\",\"';else if((\"\\n\\r\\t \").indexOf(c)<0)a+=c;s++}return a?'\"'+a+'\"':"
  +"a");
  w.s_ft=new Function("c","c+='';var s,e,o,a,d,q,f,h,x;s=c.indexOf('=function(');while(s>=0){s++;d=1;q='';x=0;f=c.substring(s);a=s_fa(f);e=o=c.indexOf('{',s);e++;while(d>0){h=c.substring(e,e+1);if(q){i"
  +"f(h==q&&!x)q='';if(h=='\\\\')x=x?0:1;else x=0}else{if(h=='\"'||h==\"'\")q=h;if(h=='{')d++;if(h=='}')d--}if(d>0)e++}c=c.substring(0,s)+'new Function('+(a?a+',':'')+'\"'+s_fe(c.substring(o+1,e))+'\")"
  +"'+c.substring(e+1);s=c.indexOf('=function(')}return c;");
  c=s_d(c);if(e>0){a=parseInt(i=v.substring(e+5));if(a>3)a=parseFloat(i)}else if(m>0)a=parseFloat(u.substring(m+10));else a=parseFloat(v);if(a<5||v.indexOf('Opera')>=0||u.indexOf('Opera')>=0)c=s_ft(c);if(!s){s=new Object;if(!w.s_c_in){w.s_c_il=new Array;w.s_c_in=0}s._il=w.s_c_il;s._in=w.s_c_in;s._il[s._in]=s;w.s_c_in++;}s._c='s_c';(new Function("s","un","pg","ss",c))(s,un,pg,ss);return s}
  function s_giqf(){var w=window,q=w.s_giq,i,t,s;if(q)for(i=0;i<q.length;i++){t=q[i];s=s_gi(t.oun);s.sa(t.un);s.setTagContainer(t.tagContainerName)}w.s_giq=0}s_giqf()
