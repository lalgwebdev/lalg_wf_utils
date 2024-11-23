// **********************************************************************
// Various jQuery functions to improve the display of Webforms
//
// *******************  Revert to using $ for jQuery
(function( $ ) {

$(document).ready(function(){

  
  // ******************  Delete Additional Member   ************************************
  
    
  $("fieldset.lalg-memb-delete-button .webform-custom-options-button").css({"background-color": "#888888", "color": "white", "font-size": "1.5em"});
  $('summary').append("<span class=deleted-notice> </span>");
 
  $("input.lalg-memb-process-tag[value='17']").each(function() {
    if ($(this).prop("checked") == true) {
      $(this).parents("details").find(".webform-custom-options-button").css({"background-color": "#027089", "color": "white"});
      $(this).parents("details").find(".webform-custom-options-button").text("Restore");       
      $(this).parents("details").find("input, select").prop('readonly', true);       
      $(this).parents("details").find("input").css('-webkit-text-fill-color', 'gray');
      $(this).parents("details").find("fieldset.lalg-memb-process-tag input.lalg-memb-process-tag[value='17']").prop('checked', true);      
      $(this).parents("details").find(".deleted-notice").text('Queued for Deletion');   
      $(this).parents("details").css('background-color', '#f8efef');    
   } 
  });
  

  
  $(".webform-custom-options-button").click(function() {
    
    if($(this).parents("details").find("fieldset.lalg-memb-process-tag input.lalg-memb-process-tag[value='17']").prop("checked") == true){
      $(this).css({"background-color": "#888888", "color": "white"});
      $(this).text("Delete"); 
      $(this).parents("details").find("input, select").prop('readonly', false); 
      $(this).parents("details").find("input").css('-webkit-text-fill-color', 'black');
      $(this).parents("details").find("fieldset.lalg-memb-process-tag input.lalg-memb-process-tag[value='17']").prop('checked', false);    
      $(this).parents("details").find(".deleted-notice").text('');    
      $(this).parents("details").css('background-color', '#0f0f0f05');         
    } else {
      $(this).css({"background-color": "#027089", "color": "white"});
      $(this).text("Restore");       
      $(this).parents("details").find("input, select").prop('readonly', true);       
      $(this).parents("details").find("input").css('-webkit-text-fill-color', 'gray');
      $(this).parents("details").find("fieldset.lalg-memb-process-tag input.lalg-memb-process-tag[value='17']").prop('checked', true);      
      $(this).parents("details").find(".deleted-notice").text('Queued for Deletion');   
      $(this).parents("details").css('background-color', '#f8efef');    
    } 

  });
  
  
//console.log("Webform Loaded");
	// Admin or User form
	var isUserForm = $("form.lalg-memb-wf").hasClass("lalg-memb-userdetails");
//console.log(isUserForm);

//*************************  Additional Members Accordions ***********************
	// Set initial state depending on content
	$('details').each(function() {
		if ($(this).find("input.lalg-memb-lastname").val()) {
			$(this).attr('open', 'open');
		} 
		else {
			$(this).removeAttr('open');
		}
	});

// ****************** FUNCTIONS TO SET FLAGS ETC. DEPENDING ON STATE OF FORM  ***********************
// **************************************************************************************************

// *****************  First Time only on Page Load  *********************************
	// Default Membership Type Required to None on first load (Admin Form - User form has Radios)
	if (!document.referrer.includes('admindetails')) { 
		$("select.lalg-memb-membership-type :nth-child(1)").prop('selected', true);
	}

// ******************  Call Set State function on first load, and change of Membership Type Required  ********
	lalg_set_flags();
	$("select.lalg-memb-membership-type").change(function(){ lalg_set_flags(); });
	$("input.lalg-memb-membership-type").change(function(){ lalg_set_flags(); });	
	$('input.lalg-memb-replace-tag').change(function(){ lalg_set_flags(); });
  

	
// *****************  Function called on page load and on changing Membership Type Requested
	function lalg_set_flags() {
		
//*************************  Stage 1 - Copy information into off-page fields.  Page 1 only  *******************
		// Copy Existing Membership Type, if field present
		var $existing = $('input.lalg-memb-existing-mship');
		if ($existing.length) {
			$('input.lalg-memb-cf-existing-mship').val($existing.val());
		}
		
		// Extract Id number of Membership Type Requested from radios or select field, if present
		// Non-visible or undefined are converted to '0'
		var typeVal, $userType, $adminType;
		if (isUserForm) {
			$userType = $("fieldset.lalg-memb-membership-type");
//			if ($("div.lalg-wf-membership-type-wrapper").is(':visible')) {
			if ($userType) {
				typeVal = $("fieldset.lalg-memb-membership-type input:checked").val();
			}
		}
		else {
			$adminType = $("select.lalg-memb-membership-type");
			if ($adminType) {
				typeVal = $adminType.val();
			}
		}

		if (($userType && $userType.length) || ($adminType && $adminType.length)) {
			$("input.lalg-memb-cf-membership-type").val(typeVal);
		}
		
// ****************  Stage 2 - Get information to work on into local variables.  Page 1 and 2 *************
		// Existing Membership Type
		var existingType = $('input.lalg-memb-cf-existing-mship').val();		
		if (!existingType) { existingType = "";}				// Convert 'undefined' to String	
//console.log("Existing Type = " + existingType);

		// Existing Membership Status  (Original field is off-page)	
		var membStatus = $('input.lalg-memb-mship-status').val();
		if (!membStatus) { membStatus = "" }							// Convert 'undefined' to String	
//console.log("Existing Status = " + membStatus);
			
		// Get the selected new membership type.
		var reqType = $("input.lalg-memb-cf-membership-type").val();
		if (!reqType) { reqType = 0; }							// Convert 'undefined' to zero
//console.log("Requested Type = " + reqType);		
			
//  **************************Stage 3 - Set the flags etc.  ***********************
			
// ***************************  Set Membership Requested  *******************
		// Set Membership Requested flag if any Membership Type set.  Else clear flag.
		if( reqType ) {
			$("fieldset.lalg-memb-process-tag input.lalg-memb-process-tag[value='13']").prop('checked', true);
		}
		else {
			$("fieldset.lalg-memb-process-tag input.lalg-memb-process-tag[value='13']").prop('checked', false);	
		}
	
// ***************************  Then Set Replacement Card visibility  *******************
		// Hide Replacement Card flags, and uncheck it, if:
		//   Any Membership Type selected, OR 
		//   Existing Type is Empty, OR
		//   Status is Lapsed, or Cancelled
		if ( reqType || !existingType || 
		      membStatus.includes("Lapsed") || membStatus.includes("Cancelled") ) { 
			$("fieldset.lalg-memb-replace-tag-wrapper").hide();
			$("fieldset.lalg-memb-replace-tag input").prop('checked', false);
		   }
		// Else show flag
		else { $("fieldset.lalg-memb-replace-tag-wrapper").show(); }

/*
// ***************************  Set Email Preferences  *******************
		// Set Information Emails flag if joining for the first time, or after lapsing.
		if ( reqType && ( !existingType || membStatus.includes("Lapsed") )) {
			$("input.lalg-memb-emailoptions[data-civicrm-field-key$='contact_1_cg4_custom_9'][value=1]" ).prop('checked', true);
		}
		// Set Newsletter Emails if Joining with plain Membership for first time, after lapsing, or changing membership type.
		if (reqType == 7 && (!existingType || membStatus.includes("Lapsed") || existingType.includes("Printed"))) {
			$("input.lalg-memb-emailoptions[data-civicrm-field-key$='contact_1_cg4_custom_9'][value=2]" ).prop('checked', true);
		}		
*/
// ***************************  Set Latest Membership Action  ******************
		// Default to New Joiner - covers the case when when Additional HH member added to existing HH. 
		// Then overwrite as required
		$('input.lalg-memb-memact').val(1);
		
		// If Replace Tag set then Action => Replace.  Can't be set at same time as Membership Requested
		// Contact 1 on Page 1 contained in Fieldset
		if ($('fieldset.lalg-membership-details input.lalg-memb-replace-tag').prop('checked')) {
			$('input.lalg-memb-memact').val(3);
		}
		// Additional members contained in Details
		$("details.lalg-wf-additional-member").each(function() {
			if ($(this).find("input.lalg-memb-replace-tag").prop('checked')) {
				$(this).find('input.lalg-memb-memact').val(3);
			}
		});	
		
		// Do nothing unless a Membership Type has been selected.
		if ( reqType ) {
			// If no existing membership then Action => Join
			if (!existingType) {
				$('input.lalg-memb-memact').val(1);
			}
			else {
				// If Membership State Current or Renewable then Action => Renew
				if (membStatus.includes("New") || membStatus.includes("Current") || membStatus.includes("Renew") || membStatus.includes("Overdue") || membStatus.includes("Grace") ) {
					$('input.lalg-memb-memact').val(2);
				}
				// Other Membership status Action => Rejoin
				else {
					$('input.lalg-memb-memact').val(4);
				}
			}	
		}
//console.log("Membership Action = " + $('input.lalg-memb-memact').val());	
	}

//*********************** VARIOUS OTHER FUNCTIONS **************************************
// *************************************************************************************
	
//**************************  Set Billing Email, on Admin Screen  ***********************
//  Set default on page load, or when membership type changes, or copy from Home Email
	if (!isUserForm) {
		// Set default on page load, if required. (Should always default blank anyway.)
		setDefaultBillingEmail();
		
		// Set default when membership type changes, if required
		$("select.lalg-memb-membership-type").change(function(){
			setDefaultBillingEmail(); 
		});
		
		// Set default when Home Email changes, if required 
		$("input.lalg-memb-email").blur(function(){
			setDefaultBillingEmail();
		});
	}
	
	function setDefaultBillingEmail() {
		// If Membership Type is set and Home Email is blank
// console.log('setDefaultBillingEmail');
		if ($("select.lalg-memb-membership-type").val() && !$("input.lalg-memb-email").val()) {
			$("input.lalg-memb-billing-email").val('membership@lalg.org.uk');			
		}
		else {
			$("input.lalg-memb-billing-email").val('');
		}
	}
	
//**********************  Default Household Name for new Contact  **************************	
	// On Page Load
	if(!$("input.lalg-memb-hhname").val() && $("input.lalg-memb-lastname").val()) {
		$("input.lalg-memb-hhname").val($("input.lalg-memb-lastname").val() + ' Household');
	}
	// And on editing Last Name
	$("input.lalg-memb-lastname").blur(function(){
		if(!$("input.lalg-memb-hhname").val()) {
//console.log('Last Name: ' + $(this).val());			
			$("input.lalg-memb-hhname").val($(this).val() + ' Household');
		}
	});	
	
//**********************  Capitalise Postcode field (on changes)  ****************************
 
	$("input.lalg-memb-postcode").blur(function(){
	  // Capitalise it, and remove blank space
	    $(this).val( $(this).val().toUpperCase() );
		$(this).val($(this).val().trim());
		$(this).val($(this).val().replace("   ", " "));
		$(this).val($(this).val().replace("  ", " "));	  
	  
	  // And copy to the Dedupe Key field (Admin form only)
	  $("input.lalg-memb-ddkey").val($(this).val());
	});	

//**********************  Free Membership (or any zero payment)  *************************
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
	
//************  Hide/Show the Card-Prompt help field on Payment page  ************
// Hide on first loading - if Admin page
	if (!isUserForm) {
		$("div.lalg-memb-card-prompt").hide();
	}
	
	$('input[name="civicrm_1_contribution_1_contribution_payment_processor_id"]').change(function(){
//		console.log($(this).val());
		var ppid = $(this).val();
		if (ppid >= 9 && ppid <= 12) {
			$("div.lalg-memb-card-prompt").show();
		}
		else {
			$("div.lalg-memb-card-prompt").hide();		
		}
	}); 

	
//****************  Hide/Show the Wait-Prompt field on the Payment Page  ****************
// Hide on first loading
	$("div.lalg-memb-wait-prompt").hide();
	
// Show when Submit button clicked
	$("input.webform-button--submit").click( function() {
		$("div.lalg-memb-wait-prompt").show();
	});


});				// End Document Ready
})(jQuery);		// ******************* Close the $ reversion	

