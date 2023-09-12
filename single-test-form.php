<?php
/**
 * The Template for displaying all single WPKoi events.
 *
 */
?>

<script>
	window.openedTab = 'form';
</script>
<div id="form">
	<div id="pdf-main-container" class="modal fade" tabindex="-1" role="dialog">
		<div class="modal-dialog  modal-lg" role="document" style="margin: 3rem auto;">
			<div class="modal-content">
				<div class="modal-header border-0" style="flex-direction: column">
					<h3>PDF page choosing</h3>
				</div>
				<div class="modal-body">
					<div id="pdf-loader">Loading document ...</div>
					<div id="pdf-contents">
						<p>Please pick which pages are the answers sheets:</p>
						<div id="canvasDiv" style="width:100%;"></div>
					</div>
					
				</div>
				<div class="modal-footer">
					<p id="atLeast1">Choose <b>at least</b> 1 page!</p>
					<div id="analysingLoader">
						<p style="flex:1; line-height:30px;"><strong>Analysing</strong> pages</p>
						<div class="smallLoader"></div>
					</div>
					<button id="formPdfPickedSave" class="disabledBtn">Save changes</button>
				</div>
			</div>
		</div>
	</div>
	<div id="formInfoSaveDelete" class="modal fade" tabindex="-1" role="dialog">
		<div class="modal-dialog  modal-lg" role="document" style="margin: 3rem auto;">
			<div class="modal-content">
				<div class="modal-header border-0" style="flex-direction: column">
					<h3 style="margin: 0;">Losing info</h3>
				</div>
				<div class="modal-body">
					<p>This action will delete all form info (the sections answering the individual questions). Do you wish to continue?</p>
				</div>
				<div class="modal-footer">
					<button id="formInfoCancel">Cancel</button>
					<button id="formInfoDelete">Continue</button>
				</div>
			</div>
		</div>
	</div>
	<div id="formPdfSide">
		<p class="formTabTitle"><b>Form</b> view:</p>
		<div id="noPDFselected" style="display:none;">
			<button id="uploadPdfBtn"><b>Select</b> PDF</button> 
			<form action="" class="invisible" method="post" enctype="multipart/form-data">
				<input type="file" name="file-upload" id="file-to-upload"  accept="application/pdf"/>
				<input type="text" name="postID" value='<?php echo get_the_ID();?>' readonly/>
				<input type="submit" id="file-upload-sInput" name="updatePDFTime">
			</form> 
		</div>
		<div id="formViewRibbon">
			<div id="formPagesLeft" class="formPagesBtn"><p><</p><p>Previous Page</p></div>
			<button id="changePdfBtn"><b>Change</b> PDF</button>
			<div id="formPagesRight" class="formPagesBtn"><p>Next Page</p><p>></p></div>
		</div>
		<div id="formPagesDiv" style="display:none; width:100%; position: relative;">
			<div>
				<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/edge.png" class="edgePoint" data-id="0"></img>
				<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/edge.png" class="edgePoint" data-id="1"></img>
				<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/edge.png" class="edgePoint" data-id="2"></img>
				<img src="<?php echo get_stylesheet_directory_uri(); ?>/img/edge.png" class="edgePoint" data-id="3"></img>
			</div>
		</div>
	</div>
	<div id="listQuestForForm">
		<p class="formTabTitle"><b>Question</b> view:</p>
	</div>
</div>
						