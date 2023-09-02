<?php
/**
 * The template for displaying summary of single test
 */
?>

<script>
	window.openedTab = 'summary';
</script>
<div id="summary">
	<h4>Editors:</h4>
	<ul id="editorsList">
		<li><input type="text" id="newEditorInput"/></li>
	</ul>
	<h4>Tasks:</h4>
	<div id="allTasks">
		<div class="taskDiv" id="describeTasks">
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
		<div class="taskDiv" id="uploadTask">
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
		<div class="taskDiv" id="questionSectorsTask">
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
		<div class="taskDiv" id="listStudentsTask">
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
		<div class="taskDiv" id="noPhotoTask">
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
		<div class="taskDiv" id="handCheckTask">
			<div>
				<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/tasks/handcheck.png"/>
			</div>
			<div>
				<p>Hand check the questions, that the computer cannot do alone</p>
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
		<div class="taskDiv impossibleTask" id="sendResultsTask" title="Please check all entries first">
			<p>Allow students to see their results</p>
			<div class="toggleResp">
				<p>OFF</p>
				<input type="checkbox" id="sendResultsSwitch" disabled/>
				<label for="sendResultsSwitch">Toggle</label>
				<p>ON</p>
			</div>
		</div>
	</div>
</div>
