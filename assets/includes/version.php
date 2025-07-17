<?php
// Versioning automatico per cache busting
function getFileVersion($filePath)
{
    $fullPath = $_SERVER['DOCUMENT_ROOT'] . $filePath;
    if (file_exists($fullPath)) {
        return filemtime($fullPath);
    }
    return time();
}

function assetUrl($path)
{
    return $path . '?v=' . getFileVersion($path);
}
