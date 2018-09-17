# SilverStripe ErrorPage Module

[![Build Status](https://api.travis-ci.org/silverstripe/silverstripe-errorpage.svg?branch=master)](https://travis-ci.org/silverstripe/silverstripe-errorpage)
[![Latest Stable Version](https://poser.pugx.org/silverstripe/errorpage/version.svg)](http://www.silverstripe.org/stable-download/)
[![Latest Unstable Version](https://poser.pugx.org/silverstripe/errorpage/v/unstable.svg)](https://packagist.org/packages/silverstripe/errorpage)
[![Total Downloads](https://poser.pugx.org/silverstripe/errorpage/downloads.svg)](https://packagist.org/packages/silverstripe/errorpage)
[![License](https://poser.pugx.org/silverstripe/errorpage/license.svg)](https://github.com/silverstripe/silverstripe-errorpage#license)
[![Dependency Status](https://www.versioneye.com/php/silverstripe:errorpage/badge.svg)](https://www.versioneye.com/php/silverstripe:errorpage)
[![Reference Status](https://www.versioneye.com/php/silverstripe:errorpage/reference_badge.svg?style=flat)](https://www.versioneye.com/php/silverstripe:errorpage/references)
[![SilverStripe supported module](https://img.shields.io/badge/silverstripe-supported-0071C4.svg)](https://www.silverstripe.org/software/addons/silverstripe-commercially-supported-module-list/)

## Overview

Provides an ErrorPage page type for the [SilverStripe CMS](https://github.com/silverstripe/silverstripe-cms), allowing CMS authors to set custom content for error page responses by error code. Error page responses are fully themed.

## Installation

```
$ composer require silverstripe/errorpage
```

You'll also need to run `dev/build`, which will generate a 500 and 404 error page.

## Limitations

The functionally in this module was separated out from the SilverStripe CMS module and retains some [existing issues](https://github.com/silverstripe/silverstripe-framework/issues/4149).
An issue of note is that static error pages are generated but are rarely served up, and rarely re-generated. This can lead to website visitors seeing a stale or broken page in the event of a 500 server error.
Contributions are welcome, please open a pull request if you want to add a feature or fix a problem.

## Upgrading from SilverStripe 3.x

### API changes

* `ErrorPage.static_filepath` config has been removed.
* `ErrorPage::get_filepath_for_errorcode` has been removed
* `ErrorPage::alternateFilepathForErrorcode` extension point has been removed

### Upgrade code that modifies the behaviour of ErrorPage

ErrorPage has been updated to use a configurable asset backend, similar to the `AssetStore` described above.
This replaces the `ErrorPage.static_filepath` config that was used to write local files.

As a result, error pages may be cached either to a local filesystem, or an external Flysystem store
(which is configured via setting a new Flysystem backend with YAML).

`ErrorPage::get_filepath_for_errorcode()` has been removed, because the local path for a specific code is
no longer assumed. Instead you should use `ErrorPage::get_content_for_errorcode` which retrieves the
appropriate content for that error using one of the methods above.

In order to retrieve the actual filename (which is used to identify an error page regardless of base
path), you can use `ErrorPage::get_error_filename()` instead. Unlike the old `get_filepath_for_errorcode`
method, there is no $locale parameter.

In case that user code must customise this filename, such as for extensions which provide a locale value
for any error page, the extension point `updateErrorFilename` can be used. This extension point should
also be used to replace any `alternateFilepathForErrorcode` used.

```php
class MyErrorPageExtension extends SiteTreeExtension
{
	public function updateErrorFilename(&$name, &$statuscode)
    {
		if ($this->owner->exists()) {
			$locale = $this->Locale;
		} else {
			$locale = Translatable::get_current_locale();
		}
		$name = "error-{$statusCode}-{$locale}.html";
	}
}
```

```yml
ErrorPage:
  extensions:
    - MyErrorPageExtension
```

## Documentation

To Do
### Theming
To apply a custom template for the error page you will need to create a ErrorPage.ss file in either `templates/SilverStripe/ErrorPage/ErrorPage.ss` or `templates/SilverStripe/ErrorPage/Layout/ErrorPage.ss`

## Reporting Issues

Please [create an issue](http://github.com/silverstripe/silverstripe-errorpage/issues) for any bugs you've found, or features you're missing.
