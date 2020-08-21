<?php
$fileName = $_GET['fileName'];
if (!preg_match("/^[\w\-]+\.(png|jpe?g|gif)$/", $fileName) || !is_file('../original/'.$fileName)) {
    exit("Bad request");
}
$originalSize = getimagesize('../original/'.$fileName);
$newSize = [
    round($originalSize[0] * (160 / $originalSize[1])),
    160
];
$image = imagecreatefromstring(file_get_contents('../original/'.$fileName));
$newImage = imagecreatetruecolor($newSize[0], $newSize[1]);
imagesavealpha($newImage, true);
imageAlphaBlending($newImage, false);
imagecopyresampled($newImage, $image, 0, 0, 0, 0, $newSize[0], $newSize[1], $originalSize[0], $originalSize[1]);
if (preg_match("/\.jpe?g$/", $fileName)) {
    imagejpeg($newImage, $fileName);
} else if (preg_match("/\.png$/", $fileName)) {
    imagepng($newImage, $fileName);
} else if (preg_match("/\.gif$/", $fileName)) {
    imagegif($newImage, $fileName);
}
header('Location: '.$fileName);
?>