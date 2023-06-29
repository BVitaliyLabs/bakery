function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
  
  window.addEventListener("scroll", function() {
    var button = document.querySelector(".back-to-top-btn");
    if (window.scrollY > 700) {
      button.classList.add("show");
    } else {
      button.classList.remove("show");
    }
  });
  