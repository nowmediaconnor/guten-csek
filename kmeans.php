<?php
/*
 * Created on Mon Aug 28 2023
 * Author: Connor Doman
 */

function createRGBArrayFromImage(GdImage $img, $pace = 2)
{
    // Convert the image to a 2D array of RGB values
    $rgbArray = [];
    for ($y = 0; $y < imagesy($img); $y += $pace) {
        for ($x = 0; $x < imagesx($img); $x += $pace) {
            $rgb = imagecolorat($img, $x, $y);
            $a = ($rgb >> 24) & 0x7F;
            if ($a == 127) {
                $x += 1;
                continue;
            }

            $r = ($rgb >> 16) & 0xFF;
            $g = ($rgb >> 8) & 0xFF;
            $b = $rgb & 0xFF;

            $rgbArray[] = [$r, $g, $b];
        }
    }
    return $rgbArray;
}

function findMainColorOfImage($rgbArray, $numColors = 1, $numIterations = 10)
{
    // Use K-means clustering to cluster the RGB values into K clusters
    $K = $numColors; // Change this to the number of colors you want to find
    $centroids = array_slice($rgbArray, 0, $K);
    $clusters = [];
    for ($i = 0; $i < $numIterations; $i++) { // Change the number of iterations as needed
        $clusters = array_fill(0, $K, []);
        foreach ($rgbArray as $rgb) {
            $distances = array_map(function ($centroid) use ($rgb) {
                return euclideanDistance($centroid, $rgb);
            }, $centroids);
            $minIndex = array_keys($distances, min($distances))[0];
            $clusters[$minIndex][] = $rgb;
        }
        $centroids = array_map(function ($cluster) {
            $numPoints = count($cluster);
            $sumR = array_reduce($cluster, function ($acc, $rgb) {
                return $acc + $rgb[0];
            }, 0);
            $sumG = array_reduce($cluster, function ($acc, $rgb) {
                return $acc + $rgb[1];
            }, 0);
            $sumB = array_reduce($cluster, function ($acc, $rgb) {
                return $acc + $rgb[2];
            }, 0);
            return [$sumR / $numPoints, $sumG / $numPoints, $sumB / $numPoints];
        }, $clusters);
        unset($rgb);
    }

    // For each cluster, calculate the mean RGB value
    $meanColors = array_map(function ($centroid) {
        $r = round($centroid[0]);
        $g = round($centroid[1]);
        $b = round($centroid[2]);
        return [$r, $g, $b];
    }, $centroids);

    // Sort the mean RGB values by their frequency in the original image
    $colorCounts = [];
    foreach ($rgbArray as $rgb) {
        $colorStr = implode(',', $rgb);
        $colorCounts[$colorStr] = ($colorCounts[$colorStr] ?? 0) + 1;
    }
    usort($meanColors, function ($a, $b) use ($colorCounts) {
        $aCount = $colorCounts[implode(',', $a)];
        $bCount = $colorCounts[implode(',', $b)];
        return $bCount - $aCount;
    });

    // The main color is the RGB value with the highest frequency
    $mainColor = $meanColors[0];
    // echo "The main color is RGB(" . implode(', ', $mainColor) . ")";
    return "rgb(" . implode(', ', $mainColor) . ")";
}

function euclideanDistance($a, $b)
{
    $dr = $a[0] - $b[0];
    $dg = $a[1] - $b[1];
    $db = $a[2] - $b[2];
    return sqrt($dr * $dr + $dg * $dg + $db * $db);
}
