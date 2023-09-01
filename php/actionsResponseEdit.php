<?php
if (isset($_POST['callResponseEditFunction'])) {
    switch($_POST['callResponseEditFunction']){
      case 'changeStatus':
        changeStatus();
        die();
        break;
      case 'changeStatusDescriptive':
        changeStatusDescriptive();
        die();
        break;
      case 'changeAnswerCh':
        $postID = $_POST['postID'];
        $attendeeID = intval($_POST['attendeeID']);
        $moduleID = $_POST['moduleID'];
        $indArr = $_POST['indArr'];
        $answer = $_POST['answer'];
        $response_array = changeAnswerCh($postID,$attendeeID,$moduleID,$indArr,$answer);
        header('Content-type: application/json');
        echo json_encode($response_array);
        die();
        break;
      case 'changeAnswerChDiff':
        $postID = $_POST['postID'];
        $reqArr = $_POST['reqArr'];
        $moduleID = $_POST['moduleID'];
        $indArr = $_POST['indArr'];
        $response_array = changeAnswerChDiff($postID,$reqArr,$moduleID,$indArr);
        header('Content-type: application/json');
        // var_dump($response_array);
        echo json_encode($response_array);
        die();
        break;
      case 'changeAnswerChArr':
        changeAnswerChArr();
        die();
        break;
      case 'deleteAttendeeImage':
        deleteAttendeeImage();
        die();
        break;
      case 'uploadAttendeeImage':
        uploadAttendeeImage();
        die();
        break;
      case 'updateEdgesAttendeeImage':
        updateEdgesAttendeeImage();
        die();
        break;
    }
  }
  
  function deleteAttendeeImage(){
    $postID = $_POST['postID'];
    $attendeeID = intval($_POST['attendeeID']);
    $id = $_POST['pageID'];

    $responses = get_post_meta( $postID, 'responses', true );
    wp_delete_attachment( intval($responses[$attendeeID]['images'][$id]['attID']), true );
    unset($responses[$attendeeID]['images'][$id]);
    update_post_meta( $postID, 'responses', $responses );
    
    $response_array['responses'] = json_encode($responses);  
    header('Content-type: application/json');
    echo json_encode($response_array);
  }

  function updateEdgesAttendeeImage(){
    $postID = $_POST['postID'];
    $attendeeID = intval($_POST['attendeeID']);
    $imageID = $_POST['imageID'];
    $edges = $_POST['edges'];
    $responses = get_post_meta( $postID, 'responses', true );
    $responses[$attendeeID]['images'][$imageID]['edges'] = $edges;
    update_post_meta( $postID, 'responses', $responses );
    $response_array['responses'] = json_encode($responses);  
    header('Content-type: application/json');
    echo json_encode($response_array);
  }

  function uploadAttendeeImage(){
    add_filter( 'upload_dir', 'uploadDirToStudents' );
    $postID = $_POST['postID'];
    $attendeeID = intval($_POST['attendeeID']);
    $id = $_POST['imageID'];
    $imgObj = $_POST['imgBase64'];
    $responses = get_post_meta( $postID, 'responses', true );
    $img = $imgObj['imgURL'];
    $edges = $imgObj['edges'];
    $img = str_replace('data:image/png;base64,', '', $img);
    $img = str_replace(' ', '+', $img);
    $fileData = base64_decode($img);
    $title = 'form_' . $postID . '_response_' . $attendeeID . '_page_' . $id . '.png';
    $attachment = wp_upload_bits( $title, null, $fileData );
    $filetype = wp_check_filetype( basename( $attachment['file'] ), null );
    $postinfo = array(
      'post_mime_type' => $filetype['type'],
      'post_title' => $title,
      'post_content' => '',
      'post_status' => 'inherit',
    );
    $filename = $attachment['file'];
    $attach_id = wp_insert_attachment( $postinfo, $filename, $postID );
    if(!isset($responses[$attendeeID]['images']))$responses[$attendeeID]['images']=array();
    $responses[$attendeeID]['images'][$id] = array('attID' => $attach_id,'edges' => $edges);
    update_post_meta( $postID, 'responses', $responses );
    remove_filter( 'upload_dir', 'uploadDirToStudents' );
    $response_array['responses'] = json_encode($responses);  
    header('Content-type: application/json');
    echo json_encode($response_array);
  }
  
  function changeAnswerChArr(){
    $postID = $_POST['postID'];
    $attendeeID = intval($_POST['attendeeID']);
    $queries = $_POST['queries'];
    $content = get_post_meta( $postID, 'content', true );
    $responses = get_post_meta( $postID, 'responses', true );
    $ansStatus = array(0,0,0,0);

    foreach ($queries as $query){
      $moduleID = intval($query['moduleID']);
      $indArr = $query['indArr'];
      $contentQ = $content[$moduleID]->getQuestion($indArr);
      if(isset($query['answer'])){
        $answer = $query['answer'];
      } else {
        $answer = null;
        if($contentQ->type == 'Descriptive'){
          $responses[$attendeeID]['pointsAll'] -= $responses[$attendeeID][$moduleID]->getQuestion($indArr)->calcPoints($contentQ);
          $responses[$attendeeID][$moduleID]->setStatus($indArr,$newStatus);
          $responses[$attendeeID]['pointsAll'] += $responses[$attendeeID][$moduleID]->getQuestion($indArr)->calcPoints($contentQ);
          $ansStatus[$newStatus]++;
          continue;
        }
      }
      $oldStatus = $responses[$attendeeID][$moduleID]->getStatus($indArr);
      $correctAnswer = $contentQ->answer;
      $responses[$attendeeID][$moduleID]->changeAnswer($answer,$indArr,$correctAnswer);
      $newStatus = $responses[$attendeeID][$moduleID]->getStatus($indArr);
      $points = $contentQ->points;
      if($oldStatus!=$newStatus && $newStatus==1) $responses[$attendeeID]['pointsAll'] += $points;
      if($oldStatus!=$newStatus && $oldStatus==1) $responses[$attendeeID]['pointsAll'] -= $points;
      $ansStatus[$newStatus]++;
    }
  
    update_post_meta( $postID, 'responses', $responses );
    $response_array['responses'] = json_encode($responses);  
    $response_array['ansStatus'] = json_encode($ansStatus);  
    header('Content-type: application/json');
    echo json_encode($response_array);
  }

  function changeAnswerChDiff($postID,$reqArr,$moduleID,$indArr){
    for($i = 0; $i < count($reqArr); $i++){
      $resp = changeAnswerCh($postID,$reqArr[$i]['attID'],$moduleID,$indArr,$reqArr[$i]['ans']);
    }
    return $resp;
  }

  function changeAnswerCh($postID,$attendeeID,$moduleID,$indArr,$answer){
    
    $content = get_post_meta( $postID, 'content', true );
    $responses = get_post_meta( $postID, 'responses', true );
    $contentQ = $content[$moduleID]->getQuestion($indArr);
    
    $responseQ = $responses[$attendeeID][$moduleID]->getQuestion($indArr);
    $oldStatus = $responses[$attendeeID][$moduleID]->getStatus($indArr);
    $correctAnswer = $contentQ->answer;
    $responses[$attendeeID][$moduleID]->changeAnswer($answer,$indArr,$correctAnswer);
    $newStatus = $responses[$attendeeID][$moduleID]->getStatus($indArr);
    $points = $contentQ->points;
    if($oldStatus!=$newStatus && $newStatus==1) $responses[$attendeeID]['pointsAll'] += $points;
    if($oldStatus!=$newStatus && $oldStatus==1) $responses[$attendeeID]['pointsAll'] -= $points;
    
    update_post_meta( $postID, 'responses', $responses );
    $response_array['responses'] = json_encode($responses);  
    return $response_array;
  }
  
  function changeStatusDescriptive(){
    $postID = $_POST['postID'];
    $attendeeID = intval($_POST['attendeeID']);
    $moduleID = $_POST['moduleID'];
    $indArr = $_POST['indArr'];
    $statusArr = $_POST['statusArr'];
    $content = get_post_meta( $postID, 'content', true );
    $responses = get_post_meta( $postID, 'responses', true );
    
    $questionC = $content[$moduleID]->getQuestion($indArr);
    $questionR = $responses[$attendeeID][$moduleID]->getQuestion($indArr);
    $pointsOld = $questionR->calcPoints($questionC);
    $ind = 0;
    while(isset($questionR->subq[$ind])){
      $questionR->subq[$ind]->status = intval($statusArr[$ind]);
      $ind++;
    }
    $pointsNew = $questionR->calcPoints($questionC);
    $responses[$attendeeID]['pointsAll'] -= $pointsOld;
    $responses[$attendeeID]['pointsAll'] += $pointsNew;

    update_post_meta( $postID, 'responses', $responses );
    $response_array['responses'] = json_encode($responses);  
    header('Content-type: application/json');
    echo json_encode($response_array);
  }

  function changeStatus(){
    $postID = $_POST['postID'];
    $attendeeID = intval($_POST['attendeeID']);
    $moduleID = $_POST['moduleID'];
    $indArr = $_POST['indArr'];
    $newStatus = intval($_POST['newStatus']);
    $content = get_post_meta( $postID, 'content', true );
    $responses = get_post_meta( $postID, 'responses', true );

    $questionC = $content[$moduleID]->getQuestion($indArr);
    $questionR = $responses[$attendeeID][$moduleID]->getQuestion($indArr);
    if($questionC->type == 'Descriptive'){
      $pointsOld = $questionR->calcPoints($questionC);
      foreach ($questionR->subq as $check){
        $check->status = $newStatus;
      }
      $pointsNew = $questionR->calcPoints($questionC);
      $responses[$attendeeID]['pointsAll'] -= $pointsOld;
      $responses[$attendeeID]['pointsAll'] += $pointsNew;
    } else {
      if($questionC->type=='Check'){
        if($newStatus != 3){
          $id = array_pop($indArr);
          $contentQD = $content[$moduleID]->getQuestion($indArr);
          $responseQ = $responses[$attendeeID][$moduleID]->getQuestion($indArr);
          for($i = 0; $i < count($contentQD->subq); $i++){
            if($responseQ->subq[$i]->status == 3) $responseQ->subq[$i]->status = 2;
          }
          array_push($indArr,$id);
        } 
        else {
          $id = array_pop($indArr);
          $contentQD = $content[$moduleID]->getQuestion($indArr);
          $responseQ = $responses[$attendeeID][$moduleID]->getQuestion($indArr);
          for($i = 0; $i < count($contentQD->subq); $i++){
            if($responseQ->subq[$i]->status == 1){
              $responses[$attendeeID]['pointsAll'] -= $contentQD->subq[$i]->points;
            }
            $responseQ->subq[$i]->status = 3;
          }
          array_push($indArr,$id);
        }
      }

      $answer = null;
      $correctAnswer = $content[$moduleID]->getAnswer($indArr);
      $oldStatus = $responses[$attendeeID][$moduleID]->getStatus($indArr);
      if($newStatus == 0) $answer = '-';
      if($newStatus == 1) $answer = $correctAnswer;
      if($newStatus == 2) $answer = '';
      
      $responses[$attendeeID][$moduleID]->changeAnswer($answer,$indArr,$correctAnswer);
      $points = $content[$moduleID]->getPoints($indArr);
      
      if($oldStatus!=$newStatus && $newStatus==1) $responses[$attendeeID]['pointsAll'] += $points;
      if($oldStatus!=$newStatus && $oldStatus==1) $responses[$attendeeID]['pointsAll'] -= $points;
    }
    
    update_post_meta( $postID, 'responses', $responses );
    $response_array['responses'] = json_encode($responses);  
    header('Content-type: application/json');
    echo json_encode($response_array);
  }
  
?>