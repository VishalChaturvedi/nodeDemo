(function () {
	'use strict';
	/* Declare app level module which depends on views, and components */
	angular
	.module('demoApp', [
		'ngRoute',
		'demoApp.authentication',
        'demoApp.common'
	])
	
	.config(config)
    .run(run);

	/* Gloabl routing are here 
	config.$inject = ['$routeProvider'];
    function config($routeProvider) {
        $routeProvider
            .otherwise({ redirectTo: '/user' });
    }*/

    /* Gloabl run for current user */
	run.$inject = ['$rootScope', '$location', '$http'];
    function run($rootScope, $location, $http) {
        $rootScope.globals = {};
        $rootScope.$on('$locationChangeStart', function(event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var loggedIn = $rootScope.globals.adminUser;
            if (!loggedIn) {
                $location.path('/');
            }
        });
    }

})();