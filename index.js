// Example Javascript Code

//import scrollSvg from '/node_modules/scroll-svg/dist/index.mjs'
import scrollSvg from './js/scroll-svg.mjs';
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

var countDownDate = new Date("Jun 29, 2024 19:30:00").getTime();
const mm = gsap.matchMedia();

var x = setInterval(function () {
  var now = new Date().getTime();
  var distance = countDownDate - now;

  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.querySelector(".days__text").textContent = days;
  document.querySelector(".hours__text").textContent = hours;
  document.querySelector(".mins__text").textContent = minutes;
  document.querySelector(".secs__text").textContent = seconds;

  // If the count down is finished, write some text 
  /* if (distance < 0) {
    clearInterval(x);
    document.getElementById("timer").innerHTML = "EXPIRED";
  } */
}, 1000);

window.addEventListener("DOMContentLoaded", () => {
  //const svgPath2 = document.querySelector('#scroll-line-2')
  // const svg2 = scrollSvg(svgPath2,{draw_origin:0.5})


  document.querySelector(".section-3").style.height = `${document.querySelector(".blocks").getBoundingClientRect().height + document.querySelector(".section-3-title").getBoundingClientRect().height}px`;

  gsap.to(".section-1 .invitation", {
    x: () => -document.querySelector(".section-1").getBoundingClientRect().width,
    y: () => document.querySelector(".section-1").getBoundingClientRect().height,
    scrollTrigger: {
      trigger: ".section-1",
      start: "top top",
      end: () => document.querySelector(".section-1").getBoundingClientRect().height * 1.25,
      scrub: 1
    }
  })
  mm.add("(min-width:961px)", () => {
    gsap.to(".heart", {
      motionPath: {
        path: "#scroll-line-2",
        align: "#scroll-line-2",
        alignOrigin: [0.5, 0.5],
      },
      scrollTrigger: {
        trigger: "#scroll-line-2",
        start: "top 25%",
        end: `+=${document.querySelector(".svg-container").getBoundingClientRect().height}`,
        scrub: 0.75,
      },
      ease: "none",
    });


    ScrollTrigger.create({
      trigger: ".block-3-big-title",
      start: "top center",
      end: "max",
      onToggle: (self) => {
        document.querySelector(".heart").style.opacity = (self.direction == 1) ? 0 : 1;
      }
    })
  });

  mm.add("(max-width:960px)", () => {
    gsap.to(".heart", {
      motionPath: {
        path: "#scroll-line-2",
        align: "#scroll-line-2",
        alignOrigin: [0.5, 0.5],
      },
      scrollTrigger: {
        trigger: "#scroll-line-2",
        start: "top 25%",
        end: `+=${document.querySelector(".svg-container").getBoundingClientRect().height}`,
        scrub: true,
      },
      ease: "none",
    });

    ScrollTrigger.create({
      trigger: ".gamos__texts",
      start: "top bottom",
      end: "max",
      onToggle: (self) => {
        document.querySelector(".heart").style.opacity = (self.direction == 1) ? 0 : 1;
      }
    })
  })

  document.querySelector("body").style.opacity = 1;
})


window.addEventListener("orientationchange",() => {
  document.querySelector(".section-3").style.height = `${document.querySelector(".blocks").getBoundingClientRect().height + document.querySelector(".section-3-title").getBoundingClientRect().height}px`;
  ScrollTrigger.refresh(true);
})

window.addEventListener("resize",() => {
  document.querySelector(".section-3").style.height = `${document.querySelector(".blocks").getBoundingClientRect().height + document.querySelector(".section-3-title").getBoundingClientRect().height}px`;
  ScrollTrigger.refresh(true);
})