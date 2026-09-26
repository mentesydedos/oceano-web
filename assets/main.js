// ================= CONFIGURACIÓN =================
// Correo al que llegarán los mensajes del formulario
const CONTACT_EMAIL = 'contacto@oceanodemisericordia.org';

// TRANSMISIÓN EN VIVO (YouTube). Usa UNA de estas dos opciones:
// A) ID del video o de la transmisión programada: lo que va después de "v=" en
//    https://www.youtube.com/watch?v=XXXXXXXXXXX  (o después de /live/ en youtube.com/live/XXXXXXXXXXX)
const YOUTUBE_VIDEO_ID = '';
// B) ID del canal (empieza con "UC..."): muestra automáticamente la transmisión en vivo activa del canal.
//    Se consulta en YouTube Studio > Configuración > Canal > Configuración avanzada.
const YOUTUBE_CHANNEL_ID = '';
// Enlace al canal para el botón "Ver canal de YouTube" (ej. https://www.youtube.com/@oceanodemisericordia)
const YOUTUBE_CHANNEL_URL = '';
// =================================================

(function () {
  if (!document.getElementById('yt-frame')) return;
  const src = YOUTUBE_VIDEO_ID
    ? `https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?rel=0`
    : YOUTUBE_CHANNEL_ID ? `https://www.youtube.com/embed/live_stream?channel=${YOUTUBE_CHANNEL_ID}` : '';
  if (src) document.getElementById('yt-frame').innerHTML =
    `<iframe src="${src}" title="Transmisión en vivo de Océano de Misericordia" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
  const ch = document.getElementById('yt-channel');
  if (!ch) return;
  if (YOUTUBE_CHANNEL_URL) ch.href = YOUTUBE_CHANNEL_URL; else ch.style.display = 'none';
})();

const yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();

// menú móvil
const burger = document.querySelector('.burger'), menu = document.querySelector('.menu');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open'); burger.classList.toggle('x', open);
  burger.setAttribute('aria-expanded', open);
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); burger.classList.remove('x'); burger.setAttribute('aria-expanded', false); }));

// animaciones al hacer scroll
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// botón arriba
const tt = document.querySelector('.to-top');
addEventListener('scroll', () => tt.classList.toggle('show', scrollY > 700), { passive: true });

// logotipo interactivo
const syms = [...document.querySelectorAll('.sym')], spots = [...document.querySelectorAll('.hotspot')];
function pick(i) {
  syms.forEach((s, j) => s.classList.toggle('on', j === i));
  spots.forEach((s, j) => s.classList.toggle('on', j === i));
}
syms.forEach((s, i) => s.addEventListener('click', () => pick(i)));
spots.forEach((s, i) => s.addEventListener('click', () => { pick(i); if (innerWidth < 820) syms[i].scrollIntoView({ behavior: 'smooth', block: 'center' }); }));
if (syms.length) pick(0);

// pestañas noticias / blog
document.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.tabs button').forEach(x => x.classList.toggle('on', x === b));
  document.querySelectorAll('.panel').forEach(p => p.classList.toggle('on', p.id === 'p-' + b.dataset.tab));
}));

// botones "Quiero donar / voluntario" preseleccionan el motivo
const motivo = new URLSearchParams(location.search).get('motivo');
const sel = document.getElementById('f-subject');
if (sel && motivo) [...sel.options].forEach(o => { if (o.text === motivo) sel.value = o.text; });

// formulario: abre el correo del visitante con el mensaje ya redactado
document.getElementById('contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, note = document.getElementById('form-note');
  if (!f.checkValidity()) { note.textContent = 'Por favor completa nombre, correo, mensaje y acepta el aviso.'; f.reportValidity(); return; }
  const d = Object.fromEntries(new FormData(f));
  const body = `Nombre: ${d.nombre}\nTeléfono: ${d.telefono || '-'}\nCorreo: ${d.correo}\n\n${d.mensaje}`;
  location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('[Web] ' + d.motivo)}&body=${encodeURIComponent(body)}`;
  note.textContent = '¡Gracias! Se abrirá tu aplicación de correo para enviar el mensaje.';
});
