angular.module('infoModule',['ngRoute']);

angular.module('infoModule').factory('infoService',function($http){
    return {
        list:function(index){//列出所有
            return $http.get('/users/list/');
        }
    }
});

angular.module('infoModule').controller('infoCtrl',function($scope,$rootScope,infoService){
    console.log('infoCtrl');
    infoService.list($scope.name).success(function(data){

    });
});