(function() {
    'use strict';
    /**
     * User Factory
     * Created by: Vishal Chaturvedi
     * Created On: 02-09-2016
     */

    angular
        .module('demoApp')
        .factory('FrontFactory', FrontFactory);
    /* Inject required modules to user factory method */
    FrontFactory.$inject = ['$http', '$location', '$rootScope'];
    /**
     * @name UserFactory
     * @desc Contains logic to store, retrieve, update and delete data of user settings in DB
     * @param $http
     * @param $location
     * @param $rootScope
     * @returns {{settingsObj: object}}
     * @constructor
     */
    function FrontFactory($http, $location, $rootScope)
    {
        var FrontObj = {
            
            /*
             * @name signUp
             * @desc Save User Data
             * @formData (object)
             */
            signUp: function(userData, callback) {
                return $http.post('registration', {userData: userData})
                    .success(function(response) {
                    callback(response);
                })
            },

            /*
             * @name login
             * @desc check user in db and login
             * @formData (object)
             */
            login: function(userData, callback) {
                return $http.post('login', {password: userData.password,email: userData.email})
                    .success(function(response) {
                    callback(response);
                })
            },
        }
        return FrontObj;
    }
})();