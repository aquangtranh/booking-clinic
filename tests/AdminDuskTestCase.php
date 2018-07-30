<?php

namespace Tests;

use Laravel\Dusk\TestCase as BaseTestCase;
use Facebook\WebDriver\Chrome\ChromeOptions;
use Facebook\WebDriver\Remote\RemoteWebDriver;
use Facebook\WebDriver\Remote\DesiredCapabilities;

abstract class AdminDuskTestCase extends DuskTestCase
{
    protected $admin;
    public function setUp()
    {
        parent::setUp();
        if(\App\Admin::count()) {
            $this->admin = \App\Admin::first();
        } else {
            $this->admin = factory(\App\Admin::class)->create();
        }
    }
}
