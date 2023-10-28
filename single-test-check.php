<?php
/**
 * The template for displaying check page of single test
 */
?>

<script>
	window.openedTab = 'check';
</script>
 <div id="check">
	<div id="hoverPopupPhoto">
		<canvas id = "hoverPopupPhotoCanvas"></canvas>
	</div>
	<div style="display: flex; gap:10px">
		<label id="attendeeNameLbl" for="attendeeName">Response of </label>
		<input type="text" id="attendeeName" value="Unknown" readonly/>
		<button class="btn btn-danger" id="resetBtn">Reset</button>
	</div>
	<div id="imageUploadPopupDiv" class="modal fade" tabindex="-1" role="dialog">
		<div class="modal-dialog  modal-lg" role="document" style="margin: 3rem auto;">
			<div class="modal-content" style="height: -webkit-fill-available;">
				<div class="modal-header border-0" style="flex-direction: column">
					<h5>Uploading attendee answer</h5>
					<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/iconStatus0.png" class="closeButton" id="imageUploadCloseBtn"></img>
					<div class="progressStepsHeader" style="width: 100%;">
						<div style="padding: 0px 23px;">
							<div class="step finishedStep">
								<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/tick.png"></img>
								<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/dot.png"></img>
								<div class="dotImage"></div>
							</div>
							<div class="line"></div>
							<div class="step">
								<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/tick.png"></img>
								<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/dot.png"></img>
								<div class="dotImage"></div>
							</div>
							<div class="line"></div>
							<div class="step">
								<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/tick.png"></img>
								<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/dot.png"></img>
								<div class="dotImage"></div>
							</div>
						</div>
						<div>
							<p>Upload image</p>
							<p>Point edges</p>
							<p>Cut page</p>
						</div>
					</div>
				</div>
				<div class="modal-body">
					<div id="photoUploadStage1" style="display:none">
						<div id="backgroundImageStage1">
							<div id="dropArea" class="center step1Overlay">
								<div>
									<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/photo.png" width="40px"/>
									<p>Drag your photo<br>here to continue</p>
									<div class="orLines">
										<div class="line"></div>
										<p>OR</p>
										<div class="line"></div>
									</div>
									<button id="uploadImageAtt" class="elegantBtn">Upload</button>
								</div>
							</div>
						</div>
						<input type="file" class="invisible" accept="application/jpg/jpeg/png" id="uploadImageInput"/>
					</div>
					<div id="photoUploadStage2" style="display:none">
						<div>
							<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/edge.png" class="edgePoint" data-id="0"></img>
							<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/edge.png" class="edgePoint" data-id="1"></img>
							<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/edge.png" class="edgePoint" data-id="2"></img>
							<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/edge.png" class="edgePoint" data-id="3"></img>
						</div>
						<img id="uploadImageImg" height="3000px"></img>
						<p style="padding-left: 16px;    font-size: 14px;">Please drag the targets so that they point to the four black rectangles located in the corners of the sheet.</p>
						<p id="cutPage" class="elegantBtn">Submit</p>
					</div>
				</div>
			</div>
		</div>
	</div>
	<input type="text" class="invisible" name="postID" value='<?php echo get_the_ID();?>' readonly/>
	<input type="text" class="invisible" id="attendeeIdInput" name="attendeeID" value='-1' readonly/>
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
	<div id="photosDiv">

	</div>
	<input type="file" class="invisible" accept="application/pdf" id="uploadImagesPDFInput"/>
	<p id="uploadPhotosPdf">Upload pages as PDF</p>
	<div id="fullDiv">
		<div class="statusDivCopy invisible">
			<div class="statusDiv">
				<img class="statusIcon wrongStatusIcon statusIconDis" src="<?php echo get_stylesheet_directory_uri(); ?>/img/iconStatus0.png" />
				<img class="statusIcon correctStatusIcon statusIconDis" src="<?php echo get_stylesheet_directory_uri(); ?>/img/iconStatus1.png" />
				<img class="statusIcon notfilledStatusIcon" src="<?php echo get_stylesheet_directory_uri(); ?>/img/iconStatus2.png" />
				<img class="statusIcon tocheckStatusIcon statusIconDis" src="<?php echo get_stylesheet_directory_uri(); ?>/img/iconStatus3.png" />
			</div>
		</div>
		<div id="allModuleChDiv"></div>
	</div>
</div>