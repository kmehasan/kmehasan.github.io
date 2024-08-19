(function($) { 
"use strict";

/*================================================================= 
    pre loader 
==================================================================*/
$('.js-preloader').preloadinator({
  animation: 'fadeOut',
  animationDuration: 400
});


/* Text Animation on Hero Area */
$('#tech-tools').textition({
      animation: 'ease-out',
      map: {x: 200, y: 100, z: 0},
      autoplay: true,
      interval: 3,
      speed: 1
   });


/*================================================================= 
    Isotope initialization 
==================================================================*/
var $grid = $('.grid').isotope({
  // options
});
// layout Isotope after each image loads
$grid.imagesLoaded().progress( function() {
  $grid.isotope('layout');
}); 

// filter items on button click
$('.filter-button-group').on( 'click', 'button', function() {
  var filterValue = $(this).attr('data-filter');
  $grid.isotope({ filter: filterValue });
});

/* checking active filter */
// change is-checked class on buttons
var buttonGroups = document.querySelectorAll('.button-group');
for ( var i=0, len = buttonGroups.length; i < len; i++ ) {
var buttonGroup = buttonGroups[i];
radioButtonGroup( buttonGroup );
}

function radioButtonGroup( buttonGroup ) {
buttonGroup.addEventListener( 'click', function( event ) {
// only work with buttons
if ( !matchesSelector( event.target, 'button' ) ) {
  return;
}
buttonGroup.querySelector('.active').classList.remove('active');
event.target.classList.add('active');
});
}


/*================================================================= 
    Testimonial carousel
==================================================================*/
const swiper = new Swiper('.swiper', {
  // Optional parameters
  breakpoints: {
    1200:{
      slidesPerView: 3,
    },
    992:{
      slidesPerView: 2, 
    },
    576:{
      slidesPerView: 1
    },
   },
  //slidesPerView: 3,
  spaceBetween: 24,
  loop: true,
  autoplay: {
     delay: 5000,
   },
   

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  },

});


/*================================================================= 
    Partner carousel
==================================================================*/
const swiper2 = new Swiper('.partnerCarousel', {
  // Optional parameters
  breakpoints: {
    1200:{
      slidesPerView: 6,
    },
    992:{
      slidesPerView: 4, 
    },
    576:{
      slidesPerView: 3
    },
    320:{
      slidesPerView: 2
    },
   },
  //slidesPerView: 6,
  spaceBetween: 24,
  loop: true,
  autoplay: {
     delay: 5000,
   },

});


/*================================================================= 
    Map
==================================================================*/
var map = L.map('mapwrapper').setView([23.779063146672023, 90.35645306370449], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


var greenIcon = L.icon({
    iconUrl: "image/location.png",
    iconSize:     [36, 48], // size of the icon
});

L.marker([23.779063146672023, 90.35645306370449], {icon: greenIcon}).addTo(map);



/*================================================================= 
    Navbar fixed top
==================================================================*/
$(document).ready(function () {

    var menu = $('.site-header nav');
    var origOffsetY = $('.hero-area').height();

    function scroll() {
        if ($(window).scrollTop() >= origOffsetY) {
            $('.site-header nav').addClass('fixed-top');
            
        } else {
            $('.site-header nav').removeClass('fixed-top');
           
        }
    }

    document.onscroll = scroll;

});


/*================================================================= 
    Age calculator
==================================================================*/
$(document).ready(function () {

  // age text where id = ageText
  var ageText = $('#ageText');
  // var ageText = $('.ageText');
  var dob = new Date("1996-04-28");
  var today = new Date();
  var age = today.getFullYear() - dob.getFullYear();
  ageText.text(age+' years');
});

/*================================================================= 
    experiance calculator
==================================================================*/
$(document).ready(function () {

  var expText = $('.experienceText');
  var jobList = document.querySelectorAll('#jobList li');
  var exp = 0;
  jobList.forEach(function(job) {
    var time_frame = job.querySelector('.time-frame span').innerText.split(' - ');
    console.log(time_frame);
    if(time_frame.length != 0){
      time_frame[0] = new Date(time_frame[0]);
      if(time_frame.length == 2){
        if(time_frame[1] == 'Continuing'){
          time_frame[1] = new Date();
        }else{
          time_frame[1] = new Date(time_frame[1]);
        }
      }else{
        time_frame.push(new Date());
      }
      var jobExp = time_frame[1].getFullYear() - time_frame[0].getFullYear();
      exp += jobExp;
    }
  });
  expText.text(exp);
});


/*================================================================= 
    Contact form 
==================================================================*/
$(function() {
    // Here is the form
    var form = $('#fungi-contact');

    // Getting the messages div
    var formMessages = $('.form-message p');


    // Setting up an event listener for the contact form
  $(form).submit(function(event) {
      // Stopping the browser to submit the form
      event.preventDefault();
      
      // Serializing the form data
    // var formData = $(form).serialize();
    var formData = new FormData(this);
    formData.append('service_id', 'default_service');
    formData.append('template_id', 'template_ra8viut');
    formData.append('user_id', 'NFNxGDjNl83UJW6Jo');
    formData.append('from_name', form.find('input[name="inputName"]').val());
    formData.append('from_email', form.find('input[name="inputEmail"]').val());
    formData.append('to_name', 'KME');
    formData.append('reply_to', form.find('input[name="inputEmail"]').val());
    formData.append('message', form.find('textarea[name="inputMessage"]').val());


    // Submitting the form using AJAX
    $.ajax({
        type: 'POST',
        // url: $(form).attr('action'),
        url: 'https://api.emailjs.com/api/v1.0/email/send-form',
        data: formData,
        contentType: false, // auto-detection
        processData: false // no need to parse formData to string
    }).done(function(response) {
      
        // Making the formMessages div to have the 'success' class
        $(formMessages).removeClass('error');
        $(formMessages).addClass('success');

        // Setting the message text
        $(formMessages).text("Your message has been sent successfully. I'll get back to you soon.");

        // Clearing the form after successful submission 
        $('#inputName').val('');
        $('#inputEmail').val('');
        $('#inputPhone').val('');
        $('#inputMessage').val('');
    }).fail(function(data) {
      
        // Making the formMessages div to have the 'error' class
        $(formMessages).removeClass('success');
        $(formMessages).addClass('error');

        // Setting the message text
        if (data.responseText !== '') {
            $(formMessages).text(data.responseText);
        } else {
            $(formMessages).text('Oops! An error occured and your message could not be sent.');
        }
    });

  });

});

/*================================================================= 
    Animating numbers
==================================================================*/
$('.counter').counterUp({
    delay: 10,
    time: 3000
});


/*================================================================= 
    Progress bar animation
==================================================================*/
var waypoint = new Waypoint({
  element: document.getElementById('skill-section'),
  handler: function() {
    $('.progress .progress-bar').css("width",function() {
      return $(this).attr("aria-valuenow") + "%";
  })
  },
  //offset: 'bottom-in-view',
  offset: 700,
})


/*================================================================= 
    Animate on scroll initialization
==================================================================*/
AOS.init({
  once: true,
});

})(jQuery);

