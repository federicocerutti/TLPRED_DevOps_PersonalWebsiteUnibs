<?php
return [
    'Piwik\Plugins\CoreHome\Tracker\VisitRequestProcessor' =>
        \Piwik\DI::autowire(\Piwik\Plugins\PageHeartbeat\Internal\PageVisitProcessor::class)
            ->constructorParameter('visitStandardLength', \Piwik\DI::get('ini.Tracker.visit_standard_length'))
            ->constructorParameter('trackerAlwaysNewVisitor', \Piwik\DI::get('ini.Debug.tracker_always_new_visitor')),
];
