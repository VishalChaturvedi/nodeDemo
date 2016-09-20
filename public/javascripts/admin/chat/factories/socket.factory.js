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
     * @name SocketFactory
     * @desc Contains logic to send and recive data through socket
     * @param $http
     * @param $location
     * @param $rootScope
     * @returns {{settingsObj: object}}
     * @constructor
     */
    function SocketFactory($http, $location, $rootScope)
    {
        var socket = io.connect("https://sysdemoapp.herokuapp.com:5000");
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