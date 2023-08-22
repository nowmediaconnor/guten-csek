<?php
/*
Plugin Name: Guten Csek
*/
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
    // wp_register_style(
    //     'curtainify-style',
    //     plugins_url('src/curtainify.css', __FILE__),
    //     [],
    //     filemtime(plugin_dir_path(__FILE__) . 'src/curtainify.css')
    // );

    // Write the following statement for each block
    register_block_type('guten-csek/tagline-header-block', array(
        'editor_script' => 'tagline-header-block',
        'editor_style' => 'guten-csek-editor-style',
        'style' => 'guten-csek-frontend-style',
    ));
    register_block_type('guten-csek/expanding-video-block', array(
        'editor_script' => 'expanding-video-block',
        'editor_style' => 'guten-csek-editor-style',
        'style' => 'guten-csek-frontend-style',
    ));
    register_block_type('guten-csek/block-quote-block', array(
        'editor_script' => 'block-quote-block',
        'editor_style' => 'guten-csek-editor-style',
        'style' => 'guten-csek-frontend-style',
    ));
    register_block_type('guten-csek/scrolling-projects-block', array(
        'editor_script' => 'scrolling-projects-block',
        'editor_style' => 'guten-csek-editor-style',
        'style' => 'guten-csek-frontend-style',
    ));
    register_block_type('guten-csek/team-block', array(
        'editor_script' => 'team-block',
        'editor_style' => 'guten-csek-editor-style',
        'style' => 'guten-csek-frontend-style',
    ));
    register_block_type('guten-csek/video-carousel-block', array(
        'editor_script' => 'video-carousel-block',
        'editor_style' => 'guten-csek-editor-style',
        'style' => 'guten-csek-frontend-style',
    ));
    register_block_type('guten-csek/horizontal-carousel-block', array(
        'editor_script' => 'horizontal-carousel-block',
        'editor_style' => 'guten-csek-editor-style',
        'style' => 'guten-csek-frontend-style',
    ));
}
add_action('init', 'enqueue_custom_block_assets');

function curtainify_enqueue()
{
    $plugin_url = plugin_dir_url(__FILE__);

    wp_enqueue_style('curtainify-style', $plugin_url . 'src/curtainify.css');
}
add_action('wp_enqueue_scripts', 'curtainify_enqueue');


function enqueue_styles_iteratively()
{
    $plugin_url = plugin_dir_url(__FILE__);
    $directory_path = plugin_dir_path(__FILE__) . '/src/css';
    $files = scandir($directory_path);
    foreach ($files as $file) {
        if (pathinfo($file, PATHINFO_EXTENSION) === 'css') {
            $handle = pathinfo($file, PATHINFO_FILENAME);
            $src = $plugin_url . 'src/css/' . $file;
            $deps = [];
            $ver = filemtime(plugin_dir_path(__FILE__) . 'src/css/' . $file);

            wp_enqueue_style($handle, $src, $deps, $ver);
        }
    }
}
add_action('wp_enqueue_scripts', 'enqueue_styles_iteratively');
