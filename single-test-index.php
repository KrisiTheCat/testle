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
				<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/iconStatus1.png" class=""></img>
			</div>
			<p>Describe all the tasks in the test and assign the correct answers to them</p>
			<p class="additionalData"></p>
			<a class="taskLink" href="base">fix here</a>
		</div>
		<div class="taskDiv" id="uploadTask">
			<div>
				<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/iconStatus1.png" class=""></img>
			</div>
			<p>Upload PDF file with the answer sheet</p>
			<p class="additionalData"></p>
			<a class="taskLink" href="form">fix here</a>
		</div>
		<div class="taskDiv" id="questionSectorsTask">
			<div>
				<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/iconStatus1.png" class=""></img>
			</div>
			<p>Show the areas where the questions are located on the answer sheet</p>
			<p class="additionalData"></p>
			<a class="taskLink" href="form">fix here</a>
		</div>
		<div class="taskDiv" id="listStudentsTask">
			<div>
				<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/iconStatus1.png" class=""></img>
			</div>
			<p>List all the students taking this test</p>
			<p class="additionalData"></p>
			<a class="taskLink" href="attendees">fix here</a>
		</div>
		<div class="taskDiv" id="noPhotoTask">
			<div>
				<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/iconStatus1.png" class=""></img>
			</div>
			<p>Upload images of all the students answer sheets</p>
			<p class="additionalData"></p>
			<a class="taskLink" href="attendees">fix here</a>
		</div>
		<div class="taskDiv" id="handCheckTask">
			<div>
				<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/iconStatus1.png" class=""></img>
			</div>
			<p>Hand check the questions, that the computer cannot do alone</p>
			<p class="additionalData"></p>
			<a class="taskLink" href="handcheck">fix here</a>
		</div>
		<div class="taskDiv impossibleTask" id="sendResultsTask" title="Please check all entries first">
			<div>
				<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/iconStatus1.png" class=""></img>
			</div>
			<p>Allow students to see their results</p>
			<div class="toggleResp">
				<input type="checkbox" id="sendResultsSwitch" disabled/>
				<label for="sendResultsSwitch">Toggle</label>
			</div>
		</div>
	</div>
</div>
