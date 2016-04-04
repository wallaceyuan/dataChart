/**
 * Created by Yuan on 2016/4/2.
 */

angular.module('dataModule',['ngRoute']);

angular.module('dataModule').factory('dataService',function($http){
    return {
        list:function(){//列出所有
            return $http.get('/details/nav');
        },
        item:function(data){//增加
            //把data放在请求体里
            return $http.post('/details/nav',data);
        },
        delete:function(id){//增加
            return $http.delete('/todos/'+id);
        },
        chart:function(nameBox,dataBox){
            var nameBox = nameBox;
            var dataBox = dataBox;
            var myChart = echarts.init(document.getElementById('main'));
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data:nameBox
                },
                series: [
                    {
                        name:'访问来源',
                        type:'pie',
                        selectedMode: 'single',
                        radius: [0, '30%'],
                        label: {
                            normal: {
                                position: 'inner'
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:dataBox
                    },
                    {
                        name:'访问来源',
                        type:'pie',
                        radius: ['40%', '55%'],
                        data:dataBox
                    }
                ]
            };
            myChart.setOption(option);
        }
    }
});

angular.module('dataModule').controller('indexCtrl',function($scope,dataService){
    console.log(1111);
    $scope.nameBox = '';$scope.dataBox = '';
    dataService.list().success(function(data){
        $scope.nameBox = data.nameBox;
        $scope.dataBox = data.dataBox;
        $scope.total_amount = data.total_amount;
        $scope.total_delta = data.total_delta;
        $scope.total_delta = data.total_delta;
        $scope.timestamp = data.timestamp;
        $scope.delta_pv =  data.delta_pv;
        $scope.today_pv =  data.today_pv;
        $scope.yesterday_pv = data.yesterday_pv;
        dataService.chart($scope.nameBox,$scope.dataBox);
    });
});
angular.module('dataModule').controller('infoCtrl',function($scope,$routeParams,dataService){
    //从路由中得到ID
    var bookId = $routeParams.bookId;
    console.log(bookId);
    $scope.nameBox = '';$scope.dataBox = '';
    dataService.item({name:bookId}).success(function(data){
        $scope.info_amount = data.total_amount;
        $scope.info_delta = data.total_delta;
        $scope.info_delta = data.total_delta;
        $scope.info_timestamp = data.timestamp;
        $scope.info_delta_pv =  data.delta_pv;
        $scope.info_today_pv =  data.today_pv;
        $scope.info_yesterday_pv = data.yesterday_pv;
    });
});
angular.module('dataModule').config(function($routeProvider){
    //进行路由的配置
    $routeProvider.when('/main',{
        templateUrl:'tmp/main.html',
        controller:'indexCtrl'
    }).when('/:bookId',{
        templateUrl:'tmp/info.html',
        controller:'infoCtrl'
    }).otherwise({
        redirectTo:'/main'
    });
});

