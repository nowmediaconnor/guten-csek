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

    // Write the following statement for each block
    register_block_type('guten-csek/video-block', array(
        'editor_script' => 'video-block',
        'editor_style' => 'guten-csek-editor-style',
        'style' => 'guten-csek-frontend-style',
    ));
}
add_action('init', 'enqueue_custom_block_assets');
