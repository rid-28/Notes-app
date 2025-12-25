const apiUrl = "http://localhost:5000/notes";

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const addBtn = document.getElementById("addBtn");
const notesContainer = document.getElementById("notesContainer");

// Fetch and display notes
async function fetchNotes() {
  notesContainer.innerHTML = "";
  const res = await fetch(apiUrl);
  const notes = await res.json();

  notes.forEach(note => {
  const noteDiv = document.createElement("div");
  noteDiv.className = "note";

  // Format the date nicely
  const date = new Date(note.createdAt);
  const formattedDate = date.toLocaleDateString() + " " + date.toLocaleTimeString();

  noteDiv.innerHTML = `
    <div class="note-content">
      <h3>${note.title}</h3>
      <p>${note.content}</p>
      <small class="note-date">Created: ${formattedDate}</small>
    </div>
    <div class="note-actions">
      <button class="edit">Edit</button>
      <button class="delete">Delete</button>
    </div>
  `;

  const noteContent = noteDiv.querySelector('.note-content');
  const titleEl = noteContent.querySelector('h3');
  titleEl.addEventListener('click', () => {
    noteContent.classList.toggle('expanded');
  });

  const editBtn = noteDiv.querySelector('.edit');
  const deleteBtn = noteDiv.querySelector('.delete');

  editBtn.addEventListener('click', () => openModal(note._id, note.title, note.content));
  deleteBtn.addEventListener('click', () => deleteNote(note._id));

  notesContainer.appendChild(noteDiv);
});
}

// Add note
addBtn.addEventListener("click", async () => {
  const title = titleInput.value;
  const content = contentInput.value;
  if (!title || !content) return alert("Fill both fields");
  
  await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content })
  });

  titleInput.value = "";
  contentInput.value = "";
  fetchNotes();
});

// Delete note
async function deleteNote(id) {
  await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
  fetchNotes();
}

// Edit note
async function editNote(id, oldTitle, oldContent) {
  const newTitle = prompt("Edit Title", oldTitle);
  const newContent = prompt("Edit Content", oldContent);
  if (!newTitle || !newContent) return;

  await fetch(`${apiUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: newTitle, content: newContent })
  });

  fetchNotes();
}

// Initial fetch
fetchNotes();

// Modal elements
const modal = document.getElementById("noteModal");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");
const saveBtn = document.getElementById("saveBtn");
const closeBtn = document.querySelector(".modal .close");

let currentNoteId = null;

// Open modal with note data
function openModal(id, title, content) {
  currentNoteId = id;
  modalTitle.value = title;
  modalContent.value = content;
  modal.style.display = "block";
}

// Close modal
closeBtn.onclick = () => {
  modal.style.display = "none";
  currentNoteId = null;   // reset
};

window.onclick = (e) => { 
  if(e.target == modal) {
    modal.style.display = "none";
    currentNoteId = null;  // reset
  }
};


// Save changes
saveBtn.addEventListener("click", async () => {
  const newTitle = modalTitle.value;
  const newContent = modalContent.value;
  if (!newTitle || !newContent) return alert("Fill both fields");

  await fetch(`${apiUrl}/${currentNoteId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: newTitle, content: newContent })
  });

  modal.style.display = "none";
  fetchNotes();
});
