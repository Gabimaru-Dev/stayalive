/* Ayodele David */
// public/script.js

document.getElementById("urlForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const urlInput = document.getElementById("url");
  const message = document.getElementById("message");

  try {
    const res = await fetch("/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: urlInput.value })
    });

    const data = await res.json();
    if (data.success) {
      message.textContent = "URL successfully added to ping list!";
      message.style.color = "#8f8";
    } else {
      message.textContent = "URL already exists or invalid.";
      message.style.color = "#ffb74d";
    }

    urlInput.value = "";
  } catch (err) {
    message.textContent = "An error occurred. Try again.";
    message.style.color = "#f88";
  }
});