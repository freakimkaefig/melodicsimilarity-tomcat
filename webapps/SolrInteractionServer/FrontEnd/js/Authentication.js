/*
	Script to define globals and methods to use in other parts for authentication process
	Authentication credentials are saved via Cookies, for the run of a session
	Data Handling as well as UI of Login

	This Script uses Javascript Cookie for Cookies Handling: https://github.com/js-cookie/js-cookie
*/

// Set authentication credential as globals
var USERNAME = Cookies.get('username');
var PASSWORD = Cookies.get('password');

var setUsernameAndPasswordForSession = function(){
	USERNAME = Cookies.get('username');
	PASSWORD = Cookies.get('password');
};

/*
  Change username and password (e.g. for successfull login)
  username and password are saved as cookie for the session with the keys 'username' and 'password'
*/
var setUsernameAndPassword = function(username, password){
	Cookies.set('username', username);
	Cookies.set('password', password);
};

/* 
 Method to build the encryptstring for Base64 encoding according http standards
 String has the form 'Basic: username:password' with username:passwordd being encoded
 More: https://en.wikipedia.org/wiki/Basic_access_authentication
*/
var getEncryptString = function(){
	// btoa is native method to encode a string in base64
	var encryptString = btoa(USERNAME + ":" + PASSWORD);
	console.log(encryptString);
	var basicAuthString = "Basic " + encryptString;
	return basicAuthString;
};

/*
 Method to check on username and password on server
 Encoding according to http-standards for Basic Access Authentication
 String has the form 'Basic: username:password' with username:passwordd being encoded 
*/
var validateUsernameAndPassword = function(username, password){

	var encryptString = btoa(username + ":" + password);
	var basicAuthString = "Basic " + encryptString;

	 $.ajax({
	        type     : "POST",
	        url      : SERVERADDRESS + "/SolrInteractionServer/rest/ssc-api-write/login",
	        // Encrypted authentication credentials get send via header with Authorization as name
	        headers  : {"Authorization": basicAuthString},
	        success  : function(msg, status){
	            // Show success UI and adjust cookies
	            loginSuccess();
	        },
	        error    : function(msg) {
	            // Show error UI and adjust cookies
	            loginFailed();
	        }
	    });
}

// Set Login-Button
$("#login-nav").on("submit", function(e){

	e.preventDefault();
	if($("#logout").is(':visible')){
		// if logged in --> logout
		logout();
	}else{
		// if logged out, get values of input field and try validation on server
		var username = $("#usernameLogin").val();
		var password = $("#passwordLogin").val();
		if(username == "" && password == ""){
			return;
		}
		validateUsernameAndPassword(username, password);
	}
  	

});

// Remove login prompts (when trying to use forbidden function) when clicking in
// input field
$("input").on("click", function(){
	$("#prompt-login").hide();
	$("#failed-login").hide();
});

/*
 Method to invoke when Login was successfull
*/
var loginSuccess = function(){
	var username = $("#usernameLogin").val();
	var password = $("#passwordLogin").val();
	// set the password and usernome and show new UI
	setUsernameAndPassword(username, password);
	showLoggedInUI();
	// trigger that login happened for other parts of application
	$("body").trigger("Login");
};

/*
 Method to check if password and username is set
*/
var usernameAndPasswordIsSet = function(){
	setUsernameAndPasswordForSession();
	if(USERNAME != undefined && USERNAME != "" && PASSWORD != undefined && PASSWORD != ""){
		return true;
	}else{
		return false;
	}
}

/*
 Method to show information that the login failed and hide
 the prompt to login.
*/
var loginFailed = function(){
	$("#prompt-login").hide();
	$("#failed-login").fadeIn();
};

/*
 Method to check if logged in and show UI accordingly
*/
var showLoggedInUI = function(){
	console.log("showLoggedInUI");
	if(usernameAndPasswordIsSet()){
		// If logged in set UI properly
		$("#login-info").text(Cookies.get('username'));
		$("#username-form").hide();
		$("#password-form").hide();
		$("#login").hide();
		$("#failed-login").hide();
		$("#prompt-login").hide();
		$("#login-text").fadeIn();
		$("#login-text").html("Sie sind eingeloggt als <em>" + USERNAME + "</em>");
		$("#logout").fadeIn();
	}else{
		// if logged out set UI properly
		$("#login-info").text("Login");
		$("#login-text").hide();
		$("#logout").hide();
		$("#failed-login").hide();
		$("#prompt-login").hide();
		$("#username-form").fadeIn();
		$("#password-form").fadeIn();
		$("#login").fadeIn();
	}
};

/*
 Method to invoke when logged out
*/
var logout = function(){
	// remove all cookes
	resetCookies();
	// show UI according to ui-state (Here logout)
	showLoggedInUI();
	// trigger logout for other parts of application
	$("body").trigger("Logout");
}

var resetCookies = function(){
	Cookies.remove('username');
	Cookies.remove('password');
};

/*
 Method to call when a login is prompted (e.g. using a forbidden write function)
*/
var promptLogin = function(){
	setTimeout(function(){ 
                    $("#login-dropdown").addClass("open");
					$("#failed-login").hide();
					$("#prompt-login").fadeIn(); 
                }, 100);
	
};

// check which UI should be shown and show it on every start of a site
showLoggedInUI();

/*
// Test Method to test local storage space
var resultList = [];
for(var i = 0; i < 20000; i++){
	resultList.push("d64d20a4-fac2-47fa-8330-0e3b8b421c5b");
}

localStorage["resultList7"] = JSON.stringify(resultList);
*/
