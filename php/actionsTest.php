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
    case 'deleteTest':
      $postID = intval($_POST['postID']);
      deleteTest($postID);
      die();
      break;
    case 'changeTitle':
      $postID = intval($_POST['postID']);
      $title = $_POST['title'];
      changeTitle($postID, $title);
      die();
      break;
    case 'createPost':
      $userID = intval($_POST['userID']);
      $title = $_POST['title'];
      createPost($userID, $title);
      die();
      break;
  }
}

function changeTitle($postID, $new_title){
  $new_title = mb_convert_case( $new_title, MB_CASE_TITLE, "UTF-8" );
  $new_slug = strtolower(mb_convert_case( $new_title, MB_CASE_TITLE, "UTF-8" ));
  
  $response_array['title'] = $new_title;
  header('Content-type: application/json');
  echo json_encode($response_array);

  if ( get_post_field( 'post_title', $postID ) === $new_title ) {
      return;
  }

  $post_update = array(
    'ID'         => $postID,
    'post_title' => $new_title,
    'post_name' => $new_slug,
  );

  wp_update_post( $post_update );
}

function createPost($userID, $title){
  $wordpress_post = array(
    'post_title' => $title,
    'post_content' => '',
    'post_status' => 'publish',
    'post_author' => $userID,
    'post_type' => 'test'
  );
  $response_array = listUserTests($userID);
  $postID = wp_insert_post( $wordpress_post );
  $response_array['id'] = $postID;
  
  update_post_meta( $postID, 'responses', array(array()));
  update_post_meta( $postID, 'content', array());
  update_post_meta( $postID, 'form', array());
  update_post_meta( $postID, 'pageInfo', array());
  update_post_meta( $postID, 'editors', array());
  $response_array['roles'] = json_decode($response_array['roles']);
  array_push($response_array['roles'], array(
                                        'postID' =>  $postID, 
                                        'postName' =>  $title,
                                        'role' =>  'creator',  
                                        'link'=>get_page_link($postID)));
  $response_array['roles'] = json_encode($response_array['roles']);

  header('Content-type: application/json');
  echo json_encode($response_array);
}

function deleteTest($postID){
  wp_trash_post($postID);
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