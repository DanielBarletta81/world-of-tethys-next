<?php
/**
 * Plugin Name: Tethys Taxonomy Seed
 * Description: Seeds Region and Faction taxonomy terms for lore_paper on activation.
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
  ];

  $factions = [
    ['Sky City', 'sky-city'],
    ['Cambria', 'cambria'],
    ['Ironwood', 'ironwood'],
    ['Mystic', 'mystic'],
    ['Lower Tier', 'lower-tier'],
    ['Silurian', 'silurian'],
    ['Thal', 'thal'],
    ['Neutral', 'neutral'],
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
}

function tethys_seed_on_activation() {
  if (!taxonomy_exists('region') || !taxonomy_exists('faction')) {
    return;
  }
  tethys_seed_terms();
}

register_activation_hook(__FILE__, 'tethys_seed_on_activation');
