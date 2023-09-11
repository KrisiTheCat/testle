<?php
/**
 * The Template for displaying all single WPKoi events.
 *
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

get_header();
$current_fp = get_query_var('fpage'); ?>

	<div id="primary" class="content-area grid-parent mobile-grid-100 grid-100 tablet-grid-100 primary-single-test">
		<main id="main" <?php lalita_main_class(); ?>>
		
			<header class="entry-header">
				<h1 class="entry-title"><?php the_title(); ?></h1>
			</header><!-- .entry-header -->
			<div id="usedForChecking">
				<canvas id="imageCanvas" width="1000" class="invisible"></canvas>
				<img id="imageImg" width="1000" class="invisible"/>
			</div>
			<button type="button" id="nullBtn" class="invisible">Nullify</button>
			<?php
			do_action( 'lalita_before_main_content' );
			while ( have_posts() ) : the_post();

				if(!is_user_logged_in()){
					?><script>
						window.userRole = 'notLogged';
					</script>
					<h2>Please enter your profile to see this page!</h2>
					<?php
				} else {
					$content = get_post_meta( get_the_ID(), 'content', true );
					$responses = get_post_meta( get_the_ID(), 'responses', true );
					$form = get_post_meta( get_the_ID(), 'form', true );
					$editors = get_post_meta(get_the_ID(), 'editors',true);

					switch(canSeeTest(get_current_user_id(), get_the_ID())){
					case 0:
						get_template_part( 'single', 'test-notallowed' );
						break;
					case 1:
						?><script>
							window.userRole = 'attendee';
							window.postID = '<?php echo get_the_ID(); ?>';
							window.contentKrisi = '<?php echo json_encode($content);?>';
							window.responsesKrisi = '<?php echo json_encode($responses);?>';
						</script><?php
						get_template_part( 'single', 'test-results' );
						break;
					case 2:
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
						$pageInfo = get_post_meta( get_the_ID(), 'pageInfo', true );
						if($pageInfo == '')$pageInfo = array();
						for($i = 0; $i < count($pageInfo);$i++){
							$pageInfo[$i]['url'] = wp_get_attachment_url($pageInfo[$i]['attID']);
						}
						?>	
						<ul id="menu-book-nav" class="testMenu">
							<li class="menu-item">
								<a id="summaryLink"   href="<?php echo get_permalink(); ?>"     		data-hover="Dashboard">Dashboard</a>
								<div class="notifCircle">0</div>
							</li>
							<li class="menu-item">
								<a id="statsLink"   href="<?php echo get_permalink(); ?>stats/"     		data-hover="Statistics">Statistics</a>
								<div class="notifCircle">0</div>
							</li>
							<li class="menu-item">
								<a id="attendeesLink" href="<?php echo get_permalink() ?>attendees/" 	data-hover="Attendees">Attendees</a>
								<div class="notifCircle">0</div>
							</li>
							<li class="menu-item">
								<a id="baseLink"      href="<?php echo get_permalink() ?>modules/"		data-hover="Modules">Modules</a>
								<div class="notifCircle">0</div>
							</li>
							<li class="menu-item">
								<a id="checkLink"     href="<?php echo get_permalink() ?>check/"		data-hover="Check">Check</a>
								<div class="notifCircle">0</div>
							</li>
							<li class="menu-item">
								<a id="handcheckLink" href="<?php echo get_permalink() ?>handcheck/"	data-hover="Hand check">Hand Check</a>
								<div class="notifCircle">0</div>
							</li>
							<li class="menu-item">
								<a id="formLink"      href="<?php echo get_permalink() ?>form/"		data-hover="Form">Form</a>
								<div class="notifCircle">0</div>
							</li>
						</ul>
						<script>
							window.userID = '<?php echo get_current_user_id(); ?>';
							window.userRole = 'editor';
							window.tempPath = '<?php echo get_stylesheet_directory_uri(); ?>/img';
							window.postID = '<?php echo get_the_ID(); ?>';
							window.contentKrisi = '<?php echo json_encode($content);?>';
							window.formKrisi = '<?php echo json_encode($form);?>';
							window.srcPath = '<?php echo get_stylesheet_directory_uri(); ?>';
							window.pageInfo = '<?php echo json_encode($pageInfo);?>';
							window.usersKrisi = '<?php echo json_encode($usersInfo);?>';
							window.responsesKrisi = '<?php echo json_encode($responses);?>';
						</script><?php
						if (!$current_fp) {
							get_template_part( 'single', 'test-index' );
						} else if ($current_fp == 'attendees') {
							get_template_part( 'single', 'test-attendees' );
						} else if ($current_fp == 'stats') {
							get_template_part( 'single', 'test-stats' );
						} else if ($current_fp == 'base') {
							get_template_part( 'single', 'test-base' );
						} else if ($current_fp == 'check') {
							get_template_part( 'single', 'test-check' );
						} else if ($current_fp == 'handcheck') {
							get_template_part( 'single', 'test-handcheck' );
						} else if ($current_fp == 'form') {
							get_template_part( 'single', 'test-form' );
						}
					break;
					}
				}

			endwhile;

			/**
			 * lalita_after_main_content hook.
			 *
			 */
			do_action( 'lalita_after_main_content' );
			?>
			<div class="invisible">
				<canvas id="canvasCutQuest0"></canvas>
				<canvas id="canvasCutQuest1"></canvas>
				<canvas id="canvasCutQuest2"></canvas>
				<canvas id="canvasCutQuest3"></canvas>
				<canvas class="answerCanvas" id="diffrencesCanvas"></canvas>
			</div>
		</main><!-- #main -->
	</div><!-- #primary -->

	<?php
	/**
	 * lalita_after_primary_content_area hook.
	 *
	 */
	 do_action( 'lalita_after_primary_content_area' );

get_footer();
