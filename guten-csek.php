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
        'featured-video-block',
        'chicago-fires-block',
        'self-description-block'
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

    $files = get_all_files_from_dir($css_directory, true, ['app.css', 'app-editor.css', 'style.css', 'editor.css', 'blocks']);

    foreach ($files as $file) {
        // error_log('Enqueuing style: ' . $file);
        $handle = pathinfo($file, PATHINFO_FILENAME);
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
        ['wp-element', 'wp-i18n'],
        filemtime(plugin_dir_path(__FILE__) . 'build/index.js')
    );
    $apiSettings = [
        'root' => esc_url_raw(rest_url()),
        'nonce' => wp_create_nonce('wp_rest')
    ];
    wp_add_inline_script("guten-csek-blocks", "const CSEK_API_SETTINGS = " . json_encode($apiSettings), "before");

    // fonts
    // wp_enqueue_style('guten-csek-fonts', plugin_dir_url(__FILE__) . 'src/fonts/fonts.css');

    // misc front end css
    wp_register_style(
        'guten-csek-frontend-style',
        plugins_url('css/guten-csek.css', __FILE__),
        [],
        filemtime(plugin_dir_path(__FILE__) . 'css/guten-csek.css')
    );

    // every other stylesheet
    // enqueue_css_folder();

    // enqueue block registration
    enqueue_blocks_iteratively();
}
// Only enqueue these scripts if we're not in the admin panel
add_action('init', 'enqueue_custom_block_assets');

/* Enqueue Editor-Only Scripts */
function enqueue_editor_scripts()
{
    $script_asset_path = plugin_dir_path(__FILE__) . "/build/editor.asset.php";
    if (!file_exists($script_asset_path)) {
        throw new Error(
            'You need to run `npm start` or `npm run build` to generate files for the Guten Csek plugin.'
        );
    }
    $editor_script = 'build/editor.js';

    // Enqueue the block index.js file
    wp_enqueue_script(
        'guten-csek-editor-script', // unique handle
        plugins_url($editor_script, __FILE__),
        ['wp-blocks', 'wp-element', 'wp-i18n', 'wp-editor'], // required dependencies for blocks
        filemtime(plugin_dir_path(__FILE__) . $editor_script)
    );

    // editor-only css
    wp_register_style(
        'guten-csek-editor-style',
        plugins_url('css/guten-csek-editor.css', __FILE__),
        ['wp-edit-blocks'],
        filemtime(plugin_dir_path(__FILE__) . 'css/guten-csek-editor.css')
    );
}
add_action('enqueue_block_editor_assets', 'enqueue_editor_scripts');


// API endpoints
function image_color_endpoint()
{
    function get_image($request)
    {
        // return get_image_color($request);
        return get_theme_color($request);
    }

    register_rest_route('csek/v2', '/img-color', array(
        'methods' => 'POST',
        'callback' => 'get_image',
        'permission_callback' => '__return_true',
    ));
}
add_action('rest_api_init', 'image_color_endpoint', 999);

// Custom Theme Category

function register_layout_category($categories)
{

    $newCategory = array(
        'slug'  => 'csek',
        'title' => 'Csek Creative'
    );

    array_splice($categories, 0, 0, array($newCategory));

    return $categories;
}

if (version_compare(get_bloginfo('version'), '5.8', '>=')) {
    add_filter('block_categories_all', 'register_layout_category');
} else {
    add_filter('block_categories', 'register_layout_category');
}

/* Add Guten-Csek classname */

function add_custom_class_to_blocks($content)
{
    // Define your custom class name to be added
    $additionalClass = 'guten-csek-block';

    // Regular expression to match any HTML tag with the existing class name
    // This pattern now captures all parts of the tag, including other attributes
    $pattern = '/<([a-zA-Z][a-zA-Z0-9]*)\s+(.*?)\bclass="([^"]*?wp-block-guten-csek-[^"]*?)"(.*?)>/';

    $content = preg_replace_callback($pattern, function ($matches) use ($additionalClass) {
        $tag = $matches[1]; // Tag name
        $preAttrs = $matches[2]; // Attributes before the class attribute
        $classes = $matches[3]; // Existing classes
        $postAttrs = $matches[4]; // Attributes after the class attribute
        $updatedClasses = $classes . ' ' . $additionalClass; // Add the new class
        return "<$tag $preAttrs class=\"$updatedClasses\"$postAttrs>";
    }, $content);

    return $content;
}

add_filter('render_block', 'add_custom_class_to_blocks');
