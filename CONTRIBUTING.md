# Best Practices

## Styles & Coding

- HTML, CSS and Javascript follow in general the Google Style Guide conventions (https://github.com/google/styleguide);
- Custom CSS follows the BEM convention (http://getbem.com/);

Please be sure to check and follow them before attempt any modification to the sources, in order to preserve the general integrity of the project patterns.
Third-party linter plugins like ESLint, Beautify, Prettier or any other similar resource are welcome (configuration files of the mentioned ones are already present).


## Assets

### Common Guidelines

- For assets inclusion location, specifications or their variations, please refeer to __TODO__ comments inside the sources;


### List of common assets

- Paths:
    * __/config/__: Contains all the deploy manager configuration settings (__development__/__production__ version);
    * __/config/deploy__: Contains all the deploy manager configuration recipes (__development__/__production__ version);
    * __/css/__: Contains all the shared styles (__development__ version);
    * __/css/dist/__: Contains all the shared styles (__production__ version);
    * __/css/lib/__: Contains all the shared third-party styles (__production__ version);
    * __/img/__: Contains all the iconographic assets;
    * __/js/__: Contains all the shared scripts (__development__ version);
    * __/js/backend/__: Contains all the shared back-end scripts (__development__/__production__ version);
    * __/js/backend/resolvers/__: Contains all the shared back-end resolvers scripts (__development__/__production__ version);
    * __/js/fontend/__: Contains all the shared front-end scripts (__development__ version);
    * __/js/fontend/dist/__: Contains all the shared scripts (__production__ version);
    * __/js/frontend/lib/__: Contains all the shared third-party scripts;
    * __/js/frontend/\<section_name\>/__: Contains all the section scripts (__development__ version);
    * __/lib/__: Contains all the deploy manager utility recipes;
    * __/php/__: Contains all the shared section snippets;
    * __/prisma/__: Contains all the shared Back-End Database client scripts;
    * __/sass/__: Contains all the shared preprocessed styles;
    * __/sass/lib/__: Contains all the shared third-party preprocessed styles;
    * __/sass/\<section_name\>/__: Contains all the section preprocessed styles;
    * __/test/__: Contains all the shared unit tests;

- Sources:
    * __/js/backend/index.js__: Back-End server JavaScript module;
    * __/js/backend/schema.graphql__: GraphQL Database schema;
    * __/js/backend/resolvers/Mutation.js__: GraphQL Mutation definitions;
    * __/js/backend/resolvers/Query.js__: GraphQL Query definitions;
    * __/js/backend/resolvers/Subscription.js__: GraphQL Subscription definitions;
    * __/js/fontend/cookies.js__: Cookies JavaScript module;
    * __/js/fontend/index.js__: Main module
        - Includes:
            - __/sass/index.scss__: Main style preprocessor import;
            - __\<function-name\>__: Common proprietary and third-party modules import;
    * __/js/fontend/<section-name\>.js__: Section module
        - Includes:
            - __/sass/<section-name\>.scss__: Section style preprocessor import;
            - __\<function-name\>__: Common proprietary and third-party modules import;
    * __/js/fontend/install.js__: Progressive Web App local installation settings;
    * __/js/fontend/refresh.js__: Progressive Web App refresh UX;
    * __/js/fontend/service-worker.js__: Progressive Web App service worker configuration;
    * __/js/fontend/manifest.json__: _Webpack_ manifest file;
    * __/php/head.php__: HEAD definition snippet
        - Includes:
            - All the common third-party library (style/script) preloads
                - jQuery - CDN;
            - All the specific third-party library (style/script) preloads by current section
            - All the specific proprietary library (style/script) preloads by current section
                - __css/\<section-name\>.css__: Section styles;
                - __/js/\<section-name\>.js__: Section scripts;
            - All the common third-party library (style) imports
            - All the specific third-party library (style) imports by current section
            - All the specific proprietary library (style) imports by current section
                - __css/\<section-name\>.css__: Section styles;
    * __/php/scripts.php__: Scripts definition snippet
        - Includes:
            - All the common third-party library (script) imports
                - Respond.js;
                - jQuery - CDN;
            - All the specific third-party library (script) imports by current section
            - All the specific proprietary library (script) imports by current section
                - __/js/\<section-name\>.js__: Section scripts;
    * __/prisma/datamodel.prisma__: Prisma Data Model definition
    * __/prisma/prisma.yml__: Prisma Database client configuration
    * __/test/dom.test.js__: DOM manipulation testing assertion definitions


## Repository

- .gitignore (Production)
    * __!/js/frontend/install.js:__ Progressive Web App management file (_JavaScript_);
    * __!/js/frontend/refresh.js:__ Progressive Web App installation manager file (_JavaScript_);
    * __!/js/frontend/lib/*.js:__ Front-End third-party library files (_JavaScript_);
    * __/js/frontend/*:__ Front-End development files (_JavaScript_);
    * __/js/frontend/lib/workbox/*:__ Progressive Web App chache files (_JavaScript_);
	* __/lib/:__ Deploy manager utility recipes (_Capistrano_);
    * __/log/:__ Various operational registries;
    * __/node_modules/:__ Full-Stack Front-End dependencies (_NodeJS_);
    * __/sass/:__ Front-End development files (_SASS_);
    * __/test/:__ Unit testing files (_JavaScript_);
    * __/\_.browserslistrc/:__ _NodeJS_ configuration file;
    * __!/.gitignore:__ Repository configuration file;
    * __!/.htaccess:__ Host configuration file;
    * __/.:__ Various system and configuration files;
    * __!/manifest.json:__ Progressive Web App manifest file;
    * __/*.json:__ Full-Stack Front-End various configuration files;
    * __/babel.config.js:__ ES6 compiler configuration files (_JavaScript_);
    * __/Capfile:__ Deploy Manager configuration file (_Capistrano_);
    * __/config.rb:__ Front-End Framework configuration files (_Compass_);
    * __/Gemfile:__  Deploy Manager installation file (_Capistrano_);
    * __/Gemfile.lock:__ Deploy Manager dependencies file (_Capistrano_);
	* __/gulpfile.js:__ Front-End task-runner configuration files (_Gulp_);
    * __/jest.*.js:__ Unit testing plugin configuration files (_Jest_);
    * __/postcss.config.js:__ Module plugin bundler configuration files (_Webpack_);
	* __/webpack.*.js__: Module plugin bundler configuration files (_Webpack_);
    * __.DS_Store__: OS filesystem indexing file (_Mac OS X_);


I.e.

```
    # Repository - Configuration
    /config/
    !/js/frontend/install.js
    !/js/frontend/refresh.js
    !/js/frontend/lib/*
    /js/frontend/*
    /js/frontend/lib/workbox/*
    /lib/
    /log/
    /node_modules/
    /sass/
    /test/
    /_.browserlistrc
    !/.gitignore
    !/.htaccess
    /.*
    !/manfest.json
    /*.json
    /babel.config.js
    /Capfile
    /config.rb
    /Gemfile
    /Gemfile.lock
    /gulpfile.js
    /jest.*.js
    /postcss.config.js
    /webpack.*.js
    .DS_Store
```


### Branches

There are three branches, defined as:

- __develop__ (Development);
- __staging__ (Beta);
- __master__ (Production - _Default_);

Contributions implement the GitFlow framework (https://tinyurl.com/zt4vys8).
Please read about its specifications before commit on any branch.



### Commits

Official Udacity Git commit message style guide is used. Please consult the docs (http://udacity.github.io/git-styleguide/) for details.


### Merges

- __staging__: merging from __develop__;
- __master__: merging from __staging__;


### Releases

The releasing process follows the SemVer specification (https://semver.org/).
Please read about its guidelines before draft any release.


## Host

### Essential files^!

- __.ftpquota__
- __revisions.log__

^! __Not delete__
