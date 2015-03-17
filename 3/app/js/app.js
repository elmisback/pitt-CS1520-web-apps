'use strict';

angular.module('notes-autosave-example', [
  'ngRoute',
  'ngSanitize',
  'notes-autosave-example.directives',
  'notes-autosave-example.controllers'
]).
service('data', ['$http', function ($http) {
  this.notes = undefined;
}]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/index',
          {templateUrl: 'partials/index.html', controller: 'IndexCtrl'})
    .when('/edit/:noteId',
          {templateUrl: 'partials/edit.html', controller: 'EditCtrl'})
    .when('/logout',
          {controller: 'LogoutCtrl'})
    .otherwise(
          {redirectTo: '/index'});
}]);
