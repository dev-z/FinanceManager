/**
 * Created by Ishtiaque on 9/23/2016.
 */
angular.module("ngFinanceManager").controller("FinManCtrl", function($scope, finManServices, $sessionStorage, $localStorage, $window){

	/*************************************************/
	/*  All the things concerning Filters go below   */
	/*************************************************/

	$scope.currentAccount = "";
	$scope.currentTag = "";
	$scope.currentSrc = "";
	$scope.currentMonth = "";//new Date().getMonth() + 1;
	$scope.setCurrentAccount = function(name){
		$scope.currentAccount = name;
		console.log(name);
	};
	$scope.setCurrentTag = function(name){
		$scope.currentTag = name;
		console.log(name);
	};

	/*************************************************/
	/*All the things concerning Transactions go below*/
	/*************************************************/

	$scope.chosenSource = "Expense";
	$scope.chosenAmt = "";
	$scope.chosenTag = "Bills";
	$scope.chosenDesc = "";
	$scope.chosenAccount = "Cash";
	var today = new Date();
	var month = today.getMonth()+1;
	if(month < 10){
		month = "0"+month;
	}
	var todayStr = today.getDate()+"/"+ month +"/"+today.getFullYear();
	$scope.datePicker = todayStr;// /"00/00/0000";
	$scope.allTransactions = [];
	$scope.allAccountsMoney = 0;

	function updateRecords(){
		$scope.allAccountsMoney = 0;
		$scope.allAccounts.forEach(function(eachAcc){
			$scope.allAccountsMoney += eachAcc.amount;
		})
	}
	$scope.updateRecords = updateRecords;

	$scope.editingTrans = "";
	$scope.updatedTrans = "";
	$scope.setEditingTrans = function(eachTrans){
		$scope.editingTrans = eachTrans;
	};
	$scope.isSelected = function(name){
		console.log(name);
		if(name === $scope.editingTrans.tag){
			return "selected";
		}
	};
	$scope.setUpdatedTrans = function(updatedAmt, updatedTag, updatedDesc, updatedAccount, updatedDate){
		//var amt = updatedAmt==undefined ? $scope.editingTrans.amount : updatedAmt;
		//var tag = updatedTag==undefined ? $scope.editingTrans.tag : updatedTag;
		//var desc = updatedDesc==undefined ? $scope.editingTrans.desc : updatedDesc;
		//var acc = updatedAccount==undefined ? $scope.editingTrans.account : updatedAccount;
		var newDateArr = updatedDate.split("/");
		$scope.updatedTrans = {
			source: $scope.editingTrans.source,
			amount: updatedAmt,
			tag: updatedTag,
			desc: updatedDesc,
			account: updatedAccount,
			date: newDateArr[0],
			month: newDateArr[1],
			year: newDateArr[2]
		};
		$scope.updateAlTransData();
	};

	$scope.updateAlTransData = function updateAlTransData(){
		//find the index of the editing transaction object in allTransaction.
		var oldTransIndex = $scope.allTransactions.indexOf($scope.editingTrans);
		//find out the corresponding account and tag
		var allAccNameOnlyArr = $scope.allAccounts.map(function (eachObj) {
			return eachObj.name;
		});
		var allTagNameOnlyArr = $scope.allTags.map(function (eachObj) {
			return eachObj.name;
		});
		var accIndex = allAccNameOnlyArr.indexOf($scope.editingTrans.account);
		var tagIndex = allTagNameOnlyArr.indexOf($scope.editingTrans.tag);
		//reverse the changes regarding money
		if ($scope.editingTrans.source === "Income") {
			//subtraction from account and tag
			$scope.allAccounts[accIndex].amount -= $scope.editingTrans.amount;
			$scope.allTags[tagIndex].amount -= $scope.editingTrans.amount;
			$scope.allTags[tagIndex].count -= 1;
		} else if ($scope.editingTrans.source === "Expense") {
			//addition to account and tag
			$scope.allAccounts[accIndex].amount += $scope.editingTrans.amount;
			$scope.allTags[tagIndex].amount += $scope.editingTrans.amount;
			$scope.allTags[tagIndex].count -= 1;
		}
		//now make the changes regarding money with the updatedTrans object
		var accIndexUpdt = allAccNameOnlyArr.indexOf($scope.updatedTrans.account);
		var tagIndexUpdt = allTagNameOnlyArr.indexOf($scope.updatedTrans.tag);
		if ($scope.updatedTrans.source === "Income") {
			//addition to account and tag
			$scope.allAccounts[accIndexUpdt].amount += $scope.updatedTrans.amount;
			$scope.allTags[tagIndexUpdt].amount += $scope.updatedTrans.amount;
			$scope.allTags[tagIndexUpdt].count += 1;
		} else if ($scope.updatedTrans.source === "Expense") {
			//subtraction from account and tag
			$scope.allAccounts[accIndexUpdt].amount -= $scope.updatedTrans.amount;
			$scope.allTags[tagIndexUpdt].amount -= $scope.updatedTrans.amount;
			$scope.allTags[tagIndexUpdt].count += 1;
		}
		//splice the old trans with the updated on
		$scope.allTransactions.splice(oldTransIndex,1, $scope.updatedTrans);
		updateRecords();

	};

	$scope.addNewTransaction = function(){

		if($scope.chosenSource === ""){
			alert("Invalid Source. Please choose a source first.");
		}else if($scope.chosenAmt === ""){
			alert("Invalid Amount. Please specify amount > 0.");
		}else if($scope.chosenTag === ""){
			alert("Invalid Tag. Please choose a tag first or create a new tag.");
		}else if($scope.chosenDesc === ""){
			alert("Description cannot be empty");
		}else if($scope.chosenAccount === ""){
			alert("Invalid Account. Please choose an account.");
		}else if($scope.datePicker === "00/00/0000"){
			alert("Invalid Date. Please choose an date.");
		}else {
			var dateArr = $scope.datePicker.split("/");
			var trans = {
				source: $scope.chosenSource,
				amount: $scope.chosenAmt,
				tag: $scope.chosenTag,
				desc: $scope.chosenDesc,
				account: $scope.chosenAccount,
				date: dateArr[0],
				month: dateArr[1],
				year: dateArr[2]
			};
			var allAccNameOnlyArr = $scope.allAccounts.map(function (eachObj) {
				return eachObj.name;
			});
			var allTagNameOnlyArr = $scope.allTags.map(function (eachObj) {
				return eachObj.name;
			});
			var accIndex = allAccNameOnlyArr.indexOf(trans.account);
			var tagIndex = allTagNameOnlyArr.indexOf(trans.tag);
			/*
			 console.log(trans.account);
			 console.log(trans.tag);
			 console.log(allAccNameOnlyArr);
			 console.log(allTagNameOnlyArr);
			 console.log(accIndex);
			 console.log(tagIndex);
			 */
			if (trans.source === "Income") {
				//addition to account and tag
				$scope.allAccounts[accIndex].amount += trans.amount;
				$scope.allTags[tagIndex].amount += trans.amount;
				$scope.allTags[tagIndex].count += 1;
			} else if (trans.source === "Expense") {
				//subtraction from account and tag
				$scope.allAccounts[accIndex].amount -= trans.amount;
				$scope.allTags[tagIndex].amount -= trans.amount;
				$scope.allTags[tagIndex].count += 1;
			}
			//console.log($scope.allTags);
			$scope.allTransactions.push(trans);
			//clear the fields
			$scope.chosenSource = "Expense";
			$scope.chosenAmt = "";
			$scope.chosenTag = "Bills";
			$scope.chosenDesc = "";
			$scope.chosenAccount = "Cash";
			$scope.datePicker = todayStr;
			//update the records
			updateRecords();
		}
	};
	$scope.reverseTransaction = function(trans){

		var index = $scope.allTransactions.indexOf(trans);
		console.log(trans);
		console.log(index);
		var allAccNameOnlyArr = $scope.allAccounts.map(function (eachObj) {
			return eachObj.name;
		});
		var allTagNameOnlyArr = $scope.allTags.map(function (eachObj) {
			return eachObj.name;
		});
		var accIndex = allAccNameOnlyArr.indexOf(trans.account);
		var tagIndex = allTagNameOnlyArr.indexOf(trans.tag);

		if (trans.source === "Income") {
			//subtraction from account and tag
			$scope.allAccounts[accIndex].amount -= trans.amount;
			$scope.allTags[tagIndex].amount -= trans.amount;
			$scope.allTags[tagIndex].count -= 1;
		} else if (trans.source === "Expense") {
			//addition to account and tag
			$scope.allAccounts[accIndex].amount += trans.amount;
			$scope.allTags[tagIndex].amount += trans.amount;
			$scope.allTags[tagIndex].count -= 1;
		}
		$scope.allTransactions.splice(index,1);
		updateRecords();
	};

	/*********************************************/
	/*All the things concerning Accounts go below*/
	/*********************************************/
	$scope.showAddAccSec = false;
	$scope.newAccName = "";
	$scope.newAccAmt = "";
	$scope.newAccCurr = "USD"; //default currency
	$scope.currencies = [];
	$scope.allAccounts = [];
	$scope.accountAddedSuccess = false;
	$scope.accountAddError1 = false;
	$scope.accountAddError2 = false;

	//adding a default account for every user
	var defaultAccount = {
		name: "Cash",
		amount:0,
		currency: "USD"
	};
	$scope.allAccounts.push(defaultAccount);

	$scope.addNewAccount = function(){
		if($scope.newAccName !== ""){
			//name is ok, proceed to check if exists or not.
			var allAccNameOnlyArr = $scope.allAccounts.map(function(eachObj){
				return eachObj.name;
			});
			var accIndex = allAccNameOnlyArr.indexOf($scope.newAccName);
			if(accIndex === -1){
				//name does not exist, everything ok
				//add the object to the accounts array
				var newAccount2 = {
					name: $scope.newAccName,
					amount: $scope.newAccAmt,
					currency: $scope.newAccCurr
				};
				$scope.allAccounts.push(newAccount2);
				$scope.accountAddedSuccess = true;
				updateRecords();
			}else{
				//name exists
				$scope.accountAddError1 = true;
			}
		}else{
			//invalid account name
			$scope.accountAddError2 = true;
		}
		//hide the div
		$scope.newAccName = "";
		$scope.newAccAmt = "";
		$scope.newAccCurr = "USD";
		$scope.showAddAccSec = false;
	};

	$scope.cancelNewAccount = function(){
		//hide the div
		$scope.newAccName = "";
		$scope.newAccAmt = "";
		$scope.newAccCurr = "USD";
		$scope.showAddAccSec = false;
	};

	//fetch the currencies
	finManServices.getCurrencies().then(function onSuccess(response){
		$scope.currencies = response.data;
	}, function onError(response){
		console.log("Error in fetching currencies");
	});

	/*This function removes an item from the allAccounts array*/
	$scope.remove=function(item){
		var index=$scope.allAccounts.indexOf(item);
		$scope.allAccounts.splice(index,1);
		updateRecords();
	};
	/*****************************************/
	/*All the things concerning Tags go below*/
	/*****************************************/
	$scope.showAddTagSec = false;
	$scope.tagAddedSuccess = false;
	$scope.tagAddError1 = false;
	$scope.tagAddError2 = false;
	$scope.newTagName = "";
	$scope.allTags = [
		{
			name: "Bills",
			amount:0,
			count: 0
		},
		{
			name: "Car",
			amount:0,
			count: 0
		},
		{
			name: "Dinner",
			amount:0,
			count: 0
		},
		{
			name: "Entertainment",
			amount:0,
			count: 0
		},
		{
			name: "Food",
			amount:0,
			count: 0
		},
		{
			name: "Groceries",
			amount:0,
			count: 0
		},
		{
			name: "Lunch",
			amount:0,
			count: 0
		},
		{
			name: "Meal",
			amount:0,
			count: 0
		},
		{
			name: "Misc",
			amount:0,
			count: 0
		},
		{
			name: "Savings",
			amount:0,
			count: 0
		},
		{
			name: "Transport",
			amount:0,
			count: 0
		},
		{
			name: "Travel",
			amount:0,
			count: 0
		}
	];

	$scope.addNewTag = function(){
		//add the object to the accounts array
		if($scope.newTagName !== ""){
			var allTagNameOnlyArr = $scope.allTags.map(function(eachObj){
				return eachObj.name;
			});
			var tagIndex = allTagNameOnlyArr.indexOf($scope.newTagName);
			if(tagIndex === -1){
				var newTag = {
					name: $scope.newTagName,
					amount:0,
					count: 0
				};
				$scope.allTags.push(newTag);
				//hide the div
				//display success
				$scope.tagAddedSuccess = true;
				$scope.newTagName = "";
			}else{
				//tag already exists
				$scope.tagAddError1 = true;
				//reset the name
				$scope.newTagName = "";
			}
		}else{
			//invalid tag name
			$scope.tagAddError2 = true;
		}
		$scope.showAddTagSec = false;
	};
	$scope.cancelNewTag = function(){
		//hide the div
		$scope.newTagName = "";
		$scope.showAddTagSec = false;
	};
	/*This function removes an item from the allTags array */
	$scope.removeTag=function(item){
		var index=$scope.allTags.indexOf(item);
		$scope.allTags.splice(index,1);
	};
	/*Predicate function to be used in filters.
	 Shows only those objects where object[prop] > val  */
	$scope.greaterThan = function(prop, val){
		return function(item){
			return item[prop] > val;
		}
	};
	/*******************************************/
	/*All the things saving to session go below*/
	/*******************************************/
	$scope.saveToStorage = function saveToStorage(){
		$sessionStorage.allTrans = $scope.allTransactions;
		$sessionStorage.allAccounts = $scope.allAccounts;
		$sessionStorage.allTags = $scope.allTags;
		//also save to local storage
		$localStorage.allTrans = $scope.allTransactions;
		$localStorage.allAccounts = $scope.allAccounts;
		$localStorage.allTags = $scope.allTags;
	};
	$scope.clearStorage = function clearStorage(){
		$sessionStorage.allTrans = [];
		$sessionStorage.allAccounts = [];
		$sessionStorage.allTags = [];
		//clear from local storage
		$localStorage.allTrans = [];
		$localStorage.allAccounts = [];
		$localStorage.allTags = [];
	};
	$scope.getFromStorage = function getFromStorage(){

		if($localStorage.allTrans!== undefined && $localStorage.allTrans!== []){
			$scope.allTransactions = $localStorage.allTrans;
		}
		if($localStorage.allAccounts!== undefined && $localStorage.allAccounts !== []){
			$scope.allAccounts = $localStorage.allAccounts;
			updateRecords();
		}
		if($localStorage.allTags!== undefined && $localStorage.allTags !== []){
			$scope.allTags = $localStorage.allTags;
		}
	};
	$scope.getFromStorage();
	var win = $window;
	win.onbeforeunload = function(){
		return 'Your message here';
	}
});