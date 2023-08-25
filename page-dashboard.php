<?php
/**
 * The Template for displaying all single WPKoi events.
 *
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

get_header(); ?>

	<div id="primary" class="content-area grid-parent mobile-grid-100 grid-100 tablet-grid-100 primary-single-test">
		<main id="main" <?php lalita_main_class(); ?>>
			<?php

            do_action( 'lalita_before_main_content' );
            while ( have_posts() ) : the_post();
                get_template_part( 'content', 'single' );
				
  $query = new WP_Query( array('post_type' =>  'test'));
  $ans = array();

  foreach ($query->posts as $post) { 
				//var_dump($post);
  }
    		
                if(!is_user_logged_in()){
					?><script>
						window.userRole = 'notLogged';
						</script>
					<h2>Please enter your profile to see this page!</h2>
					<?php
				} else {
					$attendeeID = get_current_user_id();
					?><script>
						window.attID = '<?php echo json_encode($attendeeID);?>';
						window.tempPath = '<?php echo get_stylesheet_directory_uri(); ?>/img';
					</script>
                    <p>My tests:</p>
                    <div id="myTests">
                    </div>
                    <p>My groups:</p>
                    <?php
                    $html = do_shortcode("[profilegrid_user_groups_area]");
					echo $html;
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
