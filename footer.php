<?php
/**
 * The template for displaying the footer.
 *
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
?>

	</div><!-- #content -->
</div><!-- #page -->

<?php


/**
 * lalita_before_footer hook.
 *
 */
?>

<div class="footer">
	<div style="flex: 1;">
		<div>
			<a href="/">Home</a>
			<a href="/dashboard">Dashboard</a>
			<a href="/my-profile">My Profile</a>
		</div>
		<p>Powered by Wordpress and Kristina Stoyanova</p>
		<p style="    padding-bottom: 8px;"><?php echo date('Y'); ?> All rights reserved</p>
	</div>
	<img style="height:50px" src="<?php echo get_stylesheet_directory_uri(); ?>/img/logo.png"/>
</div><!-- .site-footer -->

<?php
/**
 * lalita_after_footer hook.
 *
 */

wp_footer();
?>

</body>
</html>
