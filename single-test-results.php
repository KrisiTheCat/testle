<?php
/**
 * The Template for displaying all single WPKoi events.
 *
 */

?>

<script>
	window.openedTab = 'results';
</script>
<div id="results">
	<div id="pleaseWait">
		<h4>We are still checking your entry. Please wait.</h4>
	</div>
	<div id="actualResults">
		<p id="attendeeIDp" class="invisible"><?php echo json_encode(get_current_user_id());?></p>
		<h4>Your results:</h4>
		<div id="summaryDiv">
			<div class="moduleSummery">
				<label><b>General</b> score</label>
				<div class="checkTd">
					<div class="progress" style="flex:1">
						<div class="progress-bar correctAnswers" role="progressbar" style="width: 0%" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
						<div class="progress-bar wrongAnswers" role="progressbar" style="width: 0%" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
						<div class="progress-bar notfilledAnswers" role="progressbar" style="width: 0%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
						<div class="progress-bar toCheckAnswers" role="progressbar" style="width: 0%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
					</div>
				</div>
				<div class="checkTd scoreTd">
					<p class="pointsField-1_-1_-1_-1">65/100</p>
				</div>
			</div>
		</div>
	</div>
</div>
