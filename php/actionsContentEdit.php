<?php

if (isset($_POST['callTestEditFunction'])) {
  switch($_POST['callTestEditFunction']){
    case 'createModule':
      createModule();
      die();
      break;
    case 'addQuestion':
      addQuestion();
      die();
      break;
    case 'addCheck':
      addCheck();
      die();
      break;
    case 'deleteQuestion':
      deleteQuestion();
      die();
      break;
    case 'changeAnswer':
      changeAnswer();
      die();
      break;
    case 'changePoints':
      changePoints();
      die();
      break;
  }
}

function createModule(){
  $postID = $_POST['postID'];
  $content = get_post_meta( $postID, 'content', true );
  $responses = get_post_meta( $postID, 'responses', true );
  $form = get_post_meta( $postID, 'form', true );

  foreach($responses as &$resp){
    $resp[count($content)] = new QuestionResponse('Module');
  }
  $content[count($content)] = new Question('Module');

  update_post_meta( $postID, 'content', $content );
  update_post_meta( $postID, 'responses', $responses );
  update_post_meta( $postID, 'form', $responses );
  $response_array['content'] = json_encode($content);  
  $response_array['responses'] = json_encode($responses);  
  header('Content-type: application/json');
  echo json_encode($response_array);
}

function addQuestion(){
  $postID = $_POST['postID'];
  $moduleID = intval($_POST['moduleID']);
  $indArr = json_decode(stripslashes($_POST['indArr']));
  $type = $_POST['questionType'];
  $content = get_post_meta( $postID, 'content', true );
  $responses = get_post_meta( $postID, 'responses', true );
  $question = new Question($type);
  if($indArr == null) $indArr = array();
  
  $content[$moduleID]->addSubQ($question, $indArr);
  foreach($responses as &$resp){
    $respquestion = new QuestionResponse($type);
    $resp[$moduleID]->addSubQ($respquestion,$indArr);
  }
  // var_dump($content[0]->subq[6]);
  // var_dump($responses[0][0]->subq[6]);
  // var_dump($responses[2][0]->subq[6]);
  // die();
  $content[$moduleID]->changePoints($question->points, $indArr);
  // var_dump($content[0]);
  // die();
  calcResponses($responses, $content, $postID);
}


function deleteQuestion(){
  $postID = $_POST['postID'];
  $moduleID = $_POST['moduleID'];
  $indArr = json_decode(stripslashes($_POST['indArr']));
  $content = get_post_meta( $postID, 'content', true );
  $responses = get_post_meta( $postID, 'responses', true );
  $form = get_post_meta( $postID, 'form', true );
  if($indArr == null) $indArr = array();

  $diff = -$content[$moduleID]->getPoints($indArr);
  $content[$moduleID]->changePoints($diff, $indArr);
  deleteArgs($form, $responses, $content, $postID, $moduleID, $indArr);
}

function deleteArgs($form, $responses, $content, $postID, $moduleID, $indArr){
  if(count($indArr) == 0){
    array_splice($content, $moduleID, 1);
    if(isset($form[$moduleID])){
      array_splice($form, $moduleID, 1);
    }
    foreach($responses as &$resp){
      array_splice($resp, $moduleID, 1);
    }
  } else {
    $toDel = $content[$moduleID]->delete(json_decode(json_encode($indArr)));
    if($toDel){
      deleteArgs($form, $responses, $content, $postID, $moduleID, array());
      return;
    }
    foreach($responses as &$resp){
      $resp[$moduleID]->delete(json_decode(json_encode($indArr)));
    }
    $form[$moduleID]->delete(json_decode(json_encode($indArr)));
  }
  update_post_meta( $postID, 'form', $form );
  calcResponses($responses, $content, $postID);
}

function extractFromArray($array, $id, $minus){
  for($i = $id; $i < count($array)-1-$minus; $i++){
    $array[$i] = $array[$i+1];
  }
  unset($array[count($array)-1-$minus]);
  return $array;
}

function changeAnswer(){
  $postID = $_POST['postID'];
  $moduleID = intval($_POST['moduleID']);
  $indArr = json_decode(stripslashes($_POST['indArr']));
  $answer = $_POST['answer'];
  $content = get_post_meta( $postID, 'content', true );
  $responses = get_post_meta( $postID, 'responses', true );
  if($indArr == null) $indArr = array();

  $content[$moduleID]->changeAnswer($answer, $indArr);
  foreach($responses as &$resp){
    $resp[$moduleID]->checkAnswer($answer, $indArr);
  }
  calcResponses($responses, $content, $postID);
}

function changePoints(){
  $postID = $_POST['postID'];
  $moduleID = intval($_POST['moduleID']);
  $indArr = json_decode(stripslashes($_POST['indArr']));
  $points = floatval($_POST['points']);
  $content = get_post_meta( $postID, 'content', true );
  $responses = get_post_meta( $postID, 'responses', true );
  if($indArr == null) $indArr = array();

  $diff = $points - $content[$moduleID]->getPoints($indArr);
  $content[$moduleID]->changePoints($diff, $indArr);
  calcResponses($responses, $content, $postID);
}

function calcResponses($responses, $content, $postID){
  foreach($responses as &$resp){
    $resp['pointsAll'] = 0;
    for($moduleID = 0; isset($resp[$moduleID]); $moduleID++){
      $resp['pointsAll'] += $resp[$moduleID]->calcPoints($content[$moduleID]);
    }
  }
  //  var_dump($responses);
  update_post_meta( $postID, 'responses', $responses );
  update_post_meta( $postID, 'content', $content );
  $response_array['content'] = json_encode($content);  
  $response_array['responses'] = json_encode($responses);  
  header('Content-type: application/json');
  echo json_encode($response_array);
}
?>