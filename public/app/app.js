'use strict';
angular.module('lmisDashboardApp',['ngRoute', 'ngResource', 'ngTable']);

angular.module('lmisDashboardApp').config(function($routeProvider) {
    $routeProvider
        .when('/',{
            templateUrl:'public/app/partials/main.html',
            controller:'main'
        });

});