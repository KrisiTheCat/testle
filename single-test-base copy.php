<?php
/**
 * The Template for displaying all single WPKoi events.
 *
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

get_header();
$current_fp = get_query_var('fpage'); ?>

	<div id="primary" class="content-area grid-parent mobile-grid-100 grid-100 tablet-grid-100 primary-single-test">
		<main id="main" <?php lalita_main_class(); ?>>
			<?php
			/*<img src="<?php echo wp_get_attachment_image_url(238); ?>"/>*/
			do_action( 'lalita_before_main_content' );
			while ( have_posts() ) : the_post();

				if(!is_user_logged_in()){
					?><script>
						window.userRole = 'notLogged';
					</script>
					<h2>Please enter your profile to see this page!</h2>
					<?php
				} else {
					$content = get_post_meta( get_the_ID(), 'content', true );
					$responses = get_post_meta( get_the_ID(), 'responses', true );
					$form = get_post_meta( get_the_ID(), 'form', true );
					$user_meta = get_userdata(get_current_user_id());
					$user_roles = $user_meta->roles;
					if(in_array("administrator", $user_roles) || in_array("teacher", $user_roles)){
						$users = get_users();
						$usersInfo = array();
						foreach ($users as $user) { 
							$user_id = $user->ID;
							$helper = array(
								"id"=>$user_id,
								"name"=>$user->display_name,
								"groups"=>explode(",", do_shortcode("[profilegrid_user_all_groups uid=" . $user_id . "]")),
								"roles"=>get_userdata($user_id)->roles);
							$usersInfo[$user_id] = $helper;
						}
						$pageInfo = get_post_meta( get_the_ID(), 'pageInfo', true );
						if($pageInfo == '')$pageInfo = array();
						for($i = 0; $i < count($pageInfo);$i++){
							$pageInfo[$i]['url'] = wp_get_attachment_url($pageInfo[$i]['attID']);
						}
						?>
						<h1>ATTENDEES</h1>		
						<script>
							window.userRole = 'editor';
							window.contentKrisi = '<?php echo json_encode($content);?>';
							window.formKrisi = '<?php echo json_encode($form);?>';
							window.srcPath = '<?php echo get_stylesheet_directory_uri(); ?>';
							window.pageInfo = '<?php echo json_encode($pageInfo);?>';
							window.usersKrisi = '<?php echo json_encode($usersInfo);?>';
							window.responsesKrisi = '<?php echo json_encode($responses);?>';
						</script>
						<canvas id="imageCanvas" width="1000" class="invisible"></canvas>
						<button type="button" id="nullBtn">Nullify</button>
						<div id="tabs">
							<ul id="tabUl" class="nav nav-tabs">
								<li class="nav-item"><a class="nav-link tabcont" href="#summary" title="">Summary</a></li>
								<li class="nav-item"><a class="nav-link tabcont" href="#attendees" title="">Attendees</a></li>
								<li class="nav-item"><a class="nav-link tabcont" href="#base" title="">Base information</a></li>
								<li class="nav-item"><a id="tabCheck" class="nav-link invisible tabcont" href="#check" title="">Check</a></li>
								<li class="nav-item"><a class="nav-link tabcont" href="#handCheck" title="">Hand checking</a></li>
								<li class="nav-item"><a class="nav-link tabcont" href="#form" title="">Form</a></li>
							</ul>
						
							<div id="summary" class="tabcontent">
								<div style="display: flex">
									<label id="attendeeNameLbl" for="attendeeName">Response of </label>
									<input type="text" id="attendeeName" value="Unknown" readonly/>
								</div>
								<h3>Tasks:</h3>
								<div id="allTasks">
									<div class="taskDiv" id="describeTasks">
										<div>
											<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/iconStatus1.png" class=""></img>
										</div>
										<p>Describe all the tasks in the test and assign the correct answers to them</p>
										<p class="additionalData"></p>
										<a class="taskLink" target="_self" href="#base">fix here</a>
									</div>
									<div class="taskDiv">
										<div>
											<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/iconStatus1.png" class=""></img>
										</div>
										<p>Input all data about the test (questions, answers)</p>
									</div>
								</div>
							</div>
							<div id="attendees" class="tabcontent">

								<div id="popupFormUsers" class="modal fade" tabindex="-1" role="dialog">
									<div class="modal-dialog" role="document" style="margin: 3rem auto;">
										<div class="modal-content">
											<div class="modal-header border-0">
												<p><b>Attendees</b> list:</p>
												<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/closeD.png" class="closeButton"></img>
											</div>
											<div class="modal-body" style="padding-top: 0px !important;">
												<form  accept-charset="UTF-8" action="" method="POST" enctype="multipart/form-data" class="formContainer">
													<input type="text" class="invisible" name="postID" value='<?php echo get_the_ID();?>' readonly/>
													<input type="text" id="searchUserOption" class="lightGradientBackground" placeholder="Search"/>
													<div style="margin: 9px 0px 16px 0px;">
														<label for="selectGroupFilter" style="color: black;">Show only:</label>
														<select id="selectGroupFilter" class="lightGradientBackground">
														</select>
														<span class="focus"></span>
													</div>
													<div id="attendeeChoiceDiv"></div>
													<input type="submit" name="submitUserAttendees" value="Save" />
												</form>
											</div>
										</div>
									</div>
								</div>
								<div class="userCheckedPopup">
									<div class="formPopup" id="userCheckedForm">
										<div class="formContainer">
											<h3>Deleting checked attendee</h3>
											<label>The results from this attendee have already been <strong>checked</strong>. Are you sure you wish to delete him/her?</label>
											<button id="yesUserCheckedButton">Yes</button>
											<button id="cancelUserCheckedButton">Cancel</button>
										</div>
									</div>
								</div>
								<div id="noPhotoGroup" class="attendeesGroup">
									<div class="groupHeader">
										<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/missingImage.png"/>
										<p>Students with missing scanned test pages:</p>
										<img class="showHideTable showAttendeesButton" data-showed="1" src="<?php echo get_stylesheet_directory_uri(); ?>/img/arrowUp.png"/>
									</div>
									<p class="noSuchText">No such students</p>
									<table class="testAttendeedDiv">
										<tbody>
											<tr>
												<th style="width:100%"></th>
												<th style="min-width:75px">Points</th>
												<th style="min-width:100px">Test</th>
											</tr>
										</tbody>
									</table>
								</div>
								<div id="notCheckedGroup" class="attendeesGroup">
									<div class="groupHeader">
										<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/notChecked.png"/>
										<p>Students with unchecked questions scanned test pages:</p>
										<img class="showHideTable showAttendeesButton" data-showed="1" src="<?php echo get_stylesheet_directory_uri(); ?>/img/arrowUp.png"/>
									</div>
									<p class="noSuchText">No such students</p>
									<table class="testAttendeedDiv">
										<tbody>
											<tr>
												<th style="width:100%"></th>
												<th style="min-width:75px">Points</th>
												<th style="min-width:100px">Test</th>
											</tr>
										</tbody>
									</table>
								</div>
								<div id="allFineGroup" class="attendeesGroup">
									<div class="groupHeader">
										<p>Students with finished checking:</p>
										<img class="showHideTable showAttendeesButton" data-showed="1" src="<?php echo get_stylesheet_directory_uri(); ?>/img/arrowUp.png"/>
									</div>
									<p class="noSuchText">No such students</p>
									<table class="testAttendeedDiv">
										<tbody>
											<tr>
												<th style="width:100%"></th>
												<th style="min-width:75px">Points</th>
												<th style="min-width:100px">Test</th>
											</tr>
										</tbody>
									</table>
								</div>
								<button id="newAttendeeBtn" class="elegantBtn"><b>Edit</b> attendee list</button>
								<button id="exportAttBtn" class="elegantBtn"  download="file.xml"><b>Export</b></button>
								<button id="sortNameBtn" class="elegantBtn"><b>Sort by name</b></button>
								<button id="sortPtsBtn" class="elegantBtn"><b>Sort by pts</b></button>
							</div>
							
							<input type="text" id="inputPostId" class="invisible" name="postID" value='<?php echo get_the_ID();?>' readonly/>
							
							<div id="base" class="tabcontent">
								<div class="loginPopup">
									<div class="formPopup" id="popupForm">
										<h3 style="margin: 0px 0px 20px 0px;">You sure?</h3>
										<label style="display: block; margin-bottom: 21px;">Are you sure you want to delete this item?</label>
										<button id="yesYouSureButton">Yes</button>
										<button id="noYouSureButton">Cancel</button>
									</div>
								</div>
								<div class="loginPopup">
									<div class="formPopup" id="popupEmptyOpForm">
										<h3 style="margin: 0px 0px 20px 0px;">Not allowed</h3>
										<label style="display: block; margin-bottom: 21px;">Leaving an opened question without an answer is not allowed.</label>
										<button id="closeEmptyOButton">Close</button>
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

							<div id="check" class="tabcontent">
								<div class="invisible">
									<canvas id="canvasCutQuest0"></canvas>
									<canvas id="canvasCutQuest1"></canvas>
									<canvas id="canvasCutQuest2"></canvas>
									<canvas id="canvasCutQuest3"></canvas>
									<canvas class="answerCanvas" id="diffrencesCanvas"></canvas>
								</div>
								<div id="hoverPopupDiff">
									<p style="font-size: small;">This sign shows that there is a diffrence the answer, saved for this question, and what was extracted from the photo</p>
									<p style="display: inline-block;">Saved answer:</p>
									<p style="display: inline-block;" id="hoverPopupDiffAns"></p>
								</div>
								<div id="hoverPopupPhoto">
									<canvas id = "hoverPopupPhotoCanvas"></canvas>
								</div>
								<div style="display: flex">
									<label id="attendeeNameLbl" for="attendeeName">Response of </label>
									<input type="text" id="attendeeName" value="Unknown" readonly/>
								</div>
								<div id="imageUploadPopupDiv" class="modal fade" tabindex="-1" role="dialog">
									<div class="modal-dialog  modal-lg" role="document" style="margin: 3rem auto; height: calc(100% - 6rem);">
										<div class="modal-content" style="height: -webkit-fill-available;">
											<div class="modal-header border-0" style="flex-direction: column">
												<h5>Uploading attendee photo</h5>
												<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/closeD.png" class="closeButton" id="imageUploadCloseBtn"></img>
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
													<div>
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
													<img id="uploadImageImg" height="300px"></img>
													<p class="cutPage elegantBtn">></p>
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
								<?php
								$moduleID = 0;
								foreach($content as $module){?>
									<div class="moduleSummery">
										<label><b>Module</b> #<?php echo ($moduleID+1);?></label>
										<div class="checkTd">
											<div class="progress" style="flex:1">
												<div class="progress-bar correctAnswers" role="progressbar" style="width: 0%" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
												<div class="progress-bar wrongAnswers" role="progressbar" style="width: 0%" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
												<div class="progress-bar notfilledAnswers" role="progressbar" style="width: 0%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
												<div class="progress-bar toCheckAnswers" role="progressbar" style="width: 0%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
											</div>
										</div>
										<div class="checkTd scoreTd">
											<p class="pointsField<?php echo $moduleID;?>_-1_-1_-1">65/100</p>
										</div>
									</div>
									<?php
									$moduleID++;
								}
								?>
								</div>
								<div id="photosDiv">

								</div>
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
								<div class = "notesBtn">
									<img class="arrowImg rotate180" src="<?php echo get_stylesheet_directory_uri(); ?>/img/arrow.png"/>
								</div>
								<textarea id = "notesTA" class="zeroHeight"></textarea>
							</div>

							<div id="handCheck" class="tabcontent">
								<div id="toBeCheckedPopup" class="modal fade" tabindex="-1" role="dialog">
									<div class="modal-dialog  modal-lg" role="document" style="margin: 3rem auto;">
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
														<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/box0.png"/>
													</div>
													<div class="basketAnswerType" id="basket1">
														<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/box1.png"/>
													</div>
													<div class="basketAnswerType" id="basket2">
														<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/box2.png"/>
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
								<p class="dashboardP">Dashboard</p>
								<p class="handCheckTitle">Opened questions</p>
								<div id="handCheckOpenedDashboard">

								</div>
								<p class="handCheckTitle">Descriptive questions</p>
								<div id="handCheckDescrDashboard">

								</div>
							</div>
							
							<div id="form" class="tabcontent">
								<div id="pdf-main-container" class="modal fade" tabindex="-1" role="dialog">
									<div class="modal-dialog  modal-lg" role="document" style="margin: 3rem auto;">
										<div class="modal-content">
											<div class="modal-header border-0" style="flex-direction: column">
												<h3>PDF page choosing</h3>
											</div>
											<div class="modal-body">
												<div id="pdf-loader">Loading document ...</div>
												<div id="pdf-contents">
													<p>Please pick which pages are the answers sheets:</p>
													<div id="canvasDiv" style="width:100%;"></div>
												</div>
												
											</div>
											<div class="modal-footer">
												<p id="atLeast1">Choose <b>at least</b> 1 page!</p>
												<div id="analysingLoader">
													<p style="flex:1; line-height:30px;"><strong>Analysing</strong> pages</p>
													<div class="smallLoader"></div>
												</div>
												<button id="formPdfPickedSave" class="disabledBtn">Save changes</button>
											</div>
										</div>
									</div>
								</div>
								<div id="formInfoSaveDelete" class="modal fade" tabindex="-1" role="dialog">
									<div class="modal-dialog  modal-lg" role="document" style="margin: 3rem auto;">
										<div class="modal-content">
											<div class="modal-header border-0" style="flex-direction: column">
												<h3>Do you wish to <b>delete</b> all form info?</h3>
											</div>
											<div class="modal-footer">
												<button id="formInfoDelete">Delete</button>
												<button id="formInfoSave">Save</button>
											</div>
										</div>
									</div>
								</div>
								<div id="formPdfSide">
									<p class="formTabTitle"><b>Form</b> view:</p>
									<div id="noPDFselected" style="display:none;">
										<button id="uploadPdfBtn"><b>Select</b> PDF</button> 
										<form action="" class="invisible" method="post" enctype="multipart/form-data">
											<input type="file" name="file-upload" id="file-to-upload"  accept="application/pdf"/>
											<input type="text" name="postID" value='<?php echo get_the_ID();?>' readonly/>
											<input type="submit" id="file-upload-sInput" name="updatePDFTime">
										</form> 
									</div>
									<div id="formViewRibbon">
										<div id="formPagesLeft" class="formPagesBtn"><p><</p><p>Previous Page</p></div>
										<button id="changePdfBtn"><b>Change</b> PDF</button>
										<div id="formPagesRight" class="formPagesBtn"><p>Next Page</p><p>></p></div>
									</div>
									<div id="formPagesDiv" style="display:none; width:100%; position: relative;">
										<div>
											<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/edge.png" class="edgePoint" data-id="0"></img>
											<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/edge.png" class="edgePoint" data-id="1"></img>
											<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/edge.png" class="edgePoint" data-id="2"></img>
											<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/edge.png" class="edgePoint" data-id="3"></img>
										</div>
									</div>
								</div>
								<div id="listQuestForForm">
									<p class="formTabTitle"><b>Question</b> view:</p>
								</div>
							</div>
						</div>
						<?php
					} else if(in_array("student", $user_roles) && array_key_exists(get_current_user_id(), $responses)){
						?><script>
							window.userRole = 'attendee';
							window.responsesKrisi = '<?php echo json_encode($responses);?>';
							window.contentKrisi = '<?php echo json_encode($content);?>';
						</script>
						<p id="attendeeIDp" class="invisible"><?php echo json_encode(get_current_user_id());?></p>
						<h4>Your results:</h4>
						<div id="summaryDiv">
							<table>
								<tbody>
									<tr>
										<th>General score</th>
										<th width="80%" class="checkTd scoreTd pointsField-1_-1_-1_-1">N/A</th>
									</tr>
								<?php
								$moduleID = 0;
								foreach($content as $module){?>
									<tr>
										<td class="moduleID"><b>Module</b> #<?php echo ($moduleID+1);?></td>
										<td class="checkTd scoreTd pointsField<?php echo $moduleID;?>_-1_-1_-1">N/A</td>
									</tr>
									<?php
									$moduleID++;
								}
								?>
								</tbody>
							</table>
						</div>
						<?php
					} else {
						?><h2>You don't have access to this page!</h2><?php
					}
				}

			endwhile;

			/**
			 * lalita_after_main_content hook.
			 *
			 */
			do_action( 'lalita_after_main_content' );
			?>
		</main><!-- #main -->
	</div><!-- #primary -->
	<?php
	/**
	 * lalita_after_primary_content_area hook.
	 *
	 */
	 do_action( 'lalita_after_primary_content_area' );

get_footer();
