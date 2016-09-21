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
        'toaster',
        'ngCookies'
	])
	.config(config)
    .controller('ChatController', ChatController)
    .controller('MessagesController', MessagesController);

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
        .otherwise({ redirectTo: '/chat' });
    }


    /* Inject required stuff as parameters to user controller function */
    ChatController.$inject = ['$scope', '$location', '$http', 'SocketFactory', 'UserFactory','toaster','$cookies'];
    /**
     * Chat Controller
     * Created by: Vishal Chaturvedi
     * Created On: 08-09-2016
     */
    function ChatController($scope, $location, $http, SocketFactory,UserFactory,toaster,$cookies) {

        $scope.newUsers = [];
        $scope.currentUser = [];
        
        /*$scope.join = function() {
            SocketFactory.emit('add-customer', $scope.currentCustomer);
        };
        $scope.join();*/

        function getOnlineUser(){

             UserFactory.GetAllUsers(function (response) {
                if (response.status){ 
                   var UserInfo = $cookies.getObject('demoApp'); 
                   $scope.newUsers = [];
                   angular.forEach(response.data, function(value, key) {
                        console.log(value);
                        if(value._id != UserInfo.id){
                            $scope.newUsers.push(value);
                        }
                    });
                    //$scope.newUsers = response.data;

                }else{
                    //$location.path('/user/login');
                }
            });
        }
        getOnlineUser();

        

        SocketFactory.on('notification', function(data) {
            $scope.$apply(function () {
                $scope.currentUser.push(data);
                if(data.message == "Join user")    
                    toaster.pop('success', data.message, data.name);
                else
                    toaster.pop('error', data.message, data.name);
                getOnlineUser();
            });
        });
    }    

    /* Inject required stuff as parameters to user login controller function */
    MessagesController.$inject = ['$scope', '$location', '$http', 'SocketFactory','toaster','$cookies','ChatFactory','$timeout'];
    /**
     * User Login Controller
     * Created by: Vishal Chaturvedi
     * Created On: 08-09-2016
     */
    function MessagesController($scope, $location,$http,SocketFactory,toaster,$cookies,ChatFactory,$timeout) {
        $scope.newMessage = [];
        $scope.send_message = send_message;
        $scope.typing = typing;
        var vm = this;
        vm.send_message = send_message;
        vm.typing = typing;
        var UserInfo = $cookies.get('demoApp');
        UserInfo = JSON.parse(UserInfo);
        
        /* Get Old messages */
        function getChatMessages(){
            ChatFactory.GetChatMessages(function (response) {
                if (response.status){ 
                    var UserInfo = $cookies.getObject('demoApp');
                    angular.forEach(response.data, function(value, key) {
                        if(value.senderName != UserInfo.name){
                            $scope.newMessage.push(value);
                        }else{
                            value['self'] = true;
                            $scope.newMessage.push(value);
                        }
                    });
                    //$scope.newMessage = response.data;
                }else{
                    //$location.path('/user/login');
                }
            });
        }
        getChatMessages();

        function typing(){
            var UserInfo = $cookies.get('demoApp');
            SocketFactory.emit('typing',UserInfo);
        }

        /* Send Messages */
        function send_message(){
            if(vm.chat.message !=''){
                var data = {
                    senderId:UserInfo.id,
                    message:vm.chat.message,
                    senderName:UserInfo.name
                }
                //clear the add record form
                vm.chat.message = '';
                SocketFactory.emit('send-message',data);
            }
        }

        /* Recived Messages */
        SocketFactory.on('received-message', function(data) {
            $scope.$apply(function () {
                var UserInfo = $cookies.getObject('demoApp');
                if(data.senderName != UserInfo.name){
                    $scope.newMessage.push(data);
                }else{
                    data['self'] = true;
                    $scope.newMessage.push(data);
                }
            });
        });

        SocketFactory.on('typing', function(data) {
            $scope.$apply(function () {
                var UserInfo = $cookies.getObject('demoApp');
                data = JSON.parse(data);
                if(data.name != UserInfo.name){
                    $scope.typingNotification = data.name+" is typeing";
                    $timeout(function(){
                        $scope.typingNotification= '';    
                    }, 3000);
                }
            });
        });
    }
})();