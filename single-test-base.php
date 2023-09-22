<?php
/**
 * The Template for displaying all single WPKoi events.
 *
 */
?>

<script>
	window.openedTab = 'modules';
</script>
<div id="base">
	<div class="loginPopup">
		<div class="formPopup" id="popupForm">
			<h3 style="margin: 0px 0px 20px 0px;">You sure?</h3>
			<label style="display: block; margin-bottom: 21px;">Are you sure you want to delete this item?</label>
			<button id="yesYouSureButton">Yes</button>
			<button id="noYouSureButton">Cancel</button>
		</div>
	</div>

	<div id="copyModule" class="moduleDiv invisible">
		<div style="display:flex; align-items: center;">
			<p class="moduleID"><b>Module</b>#KrISI</p>
			<div style="flex:1"></div>
			<img class="showHideTable showModuleButton" data-showed="1" src="<?php echo get_stylesheet_directory_uri(); ?>/img/arrowUp.png"/>
			<img class="deleteModule deleteButton" data-moduleid="KrIsI" src="<?php echo get_stylesheet_directory_uri(); ?>/img/closeD.png"/>
		</div>
		<table class = "questionTable" data-moduleid="KrIsI">
			<tbody>
				<tr class="invisible">
					<th style="min-width: 100px;">ID</th>
					<th width="100%">Answer</th>
					<th style="min-width: 75px;">Points</th>
					<th style="min-width: 45px;">Del</th>
				</tr>
				<tr class="question closedQuestion questionOrCheck invisible">
					<td class="idTypeTD">
						<div class="square">
							<p class="idTD questionID">0</p>
							<p class="typeTD">closed</p>
						</div>
					</td>
					<td class="answerTD answerBox">
						<div class="radioAnswers">
							<div class="radio radioA" data-answer="A">
								<p class="closedAnswerLetter">A</p>
							</div>
							<div class="radio radioB" data-answer="B">
								<p class="closedAnswerLetter">B</p>
							</div>
							<div class="radio radioC" data-answer="C">
								<p class="closedAnswerLetter">C</p>
							</div>
							<div class="radio radioD" data-answer="D">
								<p class="closedAnswerLetter">D</p>
							</div>
						</div>
					</td>
					<td class="pointsTD">
						<input type="number" min="0.5" step="0.5" step="0.5" class="points" name="pointsKrIsI[]" value="1"/>
					</td>
					<td class="buttonTD"><img class="deleteButton" src="<?php echo get_stylesheet_directory_uri(); ?>/img/closeD.png"/></td>
				</tr>
				<tr class="question openedQuestion questionOrCheck invisible">
					<td class="idTypeTD">
						<div class="square">
							<p class="idTD questionID">0</p>
							<p class="typeTD">opened</p>
						</div>
					</td>
					<td class="answerTD">
						<div class="openedAnswerBox">
						<input type="text" class="openedAnswer" name="answerKrIsI[]" value=""/>
						</div>
					</td>
					<td class="pointsTD">
						<input type="number" min="0.5" step="0.5" class="points" required="required" name="pointsKrIsI[]" value="1"/></td>
					<td class="buttonTD"><img class="deleteButton" src="<?php echo get_stylesheet_directory_uri(); ?>/img/closeD.png"/></td>
				</tr>
				<tr class="question descriptiveQuestion questionOrCheck invisible" rowsp>
					<td class="idTypeTD">
						<div class="square">
							<p class="idTD questionID">0</p>
							<p class="typeTD">descriptive</p>
						</div>
					</td>
					<td colspan = "3" class="nopadding" style="background-color: white;">
						<table>
							<tr>
								<td class="answerTD" width="100%">
									<div class="descriptiveAnswerBox">
										<p class="addSubQP">Add check: </p>
										<a class="addCheck buttonLook">+</a>
										<div style="flex: 1;"></div>
										<img class="showHideTable showDescrButton" data-showed="1" src="<?php echo get_stylesheet_directory_uri(); ?>/img/arrowUp.png"/>
									</div>
								</td>
								<td class="pointsTD">
									<input type="number" min="0.5" step="0.5" class="points" name="pointsKrIsI[]" value="1" readonly/></td>
								</td>
								<td class="buttonTD"><img class="deleteButton" src="<?php echo get_stylesheet_directory_uri(); ?>/img/closeD.png"/></td>
							</tr>
							<tr>
								<td colspan = "4" style="padding: 0px;">
									<table class="descriptiveTable">
										<tbody>
											<tr class = "check questionOrCheck">
												<td class="answerTD">
													<input type="text" class="conditionCheck" value="Вярно разкрити скоби" name='answerKrIsI[]'/>
												</td>
												<td class="pointsTD">
													<input type="number" min="0.5" step="0.5" class="points pointsCheck" name="pointsKrIsI[]" value="1"/></td>
												</td>
												<td class="buttonTD"><img class="deleteButton" src="<?php echo get_stylesheet_directory_uri(); ?>/img/closeD.png"/></td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</table>
					</td>
				</tr>
				<tr class="question compositeQuestion questionOrCheck invisible">
					<td colspan = "5">
						<table>
							<tr>
								<td class="idTypeTD">
									<div class="square">
										<p class="idTD questionID">0</p>
										<p class="typeTD">composite</p>
									</div>
								</td>
								<td class="spaceTD"></td>
								<td class="answerTD">
									<div class="descriptiveAnswerBox">
										<div class="addQuestionDiv">
											<h4 class="addSubQP">Add subquestion: </h4>
											<a class="addSubQButton addOpened buttonLook">Opened</a>
											<a class="addSubQButton addClosed buttonLook">Closed</a>
											<a class="addSubQButton addDesciptive buttonLook">Descriptive</a>
											<img class="showHideTable showSubQButton" data-showed="1" src="<?php echo get_stylesheet_directory_uri(); ?>/img/arrowUp.png"/>
										<div>
									</div>
								</td>
								<td class="pointsTD">
									<input type="number" min="0.5" step="0.5" class="points" name="pointsKrIsI[]" value="1" readonly/></td>
								</td>
								<td class="buttonTD"><img class="deleteButton" src="<?php echo get_stylesheet_directory_uri(); ?>/img/closeD.png"/></td>
							</tr>
							<tr>
								<td colspan = "1"></td>
								<td class="spaceTD"></td>
								<td colspan = "3" class="compositeTDTable">
								<table class="compositeTable">
									<tbody>
									</tbody>
								</table>
								</td>
							</tr>
						</table>
					</td>
				</tr>
				<tr class="lastTr">
					<td colspan='5'>
						<div class="addQuestionDiv">
							<h4 class="addSubQP">Add question: </h4>
							<a class="addQuestionButton addOpened buttonLook">Opened</a>
							<a class="addQuestionButton addClosed buttonLook">Closed</a>
							<a class="addQuestionButton addDesciptive buttonLook">Descriptive</a>
							<a class="addQuestionButton addComposite buttonLook">Composite</a>
						<div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
	<div id="allModulesDiv">
	</div>
	<a class="addModule buttonLook">New Module</a>
</div>
