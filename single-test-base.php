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
	<div id="youSureBaseDelete" class="modal fade beautifulModal ">
		<div class="modal-dialog modal-confirm">
			<div class="modal-content">
				<div class="modal-header flex-column">
					<div class="icon-box">
						<i class="material-icons">X</i>
					</div>						
					<h4 class="modal-title w-100">Are you sure?</h4>	
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				</div>
				<div class="modal-body">
					<p>Do you really want to delete this response? Each of their checked tasks will also be deleted. This process cannot be undone.</p>
				</div>
				<div class="modal-footer justify-content-center">
					<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
					<button type="button" class="btn btn-danger" id="deleteBaseConfirm">Delete</button>
				</div>
			</div>
		</div>
	</div>   

	<div id="copyModule" class="moduleDiv invisible">
		<div style="display:flex; align-items: center;">
			<p class="moduleID"><b>Module</b>#KrISI</p>
			<div style="flex:1"></div>
			<img class="showHideTable showModuleButton" data-showed="1" src="<?php echo get_stylesheet_directory_uri(); ?>/img/arrowUp.png"/>
			<img class="deleteModule deleteButton" data-moduleid="KrIsI" src="<?php echo get_stylesheet_directory_uri(); ?>/img/iconStatus0.png"/>
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
						<input type="number" min="0.5" step="0.5" step="0.5" class="points" title="Points" name="pointsKrIsI[]" value="1"/>
					</td>
					<td class="buttonTD"><img class="deleteButton" src="<?php echo get_stylesheet_directory_uri(); ?>/img/iconStatus0.png"/></td>
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
						<input type="number" min="0.5" step="0.5" class="points" title="Points" required="required" name="pointsKrIsI[]" value="1"/></td>
					<td class="buttonTD"><img class="deleteButton" src="<?php echo get_stylesheet_directory_uri(); ?>/img/iconStatus0.png"/></td>
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
									<input type="number" min="0.5" step="0.5" class="points" title="Points" name="pointsKrIsI[]" value="1" readonly/></td>
								</td>
								<td class="buttonTD"><img class="deleteButton" src="<?php echo get_stylesheet_directory_uri(); ?>/img/iconStatus0.png"/></td>
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
													<input type="number" min="0.5" step="0.5" class="points pointsCheck" title="Points" name="pointsKrIsI[]" value="1"/></td>
												</td>
												<td class="buttonTD"><img class="deleteButton" src="<?php echo get_stylesheet_directory_uri(); ?>/img/iconStatus0.png"/></td>
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
									<input type="number" min="0.5" step="0.5" class="points" title="Points" name="pointsKrIsI[]" value="1" readonly/></td>
								</td>
								<td class="buttonTD"><img class="deleteButton" src="<?php echo get_stylesheet_directory_uri(); ?>/img/iconStatus0.png"/></td>
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
