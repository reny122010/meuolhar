var appMeuolhar = angular.module("appMeuolhar", []);

appMeuolhar.controller("meuolharCtrl", ['$scope', '$http', '$sce',function($scope, $http, $sce) {
	var headers = { Authorization: "Bearer _dev"};
	var local = {
		address : "http://150.165.205.120:3000",
		refereceRoute : "/api/v1/reference/"
	};

	var limitDefault = 8, pageDefault = 0;


	$scope.dropdown = { atual:"DA SEMANA", date:"thisWeek" };

	$scope.setFilter = function(__idFilter){
		switch (__idFilter){
			case 0:
				$scope.dropdown["atual"] = "DO MÊS";
				$scope.dropdown["date"] = "thisMonth";
				recentFilter();
				break;
			case 1:
				$scope.dropdown["atual"] = "DO DIA";
				$scope.dropdown["date"] = "today";
				recentFilter();
				break;
			default:
				$scope.dropdown["atual"] = "DA SEMANA";
				$scope.dropdown["date"] = "thisWeek";
				recentFilter();
		}
	}
	
    var getReference = function(filter, list){
    	var url = local.address+local.refereceRoute;
    	var params = { };
    
	    params["verified"] = true;
	    params["accepted"] = true;

    	params["limit"] = filter.limit;
    	params["mediaType"] = filter.mediaType;
    	params["date"] = filter.date;
    	params["page"] = filter.page;
    	params["order"] = filter.order;

    	$http.get(url, { headers: headers, params}).success(function(response){
	        console.log(response);
	        switch (list){
	        	case 0: 
	        		$scope.listPublications =  response;
	        		break;
	        	case 1:
	        		$scope.listPublicationsFilter = response;
	        		break;
	        	default:
	        		console.log("Falied switch to list");
	        }
	    });	
    }

	var recentMidias = function(){
		getReference({ order:"dateDesc", date:undefined, page:pageDefault, limit:limitDefault, mediaType:"video" }, 0);
    };

    var recentFilter = function(){
    	getReference({ order:"dateDesc", date:$scope.dropdown.date, limit:3, mediaType:"video" }, 1);
    };

    $scope.viewMore = function(){
    	limitDefault +=8;
		recentMidias();
		
    }

    $scope.trustYoutube = function(src) {
        src = "http://www.youtube.com/embed/"+src;
        return $sce.trustAsResourceUrl(src);
    }


    $scope.trustVimeo = function(src) {
        src = "http://player.vimeo.com/video/"+src+"?api=1";
        return $sce.trustAsResourceUrl(src);
    }

    recentMidias();
    recentFilter();
}]);
