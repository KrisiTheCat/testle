<?php
/**
 * The Template for displaying all single WPKoi events.
 *
 */
?>

<script>
	window.openedTab = 'attendees';
</script>
<div id="attendees">

	<div id="popupFormUsers" class="modal fade" tabindex="-1" role="dialog">
		<div class="modal-dialog" role="document" style="margin: 3rem auto;">
			<div class="modal-content">
				<div class="modal-header border-0">
					<p><b>Attendees</b> list:</p>
					<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/closeD.png" class="closeButton"></img>
				</div>
				<div class="modal-body" style="padding-top: 0px !important;">
					<form  accept-charset="UTF-8" action="" method="POST" enctype="multipart/form-data" class="formContainer">
						<input type="text" class="invisible" name="postID" value='<?php echo get_the_ID();?>' readonly/>
						<input type="text" id="searchUserOption" class="lightGradientBackground" placeholder="Search"/>
						<div style="margin: 9px 0px 16px 0px;">
							<label for="selectGroupFilter" style="color: black;">Show only:</label>
							<select id="selectGroupFilter" class="lightGradientBackground">
							</select>
							<span class="focus"></span>
						</div>
						<div id="attendeeChoiceDiv"></div>
						<input type="submit" name="submitUserAttendees" value="Save" />
					</form>
				</div>
			</div>
		</div>
	</div>
	<p class="noSuchText" style="display: none">No such students</p>
	<div class="attendeesTable">
		<table class="data-table">
			<thead>
				<tr>
					<th style="width:100%"><button id="name">Name</button></th>
					<th><button id="status">Status</button></th>
					<th><button id="result">Result</button></th>
					<th><button id="actions">Actions</button></th>
				</tr>
			</thead>
		<tbody id="table-content"></tbody>
	</table>
	</div>
	<div class="userCheckedPopup">
		<div class="formPopup" id="userCheckedForm">
			<div class="formContainer">
				<h3>Deleting checked attendee</h3>
				<label>The results from this attendee have already been <strong>checked</strong>. Are you sure you wish to delete him/her?</label>
				<button id="yesUserCheckedButton">Yes</button>
				<button id="cancelUserCheckedButton">Cancel</button>
			</div>
		</div>
	</div>
	<button id="newAttendeeBtn" class="elegantBtn"><b>Edit</b> attendee list</button>
	<button id="exportAttBtn" class="elegantBtn"  download="file.xml"><b>Export</b></button>
</div>
