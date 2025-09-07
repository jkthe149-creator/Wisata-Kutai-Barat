// --- Animasi ikon mode peta hanya jika klik tombol Jelajahi ---
document.addEventListener('DOMContentLoaded', function() {
  const exploreBtn = document.querySelector('.explore-btn');
  if (exploreBtn) {
    exploreBtn.addEventListener('mouseenter', function() {
      this.style.background = 'linear-gradient(45deg, #FF6B6B, #FF9A3D)';
    });
    exploreBtn.addEventListener('mouseleave', function() {
      this.style.background = 'linear-gradient(45deg, #FF9A3D, #FF6B6B)';
    });
    exploreBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const overlay = document.getElementById('landing-overlay');
      overlay.style.opacity = 0;
      overlay.style.visibility = 'hidden';
      setTimeout(() => overlay.style.display = 'none', 600);
      window._triggeredByExploreBtn = true;
      showMapModeModal();
    });
  }

  // ================== MAP INIT ==================
  const gpsBtn = document.getElementById('gps-btn');
  gpsBtn.style.display = 'none';
  let wisataMarkersVisible = false;
  const indonesiaBounds = [[-11.0, 94.0], [6.0, 141.0]];
  const map = L.map('map', {
    center: [-0.2, 115.6],
    zoom: 10,
    minZoom: 5,
    maxZoom: 18,
    maxBounds: indonesiaBounds,
    maxBoundsViscosity: 1.0,
    zoomAnimation: true,
    zoomAnimationThreshold: 4
  });

  // --- Map Layers ---
  const defaultLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri'
  });

  // --- Dark Mode Layer ---
  const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  });

  const labels = L.tileLayer('https://cartodb-basemaps-a.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OSM</a> & Carto',
    pane: 'shadowPane'
  }).addTo(map);

  const baseLayers = {
    "Default": defaultLayer,
    "Satelit": satellite,
    "Mode Gelap": darkLayer
  };

  defaultLayer.addTo(map);

  const layerControl = L.control.layers(baseLayers, {
    "Label Jalan & Lokasi": labels
  }, {
    position: 'topright'
  }).addTo(map);

  map.on('baselayerchange', async function(e) {
    if (wisataMarkersVisible) {
      hideAllMarkers();
      await showMarkersAnimated();
    }
  });

  // --- Map Mode Modal Logic ---
  const mapModeModal = document.getElementById('map-mode-modal');
  let mapModeSelected = false;
  let firstMarkerDelay = false;
  function showMapModeModal() {
    mapModeModal.style.display = 'flex';
    document.querySelectorAll('.map-mode-option.selected').forEach(el => el.classList.remove('selected'));
    if (window._triggeredByExploreBtn) {
      setTimeout(() => mapModeModal.classList.add('show'), 10);
      window._triggeredByExploreBtn = false;
    }
    map.scrollWheelZoom.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
  }
  function hideMapModeModal() {
    mapModeModal.classList.remove('show');
    setTimeout(() => { mapModeModal.style.display = 'none'; }, 350);
    map.scrollWheelZoom.enable();
    map.touchZoom.enable();
    map.doubleClickZoom.enable();
    map.boxZoom.enable();
    map.keyboard.enable();
  }
  document.querySelectorAll('.map-mode-option').forEach(opt => {
    opt.addEventListener('click', async function() {
      document.querySelectorAll('.map-mode-option').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      const mode = this.getAttribute('data-mode');
      if (mode === 'default') {
        map.eachLayer(l => { if (l !== labels && map.hasLayer(l)) map.removeLayer(l); });
        defaultLayer.addTo(map);
      } else if (mode === 'satellite') {
        map.eachLayer(l => { if (l !== labels && map.hasLayer(l)) map.removeLayer(l); });
        satellite.addTo(map);
      } else if (mode === 'dark') {
        map.eachLayer(l => { if (l !== labels && map.hasLayer(l)) map.removeLayer(l); });
        darkLayer.addTo(map);
      }
      hideMapModeModal();
      mapModeSelected = true;
      firstMarkerDelay = true;
      gpsBtn.style.display = 'flex';
      requestLocationPermission();
    });
  });

  // ================== DATA WISATA ==================
  const wisata = [{
    name: "Jantur Mapan",
    coords: [-0.17495892410772118, 115.62464606649087],
    desc: "Air Terjun Jantur Mapan terletak sekitar 10 km dari Melak Kubar di Kampung Linggang Mapan, mudah diakses dari jalan utama Barong Tongkok-Linggang Bigung. Air terjun tingginya kurang dari 10 meter dengan volume air besar, dikelilingi pepohonan rindang dan sejuk. Terdapat dua paviliun istirahat, toilet, ruang ganti, dua ayunan kecil dengan bangku, dan produk budaya Dayak seperti anyaman keranjang (anjat) serta topi pelindung (seraung). Tiket masuk Rp5.000 per orang.",
    type: "jantur",
    images: ["https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Mapan1.jpg", "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Mapan2.jpg", "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Mapan3.jpg"],
    address: "Kampung Linggang Mapan, Kecamatan Linggang Bigung, Kabupaten Kutai Barat, Kalimantan Timur"
  }, {
    name: "Jantur Tabalas",
    coords: [-0.1717730816498666, 115.57041117998328],
    desc: "Jantur Tabalas merupakan air terjun di tengah hutan tropis yang lebat dan alami. Tempat ini menonjolkan keindahan alam dan sesuai untuk pengunjung yang menyukai petualangan dan kegiatan outdoor.",
    type: "jantur",
    images: ["https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Tabalas1.jpg", "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Tabalas2.jpg"],
    address: "RHHC+658, Jl. Poros Tenggarong Melak, Juhan Asa, Kec. Barong Tongkok, Kabupaten Kutai Barat, Kalimantan Timur 75776"
  }, {
    name: "Jantur Inar",
    coords: [-0.2989443832829239, 115.54792189532664],
    desc: "Air Terjun Jantur Inar adalah air terjun tinggi di Kutai Barat dengan hutan tropis masih asli, menawarkan pengalaman alam yang menenangkan dan petualangan. Tempat ini juga memiliki nilai budaya penting terkait kisah seorang gadis Dayak bangsawan.",
    type: "jantur",
    images: ["https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Inar1.jpg", "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Inar2.jpg", "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Inar3.jpg"],
    address: "PG2X+85V, Terajuk, Nyuatan, West Kutai Regency, East Kalimantan 75777"
  }, {
    name: "Jantur Sengkulai",
    coords: [-0.17123533922068557, 115.61586372416258],
    desc: "Jantur Sengkulai adalah destinasi wisata alam air terjun di tengah hutan yang terletak di Kabupaten Kutai Barat, Kalimantan Timur. Air terjun ini memiliki aliran air deras yang menyegarkan, terutama saat musim hujan.",
    type: "jantur",
    images: ["https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Sengkulai1.jpg", "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Sengkulai2.jpg", "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Sengkulai3.jpg"],
    address: "RJH8+C8Q, Jl. Sengkereaq Lacaq, Linggang Mapan, Kec. Linggang Bigung, Kabupaten Kutai Barat, Kalimantan Timur 75776"
  }, {
    name: "Jantur Dora",
    coords: [-0.23325511106740596, 115.59239457998318],
    desc: "Jantur Dora adalah tempat wisata air terjun yang terletak di Kalimantan Timur, Kutai Barat, tepatnya di Kampung Juhan Asa. Air terjun ini menjadi salah satu destinasi wisata alam yang populer dan banyak dikunjungi pada akhir pekan dan hari libur. Kata \"jantur\" sendiri dalam bahasa daerah Kutai Barat berarti air terjun. Jantur Dora memiliki air yang bersih berasal dari hulu perbukitan Meranga yang mengalir melalui akar-akar kayu menuju hilir sungai. Jalur akses menuju Jantur Dora cukup menantang karena jalannya menanjak dan menurun. Keindahan dan kesejukan air di Jantur Dora sangat menarik bagi para pengunjung dan penggemar wisata alam. Tidak ada biaya masuk untuk mengunjungi Jantur Dora.",
    type: "jantur",
    images: ["https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Dora1.jpg", "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Dora2.jpg", "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Dora3.jpg"],
    address: "QH8R+JX, Balok, Kec. Barong Tongkok, Kabupaten Kutai Barat, Kalimantan Timur"
  }, {
    name: "Danau Aco",
    coords: [-0.16659038160350229, 115.54449359532649],
    desc: "Danau Aco seluas 4 hektare terletak di Kampung Linggang Melapeh, Kecamatan Linggang Bigung, sekitar 20 km dari Sendawar. Nama 'Aco' berarti 'memberi' dalam bahasa Dayak Tunjung dialek Rentenuukng, danau ini dianggap sebagai pemberian alam akibat bencana di masa lalu.",
    type: "danau",
    images: ["https://jkthe149-creator.github.io/Wisata-Kutai-Barat/aco1.jpg", "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/aco2.jpg", "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/aco3.jpg"],
    address: "RGMV+7QQ, Linggang Melapeh, Linggang Bigung, West Kutai Regency, East Kalimantan"
  }, {
    name: "Danau Jempang",
    coords: [-0.49757637813715355, 116.18325938305965],
    desc: "Danau Jempang merupakan danau alami terbesar di sepanjang Sungai Mahakam dengan luas sekitar 15.000 hektare dan kedalaman 7-8 meter, terletak di Kecamatan Jempang. Di danau ini bisa ditemukan berbagai burung dan ikan endemik. Di sekitar danau terdapat desa tradisional Tanjung Isuy yang masih menjaga kearifan lokal dan budaya adat istiadat.",
    type: "danau",
    images: ["https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Jempang1.jpeg", "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Jempang2.jpeg", "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Jempang3.jpeg"],
    address: "F4RX+5QQ, Tanjung Isuy, Jempang, West Kutai Regency, East Kalimantan 75773"
  }, {
    name: "Danau Tajan",
    coords: [-0.06912042336958966, 115.67053353765498],
    desc: "Danau Tajan adalah danau alami dengan suasan yang menenangkan dan udara segar. Tempat ini populer untuk memancing dan menikmati keindahan alam serta ketenangan di sekitarnya.",
    type: "danau",
    images: ["https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Tajan1.jpg", "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Tajan2.jpg", "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Tajan3.jpg"],
    address: "WMJC+76, Jelemuq, Tering, West Kutai Regency, East Kalimantan"
  }, {
    name: "Danau Beluq",
    coords: [-0.3202729263139051, 115.5151601799834],
    desc: "Danau Beluq berlokasi di kampung Dempar dengan luas sekitar 25 hektare dan dikelilingi berbagai jenis kayu dan akar-akar. Jaraknya sekitar 30 km dari ibu kota Kutai Barat. Danau ini memiliki legenda suku Dayak Benuaq yang menjadi asal usul terbentuknya danau.",
    type: "danau",
    images: ["https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Beluq1.jpg", "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Beluq2.jpg", "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Beluq3.jpg"],
    address: "MGH8+R34, Sentalar, Nyuatan, West Kutai Regency, East Kalimantan"
  }, {
    name: "Pulau Lanting",
    coords: [-0.4956150831759541, 116.19187756065084],
    desc: "Pulau Lanting adalah pulau kecil dengan pemandangan laut yang indah dan suasana pantai yang tenang. Pulau ini menawarkan pengalaman menikmati alam pantai yang masih alami dan cocok untuk aktivitas santai seperti berenang.",
    type: "pulau",
    images: ["https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Lanting1.jpg", "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Lanting2.jpg", "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Lanting3.jpg"],
    address: "G53V+F2, Pulau Lanting, Jempang, West Kutai Regency, East Kalimantan 75773"
  }, {
    name: "Batuq Bura Lakan Bilem",
    coords: [-0.1283261407196992, 115.42650059995286],
    desc: "Batuq Bura Lakan Bilem merupakan formasi batuan unik di tengah alam yang asri. Tempat ini juga menjadi lokasi kegiatan budaya dan tradisional masyarakat setempat, memberikan nilai historis dan kultural selain keindahan alamnya.",
    type: "sungai",
    images: ["https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Batuq1.jpg", "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Batuq2.jpg", "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Batuq3.jpg"],
    address: "VCCG+JJJ, Lakan Bilem, Nyuatan, West Kutai Regency, East Kalimantan 75776"
  }, {
    name: "Gunung S",
    coords: [-0.12743465249493863, 115.45939356649073],
    desc: "Gunung S, yang juga dikenal sebagai Gunung Es, adalah sebuah destinasi wisata alam yang terletak di Kabupaten Kutai Barat, Kalimantan Timur, tepatnya di antara Kampung Tutung dan Kampung Intu Lingau di kawasan Sendawar. Gunung ini populer karena pemandangan alamnya yang indah, terutama saat matahari terbit dan terbenam, serta suasana \"Negeri di Atas Awan\" yang diciptakannya oleh hamparan awan di puncaknya. Selain itu, Gunung S juga menjadi lokasi favorit untuk olahraga paralayang.",
    type: "gunung",
    images: ["https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Gunung1.jpeg", "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Gunung2.jpeg", "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Gunung3.jpeg"],
    address: "VFC5+WQR, Tutung, Linggang Bigung, West Kutai Regency, East Kalimantan 75776"
  }, {
    name: "Alun-Alun ITHO",
    coords: [-0.23862117722493723, 115.69625164623564],
    desc: "Terletak di samping Kantor Bupati Kutai Barat, Alun-Alun Itho menjadi pusat kegiatan masyarakat sekaligus ruang terbuka hijau favorit warga. Setiap akhir pekan, alun-alun ramai dikunjungi untuk olahraga, bersantai, maupun menikmati kuliner UMKM lokal. Suasananya semakin hidup dengan pedagang kaki lima yang menjajakan camilan tradisional seperti jagung rebus, kacang rebus, hingga minuman segar. Tempat ini cocok untuk rekreasi keluarga, berkumpul bersama teman, atau sekadar menikmati sore di jantung kota Kutai Barat.",
    type: "rekreasi",
    images: ["https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Alun1.jpeg", "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Alun2.jpeg", "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Alun3.jpeg"],
    address: "Barong Tongkok, West Kutai Regency, East Kalimantan 75777"
  }, {
    name: "Taman Budaya Sendawar",
    coords: [-0.22185993973042262, 115.70466809882845],
    desc: "Dikenal sebagai \"Lamin Enam Etnis,\" TBS merupakan pusat budaya Kutai Barat yang menampilkan enam lamin (rumah adat) dari Dayak Ahoeng, Benuaq, Tanjung, Kenyah, dan etnis Melayu. Bangunan berbentuk huruf U ini didominasi kayu ulin dengan ukiran khas tiap etnis, menjadikannya destinasi wisata budaya yang memukau dan penuh nilai sejarah.",
    type: "budaya",
    images: ["https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Tbs1.jpeg", "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Tbs2.jpeg", "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Tbs3.jpeg"],
    address: "QPH3+5VV, Jl. Sendawar Raya, Barong Tongkok, Kec. Barong Tongkok, Kabupaten Kutai Barat, Kalimantan Timur 75777"
  }];

  const labelColors = {
      'jantur': '#5dade2',
      'danau': '#58d68d',
      'pulau': '#ec7063',
      'sungai': '#48C9B0',
      'gunung': '#9b59b6',
      'rekreasi': '#f1c40f',
      'budaya': '#d35400'
  };

  function clearAllHighlights() {
    if (activeMarker) {
        if (activeMarker._icon) activeMarker._icon.classList.remove('active');
        if (activeMarker.getTooltip()) {
            activeMarker.getTooltip().getElement().classList.remove('active');
        }
        activeMarker = null;
    }
    updateVisibility();
  }

  // FUNGSI BARU DITAMBAHKAN KEMBALI
  function determineLabelDirection(coords, index) {
      return index % 2 === 0 ? 'right' : 'left';
  }

  function createIconHTML(type) {
      const color = labelColors[type] || '#95a5a6';
      let icon, svgGradient;

      switch (type) {
          case 'jantur':
              icon = '🌊';
              svgGradient = `<radialGradient id="grad-${type}" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#5dade2"/><stop offset="100%" stop-color="#3498db"/></radialGradient>`;
              break;
          case 'danau':
              icon = '🏞️';
              svgGradient = `<radialGradient id="grad-${type}" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#58d68d"/><stop offset="100%" stop-color="#2ecc71"/></radialGradient>`;
              break;
          case 'pulau':
              icon = '🏝️';
              svgGradient = `<radialGradient id="grad-${type}" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#ec7063"/><stop offset="100%" stop-color="#e74c3c"/></radialGradient>`;
              break;
          case 'sungai':
              icon = '🛶';
              svgGradient = `<radialGradient id="grad-${type}" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#48C9B0"/><stop offset="100%" stop-color="#1abc9c"/></radialGradient>`;
              break;
          case 'gunung':
              icon = '🏔️';
              svgGradient = `<radialGradient id="grad-${type}" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#b39ddb"/><stop offset="100%" stop-color="#9b59b6"/></radialGradient>`;
              break;
          case 'rekreasi':
              icon = '🌳';
              svgGradient = `<radialGradient id="grad-${type}" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#f1c40f"/><stop offset="100%" stop-color="#f39c12"/></radialGradient>`;
              break;
          case 'budaya':
              icon = '🏛️';
              svgGradient = `<radialGradient id="grad-${type}" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#f39c12"/><stop offset="100%" stop-color="#d35400"/></radialGradient>`;
              break;
          default:
              icon = '📍';
              svgGradient = `<radialGradient id="grad-default" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#fff"/><stop offset="100%" stop-color="#95a5a6"/></radialGradient>`;
              break;
      }

      return `<svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>${svgGradient}</defs>
                  <path d="M16 0C8 0 1.5 6.5 1.5 14.5C1.5 25.5 16 40 16 40C16 40 30.5 25.5 30.5 14.5C30.5 6.5 24 0 16 0Z" fill="url(#grad-${type})" stroke="#242833" stroke-width="2"/>
                  <text x="16" y="22" text-anchor="middle" font-size="16" fill="#fff">${icon}</text>
              </svg>`;
  }

  function createCustomIcon(type) {
    const iconHTML = createIconHTML(type);
    return L.divIcon({
      className: `custom-marker ${type}`,
      html: iconHTML,
      iconSize: [32, 40],
      iconAnchor: [16, 40]
    });
  }

  let markers = [];
  let activeMarker = null;
  let userLocationMarker = null;
  let accuracyCircle = null;
  let routeLine = null; 
  let watchId = null;
  let gpsActive = false;

  const markerZoomThreshold = 10;
  const mapContainer = document.getElementById('map');

  function updateVisibility() {
    const currentZoom = map.getZoom();
    const isMarkerVisible = currentZoom >= markerZoomThreshold;

     markers.forEach(marker => {
        if (isMarkerVisible) {
            if (!map.hasLayer(marker)) {
                marker.addTo(map);
            }
        } else {
            if (map.hasLayer(marker)) {
                map.removeLayer(marker);
            }
        }
    });
  }

  map.on('zoomend', updateVisibility);
  map.on('moveend', updateVisibility);

  function createAllMarkers() {
    markers.forEach(m => { if (map.hasLayer(m)) map.removeLayer(m); });
    markers = [];
    wisata.forEach((loc, index) => {
      const marker = L.marker(loc.coords, {
        icon: createCustomIcon(loc.type)
      });
      marker._locData = loc;
      markers.push(marker);
      
      const labelDirection = determineLabelDirection(loc.coords, index);
      marker.bindTooltip(loc.name, {
        permanent: true,
        direction: labelDirection,
        className: `location-label ${loc.type}`,
        offset: L.point(labelDirection === 'left' ? -15 : 15, -25)
      });

      marker.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        
        if (activeMarker && activeMarker !== e.target) {
            if (activeMarker._icon) {
                activeMarker._icon.classList.remove('active');
            }
            if (activeMarker.getTooltip()) {
                activeMarker.getTooltip().getElement().classList.remove('active');
            }
        }
        
        activeMarker = e.target;
        if (activeMarker._icon) {
            activeMarker._icon.classList.add('active');
        }
        if (activeMarker.getTooltip()) {
            activeMarker.getTooltip().getElement().classList.add('active');
        }

        updateVisibility();

        map.flyTo(loc.coords, Math.max(map.getZoom(), 14), {
          duration: 1.2
        });
        showSheet(loc);
      });
    });
  }

  function hideAllMarkers() {
    markers.forEach(m => {
      if (map.hasLayer(m)) map.removeLayer(m);
    });
  }

  // ===== FUNGSI DIPERBARUI =====
  async function showMarkersAnimated() {
    // Menghapus marker lama jika ada
    markers.forEach(m => {
        if (map.hasLayer(m)) map.removeLayer(m);
    });

    // Loop untuk menambahkan setiap marker ke peta
    for (let i = 0; i < markers.length; i++) {
        if (map.getZoom() >= markerZoomThreshold) {
            markers[i].addTo(map);
        }
        // Memberi jeda waktu antar kemunculan marker
        if (i === 0 && firstMarkerDelay) {
            await new Promise(res => setTimeout(res, 2000));
            firstMarkerDelay = false;
        } else {
            await new Promise(res => setTimeout(res, 120));
        }
    }

    updateVisibility();

    // Setelah semua marker muncul, tunggu sejenak lalu tampilkan semua label
    setTimeout(() => {
        document.querySelectorAll('.leaflet-tooltip.location-label').forEach(label => {
            label.classList.add('visible');
        });
    }, 150); // Jeda 150ms untuk memastikan semua stabil
  }

  const searchInput = document.getElementById('search-input'),
    searchOverlay = document.getElementById('search-overlay'),
    closeSearchBtn = document.getElementById('search-overlay-close'),
    resultsList = document.getElementById('search-results-list');

  const searchBoxEl = document.querySelector('.search-box');
  let clearSearchBtn = null;
  if (searchBoxEl) {
    clearSearchBtn = document.createElement('button');
    clearSearchBtn.type = 'button';
    clearSearchBtn.className = 'search-clear-btn';
    clearSearchBtn.innerText = '×';
    clearSearchBtn.setAttribute('aria-label', 'Hapus pencarian');
    clearSearchBtn.style.display = 'none';
    if (searchInput) {
      searchInput.insertAdjacentElement('afterend', clearSearchBtn);
    }

    clearSearchBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      searchInput.value = '';
      populateSearchResults();
      searchInput.focus();
      if (clearSearchBtn) clearSearchBtn.style.display = 'none';
    });
  }

  let lastSelectedSearchName = null;

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function highlightMatches(name, query) {
    if (!query) return escapeHtml(name);
    const q = query.toLowerCase();
    const lower = name.toLowerCase();
    if (!lower.startsWith(q)) {
      return escapeHtml(name);
    }
    const prefix = name.slice(0, q.length);
    const rest = name.slice(q.length);
    return `<span class="char-match">${escapeHtml(prefix)}</span>${escapeHtml(rest)}`;
  }

  function populateSearchResults() {
    resultsList.innerHTML = '';
    const ordered = [...wisata];
    if (lastSelectedSearchName) {
      const idx = ordered.findIndex(w => w.name === lastSelectedSearchName);
      if (idx > 0) ordered.unshift(ordered.splice(idx, 1)[0]);
    }

    const query = (searchInput.value || '').trim();
    const qLower = query.toLowerCase();

    ordered.forEach(loc => {
      if (query && !loc.name.toLowerCase().startsWith(qLower)) return;
      const item = document.createElement('div');
      item.className = `search-result-item type-${loc.type}`;
      if (loc.labelColor) {
        item.style.setProperty('--match-color', loc.labelColor);
      }
      const nameHtml = highlightMatches(loc.name, query);
      const addressText = loc.address ? loc.address : 'Alamat tidak tersedia';
      item.innerHTML = `
        <div class="icon-container">${createIconHTML(loc.type)}</div>
        <div class="result-info">
            <span class="result-name">${nameHtml}</span>
            <span class="search-result-address">${escapeHtml(addressText)}</span>
        </div>
      `;
      item.addEventListener('click', async () => {
        lastSelectedSearchName = loc.name;
        resultsList.prepend(item);

        if (markers.length === 0) {
          createAllMarkers();
        }

        const targetMarker = markers.find(m => m._locData && m._locData.name === loc.name);

        if (targetMarker) {
          if (!map.hasLayer(targetMarker)) targetMarker.addTo(map);
          map.flyTo(targetMarker.getLatLng(), Math.max(map.getZoom(), 14), { duration: 0.9 });
          setTimeout(() => targetMarker.fire('click'), 250);
        } else {
          map.flyTo(loc.coords, Math.max(map.getZoom(), 14), { duration: 0.9 });
          showSheet(loc);
        }

        hideSearchOverlay();
      });
      resultsList.appendChild(item);

      const matches = item.querySelectorAll('.char-match');
      if (matches && matches.length > 0) {
        matches.forEach(m => {
          m.classList.remove('match-animate');
          void m.offsetWidth;
          m.classList.add('match-animate');
        });
      }
    });
  }

  searchInput.addEventListener('input', () => {
    populateSearchResults();
    if (clearSearchBtn) {
      clearSearchBtn.style.display = searchInput.value.trim() ? 'block' : 'none';
    }
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      e.preventDefault();
      const query = (searchInput.value || '').trim().toLowerCase();
      if (!query) return;

      const matches = wisata.filter(w => w.name.toLowerCase().startsWith(query));

      if (matches.length > 1) {
        showMultiResultSheet(matches);
      } else if (matches.length === 1) {
        const targetMarker = markers.find(m => m._locData.name === matches[0].name);
        if (targetMarker) {
          targetMarker.fire('click');
        } else {
          map.flyTo(matches[0].coords, Math.max(map.getZoom(), 14), { duration: 1.0 });
          showSheet(matches[0]);
        }
      }
      
      hideSearchOverlay();
      searchInput.blur();
      if (clearSearchBtn) clearSearchBtn.style.display = 'none';
    }
  });

  function showSearchOverlay() {
    populateSearchResults();
    if (clearSearchBtn) {
      clearSearchBtn.style.display = searchInput.value.trim() ? 'block' : 'none';
    }
    try {
      const rect = searchInput.getBoundingClientRect();
      const gap = 8;
      const topPx = Math.max(Math.round(rect.bottom + gap), 0);

      searchOverlay.style.position = 'fixed';
      searchOverlay.style.left = '0';
      searchOverlay.style.right = '0';
      searchOverlay.style.top = topPx + 'px';
      searchOverlay.style.height = `calc(100% - ${topPx}px)`;
      searchOverlay.style.zIndex = '1200';

      if (getComputedStyle(searchInput).position === 'static') {
        searchInput.style.position = 'relative';
      }
      searchInput.style.zIndex = '1300';
    } catch (err) {
      console.warn('Gagal mengatur posisi overlay pencarian', err);
    }

    searchOverlay.classList.add('show');
    searchInput.focus();
  }

  function hideSearchOverlay() {
    searchOverlay.classList.remove('show');
    if (clearSearchBtn) clearSearchBtn.style.display = 'none';
    searchOverlay.style.position = '';
    searchOverlay.style.left = '';
    searchOverlay.style.right = '';
    searchOverlay.style.top = '';
    searchOverlay.style.height = '';
    searchOverlay.style.zIndex = '';

    if (searchInput) {
      searchInput.style.zIndex = '';
    }
  }

  searchInput.addEventListener('click', showSearchOverlay);
  closeSearchBtn.addEventListener('click', hideSearchOverlay);
  populateSearchResults();

  // ================== FUNGSI GPS ==================
  const permissionModal = document.getElementById('gps-permission-modal');
  const allowGpsBtn = document.getElementById('allow-gps');

  hideAllMarkers();
  wisataMarkersVisible = false;

  function requestLocationPermission() {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung geolocation");
      return;
    }

    permissionModal.style.display = 'flex';
    map.scrollWheelZoom.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();

    allowGpsBtn.addEventListener('click', () => {
      permissionModal.style.display = 'none';
      gpsBtn.classList.add('loading');
      map.scrollWheelZoom.enable();
      map.touchZoom.enable();
      map.doubleClickZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();

      navigator.geolocation.getCurrentPosition(
        () => {
          startWatchingPosition();
          wisataMarkersVisible = true;
          createAllMarkers();
          showMarkersAnimated();
        },
        (error) => {
          gpsBtn.classList.remove('loading');
          handleLocationError(error);
        }, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }, { once: true });
  }

  function startWatchingPosition() {
    if (watchId !== null) navigator.geolocation.clearWatch(watchId);

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    watchId = navigator.geolocation.watchPosition(handlePositionUpdate, handleLocationError, options);

    gpsActive = true;
    gpsBtn.classList.remove('loading');
    gpsBtn.classList.add('active');
  }

  function handlePositionUpdate(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const accuracy = position.coords.accuracy;
    const userLatLng = [lat, lon];

    if (lat < indonesiaBounds[0][0] || lat > indonesiaBounds[1][0] || lon < indonesiaBounds[0][1] || lon > indonesiaBounds[1][1]) {
      console.warn("Lokasi di luar batas Indonesia, mengabaikan update");
      return;
    }

    if (!userLocationMarker) {
      const gpsIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background-color:#1abc9c;width:28px;height:28px;border-radius:50%;border:2px solid white; box-shadow: 0 0 10px #1abc9c;"></div>',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      userLocationMarker = L.marker(userLatLng, {
        icon: gpsIcon,
        zIndexOffset: 1000
      }).addTo(map);
      accuracyCircle = L.circle(userLatLng, {
        radius: accuracy,
        className: 'accuracy-circle'
      }).addTo(map);
      map.flyTo(userLatLng, 15);

    } else {
      userLocationMarker.setLatLng(userLatLng);
      accuracyCircle.setLatLng(userLatLng).setRadius(accuracy);
    }
  }

  function handleLocationError(error) {
    gpsBtn.classList.remove('active', 'loading');
    gpsActive = false;
    stopWatchingPosition();

    if (error.code === error.PERMISSION_DENIED) {
      console.log("Akses lokasi ditolak oleh pengguna");
    } else {
      alert("Tidak bisa mendapatkan lokasi. Pastikan GPS Anda aktif.");
    }
  }

  function stopWatchingPosition() {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }

    if (userLocationMarker) {
      map.removeLayer(userLocationMarker);
      userLocationMarker = null;
    }

    if (accuracyCircle) {
      map.removeLayer(accuracyCircle);
      accuracyCircle = null;
    }

    gpsBtn.classList.remove('active');
    gpsActive = false;
  }

  gpsBtn.addEventListener('click', () => {
    if (gpsActive) {
      stopWatchingPosition();
    } else {
      requestLocationPermission();
    }
  });

  // ================== FUNGSI RUTE ==================
  // Tambahkan fungsi utilitas untuk decode polyline
  L.PolylineUtil = {
    decode: function(encoded) {
      var points = [];
      var index = 0, len = encoded.length;
      var lat = 0, lng = 0;
      
      while (index < len) {
        var b, shift = 0, result = 0;
        do {
          b = encoded.charCodeAt(index++) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
        } while (b >= 0x20);
        var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lat += dlat;

        shift = 0;
        result = 0;
        do {
          b = encoded.charCodeAt(index++) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
        } while (b >= 0x20);
        var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lng += dlng;

        points.push([lat * 1e-5, lng * 1e-5]);
      }
      
      return points;
    }
  };

  async function calculateAndShowRoute(destinationData) {
    if (routeLine) {
      map.removeLayer(routeLine);
      routeLine = null;
    }

    if (!gpsActive || !userLocationMarker) {
      alert("Aktifkan GPS terlebih dahulu untuk menampilkan rute.");
      if (!gpsActive) gpsBtn.click();
      return;
    }

    const start = userLocationMarker.getLatLng();
    const end = L.latLng(destinationData.coords[0], destinationData.coords[1]);

    try {
      // Menggunakan domain backend yang benar
      const response = await fetch('https://wisata-kutai-barat-backend.vercel.app/api/osm/protected', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          start: [start.lat, start.lng], 
          end: [end.lat, end.lng]
        })
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const routeData = await response.json();
      
      // Decode polyline geometry
      const routeGeometry = L.PolylineUtil.decode(routeData.geometry);
      const latLngs = routeGeometry.map(point => L.latLng(point[0], point[1]));
      
      // Buat polyline dengan style yang mencolok
      routeLine = L.polyline(latLngs, {
        color: '#3498db',
        weight: 6,
        opacity: 0.9,
        lineJoin: 'round',
        dashArray: '10, 10',
        dashOffset: '0'
      }).addTo(map);

      // Animasi garis rute
      let offset = 0;
      const animateDash = () => {
        offset = (offset + 1) % 20;
        routeLine.setStyle({dashOffset: offset});
        requestAnimationFrame(animateDash);
      };
      animateDash();

      // Fit bounds untuk menampilkan seluruh rute
      map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });

      const distanceKm = (routeData.distance / 1000).toFixed(1);
      const timeMinutes = Math.round(routeData.duration / 60);

      alert(`Rute ke ${destinationData.name}\nJarak: ${distanceKm} km\nWaktu: ${timeMinutes} menit`);
      
      routeBtn.textContent = '❌ Hapus Rute';
      routeBtn.classList.add('active');

    } catch (error) {
      console.error("Gagal mengambil rute:", error);
      alert("Gagal memuat rute. Pastikan backend berjalan dan terhubung.");
      
      // Fallback: buat garis lurus jika backend tidak tersedia
      routeLine = L.polyline([start, end], {
        color: '#3498db',
        weight: 4,
        opacity: 0.7,
        dashArray: '15, 10'
      }).addTo(map);
      
      map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
      
      // Hitung jarak dan waktu perkiraan
      const distance = map.distance(start, end);
      const distanceKm = (distance / 1000).toFixed(1);
      const timeMinutes = Math.round(distance / 1000 * 3); // Asumsi 3 menit per km
      
      alert(`Rute perkiraan ke ${destinationData.name}\nJarak: ${distanceKm} km\nPerkiraan Waktu: ${timeMinutes} menit\n\n(Catatan: Menggunakan rute garis lurus karena server tidak tersedia)`);
      
      routeBtn.textContent = '❌ Hapus Rute';
      routeBtn.classList.add('active');
    }
  }

  const routeBtn = document.querySelector('#bottom-sheet #route-btn');

  routeBtn.addEventListener('click', async () => {
    const currentLocName = sheetTitle.textContent;
    const destinationData = wisata.find(w => w.name === currentLocName);
    if (!destinationData) return;
    
    await calculateAndShowRoute(destinationData);
    minimizeSheet();
  });

  // ================== FUNGSI HEADER ==================
  const header = document.getElementById("header"),
    showHeaderBtn = document.getElementById("show-header-btn");
  let headerTimeout, headerManuallyClosed = false;

  map.on('movestart', () => {
    header.classList.add('hidden');
    clearTimeout(headerTimeout);
  });
  map.on('moveend', () => {
    headerTimeout = setTimeout(() => {
      if (!headerManuallyClosed) header.classList.remove('hidden');
    }, 1500);
  });
  document.getElementById('close-header').addEventListener('click', function() {
    header.classList.add('hidden');
    headerManuallyClosed = true;
    showHeaderBtn.style.display = 'flex';
    if (searchInput) {
      searchInput.value = '';
      populateSearchResults();
      try { searchInput.blur(); } catch (err) {}
    }
  });
  document.getElementById('show-header-btn').addEventListener('click', function() {
    header.classList.remove('hidden');
    headerManuallyClosed = false;
    showHeaderBtn.style.display = 'none';
  });

  // ================== FUNGSI BOTTOM SHEET UPDATED ==================
  const sheet = document.getElementById("bottom-sheet"),
    sheetTitle = document.getElementById("sheet-title"),
    sheetDesc = document.getElementById("sheet-desc"),
    sheetImages = document.getElementById("sheet-images"),
    sheetAddressContainer = document.getElementById("sheet-address-container"),
    sheetAddress = document.getElementById("sheet-address"),
    sheetHeader = document.getElementById("sheet-header"),
    sheetCloseBtn = document.getElementById("sheet-close-btn"),
    sheetSingleResult = document.getElementById("sheet-single-result"),
    sheetMultiResults = document.getElementById("sheet-multi-results");

  const sheetStates = {
    HIDDEN: 'hidden',
    MINI: 'mini',
    HALF: 'half',
    FULL: 'full'
  };
  let currentSheetState = sheetStates.HIDDEN;
  let dragging = false,
    startY = 0,
    startTranslate = 0,
    currentTranslate = 0,
    maxTranslate = {};

  function getWindowH() {
    return window.innerHeight || document.documentElement.clientHeight;
  }

  function setBounds() {
    const windowH = getWindowH();
    maxTranslate = {
      [sheetStates.HALF]: windowH - (windowH * 0.60),
      [sheetStates.MINI]: windowH - parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--mini-height")),
      [sheetStates.FULL]: 0
    };
  }

  function setSheetState(state) {
    sheet.classList.remove('mini', 'half', 'full', 'show');
    switch (state) {
      case sheetStates.MINI:
        sheet.classList.add('show', 'mini');
        sheet.style.transform = `translateY(calc(100% - var(--mini-height)))`;
        sheet.style.visibility = 'visible';
        break;
      case sheetStates.HALF:
        sheet.classList.add('show', 'half');
        sheet.style.transform = "translateY(0)";
        sheet.style.height = "60%";
        sheet.style.visibility = 'visible';
        break;
      case sheetStates.FULL:
        sheet.classList.add('show', 'full');
        sheet.style.transform = "translateY(0)";
        sheet.style.height = "85%";
        sheet.style.visibility = 'visible';
        break;
      case sheetStates.HIDDEN:
        sheet.style.transform = "translateY(100%)";
        sheet.style.visibility = 'hidden';
        break;
    }
    currentSheetState = state;
    setBounds();
  }
  
  function showMultiResultSheet(matches) {
    sheetSingleResult.style.display = 'none';
    sheetMultiResults.style.display = 'block';
    sheetMultiResults.innerHTML = '';

    matches.forEach(loc => {
        const card = document.createElement('div');
        card.className = 'multi-result-card';
        
        const imageUrl = loc.images && loc.images.length > 0 ? loc.images[0] : 'https://via.placeholder.com/90';

        card.innerHTML = `
            <img src="${imageUrl}" alt="${loc.name}" class="multi-card-image">
            <div class="multi-card-info">
                <h3 class="multi-card-name">${loc.name}</h3>
                <button class="multi-card-route-btn">🗺️ Tampilkan Rute</button>
            </div>
        `;
        
        card.addEventListener('click', () => {
            const targetMarker = markers.find(m => m._locData.name === loc.name);
            if (targetMarker) {
                targetMarker.fire('click');
            } else {
                showSheet(loc);
            }
        });

        card.querySelector('.multi-card-route-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            calculateAndShowRoute(loc);
            minimizeSheet();
        });

        sheetMultiResults.appendChild(card);
    });

    sheetTitle.textContent = `Hasil Pencarian (${matches.length})`;
    setSheetState(sheetStates.FULL);
  }

  function showSheet(loc) {
    sheetMultiResults.style.display = 'none';
    sheetSingleResult.style.display = 'flex';

    sheetImages.innerHTML = '';
    sheetImages.style.display = 'none';

    if (loc.address) {
      sheetAddress.textContent = loc.address;
      sheetAddressContainer.style.display = 'flex';
    } else {
      sheetAddressContainer.style.display = 'none';
    }

    sheetTitle.textContent = loc.name;
    sheetDesc.textContent = loc.desc;

    if (loc.images && loc.images.length > 0) {
      loc.images.forEach(imgUrl => {
        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = loc.name;
        sheetImages.appendChild(img);
      });
      sheetImages.style.display = 'flex';
    }

    if (routeLine) {
        map.removeLayer(routeLine);
        routeLine = null;
    }
    routeBtn.textContent = '🗺️ Tampilkan Rute';
    routeBtn.classList.remove('active');

    setSheetState(sheetStates.HALF);
  }

  function minimizeSheet() {
    setSheetState(sheetStates.MINI);
    clearAllHighlights();
    updateVisibility();
  }

  function hideSheet() {
    setSheetState(sheetStates.HIDDEN);
    if (routeLine) {
        map.removeLayer(routeLine);
        routeLine = null;
    }
    routeBtn.textContent = '🗺️ Tampilkan Rute';
    routeBtn.classList.remove('active');
    clearAllHighlights();
    dragging = false;
    sheetMultiResults.style.display = 'none';
    sheetSingleResult.style.display = 'block';
  }

  function startDrag(e) {
    if (sheet.classList.contains('show')) {
      dragging = true;
      startY = e;
      const t = window.getComputedStyle(sheet).transform;
      startTranslate = t && "none" !== t ? parseFloat(t.split(',')[5]) || 0 : currentTranslate;
      sheet.style.transition = "none";
      setBounds();
    }
  }

  function moveDrag(e) {
    if (dragging) {
      let n = startTranslate + (e - startY);
      currentTranslate = Math.max(maxTranslate[sheetStates.FULL], Math.min(n, maxTranslate[sheetStates.MINI]));
      sheet.style.transform = `translateY(${currentTranslate}px)`;
    }
  }

  function endDrag() {
    if (dragging) {
      dragging = false;
      sheet.style.transition = "transform 0.26s cubic-bezier(0.22,0.61,0.36,1), height 0.26s cubic-bezier(0.22,0.61,0.36,1)";
      
      const thresholdMini = maxTranslate[sheetStates.MINI] * 0.8;
      const thresholdHalf = maxTranslate[sheetStates.HALF] * 0.6;
      
      if (currentTranslate > thresholdMini) {
        hideSheet();
      } else if (currentTranslate > thresholdHalf) {
        setSheetState(sheetStates.MINI);
      } else if (currentTranslate < thresholdHalf * 0.4) {
        setSheetState(sheetStates.FULL);
      } else {
        setSheetState(sheetStates.HALF);
      }
    }
  }

  sheetHeader.addEventListener('mousedown', e => startDrag(e.clientY));
  window.addEventListener('mousemove', e => {
    dragging && moveDrag(e.clientY)
  });
  window.addEventListener('mouseup', endDrag);
  sheetHeader.addEventListener('touchstart', e => {
    e.touches.length > 0 && startDrag(e.touches[0].clientY)
  }, {
    passive: true
  });
  window.addEventListener('touchmove', e => {
    dragging && e.touches.length > 0 && moveDrag(e.touches[0].clientY)
  }, {
    passive: true
  });
  window.addEventListener('touchend', endDrag);

  sheetHeader.addEventListener('click', e => {
    if (e.target !== sheetCloseBtn && !e.target.classList.contains('drag-handle') && currentSheetState === sheetStates.MINI) {
      setSheetState(sheetStates.HALF);
    }
  });

  map.on('click', function(e) {
    if (!e.originalEvent.propagatedFromMarker && sheet.classList.contains('show')) {
      setSheetState(sheetStates.MINI);
    }
  });

  sheetCloseBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    hideSheet();
  });
  
  window.addEventListener('resize', setBounds);
  setBounds();
});