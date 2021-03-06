/**
 * Created by Vishal Chaturvedi on 02-09-2016.
 */
(function () {

	'use strict';
    /**
     * Initialize angular user app
     * Created by: Vishal Chaturvedi
     * Created On: 02-09-2016
     */
	angular
	.module('demoApp.authentication', [
    	'ngRoute',
        'toaster',
        'ngCookies'
	])
	.config(config)
    .controller('loginController', loginController)
    .controller('signUpController', signUpController);

    /**
     * Configuration
     * Created by: Vishal Chaturvedi
     * Created On: 02-09-2016
     */
    config.$inject = ['$routeProvider'];
    function config($routeProvider) {
        $routeProvider
        .when('/login', {
            templateUrl: 'javascripts/front/authentication/pages/login.html'
        }).when('/registration', {
            templateUrl: 'javascripts/front/authentication/pages/signup.html'
        }).when('/registration', {
            templateUrl: 'javascripts/front/authentication/pages/signup.html'
        })
        .otherwise({ redirectTo: '/' });

        
    }


    /* Inject required stuff as parameters to user controller function */
    loginController.$inject = ['$scope', '$location', '$http', 'FrontFactory','toaster','$window','$cookies'];
    /**
     * login Controller
     * Created by: Vishal Chaturvedi
     * Created On: 06-09-2016
     */
    function loginController($scope, $location, $http, FrontFactory,toaster,$window,$cookies) {
        var vm = this;
        vm.login = login;
        
        /* Function for login  */
        function login() {
            // get all users
            FrontFactory.login(vm.user,function (response) {
                if (response.status == "true"){ 
                    $cookies.put('demoApp', '');
                    toaster.pop('success', "Login", "You have successfully logged in");
                    // Setting a cookie
                    $cookies.putObject('demoApp', response.data);
                    $window.location.href = window.path+'admin';
                }else{
                    toaster.pop('error', "Registration", response.message);
                }
            });
        }
    }


    /* Inject required stuff as parameters to sign up controller function */
    signUpController.$inject = ['$scope', '$location', '$http', 'FrontFactory','toaster'];
    /**
     * User sign up Controller
     * Created by: Vishal Chaturvedi
     * Created On: 06-09-2016
     */
    function signUpController($scope, $location, $http, FrontFactory, toaster) {
        var vm = this;
        vm.signUp = signUp;
        /**
         * User signUp Controller
         * Created by: Vishal Chaturvedi
         * Created On: 06-09-2016
        */

        function signUp(){
            FrontFactory.signUp(vm.user, function (response) {
                if (response.status == 'true') {
                    //clear the add record form
                    $scope.registration.$setPristine();
                    $scope.registration.$setUntouched();
                    toaster.pop('success', "Registration", "You have successfully registered");
                    $location.path('/login');
                } else{
                    toaster.pop('error', "Registration", response.message);
                }
            });
        }
    }

})();