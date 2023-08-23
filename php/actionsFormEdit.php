<?php

if (isset($_POST['callFormEditFunction'])) {
    switch($_POST['callFormEditFunction']){
      case 'getFormData':
        getFormData();
        die();
        break;
      case 'updateFormQuestion':
        updateFormQuestion();
        die();
        break;
      case 'saveFormImages':
        saveFormImages();
        die();
        break;
      case 'deleteFormImages':
        deleteFormImages();
        die();
        break;
      case 'editEdge':
        editEdge();
        die();
        break;
    }
  }

  function getFormData(){
    $postID = $_POST['postID'];
    $form = get_post_meta( $postID, 'form', true );
    $response_array['form'] = json_encode($form);  
    header('Content-type: application/json');
    echo json_encode($response_array);
  }
  
  function updateFormQuestion(){
    $postID = $_POST['postID'];
    $moduleID = intval($_POST['moduleID']);
    $indArr = $_POST['indArr'];
    $value = $_POST['value'];
    $form = get_post_meta( $postID, 'form', true );

    if($form == '') $form = array();
    if(!isset($form[$moduleID]) || !$form[$moduleID] instanceof QuestionForm) $form[$moduleID] = new QuestionForm();
    $form[$moduleID]->setValue($value,$indArr);
    update_post_meta( $postID, 'form', $form );

    $response_array['form'] = json_encode($form);  
    header('Content-type: application/json');
    echo json_encode($response_array);
  }
  
  function saveFormImages(){
    add_filter( 'upload_dir', 'uploadDirToTemplates' );
    $postID = $_POST['postID'];
    $id = 0;
    $pageInfo = get_post_meta( $postID, 'pageInfo', true );
    if($pageInfo=='')$pageInfo=array();
    foreach( $_POST['imgBase64'] as $imgObj ) {
      $img = $imgObj['imgURL'];
      $edges = $imgObj['edges'];
      $img = str_replace('data:image/png;base64,', '', $img);
      $img = str_replace(' ', '+', $img);
      $fileData = base64_decode($img);
      $title = 'form_' . $postID . '_page_' . $id . '.png';
      
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
      array_push($pageInfo,array('attID' => $attach_id,'edges' => $edges));
      $id++;
    }
    //$pageInfo=array();
    update_post_meta( $postID, 'pageInfo', $pageInfo );
    remove_filter( 'upload_dir', 'uploadDirToTemplates' );
  }
  
  function editEdge(){
    $postID = $_POST['postID'];
    $pageID = $_POST['pageID'];
    $edgeID = $_POST['edgeID'];
    $top = $_POST['top'];
    $left = $_POST['left'];
    $pageInfo = get_post_meta( $postID, 'pageInfo', true );
    $pageInfo[$pageID]['edges'][$edgeID]['x'] = $left;
    $pageInfo[$pageID]['edges'][$edgeID]['y'] = $top;
    usort($pageInfo[$pageID]['edges'], 'edgeSort');

    update_post_meta( $postID, 'pageInfo', $pageInfo );
    $response_array['pageInfo'] = json_encode($pageInfo);  
    header('Content-type: application/json');
    echo json_encode($response_array);
  }

  function edgeSort($a, $b){
  if ($a['y'] < 0.5 && $b['y'] > 0.5) return false;
  if ($a['y'] > 0.5 && $b['y'] < 0.5) return true;
  if ($a['x'] < 0.5 && $b['x'] > 0.5) return false;
  return true;
}
  function deleteFormImages(){
    $postID = $_POST['postID'];
    $deleteData = $_POST['deleteData'];
    if($deleteData == 'true') update_post_meta( $postID, 'form', array() );
    $pageInfo = get_post_meta( $postID, 'pageInfo', true );
    foreach( $pageInfo as $attach ) {
      wp_delete_attachment( intval($attach['attID']), true );
    }
    update_post_meta( $postID, 'pageInfo', array() );
  }
  
  function uploadDirToTemplates( $dir ) {
    return array(
        'path'   => $dir['basedir'] . '/templates',
        'url'    => $dir['baseurl'] . '/templates',
        'subdir' => '/templates',
    ) + $dir;
  }
  function uploadDirToStudents( $dir ) {
    return array(
        'path'   => $dir['basedir'] . '/studentForms',
        'url'    => $dir['baseurl'] . '/studentForms',
        'subdir' => '/studentForms',
    ) + $dir;
  }
  function upload_user_file( $file = array() ) {
    require_once( ABSPATH . 'wp-admin/includes/admin.php' );
    $file['name'] = 'template_' . $_POST['postID'] . '.pdf';
    add_filter( 'upload_dir', 'uploadDirToTemplates' );
    $file_return = wp_handle_upload( $file, array('test_form' => false ) );
    remove_filter( 'upload_dir', 'uploadDirToTemplates' );
    if( isset( $file_return['error'] ) || isset( $file_return['upload_error_handler'] ) ) {
        return false;
    } else {
        $filename = $file_return['file'];
        $attachment = array(
            'post_mime_type' => $file_return['type'],
            'post_title' => preg_replace( '/\.[^.]+$/', '', basename( $filename ) ),
            'post_content' => '',
            'post_status' => 'inherit',
            'guid' => $file_return['url']
        );
        $attachment_id = wp_insert_attachment( $attachment, $file_return['url'] );
        require_once(ABSPATH . 'wp-admin/includes/image.php');
        $attachment_data = wp_generate_attachment_metadata( $attachment_id, $filename );
        wp_update_attachment_metadata( $attachment_id, $attachment_data );
        if( 0 < intval( $attachment_id ) ) {
          return $attachment_id;
        }
    }
    return false;
  }
  if( ! empty( $_FILES ) ) {
    var_dump($_POST);
    var_dump(time());
    if(isset($_POST['updatePDFTime']) && time()-intval($_POST['updatePDFTime'])<=2){
      $attachment_id = upload_user_file( $_FILES['file-upload'] );
      return;
    }
  }
  

?>