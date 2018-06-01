angular.module('userControllers',['userServices'])

.controller('regCtrl',function($http,$location,$timeout,User){
	var app = this;
	this.regUser = function(regData){
		app.errorMsg = false;
		//console.log('Form submitted');
		User.create(app.regData).then(function(data){
			
			console.log(data.data.message);
             
			if(data.data.success){
				app.successMsg = data.data.message;
				//console.log('Fttttttt');
				$timeout(function() {
					$location.path('/login');
				}, 2000);
				
			}else{
				app.errorMsg = data.data.message;
				//console.log('errrrr');
			}
		});
		
	};

});
