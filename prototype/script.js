const COLUMNS = [
  { id: "todo", title: "未着手" },
  { id: "doing", title: "進行中" },
  { id: "done", title: "完了" },
];
const PRIORITY_LABEL = { low: "低", medium: "中", high: "高" };

let cards = [
  { id: "1", columnId: "todo", title: "要件定義書のレビュー", desc: "docs配下の内容を確認する", priority: "high", due: "2026-08-25" },
  { id: "2", columnId: "todo", title: "画面モックの確認", desc: "", priority: "medium", due: "" },
  { id: "3", columnId: "doing", title: "ER図の作成", desc: "tasksテーブルを設計する", priority: "medium", due: "2026-08-22" },
  { id: "4", columnId: "done", title: "技術構成の決定", desc: "React + Spring Boot + MySQL", priority: "low", due: "" },
];

let addingColumnId = null;

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function render() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  COLUMNS.forEach((col) => {
    const colEl = document.createElement("div");
    colEl.className = "column";
    colEl.innerHTML = `<h2>${col.title}</h2>`;

    const cardsEl = document.createElement("div");
    cardsEl.className = "cards";
    cardsEl.dataset.columnId = col.id;

    cards.filter((c) => c.columnId === col.id).forEach((card) => {
      cardsEl.appendChild(renderCard(card));
    });

    cardsEl.addEventListener("dragover", (e) => {
      e.preventDefault();
      cardsEl.classList.add("drag-over");
    });
    cardsEl.addEventListener("dragleave", () => {
      cardsEl.classList.remove("drag-over");
    });
    cardsEl.addEventListener("drop", (e) => {
      e.preventDefault();
      cardsEl.classList.remove("drag-over");
      const cardId = e.dataTransfer.getData("text/plain");
      const card = cards.find((c) => c.id === cardId);
      if (card) {
        card.columnId = col.id;
        render();
      }
    });

    colEl.appendChild(cardsEl);

    const addBtn = document.createElement("button");
    addBtn.className = "add-card-btn";
    addBtn.textContent = "+ カードを追加";
    addBtn.addEventListener("click", () => openModal(col.id));
    colEl.appendChild(addBtn);

    board.appendChild(colEl);
  });
}

function renderCard(card) {
  const el = document.createElement("div");
  el.className = "card";
  el.draggable = true;
  el.dataset.id = card.id;

  el.innerHTML = `
    <button class="card-delete" title="削除">✕</button>
    <div class="card-title">${escapeHtml(card.title)}</div>
    ${card.desc ? `<div class="card-desc">${escapeHtml(card.desc)}</div>` : ""}
    <div class="card-meta">
      ${card.priority ? `<span class="badge priority-${card.priority}">${PRIORITY_LABEL[card.priority]}</span>` : ""}
      ${card.due ? `<span class="due">${card.due}</span>` : ""}
    </div>
  `;

  el.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", card.id);
    setTimeout(() => el.classList.add("dragging"), 0);
  });
  el.addEventListener("dragend", () => el.classList.remove("dragging"));

  el.querySelector(".card-delete").addEventListener("click", () => {
    cards = cards.filter((c) => c.id !== card.id);
    render();
  });

  return el;
}

function openModal(columnId) {
  addingColumnId = columnId;
  document.getElementById("fieldTitle").value = "";
  document.getElementById("fieldDesc").value = "";
  document.getElementById("fieldPriority").value = "";
  document.getElementById("fieldDue").value = "";
  document.getElementById("modalOverlay").classList.add("open");
  document.getElementById("fieldTitle").focus();
}
function closeModal() {
  document.getElementById("modalOverlay").classList.remove("open");
  addingColumnId = null;
}

document.getElementById("cancelBtn").addEventListener("click", closeModal);
document.getElementById("modalOverlay").addEventListener("click", (e) => {
  if (e.target.id === "modalOverlay") closeModal();
});
document.getElementById("saveBtn").addEventListener("click", () => {
  const title = document.getElementById("fieldTitle").value.trim();
  if (!title) {
    alert("タイトルを入力してください");
    return;
  }
  cards.push({
    id: uid(),
    columnId: addingColumnId,
    title,
    desc: document.getElementById("fieldDesc").value.trim(),
    priority: document.getElementById("fieldPriority").value,
    due: document.getElementById("fieldDue").value,
  });
  closeModal();
  render();
});

render();
