angular.module('MyContacts', [])

    .controller('AppCtrl', function($scope, $http) {

    	var refresh= function()  {
	        $http.get('/contacts').success(function(response){
	        console.log("Hello from controller req for contacts");
	        $scope.contactList = response;  
	       	$scope.contact="";
	        });
    	};

    	refresh();

	    $scope.addContact = function(){
	    	console.log("Post object ....");
	    	console.log($scope.contact);
	    	$http.post('/add_contact',$scope.contact).success(function(response){
	    		console.log("Post object sucess response ....");
	    		refresh();
	    	});
	    }; 

	    $scope.delContact = function(id){
	    console.log("Delete object ...." + id);
	    $http.delete('/del_contact/'+ id).success(function(response){
	    	console.log("Deletes object sucess response ....");
	    	refresh();
	    });

	    };

	   	$scope.editContact = function(id){
	    console.log("Edit object ...." + id);
	    $http.get('/get_contact/'+ id).success(function(response){
	    	$scope.contact =response;
	    	console.log("got particular object sucess response ....");
	    });

	    };

	   	$scope.updateContact = function(){
	   	var id =$scope.contact._id;
	    console.log("Update object ...." + id);
	    $http.put('/update_contact/'+ id,$scope.contact).success(function(response){
//	    	$scope.contact =response;
	    	console.log("update particular object sucess response ....");
	    	refresh();
	    });

	    };

    });