/*
 * JavaScript for Accessible University Demo Site
 * http://uw.edu/accesscomputing/AU
 *
 * before-menu.js = Custom inaccessible Dropdown Menu
 */

// $(document).ready(function() {

//   var timeout = 3000;
//   var timer = 0;
//   var subMenu = null;

//   $("#menu > li")
//     .on('mouseenter',function(){
//       // close previously open submenu
//       closeSubMenu();
//       // get and show new submenu
//       subMenu = $(this).children('ul');
//       subMenu.show();
//       clearTimeout(timer);
//     })
//     .parent().mouseout(function(){
//       clearTimeout(timer);
//       timer = setTimeout(function(){
//         closeSubMenu();
//       },timeout);
//     });

//   // close subMenu when click-out
//   document.onclick = closeSubMenu;

//   function closeSubMenu() {
//     if (subMenu) {
//       subMenu.hide();
//       subMenu = null;
//     }
//   }
// });
