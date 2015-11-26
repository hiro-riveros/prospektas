(function(){
  this.app.config(function($stateProvider, $urlRouterProvider){
    $stateProvider

    .state('leaflet', {
      url        : '/leaflet',
      templateUrl: 'templates/leaflet.html',
      controller : 'ControlsDrawController'
    })

    .state('welcome', {
      url        : '/welcome',
      templateUrl: 'templates/welcome.html',
      controller : 'welcomeController',
      params     : {
        isRedirect: false
      }
    })
    // .state('form', {
    //   url: '/form:positions',
    //   templateUrl: 'templates/form.html',
    //   controller: 'FormController',
    //   resolve: {
    //     positions: ['$stateParams', function($stateParams) {
    //       return $stateParams.positions;
    //     }]
    //   }
    // })


    $urlRouterProvider.otherwise('/leaflet');
  })


}).call(this);
