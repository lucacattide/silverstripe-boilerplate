# Best Practices

## Repository

### Master

- .gitignore
  - **/config/:** files di configurazione deploy manager (_Capistrano_);
  - **/lib/:** registri operativi deploy manager (_Capistrano_); \* **/log/:** files di configurazione deploy manager (_Capistrano_);
  - **/silverstripe-cache/:** files di cache Framework (_SilverStripe_);
  - **/themes/simple/:** tema demo Framework (_SilverStripe_);
  - **/themes/stack/js/\*\*/\*:** files di sviluppo Front-End (_JavaScript_);
  - **!/themes/stack/js/dist/:** files di sviluppo Front-End (Produzione - _JavaScript_);
  - **!/themes/stack/js/lib/:** librerie Front-End (_JavaScript_);
  - **/themes/stack/node_modules/:** pacchetti Full-stack Front-End (_NodeJS_);
  - **/themes/stack/sass/:** files di sviluppo Front-End (_SASS_);
  - **/themes/stack/\_.browserlistrc/:** file di configurazione _NodeJS_;
  - **!/themes/stack/.gitignore/:** file di configurazione Repository (_Git_);
  - **/themes/stack/.\*:** files di sistema e configurazione vari;
  - **/themes/stack/config.rb:** file di configurazione Framework Front-End (_Compass_);
  - **/themes/stack/gulpfile.js:** file di configurazione task-runner Front-End (_Gulp_);
  - **/themes/stack/\*.json:** files di configurazione vari Full-stack Front-End;
  - **/themes/stack/package-lock.json:** file di configurazione dependency manager Front-End (_NodeJS_);
  - **/themes/stack/postcss.config.js:** file di configurazione plugin bundler moduli (_Webpack_);
  - **/themes/stack/webpack.\*.js**: file di configurazione bundler moduli (_Webpack_);
  - **/vendor/:** librerie di terze parti Framework (_SilverStripe_);
  - **/Capfile:** file di configurazione deploy manager (_Capistrano_);
  - **/Gemfile:** file di configurazione _Ruby_;
  - **/.DS_Store:** file di indicizzazione _Mac OS X_;
  - **/.\_\*:** files di sistema e configurazione vari;
  - **/!.env:** file di configurazione ambiente Framework Back-End (_SilverStripe_);
  - **/!.gitignore:** file di configurazione Repository (_GIT_);
  - **/!.htaccess:** file di configurazione Host;
  - **/.\*:** files di sistema e configurazione vari;

Es.

```
	# Generale
	/config/
    /lib/
    /log/
    /silverstripe-cache/
    /themes/simple/
    /themes/stack/js/**/*
    !/themes/stack/js/dist/
    !/themes/stack/js/lib/
    /themes/stack/node_modules/
    /themes/stack/sass/
    /themes/stack/_.browserlistrc
    !/themes/stack/.gitignore
    /themes/stack/.*
    /themes/stack/config.rb
    /themes/stack/gulpfile.js
    /themes/stack/*.json
    /themes/stack/package-lock.json
    /themes/stack/postcss.config.js
    /themes/stack/webpack.*.js
    /Capfile
    /Gemfile
    .DS_Store
    ._*
    !.env
    !.gitignore
    !.htaccess
    .*
```

## Branches

- **develop** (Sviluppo);
- **staging** (Beta);
- **master** (Produzione - _Default_);

## Commits

- **< Etichetta/Titolo >**

  - -**< Descrizione >**;

- **Etichetta**: label identificativa oggetto dell'implementazione (se prevista);
- **Titolo**: breve nomenclatura distintiva dell'oggetto dell'implementazione
- **Descrizione**: breve nota illustrativa dell'implementazione effettuata;

Es.

```
	Updates template

	- Aggiornate icone;
```

## Merges

- **staging**: merging da **develop**;
- **master**: merging da **staging**;

## Deployment

### Capistrano

#### CLI

- **Beta**
  - `cap staging deploy`
- **Produzione** \* `cap production deploy`

## Host

### Directories essenziali ^!

- **.ssh**
- **releases**
- **repo**
- **shared**
- **current**

### Files essenziali^!

- **.ftpquota**
- **revisions.log**

^! **Non eliminare**
