gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const randNum = Math.floor(Math.random() * 3) + 1; // for 1 of 3 cursor images
const d = new Date();
let year = d.getFullYear();

var hours = d.getHours(); //returns 0-23
var minutes = d.getMinutes(); //returns 0-59
var stringHours = String(hours); //turn hours to string
var day = d.getDay() //gets current day as num, 0 = sunday

if (minutes < 10) {
  var stringMin = 0 + minutes + ""; //+""casts minutes to a string.
} else {
  var stringMin = minutes;
}

var stringTime = stringHours + stringMin;
var time = Number(stringTime); //turning time into number

if (day >= 1 && day <= 6) {
  if (time >= 1100 && time < 1430) {
    $('.lunch-time').addClass('open');
  }
}
if (day == 0) {
  if (time >= 1600 && time < 2100) {
    $('.sun').addClass('open');
  }
}
if (day >= 1 && day <= 4) {
  if (time >= 1100 && time < 2130) {
    $('.mon-thu').addClass('open');
  }
}
if (day == 5 || day == 6) {
  if (time >= 1100 && time < 2200) {
    $('.fri-sat').addClass('open');
  }
}

// adding 1 of 3 cursor images to the html for use later
$('body').append(`<img class="sushi_icon" onload="mouseMove()" src="../static/images/sushi_${randNum}.svg" />`);

// Setting animation on navbar and navbar icon at 600px width and less
$('.icon').on('click', function() {
  // using the toggle method that changes an element display even if its none
  $('.drop-down').toggle('ease-out');
  // $('.hamburger-icon').css('transform', 'rotateY(180deg');
  $('.hamburger-icon').toggleClass('flipOut').toggleClass('flipIn');
  $('.close-icon').fadeToggle(600);
  // $('.close-icon').toggleClass('flipOut').toggleClass('flipIn');
});

$(window).on("resize", function() {
  // console.log($(this).width())
  if ($(this).width() < 928) {
    $('.dp-items').addClass('hide-item');
    $('.food-dropdown').addClass('hide-item');
    $('.food-dropdown').hide();
  } else {
    $('.dp-items').removeClass('hide-item');
    $('.dp-items').removeClass('hide-item');
  }
}).trigger('resize');

// // Setting animation for menu icon when clicked and change for close icon
$('.dp-items').on('click', function() {
  if ($(this).hasClass('hide-item')) {
    $('.drop-down').toggle('ease-in');
    $('.close-icon').fadeToggle(600);
    $('.hamburger-icon').toggleClass('flipOut').toggleClass('flipIn');
  }
});

// for menu categories to appear and disappear
$('.categories button').on('click', () => {
  if ($('.food-dropdown').is(':hidden')) {
    $('.food-dropdown').slideDown('slow');
  } else {
    $('.food-dropdown').hide();
  }
});
// make the categories dropdown disappear when clicking on link
$('.categories a').on('click', () => {
  $('.food-dropdown').hide();
  if ($(window).width() < 928) {
    $('.drop-down').toggle('ease-in');
    $('.close-icon').fadeToggle(600);
    $('.hamburger-icon').toggleClass('flipOut').toggleClass('flipIn');
  }
});
// when clicking on window other than categories link close link
$(window).on('click', function(e) {
  if (!e.target.matches('.categories button')) {
    $('.food-dropdown').hide();
  }
});

// Added animation for when the cursor leaves and enters viewport
$(document).mouseleave(() => {
  $(".sushi_icon").finish().fadeOut('slow');
});
$(document).mouseenter(() => {
  $(".sushi_icon").finish().fadeIn('slow');
});

// Function on making the image follow the cursor

let mouseX = 0;
let mouseY = 0;

$(document).mousemove((e) => {
  // changing the 'top' and 'left' since the img is in absolute position
  // sushi_roe.css('top', e.pageY - 15);
  // sushi_roe.css('left', e.pageX - 20);

  /* before we were using px but to convert to rem you divide pixel by 16 for
  both the current x or y pixel; since 1rem = 16px; then do the same with the
  offset amount and concatenate string 'rem'
  */
  mouseY = ('top', (e.pageY / 16) - (15 / 16) + 'rem');
  mouseX = ('left', (e.pageX / 16) - (20 / 16) + 'rem');
});

const mouseMove = () => {
  $(".sushi_icon").css('top', mouseY);
  $(".sushi_icon").css('left', mouseX);

  window.requestAnimationFrame(mouseMove);
};

// Cross-browser Solution for smooth scroll behavior
// $(document).ready(function(){
// Add smooth scrolling to all links
$("nav a").on('click', function(e) {

  // Make sure this.hash has a value before overriding default behavior
  if (this.hash !== "") {
    // Prevent default anchor click behavior
    e.preventDefault();

    // Store hash
    var hash = this.hash;

    $('html, body').animate({
        scrollTop: $(hash).offset().top
      },
      800
    ); // End if
  }
});

const faders = document.querySelectorAll('.slide-up');
const sliders = document.querySelectorAll('.slide-across');

const appearOptions = {
  threshold: 0,
  rootMargin: "0px 0px -200px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      } else {
        entry.target.classList.add('appear');
        appearOnScroll.unobserve(entry.target);
      }
    });
  },
  appearOptions);

faders.forEach(fader => {
  appearOnScroll.observe(fader);
});

sliders.forEach(slider => {
  appearOnScroll.observe(slider)
})

// ****************uncomment below for sliding images
//$(function() {
//  try {
//    var mp1Offset = $('.mp1').offset().top
//    var mp2Offset = $('.mp2').offset().top
//
//    $('.mp1').data('mp1-offset', mp1Offset);
//    $('.mp2').data('mp2-offset', mp2Offset);
//  } catch (e) {
//    //pass
//  }
//
//})

$(window).on('scroll', function() {
  var windowTop = $(window).scrollTop();
  var mp1Off = $('.mp1').data('.mp1-offset');
  var mp2Off = $('.mp2').data('.mp2-offset');

  $('.mp1').css("transform", `translateY(-${windowTop * .8 }px)`);
  $('.mp2').css("transform", `translateY(-${windowTop * .7 }px)`);

});

// When the user scrolls down 20px from the top of the document, show the button
$(window).on('scroll', function() {
  scrollFunction()
});

function scrollFunction() {
  if ($(window).scrollTop() > 100) {
    // console.log($('body').scrollTop());
    $('#topButton').css({
      'opacity': '1',
      'transform': 'translate(0, 10px)',
      'pointer-events': 'auto'
    });
  } else {
    $("#topButton").css({
      'opacity': '0',
      'transform': 'translate(0, -10px)',
      'pointer-events': 'none'
    });
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  $(window).scrollTop(0);
}

// Adding dynamic copyright to site
$("footer").append(`<p class="copyright">© DOJI ${year}<br />All Rights Reserved</p>`)


///////////////////////////////// GSAP ////////////////////////////////
let tl = new gsap.timeline({defaults: {ease: 'power2.inOut'}});
const main = $(".main");
var menu_id = $("#menu");

tl.to(
  ".logo-symbol",
  {duration: 1,rotation: 360}
)

gsap.fromTo(
  ".slide-right",
  {
    opacity: 0,
    x: -30
  },
  {
    duration: 1,
    opacity: 1,
    x: 0,
    scrollTrigger: {
      trigger: ".slide-right",
      start: "top center",
//      markers: true,
    }
  }
)
// sliding to the left pictures
const topPics = gsap.utils.toArray('.top-pictures');
topPics.forEach(pic => {
  gsap.fromTo(
    pic,
    {opacity: 0, x: 30},
    {duration: 1, opacity: 1, x: 0,
      scrollTrigger: {
        trigger: pic, // the trigger must be the same as the targeted element
        start: "top center",
//          markers: true,
        }
      }
    )
});
// sliding to the right pictures
const botPics = gsap.utils.toArray('.bot-pictures');
botPics.forEach(pic => {
  gsap.fromTo(
    pic,
    {opacity: 0, x: -30},
    {duration: 1, opacity: 1, x: 0,
      scrollTrigger: {
        trigger: pic,
        start: "top center",
//          markers: true,
        }
      }
  )
})

gsap.fromTo(
  ".lunch",
  {
    opacity: 0,
    x: 30
  },
  {
    duration: 1,
    opacity: 1,
    x: 0,
    scrollTrigger: {
      trigger: ".lunch",
      start: "top center",
//      markers: true,
    }
  }
);

gsap.to(
  ".mp1",
  {duration: 2, y:-1000,
  scrollTrigger: {
    trigger: menu_id,
    start: 'top bottom',
    scrub: 1,
//    markers: true,
    },
  }
)

gsap.to(
  ".mp2",
  {duration: 2, y:-1300,
    scrollTrigger: {
    trigger: menu_id,
    start: 'top bottom',
    scrub: 2,
//    markers: true,
    },
  }
)

gsap.to(
  ".mp3",
  {duration: 2, y:-700,
    scrollTrigger: {
    trigger: ".lunch",
    start: '-200px bottom',
    scrub: 2,
//    markers: true,
    },
  }
)
