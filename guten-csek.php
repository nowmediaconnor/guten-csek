<?php
/*
Plugin Name: Guten Csek
Version: 1.0
Author: Csek Creative
Description: Add custom blocks to wordpress for the Gutenberg system of blocks.
*/

require 'api.php';
require 'files.php';
// require 'kmeans.php';

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
        'dom-controller-block',
        'image-collage-block',
        'screenshot-collage-block',
        'next-project-block',
        'page-header-block',
        'featured-video-block'
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

function convert_path_to_url($path)
{
    $path = str_replace('\\', '/', $path);
    $path = str_replace(plugin_dir_path(__FILE__), '', $path);
    $path = plugin_dir_url(__FILE__) . $path;
    return $path;
}

function enqueue_css_folder()
{
    $css_directory = plugin_dir_path(__FILE__) . 'src/css';
    // echo "Enqueuing styles from directory: " . $css_directory . "<br/>";

    $files = get_all_files_from_dir($css_directory, true);

    foreach ($files as $file) {
        $handle = pathinfo($file, PATHINFO_FILENAME);
        // echo "Enqueuing style: " . $handle . "<br/>";
        $src = convert_path_to_url($file);
        $deps = [];
        $ver = filemtime($file);

        wp_enqueue_style($handle, $src, $deps, $ver);
    }
}

function enqueue_custom_block_assets()
{
    // bundled script
    wp_enqueue_script(
        'guten-csek-blocks',
        plugins_url('build/index.js', __FILE__),
        ['wp-blocks', 'wp-element', 'wp-i18n', 'wp-editor'],
        filemtime(plugin_dir_path(__FILE__) . 'build/index.js')
    );

    // fonts
    wp_enqueue_style('guten-csek-fonts', plugin_dir_url(__FILE__) . 'src/fonts/fonts.css');

    // editor-only css
    wp_register_style(
        'guten-csek-editor-style',
        plugins_url('src/editor.css', __FILE__),
        ['wp-edit-blocks'],
        filemtime(plugin_dir_path(__FILE__) . 'src/editor.css')
    );

    // misc front end css
    wp_register_style(
        'guten-csek-frontend-style',
        plugins_url('src/style.css', __FILE__),
        [],
        filemtime(plugin_dir_path(__FILE__) . 'src/style.css')
    );

    // every other stylesheet
    enqueue_css_folder();

    // enqueue block registration
    enqueue_blocks_iteratively();
}
add_action('init', 'enqueue_custom_block_assets');


// API endpoints
function image_color_endpoint()
{
    function get_image($request)
    {
        return get_image_color($request);
    }

    register_rest_route('csek/v2', '/img-color', array(
        'methods' => 'POST',
        'callback' => 'get_image',
        'permission_callback' => '__return_true',
    ));
}
add_action('rest_api_init', 'image_color_endpoint', 999);
