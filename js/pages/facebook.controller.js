const API_URL = "https://script.google.com/macros/s/AKfycbzO7QCCg0VXgl3bp_ksoTbthJPqcovNN-B9xuE3aJcQc3IQKPT9Ede_vq84gHJDsppw_w/exec"; // Pega aquí la URL /exec de Apps Script
const $ = (id) => document.getElementById(id);
const el = (tag, cls, txt) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (txt != null) n.textContent = txt;
  return n;
};
const placeholder =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="300"><rect width="100%" height="100%" fill="#dce5f0"/></svg>',
  );
function url(v) {
  try {
    const u = new URL(v);
    return ["https:", "http:"].includes(u.protocol) ? u.href : "";
  } catch {
    return "";
  }
}
function img(v, cls) {
  const n = el("img", cls);
  n.src = url(v) || placeholder;
  n.alt = "Imagen de demostración";
  n.onerror = () => {
    n.onerror = null;
    n.src = placeholder;
  };
  return n;
}
const demo = {
  config: {
    page_name: "Mi empresa",
    page_category: "Empresa de servicios",
    page_description: "Bienvenidos a nuestra página de demostración.",
    followers: 1250,
    following: 120,
  },
  posts: [
    {
      id_post: "P001",
      post_date: "2026-11-24",
      post_text: "¡Bienvenidos! Esta es una publicación de ejemplo.",
      likes: 128,
      shares: 4,
      status: "ACTIVE",
    },
  ],
  media: [],
  comments: [
    {
      id_post: "P001",
      author: "Usuario demo",
      comment_text: "Excelente servicio",
    },
  ],
};
let data = demo,
  tab = "posts";
const liked = new Set();
function render() {
  const c = data.config;
  $("name").textContent = c.page_name || "Página demo";
  document.title = $("name").textContent + " · Demo";
  $("counts").textContent =
    `${c.followers || 0} seguidores · ${c.following || 0} seguidos`;
  $("category").textContent = c.page_category || "";
  $("description").textContent = c.page_description || "";
  $("cover").src = url(c.cover_image) || placeholder;
  $("avatar").src = url(c.profile_image) || placeholder;
  if (/^#[0-9a-f]{6}$/i.test(c.primary_color || ""))
    document.body.style.setProperty("--blue", c.primary_color);
  $("details").replaceChildren();
  for (const [k, label] of Object.entries({
    address: "Ubicación",
    phone: "Teléfono",
    email: "Correo",
    website: "Sitio web",
    page_username: "Usuario",
  })) {
    if (c[k]) $("details").append(el("div", "detail", label + ": " + c[k]));
  }
  const w = String(c.whatsapp || "").replace(/\D/g, "");
  $("contact").hidden = !w;
  if (w) $("contact").href = "https://wa.me/" + w;
  $("gallery").replaceChildren(
    ...data.media
      .filter(
        (m) =>
          String(m.status).toUpperCase() === "ACTIVE" &&
          String(m.media_type).toUpperCase() === "IMAGE",
      )
      .map((m) => img(m.media_url)),
  );
  renderFeed();
}
function renderFeed() {
  const f = $("feed");
  f.replaceChildren();
  document
    .querySelectorAll("nav button")
    .forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
  if (tab === "about") {
    const n = el("article", "card");
    n.append(
      el("h2", "", "Información"),
      el("p", "", data.config.page_description || ""),
      $("details").cloneNode(true),
    );
    f.append(n);
    return;
  }
  if (tab === "photos") {
    const n = el("article", "card");
    n.append(el("h2", "", "Fotos"), $("gallery").cloneNode(true));
    f.append(n);
    return;
  }
  const q = $("search").value.toLowerCase();
  const posts = data.posts
    .filter(
      (p) =>
        String(p.status).toUpperCase() === "ACTIVE" &&
        String(p.post_text).toLowerCase().includes(q),
    )
    .sort(
      (a, b) =>
        Number(String(b.pinned).toLowerCase() === "true") -
          Number(String(a.pinned).toLowerCase() === "true") ||
        new Date(b.post_date) - new Date(a.post_date),
    );
  if (!posts.length) f.append(el("p", "", "No hay publicaciones."));
  for (const p of posts) {
    const n = el("article", "card"),
      h = el("div", "posthead"),
      info = el("div");
    info.append(
      el("strong", "", data.config.page_name),
      el(
        "div",
        "muted",
        String(p.post_date || "").slice(0, 10) +
          (String(p.pinned).toLowerCase() === "true" ? " · Fijada" : ""),
      ),
    );
    h.append(img(data.config.profile_image), info);
    n.append(h, el("p", "", p.post_text));
    const u = url(p.media_url);
    if (u) {
      if (p.post_type === "VIDEO") {
        const v = el("video", "media");
        v.src = u;
        v.controls = true;
        n.append(v);
      } else if (p.post_type === "LINK") {
        const a = el("a", "", "Abrir enlace");
        a.href = u;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        n.append(a);
      } else n.append(img(u, "media"));
    }
    const comments = data.comments.filter(
      (c) => String(c.id_post) === String(p.id_post),
    );
    const m = el("div", "metrics");
    m.append(
      el(
        "span",
        "",
        "👍 " + ((Number(p.likes) || 0) + (liked.has(p.id_post) ? 1 : 0)),
      ),
      el(
        "span",
        "",
        `${comments.length} comentarios · ${p.shares || 0} compartidos`,
      ),
    );
    n.append(m);
    const actions = el("div", "actions"),
      like = el(
        "button",
        "",
        liked.has(p.id_post) ? "👍 Te gusta" : "Me gusta",
      ),
      cb = el("button", "", "Comentarios"),
      share = el("button", "", "Compartir");
    like.onclick = () => {
      liked.has(p.id_post) ? liked.delete(p.id_post) : liked.add(p.id_post);
      renderFeed();
    };
    const list = el("div");
    list.hidden = true;
    cb.onclick = () => (list.hidden = !list.hidden);
    share.onclick = async () => {
      try {
        await navigator.clipboard.writeText(location.href);
        share.textContent = "Enlace copiado";
      } catch {
        share.textContent = "No se pudo copiar";
      }
    };
    actions.append(like, cb, share);
    for (const c of comments) {
      const r = el("div", "comment"),
        b = el("div", "bubble");
      b.append(el("strong", "", c.author), el("p", "", c.comment_text));
      r.append(img(c.avatar_url), b);
      list.append(r);
    }
    n.append(actions, list);
    f.append(n);
  }
}
document.querySelectorAll("nav button").forEach(
  (b) =>
    (b.onclick = () => {
      tab = b.dataset.tab;
      renderFeed();
    }),
);
$("search").oninput = () => {
  tab = "posts";
  renderFeed();
};
async function init() {
  if (!API_URL) {
    $("status").textContent =
      "Modo de ejemplo: configura API_URL para conectar Google Sheets.";
    render();
    return;
  }
  try {
    $("status").textContent = "Cargando…";
    const r = await fetch(API_URL, { credentials: "omit" });
    if (!r.ok) throw Error();
    const d = await r.json();
    if (
      d.error ||
      !d.config ||
      !Array.isArray(d.posts) ||
      !Array.isArray(d.media) ||
      !Array.isArray(d.comments)
    )
      throw Error();
    data = d;
    $("status").textContent = "";
    render();
  } catch {
    $("status").textContent =
      "No se pudo conectar con Google Sheets. Se muestran datos de ejemplo.";
    render();
  }
}
init();
