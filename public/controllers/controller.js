var app = angular.module('MyContacts',['ui.bootstrap']);



app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);


app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
        })
        .error(function(){
        });
    }
}]);



	app.controller('AppCtrl', ['$scope','$http','fileUpload', function($scope, $http, fileUpload){
    
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

	    $scope.uploadFile = function(){
	        var file = $scope.myFile;
	        console.log('file is sending for upload...' );
	        var uploadUrl = "/upload";
	        fileUpload.uploadFileToUrl(file, uploadUrl);
	        console.log("Post object sucess response ....");
	    	refresh();
			location.reload();
	    };
    
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

    }])
    .filter('startFrom',function(){
	  	return function(data, start){
	    return data.slice(start);
	  }
	});    

