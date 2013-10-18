Ember.SimpleAuth = {};
Ember.SimpleAuth.setup = function(container, application, options) {
  options = options || {};
  this.routeAfterLogin    = options.routeAfterLogin || 'index';
  this.routeAfterLogout   = options.routeAfterLogout || 'index';
  this.loginRoute         = options.loginRoute || 'login';
  this.logoutRoute        = options.logoutRoute || 'logout';
  this.serverSessionRoute = options.serverSessionRoute || '/session';

  var session = Ember.SimpleAuth.Session.create();
  application.register('simple_auth:session', session, { instantiate: false, singleton: true });
  Ember.$.each(['model', 'controller', 'view', 'route'], function(i, component) {
    application.inject(component, 'session', 'simple_auth:session');
  });

  Ember.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
    if (!jqXHR.crossDomain && !Ember.isEmpty(session.get('authToken'))) {
      jqXHR.setRequestHeader('Authorization', 'Token token="' + session.get('authToken') + '"');
    }
  });

  this.externalLoginSucceededCallback = function(sessionData) {
    session.setup(sessionData);
    container.lookup('route:application').send('loginSucceeded');
  };
};
