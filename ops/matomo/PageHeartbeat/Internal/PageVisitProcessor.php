<?php
namespace Piwik\Plugins\PageHeartbeat\Internal;

use Piwik\Container\StaticContainer;
use Piwik\Plugins\CoreHome\Tracker\VisitRequestProcessor;
use Piwik\Plugins\PrivacyManager\Config;
use Piwik\Tracker\Request;
use Piwik\Tracker\Visit\VisitProperties;
use Piwik\Tracker\VisitorRecognizer;

class PageVisitProcessor extends VisitRequestProcessor
{
    public function processRequestParams(VisitProperties $properties, Request $request)
    {
        // Preserve exclusions, native IP handling and a fresh random config ID.
        $abort = parent::processRequestParams($properties, $request);
        if ($abort) {
            return $abort;
        }

        $privacy = new Config($request->getIdSiteIfExists());
        $cid = $request->getForcedVisitorId();
        if (!$privacy->randomizeConfigId || !$privacy->forceCookielessTracking
            || $request->getIdSite() !== 1
            || !is_string($cid) || !preg_match('/^[a-f0-9]{16}$/D', $cid)) {
            return false;
        }

        // A pageview is always a fresh visit. Only heartbeats can reuse its ID.
        $properties->setProperty('idvisitor', hex2bin($cid));
        if ($request->getParam('ping') !== 1) {
            return false;
        }

        $recognizer = StaticContainer::get(VisitorRecognizer::class);
        $known = $recognizer->findKnownVisitor(
            $request->getMetadata('CoreHome', 'visitorId'),
            $properties,
            $request
        );
        $request->setMetadata('CoreHome', 'isVisitorKnown', $known);
        $last = $recognizer->getLastKnownVisit();
        $isNew = $this->isVisitNew($properties, $request, $last);
        $request->setMetadata('CoreHome', 'isNewVisit', $isNew);
        $request->setMetadata('CoreHome', 'lastKnownVisit', $last);
        if (!$isNew) {
            $recognizer->updateVisitPropertiesFromLastVisitRow($properties);
        }

        // Unknown/expired pings are rejected by the native Heartbeat processor.
        return false;
    }
}
