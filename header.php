<?php
/**
 * The template for displaying the header.
 *
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
	<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://code.jquery.com/ui/1.13.0/jquery-ui.min.js"></script>
	<?php wp_head(); ?>
</head>

<body <?php lalita_body_schema();?> <?php body_class(); ?>>
	<?php
	/**
	 * new WordPress action since version 5.2
	 */
	if ( function_exists( 'wp_body_open' ) ) {
		wp_body_open();
	} else {
		do_action( 'wp_body_open' );
	}
	
	/**
	 * lalita_before_header hook.
	 *
	 *
	 * @hooked lalita_do_skip_to_content_link - 2
	 * @hooked lalita_top_bar - 5
	 * @hooked lalita_add_navigation_before_header - 5
	 */
	do_action( 'lalita_before_header' );

	/**
	 * lalita_header hook.
	 *
	 *
	 * @hooked lalita_construct_header - 10
	 */
	do_action( 'lalita_header' );

	/**
	 * lalita_after_header hook.
	 *
	 *
	 * @hooked lalita_featured_page_header - 10
	 */
	do_action( 'lalita_after_header' );
	?>

	<div id="page" class="hfeed site grid-container container grid-parent">
		<div id="content" class="site-content">
			<?php
			/**
			 * lalita_inside_container hook.
			 *
			 */
			do_action( 'lalita_inside_container' );
