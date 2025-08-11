
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
  import { getFirestore, collection, addDoc, getDocs, query, orderBy } 
  from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDKOEwuQCRprbFXD7Q1gNuJEGvyX5tCWic",
    authDomain: "restaurant-menu-678a4.firebaseapp.com",
    projectId: "restaurant-menu-678a4",
    storageBucket: "restaurant-menu-678a4.firebasestorage.app",
    messagingSenderId: "218132392551",
    appId: "1:218132392551:web:20f3185fe4db2e27d102c2",
    measurementId: "G-JMB2TJ4SBV"
  };

  // Initialize Firebase
 const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("Firebase initialized, db:", db);


const actionButtons = document.querySelectorAll(".nav-btn.action");

actionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.target;

    if (targetId) {
      const targetSection = document.querySelector(`#${targetId}`);

      if (targetSection) {
        // Special toggle logic for Opening-Hours and Contact-and-Location
        if (
          targetId === "Opening-Hours" ||
          targetId === "Contact-and-Location"
        ) {
          const otherId =
            targetId === "Opening-Hours"
              ? "Contact-and-Location"
              : "Opening-Hours";

          const otherSection = document.querySelector(`#${otherId}`);

          // Show target section
          const isHidden = targetSection.classList.contains("hidden");
          if (isHidden) {
            targetSection.classList.remove("hidden");
            targetSection.scrollIntoView({ behavior: "smooth" });
          } else {
            targetSection.classList.add("hidden");
          }

          // Always hide the other one
          if (otherSection && !otherSection.classList.contains("hidden")) {
            otherSection.classList.add("hidden");
          }
        } else {
          // Default behavior for all other sections — toggle individually
          targetSection.classList.toggle("hidden");

          if (!targetSection.classList.contains("hidden")) {
            targetSection.scrollIntoView({ behavior: "smooth" });
          }
        }
      }
    }
  });
});
/*Reviews logic*/
const reviewSubmitBtn = document.getElementById("review-submit-btn");
const modal = document.getElementById("review-modal");
const confirmSubmit = document.getElementById("confirm-submit");
const cancelBtn = document.getElementById("cancel-btn");
const textarea = document.getElementById("review");
const reviewsButton = document.querySelector(".reviews-btn");
const output = document.getElementById("review-output");
  

reviewSubmitBtn.addEventListener("click", (e) => {
e.preventDefault();
  modal.showModal();
});

// Save review to Firestore
async function saveReview(date, text) {
  try {
    await addDoc(collection(db, "reviews"), {
      date: date,
      text: text
    });
    console.log("Review saved!");
  } catch (error) {
    console.error("Error adding review: ", error);
  }
}

// Load reviews from Firestore and display
async function loadReviews() {
  const reviewsContainer = document.getElementById("reviews-container");
  reviewsContainer.innerHTML = "";

  const q = query(collection(db, "reviews"), orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);

console.log("Number of reviews loaded:", querySnapshot.size);

if (querySnapshot.size === 0) {
    reviewsContainer.textContent = "No reviews yet.";
  }

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    console.log("Review data:", data);
    
    const dateEl = document.createElement("h4");
    dateEl.textContent = data.date;
    const textEl = document.createElement("p");
    textEl.textContent = data.text;

    reviewsContainer.appendChild(dateEl);
    reviewsContainer.appendChild(textEl);
  });
}

// When confirm submit clicked, save the review
confirmSubmit.addEventListener("click", async (e) => {
  e.preventDefault();

  const now = new Date();
  const dateString = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }) + " " + now.toLocaleTimeString("en-US", {
    hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit",
  });

  const reviewText = textarea.value.trim();
  if (!reviewText) {
    alert("Please enter a review");
    return;
  }

  await saveReview(dateString, reviewText);
  textarea.value = "";
  modal.close();

  // Refresh reviews list after saving
  await loadReviews();
});

  // Cancel button clears and closes modal
cancelBtn.addEventListener("click", () => {
  textarea.value = "";
  modal.close();
});

reviewsButton.addEventListener("click", async () => {
output.style.display = "block";
reviewsButton.style.display = "none";
await loadReviews();
});

const closeReviewBtn = document.getElementById("close-review");
closeReviewBtn.addEventListener("click", () => {
  output.style.display = "none";
  reviewsButton.style.display = "block";
});