<% base_tag %>
<meta charset="UTF-8" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
$MetaTags
<meta property="og:url" content="$AbsoluteLink.ATT" />
<meta property="og:type" content="" />
<meta property="og:title" content="$Title.ATT" />
<meta property="og:description" content="$SiteConfig.Tagline" />
<meta property="og:image" content="{$AbsoluteLink.ATT}themes/corporate/img/logo.png" />
<meta property="og:audio" content="" />
<meta property="og:video" content="" />
<meta property="og:locale" content="$ContentLocale.ATT" />
<meta property="og:locale:alternate" content="" />
<meta property="og:site_name" content="$SiteConfig.Title.ATT" />
<!--Fine Meta Tags-->
<!--Localizzazione-->
<link rel="alternate" hreflang="$ContentLocale" href="$AbsoluteLink.ATT?locale=$ContentLocale" />
<!--Inizio Preload-->
<link rel="preload" href="$ThemeDir/css/dist/main.css" as="style">
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
<% end_if %>
<!--Fine Preload-->
<!--Inizio Importazione Stili-->
<% if $URLSegment == "home" %>
  <link rel="stylesheet dns-prefetch" href="$ThemeDir/css/dist/home.css">
<% else_if $URLSegment == "privacy" %>
  <link rel="stylesheet dns-prefetch" href="$ThemeDir/css/dist/privacy.css">
<% else_if $URLSegment == "Security" %>
  <link rel="stylesheet dns-prefetch" href="$ThemeDir/css/dist/cms.css">
<% end_if %>
<!--Fine Importazione Stili-->
<link rel="icon dns-prefetch" type="image/png" href="/favicon.png" />
