///////////////////////////////// GSAP ////////////////////////////////
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

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
    duration: .5,
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