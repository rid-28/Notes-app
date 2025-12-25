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
    noteDiv.innerHTML = `
  <div class="note-content">
    <h3>${note.title}</h3>
    <p>${note.content}</p>
  </div>

  <div class="note-actions">
    <button class="edit" onclick="editNote('${note._id}','${note.title}','${note.content}')">
      Edit
    </button>
    <button class="delete" onclick="deleteNote('${note._id}')">
      Delete
    </button>
  </div>
`;

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
