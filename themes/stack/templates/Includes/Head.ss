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
    <%--TODO: CSS prefix in production must be changed to "$ThemeDir/css/dist/"--%>
    <link rel="preload" href="$ThemeDir/home.css" as="style">
    <%--TODO: JS prefix in production must be changed to "$ThemeDir/js/frontend/dist/"--%>
    <link rel="preload" href="$ThemeDir/js/frontend/home.js" as="script">
  <% else_if $ClassName == "PrivacyPage" %>
    <%--TODO: CSS prefix in production must be changed to "$ThemeDir/css/dist/"--%>
    <link rel="preload" href="$ThemeDir/css/privacy.css" as="style">
    <%--TODO: JS prefix in production must be changed to "$ThemeDir/js/frontend/dist/"--%>
    <link rel="preload" href="$ThemeDir/js/frontend/privacy.js" as="script">
  <% else_if $ClassName == "Security" %>
    <%--TODO: CSS prefix in production must be changed to "$ThemeDir/css/dist/"--%>
    <link rel="preload" href="$ThemeDir/css/cms.css" as="style">
    <%--TODO: JS prefix in production must be changed to "$ThemeDir/js/frontend/dist/"--%>
    <link rel="preload" href="$ThemeDir/js/frontend/cms.js" as="script">
  <% end_if %>
  <link rel="preload" href="$ThemeDir/js/frontend/refresh.js" as="script">
  <link rel="preload" href="$ThemeDir/js/frontend/install.js" as="script">
  <%--Preload End--%>
  <%--Inizio Importazione Stili--%>
  <% if $ClassName == "HomePage" %>
    <%--TODO: CSS prefix in production must be changed to "$ThemeDir/css/dist/"--%>
    <link rel="stylesheet dns-prefetch" href="$ThemeDir/css/home.css">
  <% else_if $ClassName == "PrivacyPage" %>
    <%--TODO: CSS prefix in production must be changed to "$ThemeDir/css/dist/"--%>
    <link rel="stylesheet dns-prefetch" href="$ThemeDir/css/privacy.css">
  <% else_if $ClassName == "Security" %>
    <%--TODO: CSS prefix in production must be changed to "$ThemeDir/css/dist/"--%>
    <link rel="stylesheet dns-prefetch" href="$ThemeDir/css/cms.css">
  <% else %>
    <%--TODO: CSS prefix in production must be changed to "$ThemeDir/css/dist/"--%>
    <link rel="stylesheet dns-prefetch" href="$ThemeDir/css/main.css">
  <% end_if %>
  <%--Fine Importazione Stili--%>
  <link rel="icon dns-prefetch" type="image/png" href="/favicon.png" />
  <%--TODO: Must be 152x152 px PNG--%>
  <link rel="apple-touch-icon dns-prefetch" href="$ThemeDir/img/">
  <link rel="manifest dns-prefetch" href="$ThemeDir/manifest.json">
</head>
