# Best Practices

## Repository

- .gitignore
    * __/config/:__ files di configurazione deploy manager (_Capistrano_);
    * __/js/*:__ files di sviluppo Front-End (_JavaScript_);
    * __/lib/:__ registri operativi deploy manager (_Capistrano_);
	* __/log/:__ files di configurazione deploy manager (_Capistrano_);
    * __/node_modules/:__ pacchetti Full-Stack Front-End (_NodeJS_);
    * __/resources/:__ risorse Framework (_SilverStripe_);
    * __/sass/:__ files di sviluppo Front-End (_SASS_);
    * __/silverstripe-cache/:__ files di cache Framework (_SilverStripe_);
    * __/vendor/:__ librerie di terze parti Framework (_SilverStripe_);
    * __/\_.browserslistrc/:__ file di configurazione _NodeJS_;
    * __/.:__ files di sistema e di configurazione vari;
    * __/!.htaccess:__ file di configurazione Host;
    * __/.json:__ files di configurazione vari Full-Stack Front-End;
    * __/Capfile:__ file di configurazione deploy manager (_Capistrano_);
    * __/composer.lock:__ file di configurazione dependency manager (_Composer_);
    * __/config.rb:__ file di configurazione Framework Front-End (_Compass_);
    * __/Gemfile:__ file di configurazione _Ruby_;
    * __/Gemfile.lock:__ file di configurazione _Ruby_;
	* __/gulpfile.js:__ file di configurazione task-runner Front-End (_Gulp_);
    * __/postcss.config.js:__ file di configurazione plugin bundler moduli (_Webpack_);
	* __/webpack.*.js__: file di configurazione bundler moduli (_Webpack_);
	

Es.

```
	# Generale
	/config/
    /js/*
    !/js/*/
    /lib/
    /log/
    /node_modules/
    /resources/
    /sass/
    /silverstripe-cache/
    /vendor/
    /_.browserlistrc
    /.*
    !/.htaccess
    /*.json
    /Capfile
    /composer.lock
    /config.rb
    /Gemfile
    /Gemfile.lock
    /gulpfile.js
    /postcss.config.js
    /webpack.*.js
```


## Branches

- __develop__ (Sviluppo);
- __staging__ (Beta);
- __master__ (Produzione - _Default_);


## Commits

- __< Etichetta/Titolo >__
    * -__< Descrizione >__;

- __Etichetta__: label identificativa oggetto dell'implementazione (se prevista);
- __Titolo__: breve nomenclatura distintiva dell'oggetto dell'implementazione
- __Descrizione__: breve nota illustrativa dell'implementazione effettuata;

Es.

```
	Updates template

	- Aggiornate icone;
```


## Merges

- __staging__: merging da __develop__;
- __master__: merging da __staging__;


## Deployment

### Capistrano

#### CLI

- __Beta__
    * ```cap staging deploy```
- __Produzione__
	* ```cap production deploy```


## Host

### Directories essenziali ^!

- __.ssh__
- __releases__
- __repo__
- __shared__
- __current__

### Files essenziali^!

- __.ftpquota__
- __revisions.log__

^! __Non eliminare__
