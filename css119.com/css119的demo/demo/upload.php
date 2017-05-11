<?php
$file_path = "uploadphp/".$_FILES['FileData']['name'];
$returnMsg="{status:true}";
move_uploaded_file( $_FILES["FileData"]["tmp_name"], $file_path);
echo $returnMsg;
?>