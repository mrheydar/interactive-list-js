const input = document.getElementById("itemInput");
const button = document.getElementById("addBtn");
const list = document.getElementById("itemList");
const tagSelect = document.getElementById("tagSelect");
const filterSelect = document.getElementById("filterSelect");

let items = JSON.parse(localStorage.getItem("items")) || [];
items.forEach(item => createListItem(item));
let dragged = null;

function saveItems() { localStorage.setItem("items", JSON.stringify(items)); }

function createListItem(item){
  const li = document.createElement("li");
  li.dataset.id = item.id;

  const textSpan = document.createElement("span");
  textSpan.textContent = `${item.text} [${item.tag}]`;
  textSpan.setAttribute("draggable","true");
  li.appendChild(textSpan);

  const editBtn = document.createElement("button");
  editBtn.textContent = "✏️";
  li.appendChild(editBtn);

  editBtn.addEventListener("click", () => {
    li.innerHTML = "";

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = item.text;
    li.appendChild(editInput);

    const editTag = document.createElement("select");
    ["عمومی","کار","شخصی"].forEach(t=>{
      const opt = document.createElement("option");
      opt.value=t; opt.textContent=t;
      if(t===item.tag) opt.selected=true;
      editTag.appendChild(opt);
    });
    li.appendChild(editTag);

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "💾";
    li.appendChild(saveBtn);

    function saveEdit(){
      const newText = editInput.value.trim();
      const newTag = editTag.value;
      if(!newText) return alert("نمی‌توان خالی گذاشت!");
      item.text = newText;
      item.tag = newTag;
      li.innerHTML = "";
      textSpan.textContent = `${newText} [${newTag}]`;
      li.appendChild(textSpan);
      li.appendChild(editBtn);
      saveItems();
    }

    saveBtn.addEventListener("click", saveEdit);
    editInput.addEventListener("keydown", e => {
      if(e.key==="Enter") saveEdit();
      if(e.key==="Escape"){ li.innerHTML=""; li.appendChild(textSpan); li.appendChild(editBtn); }
    });
  });

  li.addEventListener("dblclick", ()=>{
    const index = items.findIndex(i=>i.id===item.id);
    if(index>-1) items.splice(index,1);
    li.remove();
    saveItems();
  });

  textSpan.addEventListener("dragstart", e=>{ dragged=li; e.dataTransfer.effectAllowed="move"; e.target.style.opacity=0.5; });
  textSpan.addEventListener("dragend", e=>{ e.target.style.opacity=""; dragged=null; });
  li.addEventListener("dragover", e=>e.preventDefault());
  li.addEventListener("drop", e=>{
    e.preventDefault();
    if(dragged && dragged!==li){
      const nodes = Array.from(list.children);
      const draggedIndex = nodes.indexOf(dragged);
      const targetIndex = nodes.indexOf(li);
      if(draggedIndex < targetIndex) list.insertBefore(dragged, li.nextSibling);
      else list.insertBefore(dragged, li);
      items = Array.from(list.children).map(li=>items.find(i=>i.id===li.dataset.id));
      saveItems();
    }
  });

  list.appendChild(li);
}

function addItem(){
  const value = input.value.trim();
  if(!value) return alert("لطفاً یک آیتم وارد کنید!");
  const tag = tagSelect.value;
  const id = Date.now().toString();
  const newItem={id,text:value,tag};
  items.push(newItem);
  createListItem(newItem);
  saveItems();
  input.value="";
}

button.addEventListener("click", addItem);
input.addEventListener("keydown", e=>{ if(e.key==="Enter") addItem(); });

filterSelect.addEventListener("change", ()=>{
  const value = filterSelect.value;
  list.innerHTML="";
  items.filter(item=>value==="all"||item.tag===value)
       .forEach(item=>createListItem(item));
});
