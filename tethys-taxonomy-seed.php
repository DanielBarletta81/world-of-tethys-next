<?php
/**
 * Plugin Name: Tethys Taxonomy Seed
 * Description: Seeds taxonomy terms for Tethys CPTs on activation.
 * Version: 1.0.0
 * Author: World of Tethys
 */

if (!defined('ABSPATH')) {
  exit;
}

function tethys_seed_terms() {
  $regions = [
    ['Cambria', 'cambria'],
    ['Sky City', 'sky-city'],
    ['Ironwood', 'ironwood'],
    ['Mystic Woods', 'mystic-woods'],
    ['The Ledge', 'the-ledge'],
    ['Pteros Island', 'pteros-island'],
    ['Watcher Volcano', 'watcher-volcano'],
    ['Watcher Flats', 'watcher-flats'],
    ['Purgess', 'purgess'],
    ['The Weep', 'the-weep'],
    ['Devos Flats', 'devos-flats'],
    ['Iriel Flats', 'iriel-flats'],
    ['Straits of Dier', 'straits-of-dier'],
    ['Tethys Corridor', 'tethys-corridor'],
    ['Restricted Lagoons', 'restricted-lagoons'],
    ['Central Tethys', 'central-tethys'],
    ['Neo-Tethys', 'neo-tethys'],
    ['Northern Margin', 'northern-margin'],
    ['Western Tethys', 'western-tethys'],
    ['Southeastern Tethys', 'southeastern-tethys'],
    ['Tethys-wide', 'tethys-wide'],
  ];

  $factions = [
    ['Sky City', 'sky-city'],
    ['Cambria', 'cambria'],
    ['Ironwood', 'ironwood'],
    ['Mystic', 'mystic'],
    ['Lower Tier', 'lower-tier'],
    ['Silurian', 'silurian'],
    ['Thals', 'thals'],
    ['Neutral', 'neutral'],
  ];

  $eras = [
    ['Aptian-Albian', 'aptian-albian'],
    ['Cambrian', 'cambrian'],
    ['Sky City', 'sky-city'],
  ];

  $habitat_layers = [
    ['Photic Zone', 'photic-zone'],
    ['Coastal Fringe', 'coastal-fringe'],
    ['Estuary', 'estuary'],
    ['Shelf', 'shelf'],
    ['Deep Basin', 'deep-basin'],
  ];

  $luminescence = [
    ['Bioluminescent', 'bioluminescent'],
    ['Non-luminescent', 'non-luminescent'],
  ];

  $record_statuses = [
    ['On Record', 'on_record'],
    ['Off Record', 'off_record'],
    ['Lost', 'lost'],
  ];

  $archive_categories = [
    ['Character', 'character'],
    ['Creature', 'creature'],
    ['Location', 'location'],
    ['Faction', 'faction'],
    ['Record', 'record'],
  ];

  foreach ($regions as $region) {
    [$name, $slug] = $region;
    if (!term_exists($slug, 'region')) {
      wp_insert_term($name, 'region', ['slug' => $slug]);
    }
  }

  foreach ($factions as $faction) {
    [$name, $slug] = $faction;
    if (!term_exists($slug, 'faction')) {
      wp_insert_term($name, 'faction', ['slug' => $slug]);
    }
  }

  foreach ($eras as $era) {
    [$name, $slug] = $era;
    if (!term_exists($slug, 'era')) {
      wp_insert_term($name, 'era', ['slug' => $slug]);
    }
  }

  foreach ($habitat_layers as $layer) {
    [$name, $slug] = $layer;
    if (!term_exists($slug, 'habitat_layer')) {
      wp_insert_term($name, 'habitat_layer', ['slug' => $slug]);
    }
  }

  foreach ($luminescence as $term) {
    [$name, $slug] = $term;
    if (!term_exists($slug, 'luminescence')) {
      wp_insert_term($name, 'luminescence', ['slug' => $slug]);
    }
  }

  foreach ($record_statuses as $status) {
    [$name, $slug] = $status;
    if (!term_exists($slug, 'record_status')) {
      wp_insert_term($name, 'record_status', ['slug' => $slug]);
    }
  }

  foreach ($archive_categories as $category) {
    [$name, $slug] = $category;
    if (!term_exists($slug, 'archive_category')) {
      wp_insert_term($name, 'archive_category', ['slug' => $slug]);
    }
  }
}

function tethys_seed_on_activation() {
  $required = ['region', 'faction', 'era', 'habitat_layer', 'luminescence', 'record_status', 'archive_category'];
  foreach ($required as $taxonomy) {
    if (!taxonomy_exists($taxonomy)) {
      return;
    }
  }
  tethys_seed_terms();
}

register_activation_hook(__FILE__, 'tethys_seed_on_activation');
