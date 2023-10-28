<?php
/**
 * The template for displaying summary of single test
 */
?>

<script>
	window.openedTab = 'summary';
</script>
<div id="summary">
<div id="dublicatePostModal" class="modal fade" tabindex="-1" role="dialog">
		<div class="modal-dialog  modal-lg" role="document" style="margin: 3rem auto;">
			<div class="modal-content" style="height: -webkit-fill-available;">
				<div class="modal-header border-0" style="border-bottom: #00000033 1px solid;">
					<h5 style="margin: 0px">Dublicating test</h5>
				</div>
				<div class="modal-body">
					<small for="dublicatePostSelect" style="color: black;">Origin post:</small>
					<select id="dublicatePostSelect" class="lightGradientBackground" style="margin-bottom: 8px"></select>
				</div>
				
				<div class="modal-footer justify-content-right">
					<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
					<button type="button" class="btn btn-info" id="dublicateTestConfirm">Dublicate</button>
				</div>
			</div>
		</div>
	</div>
	<h4>Editors:</h4>
	<ul id="editorsList">
	</ul>
	<h4>Tasks:</h4>
	<div id="allTasks">
		<div class="taskDiv lightBox" id="describeTasks">
			<div>
				<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/tasks/describe.png"/>
			</div>
			<div>
				<p>Describe all the tasks in the test and assign the correct answers to them</p>
				<div>
					<p class="additionalData"></p>
					<a class="taskLink" href="base">Fix <b>here</b></a>
				</div>
			</div>
		</div>
		<div class="taskDiv lightBox" id="uploadTask">
			<div>
				<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/tasks/uploadPdf.png"/>
			</div>
			<div>
				<p>Upload PDF file with the answer sheet</p>
				<div>
					<p class="additionalData"></p>
					<a class="taskLink" href="form">Fix <b>here</b></a>
				</div>
			</div>
		</div>
		<div class="taskDiv lightBox" id="questionSectorsTask">
			<div>
				<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/tasks/magnifier.png"/>
			</div>
			<div>
				<p>Show the areas where the questions are located on the answer sheet</p>
				<div>
					<div style="flex:1">
						<p class="additionalData"></p>
						<div class="progress">
							<div class="progress-bar" role="progressbar" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
						</div>
					</div>
					<a class="taskLink" href="form">Fix <b>here</b></a>
				</div>
			</div>
		</div>
		<div class="taskDiv lightBox" id="listStudentsTask">
			<div>
				<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/tasks/student.png"/>
			</div>
			<div>
				<p>List all the students taking this test</p>
				<div>
					<p class="additionalData"></p>
					<a class="taskLink" href="attendees">Fix <b>here</b></a>
				</div>
			</div>
		</div>
		<div class="taskDiv lightBox" id="noPhotoTask">
			<div>
				<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/tasks/uploadPhoto.png"/>
			</div>
			<div>
				<p>Upload images of all the students answer sheets</p>
				<div>
					<div style="flex:1">
						<p class="additionalData"></p>
						<div class="progress">
							<div class="progress-bar" role="progressbar" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
						</div>
					</div>
					<a class="taskLink" href="attendees">Fix <b>here</b></a>
				</div>
			</div>
		</div>
		<div class="taskDiv lightBox" id="handCheckTask">
			<div>
				<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/tasks/handcheck.png"/>
			</div>
			<div>
				<p>Check student work that the computer cannot do automatically</p>
				<div>
					<div style="flex:1">
						<p class="additionalData"></p>
						<div class="progress">
							<div class="progress-bar" role="progressbar" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
						</div>
					</div>
					<a class="taskLink" href="handcheck">Fix <b>here</b></a>
				</div>
			</div>
		</div>
		<div class="taskDiv lightBox impossibleTask" id="sendResultsTask" title="Please check all entries first">
			<p>Allow students to see their results</p>
			<div class="toggleResp">
				<p>OFF</p>
				<input type="checkbox" id="sendResultsSwitch" disabled/>
				<label for="sendResultsSwitch">Toggle</label>
				<p>ON</p>
			</div>
		</div>
	</div>
	<button id="dublicateFromTest">Dublicate from test</button>
</div>
