/*
 * JavaScript for Accessible University Demo Site
 * http://uw.edu/accesscomputing/AU
 *
 * after-menu.js = Accessible Dropdown menu
 *
 * Menu uses Bootstrap Navbar menu code
 * https://getbootstrap.com/docs/4.0/components/navbar/
 *
 */

/**
 * Added minor supplemental code to make Bootstrap Navbar work on hover too
 */
$(window).on("load resize", function() {

  const $dropdown = $(".dropdown");
  const $dropdownToggle = $(".dropdown-toggle");
  const $dropdownMenu = $(".dropdown-menu");
  const showClass = "show";

  if (this.matchMedia("(min-width: 768px)").matches) {
    $dropdown.hover(
      function() {
        const $this = $(this);
        $this.addClass(showClass);
        $this.find($dropdownToggle).attr("aria-expanded", "true");
        $this.find($dropdownMenu).addClass(showClass);
      },
      function() {
        const $this = $(this);
        $this.removeClass(showClass);
        $this.find($dropdownToggle).attr("aria-expanded", "false");
        $this.find($dropdownMenu).removeClass(showClass);
      }
    );
  } else {
    $dropdown.off("mouseenter mouseleave");
  }
});
