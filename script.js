const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");
const errorText = document.getElementById("errorText");

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArr = [];

const apiKey = "YOUR_API_KEY";
let count = 5;
const UnsplahApiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

// helper function to set attributes on DOM
const setAttributes = (element, attributes) => {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
};

const checkIfImageIsLoaded = () => {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
    count = 30;
  }
};

const createLinkAndDisplayPhotos = () => {
  imagesLoaded = 0;
  totalImages = photosArr.length;
  photosArr.forEach((photo) => {
    //   create element yo link to Unsplash
    const item = document.createElement("a");
    setAttributes(item, {
      href: photo.links.html,
      target: "_blank",
    });
    // create img for photo
    const img = document.createElement("img");
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });
    // event listener, check when each photo is done loading
    img.addEventListener("load", checkIfImageIsLoaded);
    // put img inside a , then put both inside imageContainer
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
};

const getPhotosFromUnsplash = async () => {
  errorText.textContent = "";
  try {
    const response = await fetch(UnsplahApiUrl);
    photosArr = await response.json();
    // console.log(photosArr);
    createLinkAndDisplayPhotos();
  } catch (err) {
    if (err) {
      errorText.textContent = "Ops! Something went wrong!Try again later!";
      console.log(err);
    }
    // handle error
  }
};

// check to see if scrolling near bottom of page, load more photos
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;
    getPhotosFromUnsplash();
  }
});

// on Load
getPhotosFromUnsplash();
