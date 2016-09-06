(function() {
    'use strict';
    /**
     * Common Factory
     * Created by: Vishal Chaturvedi
     * Created On: 06-09-2016
     */

    angular
        .module('demoApp')
        .factory('CommonFactory', CommonFactory);
    /* Inject required modules to common factory method */
    CommonFactory.$inject = ['$http', '$location', '$rootScope'];
    /**
     * @name CommonFactory
     * @desc Contains logic to store, retrieve, update and delete data of common form settings in DB
     * @param $http
     * @param $location
     * @param $rootScope
     * @returns {{settingsObj: object}}
     * @constructor
     */
    function CommonFactory($http, $location, $rootScope)
    {
        var CommonObj = {
            /*
             * @name SaveCommonContactData
             * @desc Save User Data
             * @formData (object)
             */
            SaveCommonContactData: function(contactData, callback) {
                return $http.post('contact', {contactData: contactData})
                    .success(function(response) {
                    callback(response);
                })
            },
        }
        return CommonObj;
    }
})();