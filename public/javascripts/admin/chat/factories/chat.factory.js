(function() {
    'use strict';
    /**
     * Chat Factory
     * Created by: Vishal Chaturvedi
     * Created On: 16-09-2016
     */

    angular
        .module('adminApp')
        .factory('ChatFactory', ChatFactory);
    /* Inject required modules to user factory method */
    ChatFactory.$inject = ['$http', '$location', '$rootScope'];
    /**
     * @name ChatFactory
     * @desc Contains logic to store, retrieve, update and delete data of chat in DB
     * @param $http
     * @param $location
     * @param $rootScope
     * @returns {{settingsObj: object}}
     * @constructor
     */
    function ChatFactory($http, $location, $rootScope)
    {
        var ChatObj = {
            
            /**
             * [GetAllUsers]
             *
             */
            GetChatMessages: function(callback) {
                return $http.post(window.path + 'chat/chatList', {})
                    .success(function(response) {
                    callback(response);
                })
            },

            /*
             * @name SaveUserData
             * @desc Save User Data
             * @formData (object)
             */
            SaveChatMessages: function(userData, callback) {
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
            DeleteChatMessages: function(userID, callback) {
                return $http.post(window.path + 'admin/userDelete', {userID: userID})
                    .success(function(response) {
                    callback(response);
                })
            },
        }
        return ChatObj;
    }
})();