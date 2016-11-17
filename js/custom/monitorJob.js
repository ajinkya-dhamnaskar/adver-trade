var dtTable3;
var fileDataTable;
var selectedDate;
var regExForRejectionReason = /^[A-Za-z0-9\.;, \n]{1,250}$/;
var filenameRegex = /^[a-zA-Z0-9\-\._ ]+/;
var transactionIdRegex = /^[A-Za-z0-9 s]{1,100}$/;
var rejectReasonRegex=/^[A-Za-z0-9,\. '"\n]{1,255}$/g;
var vResult;
var isValidDate;
var isValidRejectionReason;
var randomKey;
var rejectionReason="";
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
var authBtn;//overlay AUTHORIZE buttons corresponding to action AUTHORIZE buttons of the row
var rejBtn;//overlay REJECT buttons corresponding to action REJECT buttons of the row
var pdfViewTag='<object id="object-pdf" standby="LOADING....." class="pdf-view hide" data="" type="application/pdf"></object>';
var dtTable;

var tblColumns = [ {"mDataProp": "title", sDefaultContent: "", "sClass":"all item-title"},
    {"mDataProp": "price", sDefaultContent: "", "sClass":"all item-price"},
    {"mDataProp": "category", sDefaultContent: "", "sClass":"all item-categ"},
    {"mDataProp": "username", sDefaultContent: "", "sClass": "all user-username"},
    {"mDataProp": "description", sDefaultContent: "", "bSortable": false, "bSortable": false, "sClass": "all item-description"},
   ];
	

$(document).ready(function (e) {
	
	$(".open-overlay").click(function(){
		showPopup();
		$(".validation-message").addClass("hide");
	});
	
	 dtTable = $('#itemList').dataTable({
		 "bProcessing" : true,
		 "bDeferRender" : true,
		"bDestroy":true,
		"bAutoWidth": false,
		//"bServerSide": true,
		"sAjaxSource": "getJobs.htm",
		"bPaginate": true,
		"bLengthChange":true,
		"iDisplayLength" : 10,
		"bFilter":true,
		"aoColumns": tblColumns,
		
				
	 }); 
	 
})