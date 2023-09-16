<?php /*

  This file is part of a child theme called Lalita-child.
  Functions in this file will be loaded before the parent theme's functions.
  For more information, please read
  https://developer.wordpress.org/themes/advanced-topics/child-themes/

*/

// this code loads the parent's stylesheet (leave it in place unless you know what you're doing)

function cptui_register_my_cpts_test() {

	/**
	 * Post Type: Tests.
	 */

	$labels = [
		"name" => esc_html__( "Tests", "lalita-child" ),
		"singular_name" => esc_html__( "Test", "lalita-child" ),
	];

	$args = [
		"label" => esc_html__( "Tests", "lalita-child" ),
		"labels" => $labels,
		"description" => "",
		"public" => true,
		"publicly_queryable" => true,
		"show_ui" => true,
		"show_in_rest" => true,
		"rest_base" => "",
		"rest_controller_class" => "WP_REST_Posts_Controller",
		"rest_namespace" => "wp/v2",
		"has_archive" => false,
		"show_in_menu" => true,
		"show_in_nav_menus" => true,
		"delete_with_user" => false,
		"exclude_from_search" => false,
		"capability_type" => "post",
		"map_meta_cap" => true,
		"hierarchical" => true,
		"can_export" => false,
		"rewrite" => [ "slug" => "test", "with_front" => true ],
		"query_var" => true,
		"supports" => [ "title", "editor" ],
		"show_in_graphql" => false,
	];

  
	register_post_type( "test", $args );

}


$my_fake_pages = array(
    'attendees' => 'Attendees',
    'stats' => 'Stats',
    'modules' => 'Modules',
    'check' => 'Check',
    'handcheck' => 'Hand Check',
    'form' => 'Form',
    'results' => 'Results'
);

add_filter('rewrite_rules_array', 'fsp_insertrules');
add_filter('query_vars', 'fsp_insertqv');
  
// Adding fake pages' rewrite rules
function fsp_insertrules($rules)
{
    global $my_fake_pages;
  
    $newrules = array();
    foreach ($my_fake_pages as $slug => $title)
        $newrules['test/([^/]+)/' . $slug . '/?$'] = 'index.php?test=$matches[1]&fpage=' . $slug;
  
    return $newrules + $rules;
}
  
// Tell WordPress to accept our custom query variable
function fsp_insertqv($vars){
    array_push($vars, 'fpage');
    return $vars;
}

// Remove WordPress's default canonical handling function

remove_filter('wp_head', 'rel_canonical');
add_filter('wp_head', 'fsp_rel_canonical');
function fsp_rel_canonical(){
    global $current_fp, $wp_the_query;
  
    if (!is_singular())
        return;
  
    if (!$id = $wp_the_query->get_queried_object_id())
        return;
  
    $link = trailingslashit(get_permalink($id));
  
    // Make sure fake pages' permalinks are canonical
    if (!empty($current_fp))
        $link .= user_trailingslashit($current_fp);
  
    echo '<link rel="canonical" href="'.$link.'" />';
}


/* Yoast Canonical Removal from Book pages */
add_filter( 'wpseo_canonical', 'wpseo_canonical_exclude' );

function wpseo_canonical_exclude( $canonical ) {
		global $post;
		if (is_singular('test')) {
    		$canonical = false;
    }
	return $canonical;
}


add_action( 'init', 'cptui_register_my_cpts_test' );
include_once( get_template_directory() . '-child/php/classes.php');
include_once( get_template_directory() . '-child/php/actionsFormEdit.php');
include_once( get_template_directory() . '-child/php/actionsContentEdit.php');
include_once( get_template_directory() . '-child/php/actionsResponseEdit.php');
include_once( get_template_directory() . '-child/php/actionsUsers.php');
include_once( get_template_directory() . '-child/php/actionsTest.php');

function example_enqueue_styles() {
  wp_enqueue_style('parent-theme', get_template_directory_uri() .'/style.css');
  wp_enqueue_style('meta_data_style', get_template_directory_uri() . '-child/css/admin_style.css');
  //wp_enqueue_style('parent-theme', get_template_directory_uri() .'/style.css', array('lalita-style-css'));

  wp_enqueue_script('jquery');
  wp_enqueue_style('toaster_css', get_template_directory_uri() . '-child/css/toaster.css');
  wp_enqueue_script('toaster', get_template_directory_uri() . '-child/js/toaster.js', array('jquery'));

  if( is_single() && get_post_type()=='test' ){
    
    
    // Enqueue jQuery UI from a CDN or local file
    wp_enqueue_script('excelFunctions', 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js', array('jquery'), '1.13.0', true);
    wp_enqueue_script('globalFunctions', get_template_directory_uri() . '-child/js/globalFunctions.js', array('jquery'));
    wp_enqueue_script('actionsResults', get_template_directory_uri() . '-child/js/tabs/actionsResults.js', array('jquery'));
    wp_enqueue_script('actionsSummary', get_template_directory_uri() . '-child/js/tabs/actionsSummary.js', array('jquery'));
    wp_enqueue_script('actionsStats', get_template_directory_uri() . '-child/js/tabs/actionsStats.js', array('jquery'));
    wp_enqueue_script('actionsAttendees', get_template_directory_uri() . '-child/js/tabs/actionsAttendees.js', array('jquery'));
    wp_enqueue_script('actionsBase', get_template_directory_uri() . '-child/js/tabs/actionsBase.js', array('jquery'));
    wp_enqueue_script('actionsCheck', get_template_directory_uri() . '-child/js/tabs/actionsCheck.js', array('jquery', 'toaster'));
    wp_enqueue_script('actionsHandCheck', get_template_directory_uri() . '-child/js/tabs/actionsHandCheck.js', array('jquery', 'toaster'));
    wp_enqueue_script('actionsForm', get_template_directory_uri() . '-child/js/tabs/actionsForm.js', array('jquery'));
    
    wp_enqueue_script('meta_data_script', get_template_directory_uri() . '-child/js/meta_data_input.js', 
    array('jquery', 'actionsStats', 'actionsAttendees', 'actionsResults', 'actionsBase', 'actionsCheck', 'actionsHandCheck', 'actionsForm'));
    
    wp_enqueue_script('canvasOperations', get_template_directory_uri() . '-child/js/canvasOperations.js', array('jquery'));
    wp_enqueue_script('opencv', get_template_directory_uri() . '-child/js/opencv.js', array('jquery'));
    wp_enqueue_script('pixelmatch', get_template_directory_uri() . '-child/js/pixelmatch.js', array('jquery'));
    wp_enqueue_script('imageAnalysis', get_template_directory_uri() . '-child/js/imageAnalysis.js', array('jquery','opencv','pixelmatch'));
    wp_enqueue_script('pdf_script', get_template_directory_uri() . '-child/js/pdf.js', array('jquery'));
    wp_enqueue_script('pdf_worker_script', get_template_directory_uri() . '-child/js/pdf.worker.js', array('jquery'));
    wp_enqueue_script( 'jquery-ui-tabs' );
  }
  
  if(get_post_field( 'post_name' )=='dashboard' ){
    wp_enqueue_script('actionsDashboard', get_template_directory_uri() . '-child/js/actionsDashboard.js', array('jquery'));
  }
	
}
add_action('wp_enqueue_scripts', 'example_enqueue_styles');

if(isset($_POST['nullifyTest'])){
  $postID = intval($_POST['postID']);
  update_post_meta( $postID, 'responses', array(array()));
  update_post_meta( $postID, 'content', array());
  update_post_meta( $postID, 'form', array());
  // update_post_meta( $postID, 'pageInfo', array());
  exit();
}

if(isset($_POST['getImageURL'])){
  echo json_encode(array('url'=> wp_get_attachment_url($_POST['getImageURL']), 'pageId'=> $_POST['pageId']));
  exit();
}

function bootstrap_enqueue_styles() {
  wp_register_style('bootstrap',get_stylesheet_directory_uri() . '/bootstrap/css/bootstrap.min.css' );
  $dependencies = array('bootstrap');
  wp_enqueue_style( 'bootstrap-style', get_stylesheet_directory_uri(), $dependencies); 
}

function bootstrap_enqueue_scripts() {
    $dependencies = array('jquery');
    wp_enqueue_script('bootstrap-script', get_stylesheet_directory_uri().'/bootstrap/js/bootstrap.min.js', $dependencies, '3.3.6', true );
}

add_action( 'wp_enqueue_scripts', 'bootstrap_enqueue_styles' ,1);
add_action( 'wp_enqueue_scripts', 'bootstrap_enqueue_scripts',1 ); 


