<?php
/**
 * The template for displaying summary of single test
 */
?>

<script>
	window.openedTab = 'stats';
</script>
<h3 id="statsNoStud" class="invisible">No students to analyze</h3>
<div id="stats">
	<div id="sourcePanel" class="ui form">
		<span class="ui inline fields">
			<div class="field">
				<label for="statsGroup">Analysed group</label></br>
				<select name="statsGroup" id="statsGroup"></select>
			</div>
    		<div class="field">
				<label for="statsModules">Analysed tasks</label></br>
				<select name="statsModules" id="statsModules"></select>
			</div>
		</span>
	</div>
	<div class="hotizontalFlex" id="topLeftStats">
		<div class="lightBox statsBox " id="allStudentsStats">
			<p>All students results:</p>
			<div class="lightBox"  id="allAttendeesResults"></div>
		</div>
		<div id="statsSummary">
			<div class="statsSummaryBox">
				<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/tasks/people.png"/>
				<p></p>
				<p></p>
				<p>students</p>
			</div>
			<div class="statsSummaryBox">
				<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/tasks/stats.png"/>
				<p>67</p>
				<p>of 100</p>
				<p>average score</p>
			</div>
			<div id="percentPassed">
				<h4></h4>
				<p>above the required limit (60%)</p>
			</div>
		</div>
	</div>
	<div class="lightBox" style="padding-top: 160px;">
		<div class="lightBox statsBox rankingStats">
			<p>Top scores:</p>
			<table>
				<tbody></tbody>
			</table>
		</div>
		<div class="lightBox statsBox rankingStats">
			<p>Bottom scores:</p>
			<table>
				<tbody></tbody>
			</table>
		</div>
	</div>
	
	<div class="lightBox statsBox specialQuestions">
		<div class="lightBox questionGeneral statsBox" style="    height: 256px;">
			<p>From all given answers:</p>
			<div></div>
		</div>
		<div id="easiestQuestion" class="lightBox">
			<div></div>
			<div>
				<p class="correctAnswersText">17B</p>
				<p>was too</p>
				<p>easy</p>
				<span></span>
				<p>18 of 20 correct</p>
			</div>
		</div>
		<div id="hardestQuestion" class="lightBox">
			<div></div>
			<div>
				<p class="wrongAnswersText">17B</p>
				<p>was too</p>
				<p>hard</p>
				<span></span>
				<p>18 of 20 correct</p>
			</div>
		</div>
		<div id="skippedQuestion" class="lightBox">
			<div></div>
			<div>
				<p class="notfilledAnswersText">17B</p>
				<p>left them</p>
				<p>speechless</p>
				<span></span>
				<p>18 of 20 correct</p>
			</div>
		</div>
		<div id="allQuestionsStats" class="lightBox statsBox">
			<p>Details about each question</p>
			<table class="data-table sortableTable">
				<thead>
					<tr>
						<th width="110px"><button id="code">Question</button></th>
						<th style="flex:1"><button id="stats">Stats</button></th>
						<th width="110px"><button id="right">Correct</button></th>
						<th width="110px"><button id="wrong">Wrong</button></th>
						<th width="110px"><button id="empty">Not filled</button></th>
					</tr>
				</thead>
				<tbody id="questions-table-content"></tbody>
			</table>
		</div>
	</div>
</div>
