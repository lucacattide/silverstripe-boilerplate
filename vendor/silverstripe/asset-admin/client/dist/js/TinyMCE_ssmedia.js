!function(t){function e(n){if(i[n])return i[n].exports;var a=i[n]={i:n,l:!1,exports:{}};return t[n].call(a.exports,a,a.exports,e),a.l=!0,a.exports}var i={};e.m=t,e.c=i,e.i=function(t){return t},e.d=function(t,i,n){e.o(t,i)||Object.defineProperty(t,i,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(i,"a",i),i},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s="./client/src/entwine/TinyMCE_ssmedia.js")}({"./client/src/entwine/TinyMCE_ssmedia.js":function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}var a=i(6),r=n(a),o=i(1),s=n(o),d=i(0),l=n(d),c=i(5),u=n(c),f=i(2),m=i(10),p=n(m),g=i(7),h=n(g),v=(0,f.loadComponent)(p.default),_='img[data-shortcode="image"]';!function(){var t={init:function(t){var e=s.default._t("AssetAdmin.INSERT_FROM_FILES","Insert from Files");t.addButton("ssmedia",{icon:"image",title:e,cmd:"ssmedia"}),t.addMenuItem("ssmedia",{icon:"image",text:e,cmd:"ssmedia"}),t.addCommand("ssmedia",function(){(0,r.default)("#"+t.id).entwine("ss").openMediaDialog()}),t.on("BeforeExecCommand",function(e){var i=e.command,n=e.ui,a=e.value;"mceAdvImage"!==i&&"mceImage"!==i||(e.preventDefault(),t.execCommand("ssmedia",n,a))}),t.on("SaveContent",function(t){var e=(0,r.default)(t.content);e.find(_).add(e.filter(_)).each(function(){var t=(0,r.default)(this),e={src:t.attr("src"),id:t.data("id"),width:t.attr("width"),height:t.attr("height"),class:t.attr("class"),title:t.attr("title"),alt:t.attr("alt")},i=h.default.serialise({name:"image",properties:e,wrapped:!1});t.replaceWith(i)}),t.content="",e.each(function(){void 0!==this.outerHTML&&(t.content+=this.outerHTML)})}),t.on("BeforeSetContent",function(t){for(var e=t.content,i=h.default.match("image",!1,e);i;){var n=i.properties,a=(0,r.default)("<img/>").attr(Object.assign({},n,{id:void 0,"data-id":n.id,"data-shortcode":"image"})).addClass("ss-htmleditorfield-file image");e=e.replace(i.original,(0,r.default)("<div/>").append(a).html()),i=h.default.match("image",!1,e)}t.content=e})}};tinymce.PluginManager.add("ssmedia",function(e){return t.init(e)})}(),r.default.entwine("ss",function(t){t(".insert-media-react__dialog-wrapper .nav-link, .insert-media-react__dialog-wrapper .breadcrumb__container a").entwine({onclick:function(t){return t.preventDefault()}}),t(".js-injector-boot #insert-media-react__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function(){this._clearModal()},_clearModal:function(){u.default.unmountComponentAtNode(this[0])},open:function(){this._renderModal(!0)},close:function(){this._renderModal(!1)},_renderModal:function(t){var e=this,i=function(){return e.close()},n=function(){return e._handleInsert.apply(e,arguments)},a=this.getOriginalAttributes(),r=tinymce.activeEditor.selection,o=r.getContent()||"",s=r.getNode().tagName,d="A"!==s&&("IMG"===s||""===o.trim());delete a.url,u.default.render(l.default.createElement(v,{title:!1,type:"insert-media",isOpen:t,onInsert:n,onClosed:i,bodyClassName:"modal__dialog",className:"insert-media-react__dialog-wrapper",requireLinkText:d,fileAttributes:a}),this[0])},_handleInsert:function(t,e){var i=!1;this.setData(Object.assign({},t,e));try{switch(e?e.category:"image"){case"image":i=this.insertImage();break;default:i=this.insertFile()}}catch(t){this.statusMessage(t,"bad")}return i&&this.close(),Promise.resolve()},getOriginalAttributes:function(){var e=this.getElement();if(!e)return{};var i=e.getEditor().getSelectedNode();if(!i)return{};var n=t(i),a=(n.attr("href")||"").split("#");if(a[0]){var r=h.default.match("file_link",!1,a[0]);if(r)return{ID:r.properties.id?parseInt(r.properties.id,10):0,Anchor:a[1]||"",Description:n.attr("title"),TargetBlank:!!n.attr("target")}}var o=n.parent(".captionImage").find(".caption"),s={url:n.attr("src"),AltText:n.attr("alt"),Width:n.attr("width"),Height:n.attr("height"),TitleTooltip:n.attr("title"),Alignment:this.findPosition(n.attr("class")),Caption:o.text(),ID:n.attr("data-id")};return["Width","Height","ID"].forEach(function(t){s[t]="string"==typeof s[t]?parseInt(s[t],10):null}),s},findPosition:function(t){var e=["leftAlone","center","rightAlone","left","right"];if("string"!=typeof t)return"";var i=t.split(" ");return e.find(function(t){return i.indexOf(t)>-1})},getAttributes:function(){var t=this.getData();return{src:t.url,alt:t.AltText,width:t.Width,height:t.Height,title:t.TitleTooltip,class:t.Alignment,"data-id":t.ID,"data-shortcode":"image"}},getExtraData:function(){var t=this.getData();return{CaptionText:t&&t.Caption}},insertFile:function(){var e=this.getData(),i=this.getElement().getEditor(),n=t(i.getSelectedNode()),a=h.default.serialise({name:"file_link",properties:{id:e.ID}},!0),r=tinymce.activeEditor.selection,o=r.getContent()||"",s=o||e.Text||e.filename;n.is("a")&&n.html()&&(s="");var d={href:a,target:e.TargetBlank?"_blank":"",title:e.Description};if(n.is("img")){s=e.Text||e.filename;var l=t("<a />").attr(d).text(s);n.replaceWith(l),i.addUndo(),i.repaint()}else this.insertLinkInEditor(d,s);return!0},insertImage:function(){var e=this.getElement();if(!e)return!1;var i=e.getEditor();if(!i)return!1;var n=t(i.getSelectedNode()),a=this.getAttributes(),r=this.getExtraData(),o=n&&n.is("img,a")?n:null;o&&o.parent().is(".captionImage")&&(o=o.parent());var s=n&&n.is("img")?n:t("<img />");s.attr(a).addClass("ss-htmleditorfield-file image");var d=s.parent(".captionImage"),l=d.find(".caption");r.CaptionText?(d.length||(d=t("<div></div>")),d.attr("class","captionImage "+a.class).removeAttr("data-mce-style").width(a.width),l.length||(l=t('<p class="caption"></p>').appendTo(d)),l.attr("class","caption "+a.class).text(r.CaptionText)):(d=null,l=null);var c=d||s;return o&&o.not(c).length&&o.replaceWith(c),d&&d.prepend(s),o||(i.repaint(),i.insertContent(t("<div />").append(c).html(),{skip_undo:1})),i.addUndo(),i.repaint(),!0},statusMessage:function(e,i){var n=t("<div/>").text(e).html();t.noticeAdd({text:n,type:i,stayTime:5e3,inEffect:{left:"0",opacity:"show"}})}})})},0:function(t,e){t.exports=React},1:function(t,e){t.exports=i18n},10:function(t,e){t.exports=InsertMediaModal},2:function(t,e){t.exports=Injector},5:function(t,e){t.exports=ReactDom},6:function(t,e){t.exports=jQuery},7:function(t,e){t.exports=ShortcodeSerialiser}});