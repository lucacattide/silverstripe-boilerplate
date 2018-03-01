<!--Inizio Menu-->
<nav class="menu">
  <h6>Menu Principale</h6>
  <ul class="menu__container">
    <% loop $Menu(1) %>
	  <a class="menu__container__link" href="$Link.ATT" title="$Title.ATT | $SiteConfig.Title.ATT" tabindex="$Pos.ATT" data-rel="$MenuTitle.LowerCase.ATT">
		  <li class="menu__container__link__voce">$MenuTitle</li>
	  </a>
	  <% if $Children %>
	  	<% loop $Children %>
			<a class="menu__container__link" href="$Link.ATT" title="$Title.ATT | $SiteConfig.Title.ATT" tabindex="$Pos.ATT" data-rel="$MenuTitle.LowerCase.ATT">
				<li class="menu__container__link__voce">$MenuTitle</li>
			</a>
		<% end_loop %>
	  <% end_if %>
    <% end_loop %>
	<a class="menu__container__link" href="Security/login?BackURL=/area-riservata/" title="Login | $SiteConfig.Title.ATT" tabindex="$Pos.ATT" data-rel="area-riservata">
		<li class="menu__container__link__voce">Area Riservata</li>
	</a>
  </ul>
</nav>
<!--Fine Menu-->
