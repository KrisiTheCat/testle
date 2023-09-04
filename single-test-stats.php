<?php
/**
 * The template for displaying summary of single test
 */
?>

<script>
	window.openedTab = 'stats';
</script>
<div id="stats">
	<span>
		<small for="statsGroup">Based on the results of</small> 
		<select name="statsGroup" id="statsGroup"> 
			<option value="rigatoni">Rigatoni</option> 
			<option value="dave">Dave</option> 
			<option value="pumpernickel">Pumpernickel</option> 
			<option value="reeses">Reeses</option> 
		</select>
		<small for="statsModules"> for </small> 
		<select name="statsModules" id="statsModules"> 
			<option value="rigatoni">Rigatoni</option> 
			<option value="dave">Dave</option> 
			<option value="pumpernickel">Pumpernickel</option> 
			<option value="reeses">Reeses</option> 
		</select>
	</span>
	<div class="hotizontalFlex" id="topLeftStats">
		<div class="lightBox statsBox">
			<p>General information</p>
			<div class="lightBox">
				<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/tasks/apple.png"/>
				<div class="statsGeneralBox">
					<p>182</p>
					<small>students</small>
					<a class="taskLink" href="../attendees">Learn more</a>
				</div>
			</div>
			<div class="lightBox">
				<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/tasks/result.png"/>
				<div class="statsGeneralBox">
					<p>67</p>
					<small>average score</small>
					<a class="taskLink" href="../attendees">Learn more</a>
				</div>
			</div>
		</div>
		<div class="lightBox statsBox questionGeneral">
			<p>Question status</p>
			<canvas id="doughnutWCN"></canvas>
		</div>
	</div>
	<div class="lightBox statsBox specialQuestions">
		<p>The question, that...</p>
		<div class="lightBox statsBox">
			<p>... was too easy</p>
			<div>
				<p>17B</p>
				<p>in module 1</p>
			</div>
			<canvas id="easiestQuestion"></canvas>
		</div>
		<div class="lightBox statsBox">
			<p>... was too hard</p>
			<div>
				<p>17B</p>
				<p>in module 1</p>
			</div>
			<canvas id="hardestQuestion"></canvas>
		</div>
		<div class="lightBox statsBox">
			<p>... left them speechless</p>
			<div>
				<p>17B</p>
				<p>in module 1</p>
			</div>
			<canvas id="skippedQuestion"></canvas>
		</div>
	</div>
</div>
