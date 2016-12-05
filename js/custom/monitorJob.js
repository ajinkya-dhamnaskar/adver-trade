var dtTable3;
var fileDataTable;
var selectedDate;
var regExForRejectionReason = /^[A-Za-z0-9\.;, \n]{1,250}$/;
var filenameRegex = /^[a-zA-Z0-9\-\._ ]+/;
var transactionIdRegex = /^[A-Za-z0-9 s]{1,100}$/;
var rejectReasonRegex = /^[A-Za-z0-9,\. '"\n]{1,255}$/g;
var vResult;
var isValidDate;
var isValidRejectionReason;
var randomKey;
var rejectionReason = "";
var rejectFile;
var corpNames = null;
var corpIds = null;
var flag = false;
var tblColumns3;
var fileIdForProcess = null;
var otpId = null;
var attempts = null;
var fileRecords = [];
var otpId;
var id;
var authBtn;// overlay AUTHORIZE buttons corresponding to action AUTHORIZE
			// buttons of the row
var rejBtn;// overlay REJECT buttons corresponding to action REJECT buttons of
			// the row
var pdfViewTag = '<object id="object-pdf" standby="LOADING....." class="pdf-view hide" data="" type="application/pdf"></object>';
var dtTable;

var tblColumns = [ {
	"mDataProp" : "title",
	sDefaultContent : "",
	"sClass" : "all item-title"
}, {
	"mDataProp" : "price",
	sDefaultContent : "",
	"sClass" : "all item-price"
}, {
	"mDataProp" : "category",
	sDefaultContent : "",
	"sClass" : "all item-categ"
}, {
	"mDataProp" : "username",
	sDefaultContent : "",
	"sClass" : "all user-username"
}, {
	"mDataProp" : "description",
	sDefaultContent : "",
	"bSortable" : false,
	"bSortable" : false,
	"sClass" : "all item-description"
}, ];


$(document).ready(function(e) {

//	$("img").hover(function(){
//
//	})
	$("a.open-overlay").on("click", function() {

		$("form#submitad").attr("action", "/postad")
		$(".overlay-header").text("Post Ad");

		$("#price").val("");
		$("#adTitle").val("");
		$("#description").val("");
		$("button.editOverlay").addClass("hide");
		showPopup();
		$(".validation-message").addClass("hide");
	});

	$("button.open-overlay").on("click", function() {
		$("form#submitad").attr("action", "/editAdDB")
		$(".overlay-header").text("Edit Ad");
		$("button.submitOverlay").addClass("hide");
		showPopup();
		$(".validation-message").addClass("hide");
	});



//
//	$("#alertOkBtn").on("click", function() {
//		$("button#deleteAd").trigger("click");
//	});

	$("#showAdDetails").on("click", function() {

		id = $(this).closest("tr").attr("id");
		$("#alertModal").modal();
		$(".sendEmail").on("click", function() {
			sendEmail(id, $(".message").val());
			$("#alertModal").modal("hide");
		});
	});



	$(".deleteAd").on("click", function() {
		deleteAd($(this).closest("tr"));

	});

	$(".editAd").on("click", function() {
		updateAd($(this).closest("tr").attr("id"));

	});

	$(".open-overlay").click(function() {
		showPopup();
		$(".validation-message").addClass("hide");
	});

$('#itemList').dataTable({
//		"bProcessing" : true,
//		"bDeferRender" : true,
		"bDestroy" : true,
//		"bAutoWidth" : false,
		// "bServerSide": true,
//		"sAjaxSource" : "getJobs.htm",
		"bPaginate" : true,
//		"bLengthChange" : true,
		"iDisplayLength" : 1,
//	"bFilter" : true,
//		"aoColumns" : tblColumns,

	});

});

function deleteAd(deleteTR) {
	id = deleteTR.attr("id");
	console.log(id)
	var r = confirm("Do yo want to delete this item?");
	if (r == true) {
		$.ajax({
			url : '/deleteAd',
			type : 'POST',
			data : {
				id : id
			},
			dataType : 'json',
			contentType : 'application/x-www-form-urlencoded; charset=utf-8',
			mimeType : 'application/json',
			error : function(xhr, textStatus, thrownError) {
				unblockUI();
			},
			success : function(data) {
				console.log(data);
				if(!data.isErr){
					deleteTR.remove();
				}
			}

		});
	}

}

function updateAd(id) {
	console.log(id);
	$("#id").val(id);
	$.ajax({
		url : '/editAd',
		type : 'POST',
		data : {
			id : id
		},
		dataType : 'json',
		contentType : 'application/x-www-form-urlencoded; charset=utf-8',
		mimeType : 'application/json',
		error : function(xhr, textStatus, thrownError) {
			unblockUI();
		},
		success : function(data) {
			console.log(data);
			$("#price").val(data.itemPrice);
			$("#s").val(data.itemTitle);
			$("#description").val(data.itemDesp);
			$("#category").val(data.itemName);
		}

	});
}

function displayPage(id){
	console.log(id);
	$("#id").val(id);
	$.ajax({
		url : '/adDetails',
		type : 'POST',
		data : {
			id : id
		},
		dataType : 'json',
		contentType : 'application/x-www-form-urlencoded; charset=utf-8',
		mimeType : 'application/json',
		error : function(xhr, textStatus, thrownError) {
			unblockUI();
		},
		success : function(data) {
			console.log(data);
			$("#price").val(data.itemPrice);
			$("#adTitle").val(data.itemTitle);
			$("#description").val(data.itemDesp);
			$("#category").val(data.itemName);
			$("#username").val(data.username);
			$("#useremail").val(data.useremail);
			$("#userphone").val(data.userphone);
			$("#userfullname").val(data.userfirstname + " " + data.userlastname);

		}

	});

}

function sendEmail(id, message){
	console.log(id);
	$.ajax({
		url : '/sendEmail',
		type : 'POST',
		data : {
			id : id,
			message : message
		},
		dataType : 'json',
		contentType : 'application/x-www-form-urlencoded; charset=utf-8',
		mimeType : 'application/json',
		error : function(xhr, textStatus, thrownError) {
			unblockUI();
		},
		success : function(data) {
			console.log(data);
		}

	});

}
