<?php
/*
 * Created on Sat Sep 30 2023
 * Author: Connor Doman
 */

require 'image-color.php';


function get_theme_color($request)
{

    $json = $request->get_json_params();
    $base64_image = $json['base64Data'];
    $image_data = preg_replace('#^data:image/\w+;base64,#', '', $base64_image);
    // error_log('Got image data: ' . $image_data);

    $data = ["img" => $image_data];
    $jsonData = json_encode($data);

    $ch = curl_init('https://wwvviwiftfydmr3h62q6mzfei40rsfar.lambda-url.ca-central-1.on.aws/');
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt(
        $ch,
        CURLOPT_HTTPHEADER,
        array(
            'Content-Type: application/json',
            'Content-Length: ' . strlen($jsonData)
        )
    );

    $result = curl_exec($ch);
    if (!$result) {
        die('Error: "' . curl_error($ch) . '" - Code: ' . curl_errno($ch));
    }
    curl_close($ch);

    return $result;
}

function get_image_color($request)
{
    $json = $request->get_json_params();
    // Your custom logic to retrieve and return data
    $base64_image = $json['base64Data'];
    $image_data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64_image));

    try {

        $image_resource = imagecreatefromstring($image_data);
    } catch (Error $e) {
        error_log('Error: ' . $e->getMessage() . ' on line ' . $e->getLine() . ' from image file "' . $json['fileName'] . '"');
        return rest_ensure_response(["error" => $e->getMessage()], 500);
    }

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
