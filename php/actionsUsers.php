<?php

if (isset($_POST['callUsersFunction'])) {
  switch($_POST['callUsersFunction']){
    case 'listUserTests':
      $userID = intval($_POST['userID']);
      listUserTests($userID);
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

function getEditors($postID){
  $roles = get_post_meta($postID, 'roles',true);
  $response_array['roles'] = json_encode($roles);  
  header('Content-type: application/json');
  echo json_encode($response_array);
}
function addEditor($postID, $editor){
  $roles = get_post_meta($postID, 'roles',true);
  $key = array_search($editor, array_column($roles, "id"));
  if ($key !== false) {
    //error TODO
    return;
  }
  else {
    array_push($roles, (object)array("id"=>$editor, "role"=>"editor"));
  }
  update_post_meta($postID,'roles',$roles);
  $response_array['roles'] = json_encode($roles);  
  header('Content-type: application/json');
  echo json_encode($response_array);
}
function removeEditor($postID, $editor){
  $roles = get_post_meta($postID, 'roles',true);
  $key = array_search($editor, array_column($roles, "id"));
  if ($key !== false && $roles[$key]->role != 'creator') {
    array_splice($roles, $key, 1); 
  }
  else {
    //error TODO
    return;
  }
  update_post_meta($postID,'roles',$roles);
  $response_array['roles'] = json_encode($roles);  
  header('Content-type: application/json');
  echo json_encode($response_array);
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
    $roles = get_post_meta($postID, 'roles',true);
    foreach($roles as $role){
      if($role->id == $userID){
        array_push($ans, array(
          'postID' =>  $post->ID, 
          'postName' =>  $post->post_title,
          'date' =>  'TBA',
          'role' =>  $role->role,  
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
  }
  
  $response_array['roles'] = json_encode($ans);  
  header('Content-type: application/json');
  echo json_encode($response_array);
}

?>