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
	.module('adminApp.user', [
    	'ngRoute',
        'toaster'
	])
	.config(config)
    .controller('UserController', UserController)
    .controller('UserProfileController', UserProfileController);

    /**
     * Configuration
     * Created by: Vishal Chaturvedi
     * Created On: 02-09-2016
     */
    config.$inject = ['$routeProvider'];
    function config($routeProvider) {
        $routeProvider
        .when('/profile', {
            templateUrl: window.path+'javascripts/admin/user/pages/profile.html'
        }).when('/user', {
            templateUrl: window.path+'javascripts/admin/user/pages/userlist.html'
        })
        .otherwise({ redirectTo: '/profile' });
    }


    /* Inject required stuff as parameters to user controller function */
    UserController.$inject = ['$scope', '$location', '$http', 'UserFactory','toaster'];
    /**
     * User Controller
     * Created by: Vishal Chaturvedi
     * Created On: 02-09-2016
     */
    function UserController($scope, $location, $http, UserFactory,toaster) {
        var vm = this;
        vm.user_list = user_list;
        vm.edit = edit;
        vm.save = save;
        vm.delete1 = delete1;

        $scope.sortType     = 'name'; // set the default sort type
        $scope.sortReverse  = false;  // set the default sort order


        /* Function for users listing  */
        function user_list() {
            // get all users
            UserFactory.GetAllUsers(function (response) {
                if (response.status){ 
                    vm.users = response.data;

                }else{
                    //$location.path('/user/login');
                }
            });
        }
        user_list();


        /* Function for user edit  */
        function edit(userID) {
            UserFactory.GetUserData(userID, function (response) {
                if (response.status) {
                    
                    vm.userData = response.data;
                } else
                    $location.path('/user/login');
            });
        }

        /* Function for add or save user  */
        function save() {
            UserFactory.SaveUserData(vm.userData, function (response) {
                if (response.status) {
                    //clear the add record form
                    toaster.pop('success', "User info", "Selected user info successfully updated");
                    vm.userData = {};
                    user_list();
                } else
                    $location.path('/user/login');
            });
        }


        /* Function for user delete  */
        function delete1(userID) {
            var isCofirm = confirm('Are you sure you want to detete this user?');
            if (isCofirm) {
                UserFactory.DeleteUserData(userID, function (response) {
                    if (response.status) {
                        toaster.pop('success', "User detete", "Selected user deleted");
                        user_list();
                    } else
                        $location.path('/user/login');
                });
            }
        }
    }


    /* Inject required stuff as parameters to user login controller function */
    UserProfileController.$inject = ['$scope', '$location', '$http', 'UserFactory','toaster'];
    /**
     * User Login Controller
     * Created by: Vishal Chaturvedi
     * Created On: 02-09-2016
     */
    function UserProfileController($scope, $location, $http, UserFactory, toaster) {
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
         * Created On: 02-09-2016
        */

        function update_profile(){
            console.log("submit profile");
            console.log(vm.users);
            UserFactory.updateUserProfile(vm.users, function (response) {
                if (response.status) {
                    var user = response.data[0];
                     toaster.pop('success', "Profile", "Your profile successfully updated");
                    UserFactory.SetCredentials(user.id,user.username,user.email,user.name);
                    $location.path('/user');
                } else{
                    $location.path('/user/login');
                }
            });
        }
    }

})();