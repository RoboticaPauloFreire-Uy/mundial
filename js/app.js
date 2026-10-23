// =========================================
// VARIABLES GLOBALES
// =========================================
// Pegar aquí el enlace a tu alumnos.json publicado en GitHub Pages o Firebase.
// Si se deja vacío, intentará cargar data/alumnos.json (solo funciona en servidor).
// Como último respaldo de seguridad, cargará data/alumnos.js.
const CLOUD_JSON_URL = ""; // Ya no usamos GitHub, el JSON es local.

let alumnosGlobal = [];
let grupos = [];
let paginaActual = 0;
let acabaDeEscanear = false;
const PAGINAS_EXTRA_FINALES = 4;
const paisesPorGrupo = {
    "5A": { pais: "Colombia", bandera: "🇨🇴" },
    "5B": { pais: "Ecuador", bandera: "🇪🇨" },
    "1A": { pais: "México", bandera: "🇲🇽" },
    "1B": { pais: "Estados Unidos", bandera: "🇺🇸" },
    "2A": { pais: "Portugal", bandera: "🇵🇹" },
    "2B": { pais: "Brasil", bandera: "🇧🇷" },
    "3A": { pais: "Argentina", bandera: "🇦🇷" },
    "3B": { pais: "Paraguay", bandera: "🇵🇾" },
    "4A": { pais: "España", bandera: "🇪🇸" },
    "4B": { pais: "Panamá", bandera: "🇵🇦" },
    "5PA": { pais: "Canadá", bandera: "🇨🇦" },
    "5PB": { pais: "Haití", bandera: "🇭🇹" },
    "6A": { pais: "Francia", bandera: "🇫🇷" },
    "6B": { pais: "Inglaterra", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" }
};
const perfilesPais = {
    "Panamá": {
        capital: "Ciudad de Panamá",
        poblacion: "4.4 millones aprox.",
        confederacion: "CONCACAF",
        cultura: "Puente del mundo, famoso por su Canal, clima tropical y una pasión creciente por el fútbol."
    },
    "Paraguay": {
        capital: "Asunción",
        poblacion: "6.8 millones aprox.",
        confederacion: "CONMEBOL",
        cultura: "Bilingüismo guaraní-español, tereré, rica historia y una gran tradición futbolística."
    },
    "Ecuador": {
        capital: "Quito",
        poblacion: "18 millones aprox.",
        confederacion: "CONMEBOL",
        cultura: "Centro del mundo, volcanes, islas Galápagos y una pasión vibrante por el fútbol."
    },
    "Colombia": {
        capital: "Bogotá",
        poblacion: "52 millones aprox.",
        confederacion: "CONMEBOL",
        cultura: "Café, biodiversidad, cumbia y vallenato, con una gran pasión por el fútbol."
    },
    "Haití": {
        capital: "Puerto Príncipe",
        poblacion: "11 millones aprox.",
        confederacion: "CONCACAF",
        cultura: "Primera república negra, rica en arte, música (kompa) y resiliencia histórica."
    },
    "Canadá": {
        capital: "Ottawa",
        poblacion: "40 millones aprox.",
        confederacion: "CONCACAF",
        cultura: "Naturaleza inmensa, multiculturalismo, amabilidad y amor por los deportes de invierno."
    },
    "Japón": {
        capital: "Tokio",
        poblacion: "124 millones aprox.",
        confederacion: "AFC",
        cultura: "Tradición, tecnología, respeto y disciplina conviven con una fuerte identidad deportiva."
    },
    "México": {
        capital: "Ciudad de México",
        poblacion: "129 millones aprox.",
        confederacion: "CONCACAF",
        cultura: "Música, color, familia y pasión futbolera forman parte central de su identidad."
    },
    "Alemania": {
        capital: "Berlín",
        poblacion: "84 millones aprox.",
        confederacion: "UEFA",
        cultura: "Organización, innovación, trabajo en equipo y una historia futbolística muy fuerte."
    },
    "Marruecos": {
        capital: "Rabat",
        poblacion: "37 millones aprox.",
        confederacion: "CAF",
        cultura: "Cultura diversa con influencias árabes, amazigh y africanas, reconocida por su hospitalidad."
    },
    "Portugal": {
        capital: "Lisboa",
        poblacion: "10 millones aprox.",
        confederacion: "UEFA",
        cultura: "Mar, historia, música y fútbol se mezclan con una identidad cercana y familiar."
    },
    "Brasil": {
        capital: "Brasilia",
        poblacion: "203 millones aprox.",
        confederacion: "CONMEBOL",
        cultura: "Alegría, música, diversidad y una de las culturas futboleras más reconocidas del mundo."
    },
    "Corea del Sur": {
        capital: "Seúl",
        poblacion: "52 millones aprox.",
        confederacion: "AFC",
        cultura: "Tecnología, educación, esfuerzo colectivo y una cultura moderna de gran proyección global."
    },
    "Croacia": {
        capital: "Zagreb",
        poblacion: "4 millones aprox.",
        confederacion: "UEFA",
        cultura: "Tradición mediterránea, orgullo nacional y una gran identidad deportiva."
    },
    "Argentina": {
        capital: "Buenos Aires",
        poblacion: "46 millones aprox.",
        confederacion: "CONMEBOL",
        cultura: "Fútbol, mate, música, literatura y encuentro social son parte de su vida cotidiana."
    },
    "Estados Unidos": {
        capital: "Washington D. C.",
        poblacion: "335 millones aprox.",
        confederacion: "CONCACAF",
        cultura: "Diversidad, innovación, deporte escolar y muchas comunidades conviven en un país multicultural."
    },
    "Francia": {
        capital: "París",
        poblacion: "68 millones aprox.",
        confederacion: "UEFA",
        cultura: "Arte, gastronomía, historia y diversidad cultural se combinan con tradición deportiva."
    },
    "Senegal": {
        capital: "Dakar",
        poblacion: "18 millones aprox.",
        confederacion: "CAF",
        cultura: "Música, comunidad, hospitalidad y orgullo africano marcan una cultura muy expresiva."
    },
    "España": {
        capital: "Madrid",
        poblacion: "48 millones aprox.",
        confederacion: "UEFA",
        cultura: "Fiestas, lenguas regionales, historia, gastronomía y fútbol forman parte de su identidad."
    },
    "Inglaterra": {
        capital: "Londres",
        poblacion: "56 millones aprox.",
        confederacion: "UEFA",
        cultura: "Cuna del fútbol moderno, con una rica historia, música legendaria y tradición deportiva."
    },
    "Australia": {
        capital: "Canberra",
        poblacion: "27 millones aprox.",
        confederacion: "AFC",
        cultura: "Naturaleza, deporte, vida al aire libre y multiculturalidad definen buena parte de su cultura."
    }
};

// =========================================
// INICIALIZACIÓN
// =========================================
// =========================================
// INICIALIZACIÓN
// =========================================
document.addEventListener('DOMContentLoaded', () => {

    // 1. REVISAR SI VENIMOS DE UN CÓDIGO QR Y DESBLOQUEAR FIGURITA
    handleUnlocks();

    // 2. CARGAR LOS DATOS (Esto verificará si hay que abrir el álbum automáticamente)
    initAlbum();

    const btnStart = document.getElementById('btn-start');

    if (btnStart) {
        btnStart.addEventListener('click', () => {
            abrirAlbum(true);
        });
    }
});

// =========================================
// LÓGICA DE LA PORTADA
// =========================================
function abrirAlbum(animarTapa = false) {
    const cover = document.getElementById('cover-view');
    const album = document.getElementById('album-view');

    if (!album) return;

    const mostrarAlbum = () => {
        if (cover) cover.style.display = "none";

        album.style.display = "block";

        setTimeout(() => {
            album.style.transition = "opacity 0.5s ease";
            album.style.opacity = "1";
            album.classList.add('animate__animated', 'animate__fadeIn');
            renderPagina();
        }, 50);
    };

    if (animarTapa && cover) {
        cover.style.transition = "all 0.8s ease";
        cover.style.transform = "rotateY(-110deg) scale(0.8)";
        cover.style.opacity = "0";
        setTimeout(mostrarAlbum, 600);
        return;
    }

    mostrarAlbum();
}

function startAlbum() {
    abrirAlbum(false);
}

// =========================================
// LÓGICA DE DESBLOQUEO POR QR
// =========================================
function handleUnlocks() {
    const params = new URLSearchParams(window.location.search);
    const idToUnlock = params.get('unlock');

    if (idToUnlock) {
        let coleccion = JSON.parse(localStorage.getItem('cpf_2026_coleccion')) || [];

        if (!coleccion.includes(idToUnlock)) {
            coleccion.push(idToUnlock);
            localStorage.setItem('cpf_2026_coleccion', JSON.stringify(coleccion));
        }

        acabaDeEscanear = true;
        if (window.location.protocol !== 'file:') {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
}

// =========================================
// CARGA DE DATOS Y RENDERIZADO
// =========================================
async function initAlbum() {
    try {
        let datosBase = null;

        // 1. Intentar cargar desde la nube (GitHub Pages) si hay una URL configurada
        if (CLOUD_JSON_URL) {
            try {
                const response = await fetch(CLOUD_JSON_URL);
                if (response.ok) {
                    const jsonRes = await response.json();
                    datosBase = jsonRes.alumnos ? jsonRes.alumnos : jsonRes;
                }
            } catch (err) {
                console.warn("Fallo al cargar desde la nube, intentando local...");
            }
        }

        // 2. Si no hay nube o falló, intentar cargar el JSON local
        if (!datosBase) {
            try {
                const response = await fetch("data/alumnos.json");
                if (response.ok) {
                    const jsonRes = await response.json();
                    datosBase = jsonRes.alumnos ? jsonRes.alumnos : jsonRes;
                }
            } catch (err) {
                console.warn("Fallo al cargar JSON local (¿abriste con doble clic sin servidor web?). Usando respaldo...");
            }
        }

        // 3. Respaldo de máxima seguridad: usar el archivo data/alumnos.js cargado en memoria
        if (!datosBase && typeof albumData !== 'undefined') {
            datosBase = albumData.alumnos;
        }

        // 4. Si todo falló, usar array vacío para no romper la app
        if (!datosBase) {
            datosBase = [];
        }

        procesarDatosAlbum(datosBase);
    } catch (e) {
        console.error("Error crítico inicializando el álbum:", e);
    }
}

function procesarDatosAlbum(datosBase) {
    try {
        const coleccionLocal = JSON.parse(localStorage.getItem('cpf_2026_coleccion')) || [];

        alumnosGlobal = datosBase.map(alumno => ({
            ...alumno,
            status: alumno.status || coleccionLocal.includes(alumno.id)
        }));

        grupos = [...new Set(alumnosGlobal.map(a => a.grupo))];

        const gotCount = alumnosGlobal.filter(a => a.status).length;
        const totalEl = document.getElementById('counter-total');
        const gotEl = document.getElementById('counter-got');
        const progressEl = document.getElementById('header-progress');
        
        if (totalEl) totalEl.innerText = alumnosGlobal.length;
        if (gotEl) gotEl.innerText = gotCount;
        if (progressEl && alumnosGlobal.length > 0) {
            const percentage = (gotCount / alumnosGlobal.length) * 100;
            progressEl.style.width = percentage + '%';
        }

        renderPagina();

        if (acabaDeEscanear) {
            startAlbum();
        }

    } catch (err) {
        console.error("Error inicializando el álbum:", err);
    }
}

// =========================================
// NAVEGACIÓN DE PÁGINAS CON EFECTO 3D
// =========================================
let estaAnimando = false;

function irAPagina(numeroPagina) {
    if (estaAnimando) return;
    const ultimaPagina = getUltimaPagina();

    const albumDiv = document.getElementById('album-view');

    if (!albumDiv) {
        paginaActual = Math.max(0, Math.min(ultimaPagina, numeroPagina));
        renderPagina();
        return;
    }

    estaAnimando = true;
    reproducirSonidoPagina();

    albumDiv.classList.remove('animate__fadeIn', 'hoja-entrando');
    albumDiv.classList.add('hoja-saliendo');

    setTimeout(() => {
        paginaActual = Math.max(0, Math.min(ultimaPagina, numeroPagina));
        renderPagina();

        albumDiv.classList.remove('hoja-saliendo');
        albumDiv.classList.add('hoja-entrando');

        setTimeout(() => {
            albumDiv.classList.remove('hoja-entrando');
            albumDiv.style.transform = '';
            albumDiv.style.animation = '';
            estaAnimando = false;
        }, 400);

    }, 400);
}

function cambiarPagina(direccion) {
    if (estaAnimando) return;
    const ultimaPagina = getUltimaPagina();
    const albumDiv = document.getElementById('album-view');

    // SALVAVIDAS: Si por algún motivo no encuentra el ID en el HTML, 
    // cambiamos de página sin animación para que el juego no se congele.
    if (!albumDiv) {
        console.error("No encontré id='album-view' en el HTML. Pasando página sin animación 3D.");
        paginaActual = Math.max(0, Math.min(ultimaPagina, paginaActual + direccion));
        renderPagina();
        return;
    }

    estaAnimando = true;

    reproducirSonidoPagina();

    // Animación 3D (Saliendo)
    albumDiv.classList.remove('animate__fadeIn', 'hoja-entrando');
    albumDiv.classList.add('hoja-saliendo');

    setTimeout(() => {
        // Cambiamos los datos
        paginaActual = Math.max(0, Math.min(ultimaPagina, paginaActual + direccion));
        renderPagina();

        // Animación 3D (Entrando)
        albumDiv.classList.remove('hoja-saliendo');
        albumDiv.classList.add('hoja-entrando');

        setTimeout(() => {
            albumDiv.classList.remove('hoja-entrando');
            albumDiv.style.transform = '';
            albumDiv.style.animation = '';
            estaAnimando = false;
        }, 400);

    }, 400);
}
function renderPagina() {
    const grid = document.getElementById('album-grid');
    const titulo = document.getElementById('page-title');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');

    if (grupos.length === 0 || !grid) return;

    if (paginaActual === 0) {
        renderPortadaInterna(grid, titulo, btnPrev, btnNext);
        return;
    }

    if (paginaActual === grupos.length + 1) {
        renderLogros(grid, titulo, btnPrev, btnNext);
        return;
    }

    if (paginaActual === grupos.length + 2) {
        renderEstadisticas(grid, titulo, btnPrev, btnNext);
        return;
    }

    if (paginaActual === grupos.length + 3) {
        renderEquipoIdeal(grid, titulo, btnPrev, btnNext);
        return;
    }

    if (paginaActual === grupos.length + 4) {
        renderListadoAlumnos(grid, titulo, btnPrev, btnNext);
        return;
    }

    const grupoActual = grupos[paginaActual - 1];
    if (titulo) {
        const pais = getPaisGrupo(grupoActual);
        titulo.innerHTML = `
            <span>GRUPO: ${escapeHtml(grupoActual)}</span>
            ${pais ? `<span class="country-title">${pais.bandera} ${escapeHtml(pais.pais)}</span>` : ""}
        `;
    }

    const alumnosPagina = alumnosGlobal.filter(a => a.grupo === grupoActual);

    grid.innerHTML = renderFichaPais(grupoActual);

    // ==========================================
    // MAGIA DE RENDERIZADO: ¿VACÍA O PEGADA?
    // ==========================================
    grid.innerHTML += alumnosPagina.map((al, i) => {

        // --- CASO 1: LA FIGURITA YA FUE DESBLOQUEADA (PEGADA) ---
        if (al.status) {
            return `
                <div class="figurita-pegada animate__animated animate__flipInY rounded-lg relative aspect-[3/4] flex flex-col overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow" 
                     style="animation-delay: ${i * 0.05}s"
                     onclick="abrirModal('${al.id}')">
                    
                    <div class="id-pegado">#${al.id}</div>
                    
                    <img src="${al.img}" alt="${al.nombre}" class="w-full h-full object-cover">
                </div>
            `;
        }
        // --- CASO 2: LA FIGURITA NO SE TIENE AÚN (CUADRO VACÍO) ---
        else {
            if (al.tiene_imagen) {
                return `
                    <div class="figurita-vacia rounded-lg aspect-[3/4] cursor-pointer hover:border-[#00f0ff] hover:shadow-[0_0_10px_rgba(0,240,255,0.4)] transition-all flex flex-col items-center justify-between p-2 relative group" 
                         onclick="desbloquearDesdeLista('${al.id}')" 
                         title="Click para pegar manualmente">
                        <div class="id-vacio">#${al.id}</div>
                        
                        <div class="flex flex-col items-center justify-center flex-grow w-full opacity-60 group-hover:opacity-100 transition-opacity">
                            <span class="text-2xl mb-1 text-slate-400 group-hover:text-[#00f0ff] transition-colors">➕</span>
                            <span class="text-[9px] uppercase tracking-wider font-bold text-slate-400 group-hover:text-[#00f0ff] transition-colors">Pegar</span>
                        </div> 
                        
                        <h3 class="text-[10px] md:text-xs font-bold uppercase text-slate-400 w-full text-center truncate border-t border-slate-300 pt-1">
                            ${al.nombre}
                        </h3>
                    </div>
                `;
            } else {
                return `
                    <div class="figurita-vacia rounded-lg aspect-[3/4] opacity-50 select-none flex flex-col items-center justify-between p-2 relative">
                        <div class="id-vacio">#${al.id}</div>
                        
                        <div class="flex flex-col items-center justify-center flex-grow w-full">
                            <span class="text-[9px] uppercase tracking-widest font-black text-slate-400/70">Sin Imagen</span>
                        </div> 
                        
                        <h3 class="text-[10px] md:text-xs font-bold uppercase text-slate-400/70 w-full text-center truncate border-t border-slate-300/40 pt-1">
                            ${al.nombre}
                        </h3>
                    </div>
                `;
            }
        }
    }).join('');

    // Actualizamos botones y número de página
    if (btnPrev) btnPrev.classList.toggle('invisible', paginaActual === 0);
    if (btnNext) btnNext.classList.toggle('invisible', paginaActual === getUltimaPagina());

    const footerPage = document.getElementById('footer-page-number');
    if (footerPage) footerPage.innerText = paginaActual + 1;
}

function reproducirSonidoPagina() {
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;

        const audioCtx = new AudioContextClass();
        const oscillator = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(180, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(70, audioCtx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.035, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

        oscillator.connect(gain);
        gain.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.08);
    } catch {
        // Audio opcional: si el navegador lo bloquea, la navegación sigue igual.
    }
}

function renderFichaPais(grupo) {
    const pais = getPaisGrupo(grupo);
    if (!pais) return "";

    const perfil = perfilesPais[pais.pais];
    if (!perfil) return "";

    return `
        <section class="country-card country-card--${normalizarGrupo(grupo)} col-span-2 md:col-span-4">
            <div class="country-card__flag-bg"></div>
            <div class="country-card__confed country-card__confed--${escapeHtml(perfil.confederacion.toLowerCase())}">
                <span class="country-card__ball">⚽</span>
                <strong>${escapeHtml(perfil.confederacion)}</strong>
                <small>Confed.</small>
            </div>
            <div class="country-card__content">
                <p class="country-card__eyebrow">${escapeHtml(grupo)}</p>
                <h3><span class="country-card__flag-main"></span>${escapeHtml(pais.pais)}</h3>
                <div class="country-card__facts">
                    <span><strong>Capital:</strong> ${escapeHtml(perfil.capital)}</span>
                    <span><strong>Población:</strong> ${escapeHtml(perfil.poblacion)}</span>
                </div>
                <p class="country-card__culture">${escapeHtml(perfil.cultura)}</p>
            </div>
        </section>
    `;
}

function getUltimaPagina() {
    return grupos.length + PAGINAS_EXTRA_FINALES;
}

function getResumenAlbum() {
    const total = alumnosGlobal.length;
    const pegadas = alumnosGlobal.filter(a => a.status).length;
    const porcentaje = total > 0 ? Math.round((pegadas / total) * 100) : 0;
    const faltantes = Math.max(total - pegadas, 0);
    const gruposCompletos = grupos.filter(grupo => {
        const alumnosGrupo = alumnosGlobal.filter(a => a.grupo === grupo);
        return alumnosGrupo.length > 0 && alumnosGrupo.every(a => a.status);
    });
    const gruposEmpezados = grupos.filter(grupo => {
        const alumnosGrupo = alumnosGlobal.filter(a => a.grupo === grupo);
        return alumnosGrupo.some(a => a.status);
    });

    return { total, pegadas, faltantes, porcentaje, gruposCompletos, gruposEmpezados };
}

function renderPortadaInterna(grid, titulo, btnPrev, btnNext) {
    const { total, pegadas, porcentaje } = getResumenAlbum();

    if (titulo) titulo.innerText = "PORTADA";
    if (btnPrev) btnPrev.classList.add('invisible');
    if (btnNext) btnNext.classList.remove('invisible');

    grid.innerHTML = `
        <section class="internal-cover col-span-2 md:col-span-4 animate__animated animate__fadeIn">
            <div class="internal-cover__badge">
                <img src="img/logo-cpf.jpg" alt="Logo Colegio Paulo Freire">
            </div>

            <p class="internal-cover__eyebrow">Álbum general del colegio</p>
            <h2>Jugadores del Futuro</h2>
            <p class="internal-cover__year">CPF 2026</p>

            <p class="internal-cover__message">
                Este álbum se completa entre todos. Cada figurita desbloqueada suma al progreso general
                del colegio y ayuda a construir una colección compartida.
            </p>

            <div class="internal-cover__stats">
                <div>
                    <strong>${pegadas}/${total}</strong>
                    <span>Figuritas pegadas</span>
                </div>
                <div>
                    <strong>${porcentaje}%</strong>
                    <span>Completado</span>
                </div>
                <div>
                    <strong>${grupos.length}</strong>
                    <span>Grupos</span>
                </div>
            </div>

            <div class="internal-cover__progress">
                <span style="width: ${porcentaje}%"></span>
            </div>

            <div class="mt-8 w-full max-w-2xl">
                <h3 class="text-xs md:text-sm font-bold uppercase text-slate-500 tracking-widest mb-3" style="font-family: 'Montserrat', sans-serif;">Índice de Países</h3>
                <div class="flex flex-wrap justify-center gap-2">
                    ${grupos.map((grupo, index) => {
                        const pais = getPaisGrupo(grupo);
                        const nombrePais = pais ? pais.pais : "";
                        return `<button onclick="irAPagina(${index + 1})" class="parallax-btn bg-white/80 hover:bg-white border border-[#003366]/20 text-[#003366] font-bold p-2 rounded-lg shadow-sm hover:shadow-md flex flex-col items-center gap-1 country-card--${normalizarGrupo(grupo)}" title="${nombrePais} (${grupo})">
                            <div class="country-card__flag-main parallax-content" style="margin: 0; width: 48px; height: 32px; border-radius: 4px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);"></div>
                        </button>`;
                    }).join('')}
                </div>
            </div>
        </section>
    `;

    const footerPage = document.getElementById('footer-page-number');
    if (footerPage) footerPage.innerText = 1;
}

function renderLogros(grid, titulo, btnPrev, btnNext) {
    const { total, pegadas, faltantes, porcentaje, gruposCompletos, gruposEmpezados } = getResumenAlbum();
    const ranking = getRankingFiguritasJuntadas();
    const grupoMasActivo = getGrupoMasActivo();
    const albumCompleto = total > 0 && pegadas === total;
    const mitadAlbum = porcentaje >= 50;
    const primerGrupoCompleto = gruposCompletos[0];
    const todosLosGruposEmpezados = grupos.length > 0 && gruposEmpezados.length === grupos.length;
    const topColaborador = ranking[0];
    const topDiezCompletos = ranking.length >= 10;
    const ultimaFigurita = total > 0 && faltantes === 1;

    if (titulo) titulo.innerText = "LOGROS";
    if (btnPrev) btnPrev.classList.remove('invisible');
    if (btnNext) btnNext.classList.remove('invisible');

    grid.innerHTML = `
        <section class="end-page col-span-2 md:col-span-4 animate__animated animate__fadeIn">
            <p class="end-page__eyebrow">Reconocimientos generales</p>
            <h2>Logros del Álbum</h2>

            <div class="achievement-grid">
                ${renderLogroCard(pegadas > 0, "Primera figurita", "El álbum ya empezó a completarse entre todos.", "🌟", null)}
                ${renderLogroCard(Boolean(primerGrupoCompleto), "Primer grupo completo", primerGrupoCompleto ? `${primerGrupoCompleto} ya tiene todas sus figuritas pegadas.` : "Se activa cuando un grupo completa todas sus figuritas.", "🎖️", null)}
                ${renderLogroCard(todosLosGruposEmpezados, "Todos empezados", `${gruposEmpezados.length}/${grupos.length} grupos tienen al menos una figurita pegada.`, "🚀", { actual: gruposEmpezados.length, total: grupos.length })}
                ${renderLogroCard(mitadAlbum, "Mitad del álbum", `${porcentaje}% del álbum completado.`, "⚡", { actual: porcentaje, total: 100 })}
                ${renderLogroCard(Boolean(topColaborador), "Top colaborador", topColaborador ? `${topColaborador.nombre} lidera con ${topColaborador.cantidad}.` : "Esperando figuritas juntadas.", "🏅", null)}
                ${renderLogroCard(Boolean(grupoMasActivo), "Grupo más activo", grupoMasActivo ? `${grupoMasActivo.grupo} suma ${grupoMasActivo.cantidad}.` : "Esperando datos del ranking.", "🔥", null)}
                ${renderLogroCard(topDiezCompletos, "Top 10 completo", `${ranking.length}/10 lugares del ranking ya tienen datos.`, "🔟", { actual: ranking.length, total: 10 })}
                ${renderLogroCard(ultimaFigurita, "Última figurita", ultimaFigurita ? "Queda una sola figurita para completar el álbum." : `${faltantes} figuritas restantes.`, "⏱️", null)}
                ${renderLogroCard(albumCompleto, "Álbum completo", albumCompleto ? "La colección general está completa." : `${total - pegadas} figuritas restantes.`, "👑", { actual: pegadas, total: total })}
            </div>
        </section>
    `;

    const footerPage = document.getElementById('footer-page-number');
    if (footerPage) footerPage.innerText = paginaActual + 1;
}

function renderLogroCard(activo, titulo, texto, icono, progresoObj) {
    let progressHtml = "";
    if (progresoObj && !activo && progresoObj.total > 0) {
        let maxVal = progresoObj.total || 1;
        let actVal = Math.min(progresoObj.actual || 0, maxVal);
        let pct = (actVal / maxVal) * 100;
        progressHtml = `
            <div class="achievement-card__progress">
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${pct}%"></div>
                </div>
            </div>
        `;
    }

    return `
        <article class="achievement-card ${activo ? 'achievement-card--active' : 'achievement-card--locked'}">
            <div class="achievement-card__icon-wrapper">
                <div class="achievement-card__icon">${activo ? icono : "🔒"}</div>
            </div>
            <div class="achievement-card__content">
                <h3>${titulo}</h3>
                <p>${texto}</p>
                ${progressHtml}
            </div>
        </article>
    `;
}

function renderEstadisticas(grid, titulo, btnPrev, btnNext) {
    const ranking = getRankingFiguritasJuntadas();
    const lider = ranking[0];
    const topDiez = Array.from({ length: 10 }, (_, index) => ranking[index] || null);

    if (titulo) titulo.innerText = "ESTADÍSTICAS";
    if (btnPrev) btnPrev.classList.remove('invisible');
    if (btnNext) btnNext.classList.remove('invisible');

    grid.innerHTML = `
        <section class="end-page col-span-2 md:col-span-4 animate__animated animate__fadeIn">
            <p class="end-page__eyebrow">Ranking general</p>
            <h2>Estadísticas</h2>

            <div class="stats-leader">
                <span>Alumno que juntó más figuritas</span>
                <strong>${lider ? escapeHtml(lider.nombre) : ""}</strong>
                <p>${lider ? `${lider.cantidad} figurita${lider.cantidad === 1 ? "" : "s"} juntada${lider.cantidad === 1 ? "" : "s"}` : ""}</p>
            </div>

            <div class="ranking-list">
                ${topDiez.map((item, index) => `
                    <div class="ranking-row">
                        <span class="ranking-row__pos">${index + 1}</span>
                        <span class="ranking-row__name">${item ? escapeHtml(item.nombre) : ""}</span>
                        <strong>${item ? item.cantidad : ""}</strong>
                    </div>
                `).join('')}
            </div>
        </section>
    `;

    const footerPage = document.getElementById('footer-page-number');
    if (footerPage) footerPage.innerText = paginaActual + 1;
}

function renderListadoAlumnos(grid, titulo, btnPrev, btnNext) {
    if (titulo) titulo.innerText = "LISTADO";
    if (btnPrev) btnPrev.classList.remove('invisible');
    if (btnNext) btnNext.classList.add('invisible');

    // Group alumnos by group
    const alumnosPorGrupo = {};
    alumnosGlobal.forEach(alumno => {
        if (!alumnosPorGrupo[alumno.grupo]) {
            alumnosPorGrupo[alumno.grupo] = [];
        }
        alumnosPorGrupo[alumno.grupo].push(alumno);
    });

    // Sort students inside each group alphabetically by name
    for (const g in alumnosPorGrupo) {
        alumnosPorGrupo[g].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }));
    }

    // Generate HTML
    let listadoHtml = '';
    grupos.forEach(grupo => {
        const alumnos = alumnosPorGrupo[grupo] || [];
        if (alumnos.length === 0) return;
        
        listadoHtml += `
            <div class="mb-6 w-full col-span-2 md:col-span-4">
                <h3 class="text-sm font-black text-[#003366] border-b-2 border-[#00f0ff]/30 pb-1 mb-3 uppercase tracking-wider flex justify-between items-center" style="font-family: 'Montserrat', sans-serif;">
                    <span>${escapeHtml(grupo)}</span>
                    <span class="text-xs text-slate-500 font-bold">${alumnos.filter(a => a.status).length}/${alumnos.length} Pegadas</span>
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                    ${alumnos.map(al => `
                        <div class="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div class="flex items-center gap-3 truncate">
                                <span class="font-mono text-xs font-bold bg-slate-100 text-[#003366] px-2 py-0.5 rounded border border-slate-300">#${al.id}</span>
                                <span class="font-semibold text-slate-800 text-sm truncate ${al.status ? 'line-through text-slate-400' : ''}">${escapeHtml(al.nombre)}</span>
                            </div>
                            <div>
                                ${al.status ? `
                                    <span class="text-green-500 font-bold text-xs">✔ Pegada</span>
                                ` : `
                                    <span class="text-slate-400 font-bold text-xs uppercase tracking-wider">Falta</span>
                                `}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });

    const totalAlumnos = alumnosGlobal.length;
    const totalPegadas = alumnosGlobal.filter(a => a.status).length;

    grid.innerHTML = `
        <section class="end-page roster-page col-span-2 md:col-span-4 animate__animated animate__fadeIn w-full">
            <p class="end-page__eyebrow">Control general</p>
            <h2>Listado de Figuritas</h2>

            <div class="roster-summary mb-6 flex justify-between bg-slate-800 text-white p-3 rounded-lg border border-[#00f0ff]/20">
                <span><strong>${totalAlumnos}</strong> Alumnos</span>
                <span><strong>${totalPegadas}</strong> Pegadas</span>
                <span><strong>${totalAlumnos - totalPegadas}</strong> Restantes</span>
            </div>

            <div class="w-full">
                ${listadoHtml}
            </div>
        </section>
    `;

    const footerPage = document.getElementById('footer-page-number');
    if (footerPage) footerPage.innerText = paginaActual + 1;
}

function desbloquearDesdeLista(id) {
    const alumno = alumnosGlobal.find(a => a.id === id);
    if (!alumno) return;
    iniciarCinematicaSobre(alumno);
}

function renderEquipoIdeal(grid, titulo, btnPrev, btnNext) {
    const seleccionados = alumnosGlobal
        .filter(alumno => alumno.equipo_ideal)
        .sort((a, b) => Number(b.figuritas_juntadas || 0) - Number(a.figuritas_juntadas || 0) || a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }))
        .slice(0, 11);
    const titulares = Array.from({ length: 11 }, (_, index) => seleccionados[index] || null);

    if (titulo) titulo.innerText = "EQUIPO IDEAL";
    if (btnPrev) btnPrev.classList.remove('invisible');
    if (btnNext) btnNext.classList.remove('invisible');

    grid.innerHTML = `
        <section class="end-page dream-team-page col-span-2 md:col-span-4 animate__animated animate__fadeIn">
            <p class="end-page__eyebrow">Selección manual</p>
            <h2>Equipo Ideal CPF 2026</h2>

            <div class="dream-team-field">
                ${titulares.map((alumno, index) => renderEquipoIdealCard(alumno, index)).join('')}
            </div>
        </section>
    `;

    const footerPage = document.getElementById('footer-page-number');
    if (footerPage) footerPage.innerText = paginaActual + 1;
}

function renderEquipoIdealCard(alumno, index) {
    if (!alumno) {
        return `
            <article class="dream-player dream-player--empty dream-player--pos-${index + 1}">
                <span class="dream-player__number">${index + 1}</span>
            </article>
        `;
    }

    return `
        <article class="dream-player dream-player--pos-${index + 1}">
            <span class="dream-player__number">${index + 1}</span>
            <div class="dream-player__photo">
                <img src="${escapeHtml(alumno.img)}" alt="${escapeHtml(alumno.nombre)}">
            </div>
            <h3>${escapeHtml(alumno.nombre)}</h3>
            <p>${formatGrupoPais(alumno.grupo)}</p>
            <strong>${escapeHtml(alumno.valor_destacado || "Destacado CPF")}</strong>
        </article>
    `;
}

function getRankingFiguritasJuntadas() {
    return alumnosGlobal
        .map(alumno => ({
            nombre: alumno.nombre,
            grupo: alumno.grupo,
            cantidad: Number(alumno.figuritas_juntadas || 0)
        }))
        .filter(alumno => alumno.cantidad > 0)
        .sort((a, b) => b.cantidad - a.cantidad || a.nombre.localeCompare(b.nombre))
        .slice(0, 10);
}

function getGrupoMasActivo() {
    const totalesPorGrupo = alumnosGlobal.reduce((acc, alumno) => {
        const cantidad = Number(alumno.figuritas_juntadas || 0);
        acc[alumno.grupo] = (acc[alumno.grupo] || 0) + cantidad;
        return acc;
    }, {});

    return Object.entries(totalesPorGrupo)
        .map(([grupo, cantidad]) => ({ grupo, cantidad }))
        .filter(item => item.cantidad > 0)
        .sort((a, b) => b.cantidad - a.cantidad || a.grupo.localeCompare(b.grupo))
        [0] || null;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function normalizarGrupo(grupo) {
    const texto = String(grupo || "")
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/Ñ/g, "N");

    const grado = texto.match(/[1-6]/)?.[0];
    const seccion = texto.match(/[AB]\s*$/)?.[0].trim();

    if (!grado || !seccion) return texto.replace(/\s+/g, "");

    if (grado === "5" && !texto.includes("ANOS")) {
        return `5P${seccion}`;
    }

    return `${grado}${seccion}`;
}

function getPaisGrupo(grupo) {
    return paisesPorGrupo[normalizarGrupo(grupo)] || null;
}

function formatGrupoPais(grupo) {
    return escapeHtml(formatGrupoPaisTexto(grupo));
}

function formatGrupoPaisTexto(grupo) {
    const pais = getPaisGrupo(grupo);
    return pais ? `${grupo} ${pais.bandera} ${pais.pais}` : String(grupo || "");
}
// =========================================
// LÓGICA DEL MODAL (VER FIGURITA AGRANDADA)
// =========================================
// ... (Mantén el resto de tu código app.js igual hasta la función abrirModal)

let currentAlumno = null;

function abrirModal(id) {
    const alumno = alumnosGlobal.find(a => a.id === id);
    if (!alumno) return;
    currentAlumno = alumno;

    const modal = document.getElementById('modal-figurita');
    if (!modal) return;

    // Cargamos todos los datos (Imagen e ID)
    document.getElementById('modal-img').src = alumno.img;

    // Si agregaste el span para el ID (como en el código HTML de arriba)
    const modalId = document.getElementById('modal-id');
    if (modalId) {
        modalId.innerText = alumno.id;
    }

    // Mostramos el modal
    modal.classList.remove('hidden');
    modal.classList.add('flex', 'animate__fadeIn');
    modal.classList.remove('animate__fadeOut');
}

function abrirCarpetaDrive() {
    if (currentAlumno && currentAlumno.drive_url) {
        window.open(currentAlumno.drive_url, '_blank');
    } else {
        alert("Aún no hay carpeta de Google Drive asignada para este alumno.");
    }
}

function cerrarModal() {
    const modal = document.getElementById('modal-figurita');
    if (!modal) return;

    modal.classList.add('animate__fadeOut');
    modal.classList.remove('animate__fadeIn');

    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 300);
}

// =========================================
// EFECTO PARALLAX
// =========================================
document.addEventListener('mousemove', (e) => {
    document.querySelectorAll('.parallax-btn').forEach(btn => {
        const rect = btn.getBoundingClientRect();
        
        // Calcular si el mouse está cerca o sobre el botón
        const x = e.clientX - rect.left; // Posición X dentro del botón
        const y = e.clientY - rect.top;  // Posición Y dentro del botón
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Si el mouse está fuera del área extendida del botón, resetear
        if (e.clientX < rect.left - 50 || e.clientX > rect.right + 50 ||
            e.clientY < rect.top - 50 || e.clientY > rect.bottom + 50) {
            btn.style.transform = `perspective(500px) rotateX(0deg) rotateY(0deg) scale(1)`;
            btn.style.boxShadow = '';
            return;
        }

        // Calcular la inclinación (max 20 grados)
        const rotateX = ((y - centerY) / centerY) * -20;
        const rotateY = ((x - centerX) / centerX) * 20;

        btn.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.15)`;
        btn.style.zIndex = 10;
        btn.style.boxShadow = `${-rotateY}px ${rotateX}px 15px rgba(0, 0, 0, 0.3)`;
    });
});

document.addEventListener('mouseleave', () => {
    document.querySelectorAll('.parallax-btn').forEach(btn => {
        btn.style.transform = `perspective(500px) rotateX(0deg) rotateY(0deg) scale(1)`;
        btn.style.boxShadow = '';
        btn.style.zIndex = 1;
    });
});

/* =========================================
   SISTEMA DE ESCANEO Y APERTURA DE SOBRES
   ========================================= */

function abrirModalQR() {
    const modal = document.getElementById('modal-qr');
    const input = document.getElementById('qr-input');
    const errorMsg = document.getElementById('qr-error');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        input.value = '';
        errorMsg.classList.add('hidden');
        input.focus();
    }
}

let html5QrcodeScanner = null;

function activarCamara() {
    const readerDiv = document.getElementById('qr-reader');
    readerDiv.classList.remove('hidden');
    
    if (!html5QrcodeScanner) {
        html5QrcodeScanner = new Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: {width: 200, height: 200} },
            false);
            
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    }
}

function onScanSuccess(decodedText, decodedResult) {
    document.getElementById('qr-input').value = decodedText;
    procesarCodigoQR();
}

function onScanFailure(error) {
    // Ignoramos errores de lectura por cuadro
}

function cerrarModalQR() {
    const modal = document.getElementById('modal-qr');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
    
    if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().then(() => {
            html5QrcodeScanner = null;
            document.getElementById('qr-reader').classList.add('hidden');
        }).catch(error => {
            console.error("No se pudo apagar la cámara.", error);
        });
    }
}

function extractDriveId(url) {
    if (!url) return null;
    // Match folders: /folders/ID
    const folderMatch = url.match(/\/folders\/([a-zA-Z0-9-_]+)/);
    if (folderMatch) return folderMatch[1];
    
    // Match files: /file/d/ID or /d/ID
    const fileMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (fileMatch) return fileMatch[1];
    
    // Match open?id=ID or id=ID
    const idParamMatch = url.match(/[?&]id=([a-zA-Z0-9-_]+)/);
    if (idParamMatch) return idParamMatch[1];
    
    return url.trim().toLowerCase();
}

function procesarCodigoQR() {
    const input = document.getElementById('qr-input').value.trim();
    const errorMsg = document.getElementById('qr-error');
    
    if (!input) {
        errorMsg.innerText = "Por favor ingresa un código o enlace.";
        errorMsg.classList.remove('hidden');
        return;
    }

    const inputUpper = input.toUpperCase();
    const inputDriveId = extractDriveId(input);

    // Buscar si el ID existe (o si escaneó el link de drive directo)
    const alumno = alumnosGlobal.find(a => {
        if (a.id.toUpperCase() === inputUpper) return true;
        if (a.drive_url && inputDriveId) {
            const alumnoDriveId = extractDriveId(a.drive_url);
            return alumnoDriveId && alumnoDriveId.toLowerCase() === inputDriveId.toLowerCase();
        }
        return false;
    });
    
    if (!alumno) {
        errorMsg.innerText = "Código o enlace inválido. Figurita no encontrada.";
        errorMsg.classList.remove('hidden');
        return;
    }
    
    if (alumno.status) {
        errorMsg.innerText = "¡Ya tienes esta figurita pegada en tu álbum!";
        errorMsg.classList.remove('hidden');
        return;
    }

    // Código válido y figurita nueva
    cerrarModalQR();
    iniciarCinematicaSobre(alumno);
}

function iniciarCinematicaSobre(alumno) {
    const modal = document.getElementById('modal-pack-opening');
    const pack = document.getElementById('virtual-pack');
    const card = document.getElementById('revealed-card');
    const img = document.getElementById('revealed-img');
    const name = document.getElementById('revealed-name');
    
    if (!modal) return;
    
    // Preparar UI
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    pack.classList.remove('pack-explode', 'hidden');
    pack.classList.add('pack-shake');
    card.classList.add('hidden');
    card.classList.remove('card-reveal');
    
    img.src = alumno.img;
    name.innerText = alumno.nombre;
    
    // Evento para abrir el sobre
    pack.onclick = function() {
        pack.onclick = null; // Evitar multiples clicks
        pack.classList.remove('pack-shake');
        pack.classList.add('pack-explode');
        
        // Efecto de sonido
        try { reproducirSonidoPagina(); } catch(e){}
        
        // Esperar a que el sobre explote para mostrar la carta
        setTimeout(() => {
            pack.classList.add('hidden');
            card.classList.remove('hidden');
            card.classList.add('card-reveal');
            
            // Disparar confeti
            lanzarConfeti();
            
            // Guardar en la colección y cerrar
            setTimeout(() => {
                guardarEnColeccion(alumno.id);
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }, 4500); // 4.5 segundos viendo la carta nueva
            
        }, 500); // Medio segundo dura la explosión
    };
}

function lanzarConfeti() {
    if (typeof confetti !== 'undefined') {
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#00f0ff', '#eab308', '#ffffff']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#00f0ff', '#eab308', '#ffffff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }
}

function guardarEnColeccion(id) {
    // Actualizar LocalStorage
    const coleccionLocal = JSON.parse(localStorage.getItem('cpf_2026_coleccion')) || [];
    if (!coleccionLocal.includes(id)) {
        coleccionLocal.push(id);
        localStorage.setItem('cpf_2026_coleccion', JSON.stringify(coleccionLocal));
    }
    
    // Recargar álbum completo (esto actualiza status, página, logros, etc.)
    initAlbum();
}
