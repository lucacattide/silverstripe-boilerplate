<head>
  <% base_tag %>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
  $MetaTags
  <meta name="og:url" property="og:url" content="$AbsoluteLink.ATT" />
  <meta name="og:type" property="og:type" content="" />
  <meta name="og:title" property="og:title" content="$Title.ATT" />
  <meta name="og:description" property="og:description" content="$SiteConfig.Tagline" />
  <meta name="og:image" property="og:image" content="{$AbsoluteLink.ATT}themes/corporate/img/logo.png" />
  <meta name="og:audio" property="og:audio" content="" />
  <meta name="og:video" property="og:video" content="" />
  <meta name="og:locale" property="og:locale" content="$ContentLocale.ATT" />
  <meta name="og:locale:alternate" property="og:locale:alternate" content="" />
  <meta name="og:site_name" property="og:site_name" content="$SiteConfig.Title.ATT" />
  <!--Fine Meta Tags-->
  <!--Localizzazione-->
  <link rel="alternate" hreflang="$ContentLocale" href="$AbsoluteLink.ATT?locale=$ContentLocale" />
  <!--Inizio Preload-->
  <link rel="preload" href="$ThemeDir/css/dist/home.css" as="style">
  <link rel="preload" href="//code.jquery.com/jquery-3.3.1.min.js" as="script">
  <% if $URLSegment == "home" %>
    <link rel="preload" href="$ThemeDir/home.js" as="script">
  <% else_if $URLSegment == "privacy" %>
    <link rel="preload" href="$ThemeDir/css/dist/privacy.css" as="style">
    <link rel="preload" href="$ThemeDir/privacy.js" as="script">
  <% else_if $URLSegment == "Security" %>
    <link rel="preload" href="$ThemeDir/css/dist/cms.css" as="style">
    <link rel="preload" href="$ThemeDir/cms.js" as="script">
  <% else %>
    <link rel="preload" href="$ThemeDir/css/dist/main.css" as="style">
  <% end_if %>
  <!--Fine Preload-->
  <!--Inizio Importazione Stili-->
  <% if $URLSegment == "home" %>
    <link rel="stylesheet dns-prefetch" href="$ThemeDir/css/dist/home.css">
  <% else_if $URLSegment == "privacy" %>
    <link rel="stylesheet dns-prefetch" href="$ThemeDir/css/dist/privacy.css">
  <% else_if $URLSegment == "Security" %>
    <link rel="stylesheet dns-prefetch" href="$ThemeDir/css/dist/cms.css">
  <% else %>
    <link rel="stylesheet dns-prefetch" href="$ThemeDir/css/dist/main.css">
  <% end_if %>
  <!--Fine Importazione Stili-->
  <link rel="icon dns-prefetch" type="image/png" href="/favicon.png" />
</head>