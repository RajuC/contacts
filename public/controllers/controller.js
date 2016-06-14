var app = angular.module('MyContacts',['ui.bootstrap']);

    app.controller('AppCtrl', function($scope, $http) {

		$scope.contactList = [];
		$scope.pageSize = 5;
		$scope.currentPage = 1;


		$scope.sort = function(keyname){
		    $scope.sortKey = keyname;   //set the sortKey to the param passed
		    $scope.reverse = !$scope.reverse; //if true make it false and vice versa
		}
 
    	var refresh= function()  {
	        $http.get('/contacts').success(function(response){
	        console.log("Hello from controller req for contacts");
	        $scope.contactList = response;  
	       	$scope.contact=null;
	        });
    	};

    	refresh();

	    $scope.addContact = function(){
	    	console.log("Post object ....");
	    	console.log($scope.contact);
	    	$http.post('/add_contact',$scope.contact).success(function(response){
	    		console.log("Post object sucess response ....");
	    		refresh();
				location.reload();
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


	    $scope.clearContact = function(){
	    	$scope.contact="";
	    };

    })
    .filter('startFrom',function(){
	  	return function(data, start){
	    return data.slice(start);
	  }
	});    