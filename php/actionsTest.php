<?php

if (isset($_POST['callTestEditFunction'])) {
  switch($_POST['callTestEditFunction']){
    case 'getImageURLs':
      $postID = intval($_POST['postID']);
      $pageID = intval($_POST['pageID']);
      $attArr = $_POST['attArr'];
      getImageURLs($postID, $pageID, $attArr);
      die();
      break;
  }
}

function getImageURLs($postID, $pageID, $attArr){
  $responses = get_post_meta( $postID, 'responses', true );
  $ans = array();
  foreach($attArr as $att){
    if(isset($responses[$att]['images'][$pageID])){
      array_push($ans, array("attID"=>$att, "url"=> wp_get_attachment_url($responses[$att]['images'][$pageID]['attID'])));
    }
  }
  
  header('Content-type: application/json');
  echo json_encode($ans);
}