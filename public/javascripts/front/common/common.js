/**
 * Created by Vishal Chaturvedi on 05-09-2016.
 */
(function () {

	'use strict';
    /**
     * Initialize angular demo's common app
     * Created by: Vishal Chaturvedi
     * Created On: 05-09-2016
     */
	angular
	.module('demoApp.common', [
    	'ngRoute',
        'toaster'
	])
	.config(config)
    .controller('contactUsController', contactUsController);

    /**
     * Configuration
     * Created by: Vishal Chaturvedi
     * Created On: 05-09-2016
     */
    config.$inject = ['$routeProvider'];
    function config($routeProvider) {
        $routeProvider
        .when('/contact-us', {
            templateUrl: 'javascripts/front/common/pages/contact_us.html'
        }).when('/', {
            templateUrl: 'javascripts/front/common/pages/home.html'
        })
        .otherwise({ redirectTo: '/' });

        
    }


    /* Inject required stuff as parameters to user controller function */
    contactUsController.$inject = ['$scope', '$location', '$http', 'CommonFactory','toaster'];
    /**
     * User Controller
     * Created by: Vishal Chaturvedi
     * Created On: 02-09-2016
     */
    function contactUsController($scope, $location, $http, CommonFactory,toaster) {
        var vm = this;
        vm.save = save;
        /* Function for add or save user  */
        function save() {
            $scope.dataLoading = true;
            CommonFactory.SaveCommonContactData(vm.contact, function (response) {
                if (response.status) {
                    //clear the add record form
                    $scope.contact.$setPristine();
                    $scope.contact.$setUntouched();
                    vm.contact = {};
                    toaster.pop('success', "Contact Us", "Your request successfully submitted");
                } else{
                    toaster.pop('error', "Contact Us", "There are some error. Please Try again");
                }    
            });
        }
    }
})();