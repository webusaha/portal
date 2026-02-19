// ================================
// CONFIG
// ================================
const PORTAL_NAME = "PORTAL WEB USAHA";
const SHEET_ID = "1f6CvFnZoUvqt8m_8tPQc4vSkakZL56i2P-4XQpzMqoY";

document.getElementById("portalName").innerText = PORTAL_NAME;

// ================================
// ENDPOINT
// ================================
const PORTAL_URL = `https://opensheet.elk.sh/${SHEET_ID}/portal`;
const TAUTAN_URL = `https://opensheet.elk.sh/${SHEET_ID}/tautan`;

const grid = document.getElementById("portalGrid");
const searchInput = document.getElementById("searchInput");

let allData = [];

// ================================
// FETCH DATA
// ================================
async function loadData() {
  try {
    const [portalRes, tautanRes] = await Promise.all([
      fetch(PORTAL_URL),
      fetch(TAUTAN_URL)
    ]);

    const portalData = await portalRes.json();
    const tautanData = await tautanRes.json();

    // ================================
    // FILTER + SORT (ORDER)
    // ================================
    const publishedPortal = portalData
      .filter(item => item.status === "publish")
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

    const publishedTautan = tautanData
      .filter(item => item.status === "publish" && item.group === "utama")
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

    // ================================
    // GABUNGKAN DATA
    // ================================
    allData = [
      ...publishedPortal,
      {
        title: "TAUTAN TERKAIT",
        description: "Akses cepat ke situs populer & rujukan usaha",
        category: "Tautan",
        links: publishedTautan.map(t => ({
          name: t.name,
          url: t.url
        }))
      }
    ];

    render(allData);

  } catch (err) {
    grid.innerHTML = "<p>Gagal memuat data.</p>";
    console.error(err);
  }
}

// ================================
// RENDER CARD
// ================================
function render(data) {
  grid.innerHTML = "";

  if (!data || data.length === 0) {
    grid.innerHTML = "<p>Tidak ada data.</p>";
    return;
  }

  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    let content = "";

    if (item.category === "Tautan" && item.links) {
      content = `
        <ul class="link-list">
          ${item.links.map(l => `
            <li>
              <a href="${l.url}" target="_blank" rel="noopener">
                ${l.name}
              </a>
            </li>
          `).join("")}
        </ul>
      `;
    } else {
      content = `
        <a href="${item.url}" target="_blank" class="btn" rel="noopener">
          Buka
        </a>
      `;
    }

    card.innerHTML = `
      <span class="badge">${item.category}</span>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      ${content}
    `;

    grid.appendChild(card);
  });
}

// ================================
// SEARCH REAL-TIME
// ================================
searchInput.addEventListener("input", e => {
  const keyword = e.target.value.toLowerCase();

  const filtered = allData.filter(item =>
    item.title.toLowerCase().includes(keyword) ||
    item.description.toLowerCase().includes(keyword) ||
    item.category.toLowerCase().includes(keyword)
  );

  render(filtered);
});

// ================================
// INIT
// ================================
loadData();