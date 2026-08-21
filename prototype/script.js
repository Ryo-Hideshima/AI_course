const COLUMNS = [
  { id: "todo", title: "未着手" },
  { id: "doing", title: "進行中" },
  { id: "done", title: "完了" },
];
const PRIORITY_LABEL = { low: "低", medium: "中", high: "高" };
const PRIORITY_RANK = { high: 0, medium: 1, low: 2, "": 3 };

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

// ドラッグされたカードを、targetColumnId列の中のtargetCardIdの直前/直後に移動する。
// targetCardIdがnullの場合はその列の末尾に移動する。
function moveCard(draggedId, targetColumnId, targetCardId, before) {
  const fromIndex = cards.findIndex((c) => c.id === draggedId);
  if (fromIndex === -1) return;
  const [dragged] = cards.splice(fromIndex, 1);
  dragged.columnId = targetColumnId;

  if (targetCardId && targetCardId !== draggedId) {
    let targetIndex = cards.findIndex((c) => c.id === targetCardId);
    if (!before) targetIndex += 1;
    cards.splice(targetIndex, 0, dragged);
    return;
  }

  let insertAt = cards.length;
  for (let i = cards.length - 1; i >= 0; i--) {
    if (cards[i].columnId === targetColumnId) {
      insertAt = i + 1;
      break;
    }
  }
  cards.splice(insertAt, 0, dragged);
}

// 指定した列のカードだけを条件で並び替える(他の列のカードの位置には影響しない)。
function sortColumn(columnId, key) {
  const indices = [];
  const subset = [];
  cards.forEach((c, i) => {
    if (c.columnId === columnId) {
      indices.push(i);
      subset.push(c);
    }
  });

  subset.sort((a, b) => {
    if (key === "priority") {
      return PRIORITY_RANK[a.priority || ""] - PRIORITY_RANK[b.priority || ""];
    }
    if (!a.due && !b.due) return 0;
    if (!a.due) return 1;
    if (!b.due) return -1;
    return a.due.localeCompare(b.due);
  });

  indices.forEach((idx, i) => {
    cards[idx] = subset[i];
  });
  render();
}

function render() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  COLUMNS.forEach((col) => {
    const colEl = document.createElement("div");
    colEl.className = "column";
    colEl.innerHTML = `
      <h2>${col.title}</h2>
      <div class="sort-buttons">
        <button class="sort-btn" data-key="priority">優先度順</button>
        <button class="sort-btn" data-key="due">期限順</button>
      </div>
    `;
    colEl.querySelectorAll(".sort-btn").forEach((btn) => {
      btn.addEventListener("click", () => sortColumn(col.id, btn.dataset.key));
    });

    const cardsEl = document.createElement("div");
    cardsEl.className = "cards";
    cardsEl.dataset.columnId = col.id;

    cards.filter((c) => c.columnId === col.id).forEach((card) => {
      cardsEl.appendChild(renderCard(card, col.id));
    });

    // カード同士の間ではなく、列の空いた領域(カード一覧の下)にドロップした場合は末尾に追加する。
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
      const draggedId = e.dataTransfer.getData("text/plain");
      moveCard(draggedId, col.id, null, false);
      render();
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

function renderCard(card, columnId) {
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
  el.addEventListener("dragend", () => {
    el.classList.remove("dragging");
    el.classList.remove("drag-over-top", "drag-over-bottom");
  });

  // カードの上半分/下半分どちらにカーソルがあるかで、挿入位置を手前/後ろに切り替える。
  el.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = el.getBoundingClientRect();
    const before = e.clientY - rect.top < rect.height / 2;
    el.classList.toggle("drag-over-top", before);
    el.classList.toggle("drag-over-bottom", !before);
  });
  el.addEventListener("dragleave", () => {
    el.classList.remove("drag-over-top", "drag-over-bottom");
  });
  el.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const before = el.classList.contains("drag-over-top");
    el.classList.remove("drag-over-top", "drag-over-bottom");
    const draggedId = e.dataTransfer.getData("text/plain");
    moveCard(draggedId, columnId, card.id, before);
    render();
  });

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
