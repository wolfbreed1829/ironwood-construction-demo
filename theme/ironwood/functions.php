<?php
/** Native WordPress theme setup. */
if ( ! defined( 'ABSPATH' ) ) { exit; }

add_action( 'after_setup_theme', function () {
    add_theme_support( 'wp-block-styles' );
    add_theme_support( 'editor-styles' );
    add_editor_style( array( 'assets/fonts.css', 'assets/site.css' ) );
} );

add_action( 'wp_enqueue_scripts', function () {
    $version = wp_get_theme()->get( 'Version' );
    wp_enqueue_style( 'ironwood-fonts', get_theme_file_uri( 'assets/fonts.css' ), array(), $version );
    wp_enqueue_style( 'ironwood-site', get_theme_file_uri( 'assets/site.css' ), array( 'ironwood-fonts' ), $version );
    wp_enqueue_script( 'ironwood-site', get_theme_file_uri( 'assets/site.js' ), array(), $version, true );
} );

add_action( 'init', function () {
    register_block_pattern_category( 'ironwood', array( 'label' => __( 'Ironwood Construction', 'ironwood' ) ) );
} );

add_action( 'wp_head', function () {
    if ( is_front_page() ) {
        echo '<meta name="description" content="Ironwood Construction. Residential construction, commercial spaces, and renovations.">' . "\n";
    }
} );

