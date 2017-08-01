$(document).ready(function() {

  'use strict';

  // =====================
  // Headroom
  // =====================

  $('.js-header').headroom({
    classes: {
      initial:  'c-header--headroom',
      top:      'c-header--top',
      notTop:   'c-header--not-top',
      pinned:   'c-header--pinned',
      unpinned: 'c-header--unpinned'
    }
  });

  // =====================
  // Responsive videos
  // =====================

  $('.c-content').fitVids({
    'customSelector': ['iframe[src*="ted.com"]']
  });

  // =====================
  // Off Canvas menu
  // =====================

  $('.js-off-canvas-toggle').click(function(e) {
    e.preventDefault();
    $('.js-off-canvas-content, .js-off-canvas-container').toggleClass('is-active');
  });

  // =====================
  // Post Card Images Fade
  // =====================

  $('.js-fadein').viewportChecker({
    classToAdd: 'is-inview', // Class to add to the elements when they are visible
    offset: 100,
    removeClassAfterAnimation: true
  });

  // =====================
  // Search
  // =====================

  var search_field = $('.js-search-input'),
      search_results = $('.js-search-result'),
      toggle_search = $('.js-search-toggle'),
      search_result_template = "\
        <div class='c-search-result__item'>\
          <a class='c-search-result__title' href='{{link}}'>{{title}}</a>\
          <span class='c-search-result__date'>{{pubDate}}</span>\
        </div>";

  toggle_search.click(function(e) {
    e.preventDefault();
    $('.js-search').addClass('is-active');

    // If off-canvas is active, just disable it
    $('.js-off-canvas-container').removeClass('is-active');

    setTimeout(function() {
      search_field.focus();
    }, 500);
  });

  $('.c-search, .js-search-close').on('click keyup', function(event) {
    if (event.target == this || event.target.className == 'js-search-close' || event.keyCode == 27) {
      $('.c-search').removeClass('is-active');
    }
  });

  search_field.ghostHunter({
    results: search_results,
    onKeyUp         : true,
    info_template   : "<h4 class='c-search-result__head'>Number of results found: {{amount}}</h4>",
    result_template : search_result_template,
    zeroResultsInfo : false,
    includepages 	: true,
    before: function() {
      search_results.fadeIn();
    }
  });

  // =====================
  // Ajax Load More
  // =====================

  var pagination_next_url = $('link[rel=next]').attr('href'),
      $load_posts_button  = $('.js-load-posts');

  $load_posts_button.click(function(e) {
    e.preventDefault();

    var request_next_link = pagination_next_url.split(/page/)[0] + 'page/' + pagination_next_page_number + '/';

    $.ajax({
      url: request_next_link,
      beforeSend: function() {
        $load_posts_button.text('Loading');
        $load_posts_button.addClass('c-btn--loading');
      }
    }).done(function(data) {
      var posts = $('.js-post-card-wrap', data);

      $load_posts_button.text('Load More');
      $load_posts_button.removeClass('c-btn--loading');

      $('.js-grid').append(posts);

      $('.js-fadein').viewportChecker({
        classToAdd: 'is-inview', // Class to add to the elements when they are visible
        offset: 100,
        removeClassAfterAnimation: true
      });

      pagination_next_page_number++;

      // If you are on the last pagination page, hide the load more button
      if (pagination_next_page_number > pagination_available_pages_number) {
        $load_posts_button.addClass('c-btn--disabled');
      }
    });
  });

});