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
	<div id="noPhotoGroup" class="attendeesGroup">
		<div class="groupHeader">
			<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/missingImage.png"/>
			<p>Students with missing scanned test pages:</p>
			<img class="showHideTable showAttendeesButton" data-showed="1" src="<?php echo get_stylesheet_directory_uri(); ?>/img/arrowUp.png"/>
		</div>
		<p class="noSuchText">No such students</p>
		<table class="testAttendeedDiv">
			<tbody>
				<tr>
					<th style="width:100%"></th>
					<th style="min-width:75px">Points</th>
					<th style="min-width:100px">Test</th>
				</tr>
			</tbody>
		</table>
	</div>
	<div id="notCheckedGroup" class="attendeesGroup">
		<div class="groupHeader">
			<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/notChecked.png"/>
			<p>Students with unchecked questions scanned test pages:</p>
			<img class="showHideTable showAttendeesButton" data-showed="1" src="<?php echo get_stylesheet_directory_uri(); ?>/img/arrowUp.png"/>
		</div>
		<p class="noSuchText">No such students</p>
		<table class="testAttendeedDiv">
			<tbody>
				<tr>
					<th style="width:100%"></th>
					<th style="min-width:75px">Points</th>
					<th style="min-width:100px">Test</th>
				</tr>
			</tbody>
		</table>
	</div>
	<div id="allFineGroup" class="attendeesGroup">
		<div class="groupHeader">
			<p>Students with finished checking:</p>
			<img class="showHideTable showAttendeesButton" data-showed="1" src="<?php echo get_stylesheet_directory_uri(); ?>/img/arrowUp.png"/>
		</div>
		<p class="noSuchText">No such students</p>
		<table class="testAttendeedDiv">
			<tbody>
				<tr>
					<th style="width:100%"></th>
					<th style="min-width:75px">Points</th>
					<th style="min-width:100px">Test</th>
				</tr>
			</tbody>
		</table>
	</div>
	<button id="newAttendeeBtn" class="elegantBtn"><b>Edit</b> attendee list</button>
	<button id="exportAttBtn" class="elegantBtn"  download="file.xml"><b>Export</b></button>
	<button id="sortNameBtn" class="elegantBtn"><b>Sort by name</b></button>
	<button id="sortPtsBtn" class="elegantBtn"><b>Sort by pts</b></button>
</div>
