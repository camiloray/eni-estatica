/* =====================================================
   ENI - Landing Page
   - Datos de convocatorias (mock)
   - Render dinámico + filtros + buscador
   - Menú móvil
   - Formulario de contacto (validación básica)
   - Año dinámico en footer
   ===================================================== */

// ==== Datos ====
const convocatorias = [
  {
    id: 1,
    titulo: 'Pedagogía para la Formación Profesional Integral',
    area: 'Pedagogía',
    modalidad: 'virtual',
    horas: 40,
    inicio: '15 de marzo, 2026',
    cierre: '10 de marzo, 2026',
    descripcion: 'Fortalece tus estrategias didácticas y el diseño de secuencias formativas.'
  },
  {
    id: 2,
    titulo: 'Evaluación del Aprendizaje por Competencias',
    area: 'Evaluación',
    modalidad: 'mixta',
    horas: 60,
    inicio: '02 de abril, 2026',
    cierre: '25 de marzo, 2026',
    descripcion: 'Diseña instrumentos de evaluación alineados al enfoque por competencias.'
  },
  {
    id: 3,
    titulo: 'Herramientas Digitales para la Enseñanza',
    area: 'TIC',
    modalidad: 'virtual',
    horas: 30,
    inicio: '10 de abril, 2026',
    cierre: '05 de abril, 2026',
    descripcion: 'Integra herramientas digitales y recursos interactivos en tus sesiones.'
  },
  {
    id: 4,
    titulo: 'Ambientes de Aprendizaje Inclusivos',
    area: 'Inclusión',
    modalidad: 'presencial',
    horas: 24,
    inicio: '22 de abril, 2026',
    cierre: '18 de abril, 2026',
    descripcion: 'Diseña espacios formativos accesibles y diversos para todos los aprendices.'
  },
  {
    id: 5,
    titulo: 'Investigación Aplicada en el Aula',
    area: 'Investigación',
    modalidad: 'mixta',
    horas: 50,
    inicio: '05 de mayo, 2026',
    cierre: '28 de abril, 2026',
    descripcion: 'Aplica metodologías de investigación para innovar en tu práctica docente.'
  },
  {
    id: 6,
    titulo: 'Bilingüismo: Inglés Técnico para Instructores',
    area: 'Idiomas',
    modalidad: 'virtual',
    horas: 80,
    inicio: '12 de mayo, 2026',
    cierre: '06 de mayo, 2026',
    descripcion: 'Desarrolla competencias comunicativas en inglés técnico y profesional.'
  }
];

// ==== Referencias DOM ====
const listEl = document.getElementById('convocatorias-list');
const emptyEl = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const chips = document.querySelectorAll('.chip');

// ==== Estado ====
let state = { search: '', modalidad: 'all' };

// ==== Utilidades ====
const modalidadLabel = (m) =>
  ({ virtual: 'Virtual', presencial: 'Presencial', mixta: 'Mixta' }[m] || m);

const escapeHtml = (str = '') =>
  str.replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

// ==== Render ====
function render() {
  const q = state.search.trim().toLowerCase();

  const filtered = convocatorias.filter((c) => {
    const matchModalidad = state.modalidad === 'all' || c.modalidad === state.modalidad;
    const matchSearch =
      !q ||
      c.titulo.toLowerCase().includes(q) ||
      c.area.toLowerCase().includes(q) ||
      c.descripcion.toLowerCase().includes(q);
    return matchModalidad && matchSearch;
  });

  listEl.innerHTML = filtered
    .map(
      (c) => `
        <li class="card">
          <div class="card-top">
            <h3>${escapeHtml(c.titulo)}</h3>
            <span class="badge ${c.modalidad}">${modalidadLabel(c.modalidad)}</span>
          </div>
          <p>${escapeHtml(c.descripcion)}</p>
          <ul class="card-meta">
            <li><span>📚 ${c.area}</span></li>
            <li><span>⏱ ${c.horas} horas</span></li>
            <li><span>📅 Inicio: ${c.inicio}</span></li>
            <li><span>🚪 Cierre: ${c.cierre}</span></li>
          </ul>
          <a class="btn btn-primary" href="#contacto" aria-label="Inscribirme en ${escapeHtml(c.titulo)}">
            Inscribirme
          </a>
        </li>
      `
    )
    .join('');

  emptyEl.hidden = filtered.length !== 0;
}

// ==== Eventos: buscador ====
searchInput.addEventListener('input', (e) => {
  state.search = e.target.value;
  render();
});

// ==== Eventos: chips ====
chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    chips.forEach((c) => {
      c.classList.remove('is-active');
      c.setAttribute('aria-selected', 'false');
    });
    chip.classList.add('is-active');
    chip.setAttribute('aria-selected', 'true');
    state.modalidad = chip.dataset.filter;
    render();
  });
});

// ==== Menú móvil ====
const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.getElementById('primary-nav');

navToggle.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

primaryNav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    primaryNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

// ==== Formulario de contacto ====
const form = document.getElementById('contact-form');
const formMsg = document.getElementById('form-msg');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const nombre = (data.get('nombre') || '').trim();
  const email = (data.get('email') || '').trim();
  const mensaje = (data.get('mensaje') || '').trim();

  if (!nombre || !email || !mensaje) {
    formMsg.style.color = '#b42318';
    formMsg.textContent = 'Por favor completa todos los campos.';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    formMsg.style.color = '#b42318';
    formMsg.textContent = 'Ingresa un correo electrónico válido.';
    return;
  }

  formMsg.style.color = '#157347';
  formMsg.textContent = `¡Gracias, ${nombre}! Hemos recibido tu mensaje.`;
  form.reset();
});

// ==== Año en footer ====
document.getElementById('year').textContent = new Date().getFullYear();

// ==== Render inicial ====
render();