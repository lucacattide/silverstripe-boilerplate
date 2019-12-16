<!-- respond.js per IE8 -->
<!--[if lt IE 9]>
  <script src="$ThemeDir/js/frontend/lib/respond.min.js"></script>
<![endif]-->
<script src="//code.jquery.com/jquery-3.4.1.min.js"
integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
crossorigin="anonymous"></script>
<% if $ClassName == "HomePage" %>
  <script async defer src="$ThemeDir/js/frontend/dist/home.js"></script>
<% else_if $ClassName == "PrivacyPage" %>
  <script async defer src="$ThemeDir/js/frontend/dist/privacy.js"></script>
<% else_if $ClassName == "Security" %>
  <script async defer src="$ThemeDir/js/frontend/dist/cms.js"></script>
<% end_if %>
<%--Rich Snippets Start--%>
<script type="application/ld+json">
{
  "@context": "http://schema.org",
  "@graph": [{
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
  }]
}
</script>
<%--Rich Snippets End--%>
