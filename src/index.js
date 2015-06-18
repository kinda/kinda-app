'use strict';

let _ = require('lodash');
let KindaObject = require('kinda-object');
let KindaEventManager = require('kinda-event-manager');
let KindaLog = require('kinda-log');
let KindaLocalizer = require('kinda-localizer');

let KindaApplication = KindaObject.extend('KindaApplication', function() {
  this.include(KindaEventManager);

  this.creator = function(options = {}) {
    _.assign(this, _.pick(options, [
      'name', 'displayName', 'version'
    ]));

    let log = options.log || {};
    if (!KindaLog.isClassOf(log)) {
      if (!log.applicationName) log.applicationName = this.name;
      log = KindaLog.create(log);
    }
    this.log = log;

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

module.exports = KindaApplication;
