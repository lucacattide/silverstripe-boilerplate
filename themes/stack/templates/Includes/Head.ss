<head>
  <% base_tag %>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  $MetaTags
  <meta name="og:url" property="og:url" content="$AbsoluteLink.ATT" />
  <meta name="og:type" property="og:type" content="" />
  <meta name="og:title" property="og:title" content="$Title.ATT" />
  <meta name="og:description" property="og:description" content="$SiteConfig.Tagline" />
  <meta name="og:image" property="og:image" content="{$AbsoluteLink.ATT}themes/stack/img/logo.png" />
  <meta name="og:audio" property="og:audio" content="" />
  <meta name="og:video" property="og:video" content="" />
  <meta name="og:locale" property="og:locale" content="$ContentLocale.ATT" />
  <meta name="og:locale:alternate" property="og:locale:alternate" content="" />
  <meta name="og:site_name" property="og:site_name" content="$SiteConfig.Title.ATT" />
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="">
  <meta name="apple-mobile-web-app-title" content="">
  <meta name="theme-color" content="#" />
  <%--Meta Tags End--%>
  <%--Localization--%>
  <link rel="alternate" hreflang="$ContentLocale" href="$AbsoluteLink.ATT?locale=$ContentLocale" />
  <%--Preload Start--%>
  <link rel="preload" href="$ThemeDir/manifest.json" as="script">
  <link rel="preload" href="//code.jquery.com/jquery-3.4.1.min.js" as="script">
  <% if $ClassName == "HomePage" %>
    <link rel="preload" href="$ThemeDir/css/dist/home.css" as="style">
    <link rel="preload" href="$ThemeDir/js/frontend/dist/home.js" as="script">
  <% else_if $ClassName == "PrivacyPage" %>
    <link rel="preload" href="$ThemeDir/css/dist/privacy.css" as="style">
    <link rel="preload" href="$ThemeDir/js/frontend/dist/privacy.js" as="script">
  <% else_if $ClassName == "Security" %>
    <link rel="preload" href="$ThemeDir/css/dist/cms.css" as="style">
    <link rel="preload" href="$ThemeDir/js/frontend/dist/cms.js" as="script">
  <% end_if %>
  <link rel="preload" href="$ThemeDir/js/frontend/refresh.js" as="script">
  <link rel="preload" href="$ThemeDir/js/frontend/install.js" as="script">
  <%--Preload End--%>
  <%--Inizio Importazione Stili--%>
  <% if $ClassName == "HomePage" %>
    <link rel="stylesheet dns-prefetch" href="$ThemeDir/css/dist/home.css">
  <% else_if $ClassName == "PrivacyPage" %>
    <link rel="stylesheet dns-prefetch" href="$ThemeDir/css/dist/privacy.css">
  <% else_if $ClassName == "Security" %>
    <link rel="stylesheet dns-prefetch" href="$ThemeDir/css/dist/cms.css">
  <% else %>
    <link rel="stylesheet dns-prefetch" href="$ThemeDir/css/dist/main.css">
  <% end_if %>
  <%--Fine Importazione Stili--%>
  <link rel="icon dns-prefetch" type="image/png" href="/favicon.png" />
  <%--TODO: Must be 152x152 px PNG--%>
  <link rel="apple-touch-icon dns-prefetch" href="$ThemeDir/img/">
  <link rel="manifest dns-prefetch" href="$ThemeDir/manifest.json">
</head>
