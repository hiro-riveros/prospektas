(function(){
  this.app.config(function($stateProvider, $urlRouterProvider){
    $stateProvider

    .state('welcome', {
      url        : '/welcome',
      templateUrl: 'templates/welcome.html',
      controller : 'welcomeCtrl',
      params     : {
        isRedirect: false
      }
    })
    .state('form', {
      url: '/form',
      templateUrl: 'templates/form.html',
      controller: 'FormController'
    })


    $urlRouterProvider.otherwise('/welcome');
  })


}).call(this);
