const input = document.getElementById("itemInput");
const button = document.getElementById("addBtn");
const list = document.getElementById("itemList");

function addItem() {
  if (input.value.trim() === "") {
    alert("لطفاً یک آیتم وارد کنید!");
    return;
  }

  const li = document.createElement("li");
  li.textContent = input.value;

  // وقتی کلیک شد، رنگ تغییر کنه و بعد حذف بشه
  li.addEventListener("click", () => {
    li.style.backgroundColor = "#ffcccc";
    setTimeout(() => li.remove(), 300);
  });

  list.appendChild(li);
  input.value = "";
}

// دکمه کلیک
button.addEventListener("click", addItem);

// Enter کیبورد
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addItem();
});
