<!-- respond.js per IE8 -->
<!--[if lt IE 9]>
  <script src="/themes/stack/js/lib/respond.min.js"></script>
<![endif]-->
<!--&#91;if lt IE 9&#93;>
  <script>
	document.createElement('video');
  </script>
<!&#91;endif&#93;-->
<script src="//code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
  crossorigin="anonymous"></script>
<% if $URLSegment == "home" %>
  <script async defer src="{$ThemeDir}/home.js"></script>
<% else_if $URLSegment == "privacy" %>
  <script async defer src="{$ThemeDir}/privacy.js"></script>
<% else_if $URLSegment == "Security" %>
  <script async defer src="{$ThemeDir}/cms.js"></script>
<% end_if %>
<!--Inizio Rich Snippets-->
<script type="application/ld+json">
{
  "@context": "http://schema.org",
  "@type": "Organization",
  "url": "http://",
  "logo": "http:///themes/stack/img/logo.png",
  "contactPoint": [{
    "@type": "ContactPoint",
    "telephone": "+39-02-35-99-7654",
    "contactType": "customer support",
    "areaServed": [
      "IT"
    ],
    "availableLanguage": {
      "@type": "Language",
      "name": ["Italian"]
    }
  }],
  "name": ""
}, {
  "@context": "http://schema.org",
  "@type": "",
  "name": "",
  "url": "http://",
  "image": "http:///themes/stack/img/logo.png",
  "@id": "http://",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "",
    "addressLocality": "",
    "addressRegion": "",
    "postalCode": "",
    "addressCountry": "IT"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": ,
    "longitude":
  },
  "telephone": "+39-"
}, {
  "@context": "http://schema.org",
  "@type": "WebSite",
  "name": "",
  "url": "http://"
}
</script>
