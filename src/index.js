'use strict';

let _ = require('lodash');
let KindaObject = require('kinda-object');
let KindaEventManager = require('kinda-event-manager');
let KindaUtil = require('kinda-util');
let KindaLog = require('kinda-log');
let KindaNotifier = require('kinda-notifier');
let KindaLocalizer = require('kinda-localizer');

let KindaApp = KindaObject.extend('KindaApp', function() {
  this.include(KindaEventManager);

  this.creator = function(options = {}) {
    _.assign(this, _.pick(options, [
      'name', 'displayName', 'projectName', 'version'
    ]));

    this.util = KindaUtil.create();

    this.environment = this.util.getEnvironment();

    let log = options.log || {};
    if (!KindaLog.isClassOf(log)) {
      if (!log.appName) log.appName = this.name;
      log = KindaLog.create(log);
    }
    this.log = log;

    let notifier = options.notifier || {};
    if (!KindaNotifier.isClassOf(notifier)) {
      if (!notifier.appName) notifier.appName = this.name;
      notifier = KindaNotifier.create(notifier);
    }
    this.notifier = notifier;

    let localizer = options.localizer;
    if (!KindaLocalizer.isClassOf(localizer)) {
      localizer = KindaLocalizer.create(localizer);
    }
    this.localizer = localizer;
  };

  Object.defineProperty(this, 'locale', {
    get() {
      if (!this._locale) this._locale = this.localizer.getLocale();
      return this._locale;
    },
    set(locale) {
      if (_.isString(locale)) locale = this.localizer.getLocale(locale);
      if (this._locale !== locale) {
        this._locale = locale;
        this.emit('locale.didChange', locale);
      }
    }
  });
});

module.exports = KindaApp;
