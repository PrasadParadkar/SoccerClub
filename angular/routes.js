myApp.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/',{
            template : ''
        })

        .when('/league',{
            // location of the template
            templateUrl     : 'views/league-view.html',
            // Which controller it should use 
            controller      : 'MainController',
            // what is the alias of that controller.
            controllerAs    : 'mainCtrl'
        })

        .when('/all',{
            // location of the template
            templateUrl     : 'views/allMatches-view.html',
            // Which controller it should use 
            controller      : 'AllMatchController',
            // what is the alias of that controller.
            controllerAs    : 'allMatchCtrl'
        })

        .when('/english',{
            //location of the template
            templateUrl : 'views/matchday-view.html',
            // Which controller it should use 
            controller      : 'MainController',
            // what is the alias of that controller.
            controllerAs    : 'mainCtrl'
        })

        .when('/matchlist',{
            //location of the template
            templateUrl : 'views/matchList-view.html',
            // Which controller it should use 
            controller      : 'MatchController',
            // what is the alias of that controller.
            controllerAs    : 'matchCtrl'
        })

        .when('/:key1/:key2/:date',{
            //location of the template
            templateUrl : 'views/singleMatch-view.html',
            // Which controller it should use 
            controller      : 'SingleMatchController',
            // what is the alias of that controller.
            controllerAs    : 'singleMatchCtrl'
        })

        .when('/teamStats',{
            //location of the template
            templateUrl : 'views/teamStats-view.html',
            // Which controller it should use 
            controller      : 'TeamStatsController',
            // what is the alias of that controller.
            controllerAs    : 'teamStatsCtrl'
        })

        .when('/leagueStats',{
            //location of the template
            templateUrl : 'views/leagueStats-view.html',
            // Which controller it should use 
            controller      : 'TeamStatsController',
            // what is the alias of that controller.
            controllerAs    : 'teamStatsCtrl'
        })

        .otherwise(
            {
                //redirectTo:'/'
                template   : '<h1>404 page not found</h1>'
            }
        );
}]);