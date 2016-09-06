(function() {
    'use strict';
    /**
     * User Factory
     * Created by: Vishal Chaturvedi
     * Created On: 02-09-2016
     */

    angular
        .module('adminApp')
        .factory('UserFactory', UserFactory);
    /* Inject required modules to user factory method */
    UserFactory.$inject = ['$http', '$location', '$rootScope'];
    /**
     * @name UserFactory
     * @desc Contains logic to store, retrieve, update and delete data of user settings in DB
     * @param $http
     * @param $location
     * @param $rootScope
     * @returns {{settingsObj: object}}
     * @constructor
     */
    function UserFactory($http, $location, $rootScope)
    {
        var UserObj = {
            
            /**
             * [GetAllUsers]
             *
             */
            GetAllUsers: function(callback) {
                return $http.post(window.path + 'admin/userList', {})
                    .success(function(response) {
                    callback(response);
                })
            },


            /*
             * @name GetUserData
             * @desc Get User Data
             * @formData (int)
             */
            GetUserData: function(userID,callback) {
                return $http.post(window.path + 'admin/userDetails', {id: userID})
                    .success(function(response) {
                    callback(response);
                })
            },

            /*
             * @name GetUserData
             * @desc Get User Data
             * @formData (int)
             */
            GetUserProfileData: function(callback) {
                return $http.post(window.path + 'admin/userDetails', {})
                    .success(function(response) {
                    callback(response);
                })
            },

            /*
             * @name updateUserProfile
             * @desc Update User Profile
             * @formData (object)
             */
            updateUserProfile: function(userData, callback) {
                return $http.post(window.path + 'admin/updateUserProfile', {userData: userData})
                    .success(function(response) {
                    callback(response);
                })
            },

            /*
             * @name SaveUserData
             * @desc Save User Data
             * @formData (object)
             */
            SaveUserData: function(userData, callback) {
                return $http.post(window.path + 'admin/updateUserDetails', {userData: userData})
                    .success(function(response) {
                    callback(response);
                })
            },


            /*
             * @name DeleteUserData
             * @desc Delete User Data
             * @formData (int)
             */
            DeleteUserData: function(userID, callback) {
                console.log(userID);
                return $http.post(window.path + 'admin/userDelete', {userID: userID})
                    .success(function(response) {
                    callback(response);
                })
            },
        }
        return UserObj;
    }
})();