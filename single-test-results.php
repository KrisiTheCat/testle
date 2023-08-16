<?php
/**
 * The Template for displaying all single WPKoi events.
 *
 */

?>

<script>
	window.openedTab = 'results';
</script>
<div id="results">
	<p id="attendeeIDp" class="invisible"><?php echo json_encode(get_current_user_id());?></p>
	<h4>Your results:</h4>
	<div id="summaryDiv">
		<table>
			<tbody>
				<tr>
					<th>General score</th>
					<th width="80%" class="checkTd scoreTd pointsField-1_-1_-1_-1">N/A</th>
				</tr>
			<?php
			$moduleID = 0;
			foreach($content as $module){?>
				<tr>
					<td class="moduleID"><b>Module</b> #<?php echo ($moduleID+1);?></td>
					<td class="checkTd scoreTd pointsField<?php echo $moduleID;?>_-1_-1_-1">N/A</td>
				</tr>
				<?php
				$moduleID++;
			}
			?>
			</tbody>
		</table>
	</div>
</div>
