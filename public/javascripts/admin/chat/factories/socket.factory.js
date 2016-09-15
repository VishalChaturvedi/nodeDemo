(function() {
    'use strict';
    /**
     * User Factory
     * Created by: Vishal Chaturvedi
     * Created On: 08-09-2016
     */

    angular
        .module('adminApp')
        .factory('SocketFactory', SocketFactory);
    /* Inject required modules to user factory method */
    SocketFactory.$inject = ['$http', '$location', '$rootScope'];
    /**
     * @name UserFactory
     * @desc Contains logic to store, retrieve, update and delete data of user settings in DB
     * @param $http
     * @param $location
     * @param $rootScope
     * @returns {{settingsObj: object}}
     * @constructor
     */
    function SocketFactory($http, $location, $rootScope)
    {
        var socket = io.connect("http://localhost:8080");
        return {
            on: function(eventName, callback){
                socket.on(eventName, callback);
            },
            emit: function(eventName, data) {
                socket.emit(eventName, data);
            }

            
        };
    }
})();