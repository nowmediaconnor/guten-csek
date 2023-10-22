<?php

/**
 * This file uses a machine learning algorithm, __k-means clustering__, to determine the most predominant color in an image.
 * 
 * It does this in several steps:
 * 
 * 1. Resize the image to a smaller size to preserve RAM
 * 2. Extract the RGB values from each pixel in the image
 * 3. Use k-means clustering to find the most predominant color
 *
 * Created on Wed Oct 11 2023
 * @author Connor Doman
 */

/**
 * This function creates a new image with the most predominant color from the input image.
 * 
 * @param GdImage $original_image The original image to process
 * @param int $k The number of clusters to use in k-means clustering
 * @param int $resize_size The size to resize the image to in pixels
 * @param string $method The method to use to return the color. Options are "HEX", "RGB", and "JSON"
 */
function get_predominant_color(GdImage $original_image, int $k = 5, int $resize_size = 128, string $method = "HEX")
{
    // Resize image to preserve RAM
    $image = resize_image($original_image, $resize_size);

    // Extract RGB values from the image
    $rgbArray = extract_rgb_array($image);

    // Use k-means clustering to find the dominant color
    $clustering = k_means($rgbArray, $k);

    // Find the cluster with the most members
    $maxCluster = [];
    $maxCount = 0;
    foreach ($clustering as $cluster) {
        $count = count($cluster);
        if ($count > $maxCount) {
            $maxCluster = $cluster;
            $maxCount = $count;
        }
    }

    // Calculate the average color of the dominant cluster
    $avgR = $avgG = $avgB = 0;
    foreach ($maxCluster as $color) {
        $avgR += $color[0];
        $avgG += $color[1];
        $avgB += $color[2];
    }
    $avgR = round($avgR / $maxCount);
    $avgG = round($avgG / $maxCount);
    $avgB = round($avgB / $maxCount);

    $color = [$avgR, $avgG, $avgB];

    switch ($method) {
        case "HEX":
            return tuple_as_hex($color);
        case "RGB":
            return tuple_as_rgb($color);
        case "JSON":
        default:
            return tuple_as_json($color);
    }
}

function tuple_as_hex($tuple)
{
    return sprintf("#%02x%02x%02x", $tuple[0], $tuple[1], $tuple[2]);
}

function tuple_as_rgb($tuple)
{
    return sprintf("rgb(%d, %d, %d)", $tuple[0], $tuple[1], $tuple[2]);
}

function tuple_as_json($tuple)
{
    return json_encode($tuple);
}

function resize_image(GdImage $original_image, $new_width = 500)
{
    // Get the image dimensions
    $original_width = imagesx($original_image);
    $original_height = imagesy($original_image);

    // Resize image to preserve RAM
    $width = $new_width;
    $height = round($original_height / $original_width * $width);

    // Create a new iamge with the new dimensions
    $resized_image = imagecreatetruecolor($width, $height);

    // Check if the original image has transparency (PNG)
    if (imageistruecolor($original_image) && imagecolortransparent($original_image) >= 0) {
        imagealphablending($resized_image, false);
        imagesavealpha($resized_image, true);
        $transparent = imagecolorallocatealpha($resized_image, 0, 0, 0, 127);
        imagefilledrectangle($resized_image, 0, 0, $width, $height, $transparent);
    } elseif (imagecolorstotal($original_image) <= 256) {
        // If the original image is paletted with <= 256 colors (e.g., GIF), convert it to truecolor
        imagepalettecopy($original_image, $resized_image);
        imagefill($resized_image, 0, 0, imagecolorallocate($resized_image, 0, 0, 0));
        imagecolortransparent($resized_image, imagecolorallocate($resized_image, 0, 0, 0));
        imagealphablending($resized_image, false);
        imagesavealpha($resized_image, true);
    }

    // Resize and preserve transparency
    imagecopyresampled($resized_image, $original_image, 0, 0, 0, 0, $width, $height, $original_width, $original_height);

    return $resized_image;
}
function extract_rgb_array(GdImage $image)
{
    // Initialize an array to store RGB values
    $rgb_array = [];

    $width = imagesx($image);
    $height = imagesy($image);

    // Extract RGB values from the image
    for ($x = 0; $x < $width; $x++) {
        for ($y = 0; $y < $height; $y++) {
            $rgba = imagecolorat($image, $x, $y);

            $alpha = ($rgba & 0x7F000000) >> 24;
            // Skip transparent pixels
            if ($alpha >= 127) {
                // error_log('Skipping transparent pixel at: (' . $x . ', ' . $y . ')');
                continue;
            }

            $color = imagecolorsforindex($image, $rgba);

            $r = $color['red'];
            $g = $color['green'];
            $b = $color['blue'];

            $rgb_array[] = [$r, $g, $b];
        }
    }

    return $rgb_array;
}

function k_means($img_data, $k)
{
    $clusters = [];

    // Make k random centroids to start
    for ($i = 0; $i < $k; $i++) {
        $clusters[] = $img_data[array_rand($img_data)];
    }

    while (true) {
        $new_clusters = array_fill(0, $k, []);

        // Assign each data point to the nearest centroid
        foreach ($img_data as $point) {
            $min_distance = PHP_INT_MAX;
            $cluster_index = 0;

            foreach ($clusters as $index => $centroid) {
                $distance = euclidean_distance($point, $centroid);

                if ($distance < $min_distance) {
                    $min_distance = $distance;
                    $cluster_index = $index;
                }
            }

            $new_clusters[$cluster_index][] = $point;
        }

        // Calculate new centroids
        $changed = false;
        foreach ($clusters as $index => $centroid) {
            $new_centroid = calculate_centroid($new_clusters[$index]);

            if ($centroid != $new_centroid) {
                $clusters[$index] = $new_centroid;
                $changed = true;
            }
        }

        // If centroids don't change, clustering complete
        if (!$changed) {
            break;
        }
    }

    return $new_clusters;
}

function euclidean_distance($point_a, $point_b)
{
    $sum = 0;

    for ($i = 0; $i < count($point_a); $i++) {
        $sum += pow($point_a[$i] - $point_b[$i], 2);
    }

    return $sum;
}

function calculate_centroid($cluster)
{
    $num_points = count($cluster);
    $centroid = array_fill(0, count($cluster[0]), 0);
    foreach ($cluster as $point) {
        for ($i = 0; $i < count($point); $i++) {
            $centroid[$i] += $point[$i];
        }
    }
    for ($i = 0; $i < count($centroid); $i++) {
        $centroid[$i] /= $num_points;
    }
    return $centroid;
}
