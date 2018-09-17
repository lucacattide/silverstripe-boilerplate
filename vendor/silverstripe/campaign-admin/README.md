# SilverStripe Campaign Admin Module

[![Build Status](https://api.travis-ci.org/silverstripe/silverstripe-campaign-admin.svg?branch=master)](https://travis-ci.org/silverstripe/silverstripe-campaign-admin)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/silverstripe/silverstripe-campaign-admin/badges/quality-score.png?b=1)](https://scrutinizer-ci.com/g/silverstripe/silverstripe-campaign-admin/?branch=1)
[![codecov](https://codecov.io/gh/silverstripe/comment-notifications/branch/master/graph/badge.svg)](https://codecov.io/gh/silverstripe/comment-notifications)
[![Latest Stable Version](https://poser.pugx.org/silverstripe/campaign-admin/version.svg)](http://www.silverstripe.org/stable-download/)
[![Latest Unstable Version](https://poser.pugx.org/silverstripe/campaign-admin/v/unstable.svg)](https://packagist.org/packages/silverstripe/campaign-admin)
[![Total Downloads](https://poser.pugx.org/silverstripe/campaign-admin/downloads.svg)](https://packagist.org/packages/silverstripe/campaign-admin)
[![License](https://poser.pugx.org/silverstripe/campaign-admin/license.svg)](https://github.com/silverstripe/silverstripe-campaign-admin#license)

## Overview

Provides a simple interface for managing versioned campaigns, provided by the 
[versioned](https://github.com/silverstripe/silverstripe-versioned) SilverStripe module.

This allows groups of changes to be published as a single atomic change, allowing items to be
prepared for publishing in advance.

## Installation

```
$ composer require silverstripe/campaign-admin
```

You'll also need to run `dev/build`.

## Documentation

See [doc.silverstripe.org](http://doc.silverstripe.org)

## Versioning

This library follows [Semver](http://semver.org). According to Semver,
you will be able to upgrade to any minor or patch version of this library
without any breaking changes to the public API. Semver also requires that
we clearly define the public API for this library.

All methods, with `public` visibility, are part of the public API. All
other methods are not part of the public API. Where possible, we'll try
to keep `protected` methods backwards-compatible in minor/patch versions,
but if you're overriding methods then please test your work before upgrading.

## Reporting Issues

Please [create an issue](http://github.com/silverstripe/silverstripe-campaign-admin/issues)
for any bugs you've found, or features you're missing.

## License

This module is released under the [BSD 3-Clause License](LICENSE)
