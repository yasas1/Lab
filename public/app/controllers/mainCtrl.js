angular.module('mainControllers',['authServices'])

.controller('mainCtrl',function(Auth,$timeout,$location,$rootScope){

	var app = this;

	app.loadme = false;

	$rootScope.$on('$routeChangeStart',function(){

		if(Auth.isLoggedIn()){

			app.isLoggedIn = true;
			console.log('success: User is logged in');
			Auth.getUser().then(function(data){

				app.username = data.data.username;
				app.useremail = data.data.email;
				app.loadme = true;
			});
		}else{
			console.log('Failure: User is not Logged in');
			app.isLoggedIn = false;
			app.username = '';
			app.loadme = true;
		}

	});

	this.doLogin = function(loginData){
		app.errorMsg = false;
		
		Auth.login(app.loginData).then(function(data){
			
			console.log(data.data.message);
             
			if(data.data.success){
				app.successMsg = data.data.message;
				//console.log('Fttttttt');
				$timeout(function() {
					$location.path('/');
					app.loginData=null;
					app.successMsg = false;
				}, 1000);
				
			}else{
				app.errorMsg = data.data.message;
				//console.log('errrrr');
			}
		});
		
	};

	this.logout = function(){
		Auth.logout();

		$location.path('/logout');
		$timeout(function(){
			$location.path('/');
		}, 1000);
	};

});
