<?php
/*
Plugin Name: Guten Csek
Version: 1.0
Author: Csek Creative
Description: Add custom blocks to wordpress for the Gutenberg system of blocks.
*/

require 'kmeans.php';

function enqueue_blocks_iteratively()
{
    $block_names = [
        'tagline-header-block',
        'expanding-video-block',
        'block-quote-block',
        'scrolling-projects-block',
        'team-block',
        'video-carousel-block',
        'horizontal-carousel-block',
        'project-summary-block',
        'featured-image-block',
        'multi-image-block',
        'left-right-block',
        'fullscreen-image-block',
        'vertical-scrolling-images-block',
        'dom-controller-block'
    ];

    for ($i = 0; $i < count($block_names); $i++) {
        $block_name = $block_names[$i];

        register_block_type('guten-csek/' . $block_name, [
            'editor_script' => $block_name,
            'editor_style' => 'guten-csek-editor-style',
            'style' => 'guten-csek-frontend-style',
        ]);
    }
}

function enqueue_custom_block_assets()
{
    wp_enqueue_script(
        'guten-csek-blocks',
        plugins_url('build/index.js', __FILE__),
        ['wp-blocks', 'wp-element', 'wp-i18n', 'wp-editor'],
        filemtime(plugin_dir_path(__FILE__) . 'build/index.js')
    );

    wp_register_style(
        'guten-csek-editor-style',
        plugins_url('src/editor.css', __FILE__),
        ['wp-edit-blocks'],
        filemtime(plugin_dir_path(__FILE__) . 'src/editor.css')
    );

    wp_register_style(
        'guten-csek-frontend-style',
        plugins_url('src/style.css', __FILE__),
        [],
        filemtime(plugin_dir_path(__FILE__) . 'src/style.css')
    );

    enqueue_blocks_iteratively();


    // wp_register_style(
    //     'curtainify-style',
    //     plugins_url('src/curtainify.css', __FILE__),
    //     [],
    //     filemtime(plugin_dir_path(__FILE__) . 'src/curtainify.css')
    // );

    // Write the following statement for each block
    // register_block_type('guten-csek/tagline-header-block', array(
    //     'editor_script' => 'tagline-header-block',
    //     'editor_style' => 'guten-csek-editor-style',
    //     'style' => 'guten-csek-frontend-style',
    // ));
    // register_block_type('guten-csek/expanding-video-block', array(
    //     'editor_script' => 'expanding-video-block',
    //     'editor_style' => 'guten-csek-editor-style',
    //     'style' => 'guten-csek-frontend-style',
    // ));
    // register_block_type('guten-csek/block-quote-block', array(
    //     'editor_script' => 'block-quote-block',
    //     'editor_style' => 'guten-csek-editor-style',
    //     'style' => 'guten-csek-frontend-style',
    // ));
    // register_block_type('guten-csek/scrolling-projects-block', array(
    //     'editor_script' => 'scrolling-projects-block',
    //     'editor_style' => 'guten-csek-editor-style',
    //     'style' => 'guten-csek-frontend-style',
    // ));
    // register_block_type('guten-csek/team-block', array(
    //     'editor_script' => 'team-block',
    //     'editor_style' => 'guten-csek-editor-style',
    //     'style' => 'guten-csek-frontend-style',
    // ));
    // register_block_type('guten-csek/video-carousel-block', array(
    //     'editor_script' => 'video-carousel-block',
    //     'editor_style' => 'guten-csek-editor-style',
    //     'style' => 'guten-csek-frontend-style',
    // ));
    // register_block_type('guten-csek/horizontal-carousel-block', array(
    //     'editor_script' => 'horizontal-carousel-block',
    //     'editor_style' => 'guten-csek-editor-style',
    //     'style' => 'guten-csek-frontend-style',
    // ));
    // register_block_type('guten-csek/project-summary-block', array(
    //     'editor_script' => 'project-summary-block',
    //     'editor_style' => 'guten-csek-editor-style',
    //     'style' => 'guten-csek-frontend-style',
    // ));
    // register_block_type('guten-csek/featured-image-block', [
    //     'editor_script' => 'featured-image-block',
    //     'editor_style' => 'guten-csek-editor-style',
    //     'style' => 'guten-csek-frontend-style',
    // ]);
    // register_block_type('guten-csek/multi-image-block', [
    //     'editor_script' => 'multi-image-block',
    //     'editor_style' => 'guten-csek-editor-style',
    //     'style' => 'guten-csek-frontend-style',
    // ]);
    // register_block_type('guten-csek/left-right-block', [
    //     'editor_script' => 'left-right-block',
    //     'editor_style' => 'guten-csek-editor-style',
    //     'style' => 'guten-csek-frontend-style',
    // ]);
    // register_block_type('guten-csek/fullscreen-image-block', [
    //     'editor_script' => 'fullscreen-image-block',
    //     'editor_style' => 'guten-csek-editor-style',
    //     'style' => 'guten-csek-frontend-style',
    // ]);
    // register_block_type('guten-csek/vertical-scrolling-images-block', [
    //     'editor_script' => 'vertical-scrolling-images-block',
    //     'editor_style' => 'guten-csek-editor-style',
    //     'style' => 'guten-csek-frontend-style',
    // ]);
}
add_action('init', 'enqueue_custom_block_assets');

function curtainify_enqueue()
{
    $plugin_url = plugin_dir_url(__FILE__);

    wp_enqueue_style('curtainify-style', $plugin_url . 'src/curtainify.css');
}
// add_action('wp_enqueue_scripts', 'curtainify_enqueue');



function enqueue_styles_iteratively($directory_path = null)
{
    if (!$directory_path) {
        $directory_path = plugin_dir_path(__FILE__) . '/src/css';
    }

    $plugin_url = plugin_dir_url(__FILE__);
    $files = scandir($directory_path);
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') {
            continue;
        }

        $full_path = $directory_path . '/' . $file;
        if (is_dir($full_path)) {
            enqueue_styles_iteratively($full_path);
        } elseif (pathinfo($file, PATHINFO_EXTENSION) === 'css') {
            $handle = pathinfo($file, PATHINFO_FILENAME);
            $src = $plugin_url . 'src/css/' . $file;
            $deps = [];
            $ver = filemtime($full_path);

            wp_enqueue_style($handle, $src, $deps, $ver);
        }
    }
}
add_action('wp_enqueue_scripts', 'enqueue_styles_iteratively');


// API endpoints
function image_color_endpoint()
{
    register_rest_route('csek/v2', '/img-color', array(
        'methods' => 'POST',
        'callback' => 'get_image_color',
        'permission_callback' => '__return_true',
    ));
}

function get_image_color($request)
{
    $json = $request->get_json_params();
    // Your custom logic to retrieve and return data
    $base64_image = $json['base64Data'];
    $image_data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64_image));
    $image_resource = imagecreatefromstring($image_data);

    // Initialize an array to store the unique colors

    $rgb_data = createRGBArrayFromImage($image_resource, 10);
    $main_color = findMainColorOfImage($rgb_data);
    unset($rgb_data);

    imagedestroy($image_resource);
    // $colorCount = count($uniqueColors);

    return rest_ensure_response(["color" => $main_color], 200);
}

add_action('rest_api_init', 'image_color_endpoint', 999);
