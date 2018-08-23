<?php

namespace SilverStripe\CMS\Controllers;

use SilverStripe\CMS\Model\SiteTree;
use SilverStripe\ORM\SS_List;
use SilverStripe\Versioned\Versioned;

/**
 * This filter will display the SiteTree as a site visitor might see the site, i.e only the
 * pages that is currently published.
 *
 * Note that this does not check canView permissions that might hide pages from certain visitors
 */
class CMSSiteTreeFilter_PublishedPages extends CMSSiteTreeFilter
{

    /**
     * @return string
     */
    public static function title()
    {
        return _t('SilverStripe\\CMS\\Controllers\\CMSSIteTreeFilter_PublishedPages.Title', "Published pages");
    }

    /**
     * @var string
     */
    protected $childrenMethod = "AllHistoricalChildren";

    /**
     * @var string
     */
    protected $numChildrenMethod = 'numHistoricalChildren';

    /**
     * Filters out all pages who's status who's status that doesn't exist on live
     *
     * @see {@link SiteTree::getStatusFlags()}
     * @return SS_List
     */
    public function getFilteredPages()
    {
        $pages = Versioned::get_including_deleted(SiteTree::class);
        $pages = $this->applyDefaultFilters($pages);
        $pages = $pages->filterByCallback(function (SiteTree $page) {
            return $page->isPublished();
        });
        return $pages;
    }
}
