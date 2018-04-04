<!-- respond.js per IE8 -->
<!--[if lt IE 9]>
  <script src="/themes//js/lib/respond.min.js"></script>
<![endif]-->
<!--&#91;if lt IE 9&#93;>
  <script>
	document.createElement('video');
  </script>
<!&#91;endif&#93;-->
<script src="//code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
  crossorigin="anonymous"></script>
<script async defer src="{$ThemeDir}/js/dist/cookies.js"></script>
<% if $URLSegment == "home" %>
  <script async defer src="{$ThemeDir}/home.js"></script>
<% else_if $URLSegment == "privacy" %>
  <script async defer src="{$ThemeDir}/privacy.js"></script>
<% else_if $URLSegment == "Security" %>
  <script async defer src="{$ThemeDir}/cms.js"></script>
<% end_if %>
<!--Inizio Google Tag Manager-->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KL9TZF5');</script>
<!--Fine Google Tag Manager-->
<!--Inizio Rich Snippets-->
<script type="application/ld+json">
{
  "@context": "http://schema.org",
  "@type": "Organization",
  "url": "http://notaiovarcacciogarofalo.it",
  "logo": "http://notaiovarcacciogarofalo.it/themes/assuntasiani/img/logo.png",
  "contactPoint": [
    { "@type": "ContactPoint",
      "telephone": "+39-02-35-99-7654",
      "contactType": "customer support",
	  "areaServed": [
	  	"IT"
	  ],
	  "avaliableLanguage": [
	  	"Italian"
	  ]
    }
  ],
  "name": "Notaio Marianna Varcaccio Garofalo"
},
{
  "@context": "http://schema.org",
  "@type": "StudioNotarile",
  "name": "Notaio Marianna Varcaccio Garofalo",
  "url": "http://notaiovarcacciogarofalo.it",
  "image": "http://notaiovarcacciogarofalo.it/themes/mvg/img/logo-1.svg",
  "@id": "http://notaiovarcacciogarofalo.it",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Viale Majno 9",
    "addressLocality": "Milano",
    "addressRegion": "MI",
    "postalCode": "20122",
    "addressCountry": "IT"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 45.4689444,
    "longitude": 9.2032903
  },
  "telephone": "+39-02-35-99-7654"
},
{
  "@context": "http://schema.org",
  "@type": "WebSite",
  "name": "Marianna Varcaccio Garofalo | Notaio",
  "url": "http://notaiovarcacciogarofalo.it"
}
</script>
