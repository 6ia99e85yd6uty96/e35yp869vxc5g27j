<?php
$fileName = $_GET['fileName'];
if (!preg_match("/^[\w\-]+\.(png|jpe?g|gif)$/", $fileName) || !is_file('../original/'.$fileName)) {
    exit("Bad request");
}
$originalSize = getimagesize('../original/'.$fileName);
$newSize = 160;
$image = imagecreatefromstring(file_get_contents('../original/'.$fileName));
$newImage = imagecreatetruecolor($newSize, $newSize);
imagesavealpha($newImage, true);
imageAlphaBlending($newImage, false);
$srcXOffset = max(($originalSize[0] - $originalSize[1]) / 2, 0);
$srcYOffset = max(($originalSize[1] - $originalSize[0]) / 2, 0);
imagecopyresampled($newImage, $image, 0, 0, $srcXOffset, $srcYOffset, $newSize, $newSize, $originalSize[0] - $srcXOffset * 2, $originalSize[1] - $srcYOffset * 2);
if (preg_match("/\.jpe?g$/", $fileName)) {
    imagejpeg($newImage, $fileName);
} else if (preg_match("/\.png$/", $fileName)) {
    imagepng($newImage, $fileName);
} else if (preg_match("/\.gif$/", $fileName)) {
    imagegif($newImage, $fileName);
}
header('Location: '.$fileName);
?>