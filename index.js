const loading = document.querySelector(".btn__overlay--loading");
const success = document.querySelector(".btn__overlay--success");

function openMenu() {
  document.body.classList += " menu--open";
}

function closeMenu() {
  document.body.classList.remove("menu--open");
}

function searchPending() {
  loading.classList += " btn__overlay--visible";
  setTimeout(() => {
    loading.classList.remove("btn__overlay--visible");
    success.classList += " btn__overlay--visible";
  }, 1000);
}

function showContactAlert() {
  alert("This feature has not been implemented.");
}
