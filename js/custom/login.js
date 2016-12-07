$(function(){

	errornotice = $("#error");
	$("#login-form").submit(function(){
		result = true;
		if($.trim($('#username').val()) == ""){
			errornotice.html("Enter username.");
			errornotice.fadeIn(750);
			result = false;
		}else{
			if($.trim($('#password').val()) == ""){
				errornotice.html("Enter password.");
				errornotice.fadeIn(750);
				result = false;
			}
		}
		if(result){
			errornotice.html("");
			$('#password').val(calcMD5($('#password').val()));
		}
		return result;
	});

	$('#username').focus();
});
