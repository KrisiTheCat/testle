<?php
/**
 * The Template for displaying all single WPKoi events.
 *
 */

?>

<script>
	window.openedTab = 'handcheck';
</script>
<div id="handcheck">
	<div id="toBeCheckedPopup" class="modal fade" tabindex="-1" role="dialog">
		<div class="modal-dialog " role="document" style="margin: 3rem auto;">
			<div class="modal-content">
			<div class="modal-header border-0" style="flex-direction: column">
				<div style="display: flex; width:100%">
					<div style="flex:1">
						<p id="handCheckingTitle">Checking</p>
						<p id="handCheckingQuesID">#</p>
						
					</div>
					<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/closeD.png" class="closeButton" id="handCheckCloseBtn"></img>
				</div>
				<div style="display: flex; width:100%">
					<div id="handCheckDescrButtons"  style="flex:1">
						<img class="handCheckArrow" data-direction="left" style="left:5%" src="<?php echo get_stylesheet_directory_uri(); ?>/img/arrowLeft.png"/>
						<p class="handCheckAttP">Response of:</p>
						<img class="handCheckArrow" data-direction="right" style="right:5%" src="<?php echo get_stylesheet_directory_uri(); ?>/img/arrowRight.png"/>
					</div>
					<p id="handCheckingCorrect">correct answer: </p>
				</div>
			</div>
			<div class="modal-body" style="padding-top: 0px !important;">
				<img id="handCheckAttendeePage" style="display:none"/>
				<div class="handCheckOpened">
					<div class="draggable-div" draggable="true">
						<canvas id="handCheckOpenAttCanvas" height="0"></canvas>
					</div>
					<div class="basketsDiv">
						<div class="basketAnswerType" id="basket0">
							<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/bucket0.png"/>
						</div>
						<div class="basketAnswerType" id="basket1">
							<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/bucket1.png"/>
						</div>
						<div class="basketAnswerType" id="basket2">
							<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/bucket2.png"/>
						</div>
					</div>
				</div>
				<div class="handCheckDescr">
					<div style="position: relative;">
						<div style="width:100%">
							<canvas id="handCheckDescrAttCanvas" height="0"></canvas>
						</div>
						<div id="handCheckDescrPointsDiv">
							<p id="handCheckDescrPText">Points:</p>
							<p id="handCheckDescrPoints">0</p>
						</div>
						<div id="handCheckDescrChecks">

						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button id="handCheckDescrNotFilled">Skip</button>
				<button id="handCheckDescrReady">Ready</button>
			</div>
			</div>
		</div>
	</div>
	<p class="dashboardP">Left to check:</p>
	<p class="handCheckTitle">Opened questions</p>
	<div id="handCheckOpenedDashboard">

	</div>
	<p class="handCheckTitle">Descriptive questions</p>
	<div id="handCheckDescrDashboard">

	</div>
</div>
							