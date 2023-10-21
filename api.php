<?php
/*
 * Created on Sat Sep 30 2023
 * Author: Connor Doman
 */

require 'image-color.php';


function get_image_color($request)
{
    $json = $request->get_json_params();
    // Your custom logic to retrieve and return data
    $base64_image = $json['base64Data'];
    $image_data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64_image));
    $image_resource = imagecreatefromstring($image_data);

    // Initialize an array to store the unique colors
    $main_color = get_predominant_color($image_resource, 2);

    error_log('Got color: ' . $main_color);
    // $rgb_data = createRGBArrayFromImage($image_resource, 10);
    // $main_color = findMainColorOfImage($rgb_data, 10);
    // unset($rgb_data);

    // imagedestroy($image_resource);
    // // $colorCount = count($uniqueColors);

    return rest_ensure_response(["color" => $main_color], 200);
}
