vcl 4.0;

import std;
# import bodyaccess;

# One config for API + Cache on one machine
 
acl purge {
  "localhost";   // IP which can BAN cache - it should be PWA's IP
}

backend default {
  .host = "localhost";
  .port = "3000";
}

backend api {
  .host = "localhost";
  .port = "8080";
}
 
sub vcl_recv {
  unset req.http.X-Body-Len;
  # Only allow BAN requests from IP addresses in the 'purge' ACL.
  if (req.method == "BAN") {
    # Same ACL check as above:
    if (!client.ip ~ purge) {
      return (synth(403, "Not allowed."));
    }
 
    # Logic for the ban, using the X-Cache-Tags header.
    if (req.http.X-VS-Cache-Tag) {
      ban("obj.http.x-vs-cache-tags ~ " + req.http.X-VS-Cache-Tag);
      return (synth(200, "Ban added."));
    }
    if (req.http.X-VS-Cache-Ext) {
      ban("req.url ~ " + req.http.X-VS-Cache-Ext);
      return (synth(200, "Ban added."));
    }
    if (!req.http.X-VS-Cache-Tag && !req.http.X-VS-Cache-Ext) {
      return (synth(403, "X-VS-Cache-Tag or X-VS-Cache-Ext header missing."));
    }
 
    # Throw a synthetic page so the request won't go to the backend.
    return (synth(403, "Nothing to do"));

  }

  # Choose backend
  # This custom header allows me to distuinguish target for /invalidate while using nginx proxy
  if (req.url ~ "^/api/" || req.url ~ "^/img/" || req.http.X-Target ~ "API") {
    set req.backend_hint = api;
    set req.http.X-Backend = "api";
    if (req.url ~ "^/img/") {
      return (pipe);
    }
    
    if (req.url ~ "^\/api\/catalog\/") {
      if ((req.method == "GET")) {
        return (hash);
      }
    }

    if (req.url ~ "^\/api\/stock\/") {
      if (req.method == "GET") {
        # M2 Stock
        return (hash);
      }
    }

  } else {
    set req.backend_hint = default;
    set req.http.X-Backend = "pwa";
      if (req.method == "GET") {
        return (hash);
      }
  }
 
  return (pipe);
 
}
 
sub vcl_hash {
  hash_data(req.http.X-Backend);
}
 
sub vcl_backend_response {
    # Set ban-lurker friendly custom headers.
    if (beresp.http.X-VS-Cache && beresp.http.X-VS-Cache ~ "Miss") {
      # It is required
      set beresp.ttl = 1s;
      return (deliver);
    }
    if (bereq.url ~ "\.js$" || beresp.http.content-type ~ "text" || beresp.http.content-type ~ "json") {
        set beresp.do_gzip = true;
    }

    set beresp.http.X-Url = bereq.url;
    set beresp.http.X-Host = bereq.http.host;
}

sub vcl_deliver {
    if (obj.hits > 0) {
      set resp.http.X-Cache = "Hit";
      set resp.http.X-Cache-Hits = obj.hits;
    } else {
      set resp.http.X-Cache = "Miss";
    }
    unset resp.http.X-Varnish;
    unset resp.http.Via;
    unset resp.http.Age;
    unset resp.http.X-Purge-URL;
    unset resp.http.X-Purge-Host;
    # Remove ban-lurker friendly custom headers when delivering to client.
    unset resp.http.X-Url;
    unset resp.http.X-Host;
    # Comment these for easier Drupal cache tag debugging in development.
    unset resp.http.X-Cache-Tags;
    unset resp.http.X-Powered-By;
    unset resp.http.X-Cache-Contexts;
}
