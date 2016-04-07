/**
 * Created by Yuan on 2016/4/2.
 */
angular.module('dataModule',['ngRoute']);

angular.module('dataModule').factory('dataService',function($http){
    return {
        list:function(index){//列出所有
            return $http.get('/details/nav/'+index);
        },
        item:function(data){//增加
            //把data放在请求体里
            return $http.post('/details/nav/view',data);
        },
        delete:function(id){//增加
            return $http.delete('/todos/'+id);
        },
        chart:function(nameBox,dataBox,nameAll,dataAll,timeBox,clickBox,dtBox,dclickBox){
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

            var optiontwo = {
                tooltip: {
                    trigger: 'axis'
                },
                toolbox: {
                    feature: {
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line','bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                legend: {
                    data:['访问量']
                },
                xAxis: [
                    {
                        type: 'category',
                        data: nameAll
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '访问量',
                        min: 0,
                        max: dataAll[0],
                        interval: 500000,
                        axisLabel: {
                            formatter: '{value} 次'
                        }
                    }
                ],
                series: [
                    {
                        name:'蒸发量',
                        type:'bar',
                        data:dataAll
                    }
                ]
            };
            var myChartTwo = echarts.init(document.getElementById('mainBar'));
            myChartTwo.setOption(optiontwo);

            var optionThree = {
                title: {
                    text: '往期访问量'
                },
                tooltip: {},
                legend: {
                    data:['访问量']
                },
                xAxis: {
                    data: timeBox
                },
                yAxis: {},
                label: {
                    normal: {
                        textStyle: {
                            color: 'rgba(255, 255, 255, 0.3)'
                        }
                    }
                },
                series: [{
                    name: '访问量',
                    type: 'line',
                    data: clickBox
                }]
            };
            var myChartThree = echarts.init(document.getElementById('mainPre'));
            myChartThree.setOption(optionThree);

            var optionFour = {
                title: {
                    text: '今日访问量'
                },
                tooltip: {},
                legend: {
                    data:['访问量']
                },
                xAxis: {
                    data: dtBox
                },
                yAxis: {},
                series: [{
                    name: '访问量',
                    type: 'line',
                    data: dclickBox
                }]
            };
            var myChartFour = echarts.init(document.getElementById('mainTiming'));
            myChartFour.setOption(optionFour);

        }
    }
});

angular.module('dataModule').controller('indexCtrl',function($scope,$rootScope,dataService,$location){
    console.log('indexCtrl');
    $scope.nameBox = '';$scope.dataBox = '';$scope.show = true;$rootScope.load = true;
    $scope.name = '全站';
    $scope.change = function(name){
        loading = true;$rootScope.load = true;
        if(name!='全站'){
            $scope.show = false;
        }else{
            $scope.show = true;
        }
    }
    if($location.path().match(/^\/(.)\w/)){
        $scope.show = false;
        $scope.name = 'view';
    }else{
        $scope.show = true;
    }
    dataService.list($scope.name).success(function(data){
        $rootScope.load = false;
        $scope.nameBox = data.nameBox;
        $scope.dataBox = data.dataBox;
        $scope.total_amount = data.total_amount;
        $scope.total_delta = data.total_delta;
        $scope.timestamp = data.timestamp;
        $scope.delta_pv =  data.delta_pv;
        $scope.today_pv =  data.today_pv;
        $scope.yesterday_pv = data.yesterday_pv;
        $scope.nameAll = data.nameAll;
        $scope.dataAll = data.dataAll;
        $scope.$location = $location;
        $scope.pre = data.pre;
        $scope.timeBox = data.timeBox,$scope.clickBox = data.clickBox,$scope.dtBox = data.dtBox,$scope.dclickBox = data.dclickBox;
        dataService.chart($scope.nameBox,$scope.dataBox,$scope.nameAll,$scope.dataAll,$scope.timeBox,$scope.clickBox,$scope.dtBox,$scope.dclickBox);
    });
});

angular.module('dataModule').controller('infoCtrl',function($scope,$rootScope,$routeParams,dataService){
    console.log('infoCtrl');
    var bookId = $routeParams.bookId;
    $scope.nameBox = '';$scope.dataBox = '';$scope.loading = loading;
    dataService.item({name:bookId}).success(function(data){
        $rootScope.load = false;
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
    $routeProvider.when('/:bookId',{
        templateUrl:'tmp/info.html',
        controller:'infoCtrl'
    }).otherwise({
        redirectTo:'/'
    });
});

