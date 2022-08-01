

vcl 4.0;

import std;
 
acl purge {
  "app";   // IP which can BAN cache - it should be PWA's IP
}


backend default {
  .host = "app";
  .port = "3000";
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
    if (!req.http.X-VS-Cache-Tag && !req.http.X-VS-Cache-Ext) {
      return (synth(403, "X-VS-Cache-Tag or X-VS-Cache-Ext header missing."));
    }
 
    # Throw a synthetic page so the request won't go to the backend.
    return (synth(403, "Nothing to do"));

  }

  if (!(req.url ~ "^\/invalidate")) {
    if (req.method == "GET") {
      return (hash);
    }
  }
 
  return (pipe);
 
}
 
sub vcl_hash {
  hash_data("");
}
 
sub vcl_backend_response {
    # Set ban-lurker friendly custom headers.
    if (beresp.http.X-VS-Cache && beresp.http.X-VS-Cache ~ "Miss") {
      # It is required
      set beresp.ttl = 1s;
      unset beresp.http.X-VS-Cache;
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
    unset resp.http.X-Cache-Contexts;
}