// **********************************************************************
// Various jQuery functions to improve the display of Webforms
//
// *******************  Revert to using $ for jQuery
(function( $ ) {

$(document).ready(function(){
//	console.log("Webform Loaded");

	// Admin or User form
	$isUserForm = $("div.lalg-wf-membership-type").hasClass("lalg-wf-user-form");
//console.log($isUserForm);
	
//************************* ACCORDIONS ******************************************	
//  Open Additional Household Member Details on Webforms if they have content.
//  Runs once on page load.
//  All are closed by default.

// TRIAL
//	$("details.lalg-wf-additional-member").attr("open");

	
	// // When fileset is expanded manually show the next one
	// $("fieldset.lalg-wf-fs-additional-member a.fieldset-title").click(function(){
// //		console.log('Fileset Changed');
		// if (!($(this).parent().parent().parent().hasClass("collapsed"))) {
			// $(this).parent().parent().parent().next("fieldset.lalg-wf-fs-additional-member").show();
		// }
	// });	
	
// //	*************  First Page of Webform (Input Fields)  ************
// //	Check whether filesets have content
	// $("fieldset.lalg-wf-fs-additional-member input.lalg-wf-lastname").each(function(index, el) {
// //	console.log('Input field found');
		// if ($(this).val()) {
			// // Be sure to unhide it
			// $(this).parent().parent().parent().show();
			// // Expand it
			// $(this).parent().parent().css("display", "block");
			// $(this).parent().parent().parent().removeClass("collapsed");
			// // Show the next one
			// $(this).parent().parent().parent().next("fieldset.lalg-wf-fs-additional-member").show();
		// };	
	// });

//	*************  Confirmation Page of Webform (Text Fields)  *******************
//  *************  There is no Confirmation Page in D8  *******************
// //	Check whether filesets have content
	// $("fieldset.lalg-wf-fs-additional-member .webform-component-display.lalg-wf-lastname").each(function(index, el) {
// //	console.log('Input field found');
		// var text = $(this).contents().not($(this).children()).text().trim() ;
// //	console.log(text);		
		// if (text) {
			// // Be sure to unhide it
			// $(this).parent().parent().show();
			// // Expand it
			// $(this).parent().css("display", "block");
			// $(this).parent().parent().removeClass("collapsed");
			// // Show the next one
			// $(this).parent().parent().next("fieldset.lalg-wf-fs-additional-member").show();
		// };	
	// });
	
// *********************** FUNCTIONS TO SET FLAGS ETC. DEPENDING ON STATE OF FORM  *************************
// *********************************************************************************************************

// *****************  First Time only on Page Load  *********************************
	// Default Membership Type Required to None on first load (Admin Form - User form has Radios)
	if (!document.referrer.includes('admindetails')) { 
		$("select.lalg-wf-membership-type :nth-child(1)").prop('selected', true);
	}
	
	// Hide Label of Replacement Request Tag
	$("div.lalg-wf-replace-tag label").hide();

// ******************  Call Set State function on first load, and change of Membership Type Required  ********
	lalg_set_flags();
	$("select.lalg-wf-membership-type").change(function(){ lalg_set_flags(); });
	$("input.lalg-wf-membership-type").change(function(){ lalg_set_flags(); });	
	$('input.lalg-wf-replace-tag').change(function(){ lalg_set_flags(); });

// *****************  Function called on page load and on changing Membership Type Requested
	function lalg_set_flags() {
		
// ***************************  Get information to work on  ************************
		// Admin or User form
		$isUserForm = $("div.lalg-wf-membership-type").hasClass("lalg-wf-user-form");
//console.log($isUserForm);
		
		// Existing Membership Type
		$existingType = $('input.lalg-wf-existing-mship').val();		
		if (!$existingType) { $existingType = "";}				// Convert 'undefined' to String	
//console.log($existingType);

		// Existing Membership Status	
		$status = $('input.lalg-wf-membership-status').val();
		if (!$status) { $status = "" }							// Convert 'undefined' to String	
//console.log($status);
		
		// Membership Type Required.  Id Number, or zero if none. 
		// Webform Conditionals hide Membership Type Required if it can't be used, else it's mandatory on User form. 
		$typeVis = $("div.lalg-wf-user-form.lalg-wf-membership-type-wrapper").is(':visible');
			
		// Get the selected new membership type.
		if ($isUserForm) {
			if ($typeVis) {
				$reqType = $("div.lalg-wf-membership-type input:checked").val();
			}
			else $reqType = 0;
		}
		else {
			$reqType = $("select.lalg-wf-membership-type").val();
		}
		if (!$reqType) { $reqType = 0; }
//console.log($reqType);		
			
		// Replacement Card Requested
		$replace = false;
		$('input.lalg-wf-replace-tag').each(function() {
			if ($(this).prop('checked')) {$replace = true}				// Set if any Replacement Request set
		});
		
// ***************************  Set Membership Requested  *******************
		// Set Membership Requested flag if any Membership Type set.  Else clear flag.
		if( $reqType ) {
			$("div.lalg-wf-process-tag div:nth-of-type(1) input").prop('checked', true);
		}
		else {
			$("div.lalg-wf-process-tag div:nth-of-type(1) input").prop('checked', false);	
		}
		
// ***************************  Set Replacement Card visibility  *******************
		// Do nothing if on the Preview page
		$preview = $('form.webform-client-form').hasClass('preview');		//console.log($preview);
		if (!$preview) {
			// Hide Replacement Card flags, and uncheck it, if:
			//   Any Membership Type selected, OR 
			//   Existing Type is Empty, or OTM OR
			//   Status is Pending, or Lapsed, or Cancelled
			if ( $reqType || !$existingType || $existingType.includes("Online") ||
			   $status.includes("Pending") || $status.includes("Lapsed") || $status.includes("Cancelled") ) { 
				$("div.lalg-wf-replace-tag-wrapper").hide();
				$("div.lalg-wf-replace-tag input").prop('checked', false);
			   }
			// Else show flag
			else { $("div.lalg-wf-replace-tag-wrapper").show(); }
		}
		
// ***************************  Set Email Preferences  *******************
		// Set Information Emails flag if joining for the first time, or after lapsing.
		if ( $reqType && ( !$existingType || $status.includes("Lapsed") )) {
			$("input.lalg-wf-emailoptions[data-civicrm-field-key$='contact_1_cg4_custom_9'][value=1]" ).prop('checked', true);
		}
		// Set Newsletter Emails if Joining with plain Membership for first time, after lapsing, or changing membership type.
		if ($reqType == 7 && (!$existingType || $status.includes("Lapsed") || $existingType.includes("Printed"))) {
			$("input.lalg-wf-emailoptions[data-civicrm-field-key$='contact_1_cg4_custom_9'][value=2]" ).prop('checked', true);
		}		

// ***************************  Set Latest Membership Action  ******************
		// Default to New Joiner.  E.g. when Additional HH member added to existing HH.
		$('input.lalg-wf-memact').val(1);
		
		// If any Replace Tag set then Action => Replace.  Can't be set at same time as Membership Requested
		// Override later if required.
		$('input.lalg-wf-replace-tag').each(function() {
			if ($(this).prop('checked')) {$('input.lalg-wf-memact').val(3);}
		});
		
		// Do nothing unless a Membership Type has been selected.
		if ( $reqType ) {
			// If no existing membership then Action => Join
			if (!$existingType) {
				$('input.lalg-wf-memact').val(1);
			}
			else {
				// If Membership State Current or Renewable then Action => Renew
				if ($status.includes("New") || $status.includes("Current") || $status.includes("Renew") || 
						$status.includes("Overdue") || $status.includes("Grace") || $status.includes("Pending")) {
					$('input.lalg-wf-memact').val(2);
				}
				// Other Membership status Action => Rejoin
				else {
					$('input.lalg-wf-memact').val(4);
				}
			}	
		}
//		console.log("Membership Action = " + $('input.lalg-wf-memact').val());	
	}
	
//**************************  Set Billing Email, on Admin Screen  ***********************
//  Set default on page load, or when membership type changes, or copy from Home Email
	if (!$isUserForm) {
		// Set default on page load, if required. (Should always default blank anyway.)
		setDefaultBillingEmail();
		
		// Set default when membership type changes, if required
		$("select.lalg-wf-membership-type").change(function(){
			setDefaultBillingEmail(); 
		});
		
		// Set default when Home Email changes, if required 
		$("input.lalg-wf-email").blur(function(){
			setDefaultBillingEmail();
		});
	}
	
	function setDefaultBillingEmail() {
		// If Membership Type is set and Home Email is blank
		if ($("select.lalg-wf-membership-type").val() && !$("input.lalg-wf-email").val()) {
			$("input.lalg-wf-billing-email").val('membership@lalg.org.uk');			
		}
		else {
			$("input.lalg-wf-billing-email").val('');
		}
	}
	
	
//*********************** VARIOUS OTHERS *****************************************
// Default Household Name for new Contact	
	$("input.lalg-wf-lastname").blur(function(){
		if(!$("input.lalg-wf-hhname").val()) {
			$("input.lalg-wf-hhname").val($(this).val() + ' Household');
		}
	});	
	
//****************************************************************
// When Postcode field changes
	$("input.lalg-wf-postcode").blur(function(){
	  // Capitalise it, and remove blank space
	    $(this).val( $(this).val().toUpperCase() );
		$(this).val($(this).val().trim());
		$(this).val($(this).val().replace("   ", " "));
		$(this).val($(this).val().replace("  ", " "));	  
	  
	  // And copy to the Dedupe Key field (Admin form only)
	  $("input.lalg-wf-ddkey").val($(this).val());
	});	

//**********************  Free Membership Only  *************************
// Hide Payment Method for Zero Total on Payment page
	$("tr#wf-crm-billing-total td:nth-child(2)").each(function() {
		if ($(this).text() == '£ 0.00') {
			$("div.webform-component--civicrm-1-contribution-1-contribution-payment-processor-id input[value=0]").prop("checked", true);
			$("div.webform-component--civicrm-1-contribution-1-contribution-payment-processor-id").hide();
		}
	});
	
//*********************  Hide Messages about Membership Status  **************
// Some values (e.g. 'Grace') are deprecated.
	$("#system-messages-wrapper div.messages").each(function() {
		var txt = $(this).html();
		txt = txt.replace(/"Grace"/g, '"Overdue"');
		txt = txt.replace(/"Expired"/g, '"Lapsed"');
		$(this).html(txt);	
	});
	
//********************  Hide/Show the Card-Prompt help field on Payment page
// Hide on first loading
	$("div.webform-component--card-prompt").hide();
	
// Show/Hide when Billing Block changes
	// The node to be monitored
	var target = document.getElementById('billing-payment-block');

	// Create an observer instance
	var observer = new MutationObserver(function( mutations ) {
		if ( $("#billing-payment-block").is(':empty') ) {
			$("div.webform-component--card-prompt").hide();
		}
		else {
			$("div.webform-component--card-prompt").show();		
		}
	});
	 
	// Pass in the target node, as well as the observer options
	if (target) {
		observer.observe(target, {childList: true}); 
	}
	
//***********************  Hide/Show the Wait-Prompt field on the Payment Page  ****************
// Hide on first loading
	$("div.webform-component--wait-prompt").hide();
	
// Show when Submit button clicked
	// Check on Payment page
	if ( $("table#wf-crm-billing-items") ) {
		$("input.webform-submit").click( function() {
			$("div.webform-component--wait-prompt").show();
		});
	}


});				// End Document Ready
})(jQuery);		// ******************* Close the $ reversion	

