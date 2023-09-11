<?php

if (isset($_POST['callUsersFunction'])) {
  switch($_POST['callUsersFunction']){
    case 'getShowResultsStatus':
      $postID = intval($_POST['postID']);
      getShowResultsStatus($postID);
      die();
      break;
    case 'changeShowResultsStatus':
      $postID = intval($_POST['postID']);
      changeShowResultsStatus($postID);
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
    case 'listUserTests':
      $userID = intval($_POST['userID']);
      $response_array = listUserTests($userID);
      header('Content-type: application/json');
      echo json_encode($response_array);
      die();
      break;
    case 'canCreateTests':
      $userID = intval($_POST['userID']);
      canCreateTests($userID);
      die();
      break;
    case 'getUserGroups':
      getUserGroups();
      die();
      break;
    case 'getAllUsers':
      getAllUsers();
      die();
      break;
    case 'getEditors':
      $postID = $_POST['postID'];
      getEditors($postID);
      die();
      break;
    case 'addEditor':
      $postID = intval($_POST['postID']);
      $editor = intval($_POST['editor']);
      addEditor($postID, $editor);
      die();
      break;
    case 'removeEditor':
      $postID = intval($_POST['postID']);
      $editor = intval($_POST['editor']);
      removeEditor($postID, $editor);
      die();
      break;
  }
}
function getShowResultsStatus($postID){
  $response_array['showResults'] = get_post_meta($postID, 'showResults', true);
  header('Content-type: application/json');
  echo json_encode($response_array);
}

function changeShowResultsStatus($postID){
  $old = get_post_meta($postID, 'showResults', true);
  update_post_meta($postID, 'showResults', !$old);
  $response_array['showResults'] = !$old;
  header('Content-type: application/json');
  echo json_encode($response_array);
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

function canCreateTests($userID){
  $user_meta = get_userdata($userID);
  $user_roles = $user_meta->roles;
  if(in_array('administrator',$user_roles) || in_array('teacher',$user_roles)){
    echo 1;
  }
  else{
    echo 0;
  }
}

function getEditors($postID){
  $editors = get_post_meta($postID, 'editors',true);
  array_push($editors, (object)array("id"=> get_post_field( 'post_author', $postID ),  "role"=>"creator"));
  $response_array['editors'] = json_encode($editors);  
  header('Content-type: application/json');
  echo json_encode($response_array);
}
function addEditor($postID, $editor){
  $editors = get_post_meta($postID, 'editors',true);
  $key = array_search($editor, array_column($editors, "id"));
  if ($key !== false) {
    //error TODO
    return;
  }
  else {
    array_push($editors, (object)array("id"=>$editor, "role"=>"editor"));
  }
  update_post_meta($postID,'editors',$editors);
  getEditors($postID);
}
function removeEditor($postID, $editor){
  $editors = get_post_meta($postID, 'editors',true);
  $key = array_search($editor, array_column($editors, "id"));
  if ($key !== false && $editors[$key]->role != 'creator') {
    array_splice($editors, $key, 1); 
  }
  else {
    //error TODO
    return;
  }
  update_post_meta($postID,'editors',$editors);
  getEditors($postID);
}

function getAllUsers(){
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
  $response_array['users'] = json_encode($usersInfo);  
  header('Content-type: application/json');
  echo json_encode($response_array);
}

function listUserTests($userID){
  $query = new WP_Query( array('post_type' =>  'test'));
  $ans = array();

  foreach ($query->posts as $post) { 
    $postID = $post->ID;
    $roles = get_post_meta($postID, 'editors',true);
    foreach($roles as $role){
      if($role->id == $userID){
        array_push($ans, array(
          'postID' =>  $post->ID, 
          'postName' =>  $post->post_title,
          'date' =>  'TBA',
          'role' =>  'editor',  
          'link'=>get_page_link($post->ID)));
      }
    }
    if(array_key_exists($userID, get_post_meta($postID, 'responses',true))){
      array_push($ans, array(
        'postID' =>  $post->ID, 
        'postName' =>  $post->post_title,
        'date' =>  'TBA',
        'role' =>  'attendee',  
        'link'=>get_page_link($post->ID)));
    }
    if(intval($post->post_author) == $userID){
      array_push($ans, array(
        'postID' =>  $post->ID, 
        'postName' =>  $post->post_title,
        'date' =>  'TBA',
        'role' =>  'creator',  
        'link'=>get_page_link($post->ID)));
    }
  }
  
  $response_array['roles'] = json_encode($ans);  
  return $response_array;
}

function canSeeTest($userID, $postID){  // 0-no 1-attendee 2-full vision
  $user_meta = get_userdata(get_current_user_id());
  $user_roles = $user_meta->roles;
  $editors = get_post_meta($postID, 'editors',true);
  $key = array_search($userID, array_column($editors, "id"));
  if(in_array("administrator", $user_roles)  || get_post_field( 'post_author', get_the_ID() ) == get_current_user_id() || $key !== false){
    return 2;
  }
  if(array_key_exists($userID, get_post_meta($postID, 'responses',true))){
    return 1;
  }
  return 0;
}

?>