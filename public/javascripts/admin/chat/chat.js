/**
 * Created by Vishal Chaturvedi on 08-09-2016.
 */
(function () {

	'use strict';
    /**
     * Initialize angular chat module
     * Created by: Vishal Chaturvedi
     * Created On: 08-09-2016
     */
	angular
	.module('adminApp.chat', [
    	'ngRoute',
        'toaster'
	])
	.config(config)
    .controller('ChatController', ChatController)
    .controller('ChatListController', ChatListController);

    /**
     * Configuration
     * Created by: Vishal Chaturvedi
     * Created On: 08-09-2016
     */
    config.$inject = ['$routeProvider'];
    function config($routeProvider) {
        $routeProvider
        .when('/chat', {
            templateUrl: window.path+'javascripts/admin/chat/pages/chat.html'
        })
        .otherwise({ redirectTo: '/profile' });
    }


    /* Inject required stuff as parameters to user controller function */
    ChatController.$inject = ['$scope', '$location', '$http', 'SocketFactory', 'UserFactory','toaster'];
    /**
     * Chat Controller
     * Created by: Vishal Chaturvedi
     * Created On: 08-09-2016
     */
    function ChatController($scope, $location, $http, SocketFactory,UserFactory,toaster) {

        $scope.newCustomers = [];
        $scope.currentCustomer = [];
        $scope.typing = typing;
        /*$scope.join = function() {
            SocketFactory.emit('add-customer', $scope.currentCustomer);
        };
        $scope.join();*/

        function getOnlineUser(){
             UserFactory.GetAllUsers(function (response) {
                if (response.status){ 
                    $scope.newCustomers = response.data;
                }else{
                    //$location.path('/user/login');
                }
            });
        }
        getOnlineUser();


        SocketFactory.on('notification', function(data) {
            $scope.$apply(function () {
                $scope.currentCustomer.push(data);
                toaster.pop('success', "New User", data);
            });
        });

        function typing(){
            
            SocketFactory.emit('typing', function(currentCustomer) {
               
            });
        }

        SocketFactory.on('typing', function(data) {
            console.log(currentCustomer);
            $scope.$apply(function () {
                
            });
        });
    }


    /* Inject required stuff as parameters to user login controller function */
    ChatListController.$inject = ['$scope', '$location', '$http', 'SocketFactory','toaster'];
    /**
     * User Login Controller
     * Created by: Vishal Chaturvedi
     * Created On: 08-09-2016
     */
    function ChatListController($scope, $location, $http, SocketFactory, toaster) {
        var vm = this;
        vm.user_details = user_details;
        vm.update_profile = update_profile;
        function user_details() {
            // get user's details
            UserFactory.GetUserProfileData(function (response) {
                if (response.status){ 

                    vm.users = response.data;
                }else{
                    $location.path('/user/login');
                }
            });
        }
        user_details();

        /**
         * User update_profile Controller
         * Created by: Vishal Chaturvedi
         * Created On: 08-09-2016
        */

        function update_profile(){
            UserFactory.updateUserProfile(vm.users, function (response) {
                if (response.status == 'true') {
                    //var user = response.data[0];
                    //UserFactory.SetCredentials(user.id,user.username,user.email,user.name);
                    toaster.pop('success', "Profile", "Your profile successfully updated");
                    //$location.path('/user');
                } else{
                    toaster.pop('error', "Profile", response.message);
                    user_details();
                }
            });
        }
    }

})();