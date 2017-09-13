# Front end Security at Lonely Planet

 Realizing that making software 100% secure is practically impossible, should make you feel a bit uncomfortable.
 When creating or reviewing code for Lonely Planet please take a defensive security stance
 and think about the implications of a security breach.

 By following security guidelines we can eliminate known vulnerabilities and
 discourage hackers from trying. Our secure front end can be a first line of defense.

# Cross Site Scripting (XSS)
XSS enables attackers to inject client-side script into Web pages viewed by other users.  
[More info about XSS](https://www.owasp.org/index.php/Cross-site_Scripting_(XSS))

 - filter executable scripts from input
 - do you really need to use eval() ?
 - use $().text(value) NOT $().html(value)   

```
 $('<div/>').text('<script>alert("not attacked");</script>').html(); 
 // evaluates to "&lt;script&gt;alert("not attacked");&lt;/script&gt;"
```   
```
$('<div/>').html('<script>alert("attacked");</script>'); 
// executes the JS
```

 - avoid iframes if possible or implement sandboxing   

```
<iframe sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
    src="https://lonelyplanet.com"></iframe>
```

 - implement content security policy [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/Security/CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware.


CSP header to allow content from site's own domain, excluding even subdomains

```
Content-Security-Policy: default-src 'self' 
```
CSP header to allow content from site's own domain and all its subdomains

```
Content-Security-Policy: default-src 'self' *.mydomain.com
```

# Passwords, API keys in markup, js
Information stored in this way can be scraped and used for malicious purposes.

- API keys, passwords should not be put in markup or js.

##Code sample
```
//CLIENT
$.ajax({
  url: "http://mydomain.com/widgets",
  method: "GET",
  accepts: "application/json",
  authToken: "server-generated-auth-token"
  ...
});
```

```
//SERVER
//if server-generated-auth-token isValid
uri = URI('http://otherservice.com/widgets?accessToken=' + ENV["ACCESS_TOKEN"])
res = Net::HTTP.get_response(uri)
// Send response to client
```
# CSRF cross site request forgery
Cross-site request forgery, also known as a one-click attack or session riding and abbreviated as CSRF is a type of malicious exploit of a website whereby unauthorized commands are transmitted from a user that the website trusts. Unlike cross-site scripting (XSS), which exploits the trust a user has for a particular site, CSRF exploits the trust that a site has in a user's browser.  
[More info about CSRF](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF))

- CSRF tokens should be used to validate form submissions
- Consider honey pots to prevent bot form submissions

##Code sample

- **Step 1** 
CSRF token and add it to the session  

- **Step 2**
On any form or url that should be protected, add the token as a parameter / hidden field.

```
<form action="">
  <input name="authenticity_token" type="hidden" value="{csrf token generated in step 1}">
</form>

```

- **Step 3**
On the server side, check that the submitted token matches the token generated in Step 1.

- **Step 4**
On logout and session timeout the CSRF token should be destroyed.
