/**
 * Created by Ishtiaque on 9/23/2016.
 */
angular.module("ngFinanceManager").factory("finManServices", function($http){

	function getCurrencies(){
		return $http.get('data/currencies.json');
	}
	return{
		getCurrencies: getCurrencies
	}
});