!function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=26)}({0:function(e,t){e.exports=jQuery},26:function(e,t,n){"use strict";function r(e){return document.getElementsByTagName("base")[0].href.replace("http://","").replace(/\//g,"_").replace(/\./g,"_")+e}var i=n(0),o=function(e){return e&&e.__esModule?e:{default:e}}(i);(0,o.default)(document).ready(function(){(0,o.default)("#switchView a.newWindow").on("click",function(e){return window.open(this.href,r(this.target)).focus(),!1}),(0,o.default)("#SilverStripeNavigatorLink").on("click",function(e){return(0,o.default)("#SilverStripeNavigatorLinkPopup").toggle(),!1}),(0,o.default)("#SilverStripeNavigatorLinkPopup a.close").on("click",function(e){return(0,o.default)("#SilverStripeNavigatorLinkPopup").hide(),!1}),(0,o.default)("#SilverStripeNavigatorLinkPopup input").on("focus",function(e){this.select()})})}});