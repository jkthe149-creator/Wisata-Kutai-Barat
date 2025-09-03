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
      // Trigger animasi ikon mode peta
      window._triggeredByExploreBtn = true;
      showMapModeModal();
    });
  }

  // ================== MAP INIT ==================
  // Sembunyikan tombol GPS dan marker wisata saat awal
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

  // Layer group for control
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

  // Saat ganti mode peta, sembunyikan semua marker lalu animasikan satu per satu jika marker memang boleh tampil
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
    // Remove previous selection
    document.querySelectorAll('.map-mode-option.selected').forEach(el => el.classList.remove('selected'));
    // Hanya animasi jika dipanggil dari klik tombol Jelajahi
    if (window._triggeredByExploreBtn) {
      setTimeout(() => mapModeModal.classList.add('show'), 10);
      window._triggeredByExploreBtn = false;
    }
    // Disable zoom saat modal mode peta tampil
    map.scrollWheelZoom.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
  }
  function hideMapModeModal() {
    mapModeModal.classList.remove('show');
    setTimeout(() => { mapModeModal.style.display = 'none'; }, 350);
    // Enable zoom kembali setelah modal mode peta ditutup
    map.scrollWheelZoom.enable();
    map.touchZoom.enable();
    map.doubleClickZoom.enable();
    map.boxZoom.enable();
    map.keyboard.enable();
  }
  // Pilih mode peta saat klik

  document.querySelectorAll('.map-mode-option').forEach(opt => {
    opt.addEventListener('click', async function() {
      document.querySelectorAll('.map-mode-option').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      const mode = this.getAttribute('data-mode');
      // Ganti layer
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
      // Tampilkan tombol GPS setelah mode peta dipilih
      gpsBtn.style.display = 'flex';
      // Minta izin lokasi setelah mode peta dipilih
      requestLocationPermission();
    });
  });

  // ================== DATA WISATA ==================
  const wisata = [{
    name: "Jantur Mapan",
    coords: [-0.175133, 115.624654],
    desc: "Air Terjun Jantur Mapan terletak sekitar 10 km dari Melak Kubar di Kampung Linggang Mapan, mudah diakses dari jalan utama Barong Tongkok-Linggang Bigung. Air terjun tingginya kurang dari 10 meter dengan volume air besar, dikelilingi pepohonan rindang dan sejuk. Terdapat dua paviliun istirahat, toilet, ruang ganti, dua ayunan kecil dengan bangku, dan produk budaya Dayak seperti anyaman keranjang (anjat) serta topi pelindung (seraung). Tiket masuk Rp5.000 per orang.",
    type: "jantur",
    images: [
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Mapan1.jpg",
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Mapan2.jpg",
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Mapan3.jpg"
    ],
    address: "Kampung Linggang Mapan, Kecamatan Linggang Bigung, Kabupaten Kutai Barat",
    labelColor: "#5dade2"
  }, {
    name: "Jantur Tabalas",
    coords: [-0.171794, 115.570421],
    desc: "Jantur Tabalas merupakan air terjun di tengah hutan tropis yang lebat dan alami. Tempat ini menonjolkan keindahan alam dan sesuai untuk pengunjung yang menyukai petualangan dan kegiatan outdoor.",
    type: "jantur",
    images: [
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Tabalas1.jpg",
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Tabalas2.jpg"
    ],
    address: "RHHC+658, Jl. Poros Tenggarong Melak, Juhan Asa, Kec. Barong Tongkok, Kabupaten Kutai Barat, Kalimantan Timur 75776",
    labelColor: "#5dade2"
  }, {
    name: "Jantur Inar",
    coords: [-0.298955, 115.547921],
    desc: "Air Terjun Jantur Inar adalah air terjun tinggi di Kutai Barat dengan hutan tropis masih asli, menawarkan pengalaman alam yang menenangkan dan petualangan. Tempat ini juga memiliki nilai budaya penting terkait kisah seorang gadis Dayak bangsawan.",
    type: "jantur",
    images: [
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Inar1.jpg",
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Inar2.jpg",
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Inar3.jpg"
    ],
    address: "PG2X+85V, Terajuk, Nyuatan, West Kutai Regency, East Kalimantan 75777",
    labelColor: "#5dade2"
  }, {
    name: "Danau Aco",
    coords: [-0.166611, 115.544450],
    desc: "Danau Aco seluas 4 hektare terletak di Kampung Linggang Melapeh, Kecamatan Linggang Bigung, sekitar 20 km dari Sendawar. Nama 'Aco' berarti 'memberi' dalam bahasa Dayak Tunjung dialek Rentenuukng, danau ini dianggap sebagai pemberian alam akibat bencana di masa lalu.",
    type: "danau",
    images: [
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/aco1.jpg",
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/aco2.jpg",
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/aco3.jpg"
    ],
    address: "RGMV+7QQ, Linggang Melapeh, Linggang Bigung, West Kutai Regency, East Kalimantan",
    labelColor: "#58d68d"
  }, {
    name: "Danau Jempang",
    coords: [-0.509459, 116.149478],
    desc: "Danau Jempang merupakan danau alami terbesar di sepanjang Sungai Mahakam dengan luas sekitar 15.000 hektare dan kedalaman 7-8 meter, terletak di Kecamatan Jempang. Di danau ini bisa ditemukan berbagai burung dan ikan endemik. Di sekitar danau terdapat desa tradisional Tanjung Isuy yang masih menjaga kearifan lokal dan budaya adat istiadat.",
    type: "danau",
    images: [
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Jempang1.jpeg",
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Jempang2.jpeg",
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Jempang3.jpeg"
    ],
    address: "F4RX+5QQ, Tanjung Isuy, Jempang, West Kutai Regency, East Kalimantan 75773",
    labelColor: "#58d68d"
  }, {
    name: "Pulau Lanting",
    coords: [-0.495314, 116.191875],
    desc: "Pulau Lanting adalah pulau kecil dengan pemandangan laut yang indah dan suasana pantai yang tenang. Pulau ini menawarkan pengalaman menikmati alam pantai yang masih alami dan cocok untuk aktivitas santai seperti berenang.",
    type: "pulau",
    images: [
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Lanting1.jpg",
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Lanting2.jpg",
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Lanting3.jpg"
    ],
    address: "Jempang, West Kutai Regency, East Kalimantan",
    labelColor: "#ec7063"
  }, {
    name: "Batuq Bura Lakan Bilem",
    coords: [-0.128331, 115.426489],
    desc: "Batuq Bura Lakan Bilem merupakan formasi batuan unik di tengah alam yang asri. Tempat ini juga menjadi lokasi kegiatan budaya dan tradisional masyarakat setempat, memberikan nilai historis dan kultural selain keindahan alamnya.",
    type: "sungai",
    images: [
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Batuq1.jpg",
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Batuq2.jpg",
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Batuq3.jpg"
    ],
    address: "VCCG+JJJ, Lakan Bilem, Nyuatan, West Kutai Regency, East Kalimantan 75776",
    labelColor: "#48C9B0"
  }, {
    name: "Danau Tajan",
    coords: [-0.069131, 115.670522],
    desc: "Danau Tajan adalah danau alami dengan suasan yang menenangkan dan udara segar. Tempat ini populer untuk memancing dan menikmati keindahan alam serta ketenangan di sekitarnya.",
    type: "danau",
    images: [
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Tajan1.jpg",
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Tajan2.jpg",
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Tajan3.jpg"
    ],
    address: "WMJC+76, Jelemuq, Tering, West Kutai Regency, East Kalimantan",
    labelColor: "#58d68d"
  }, {
    name: "Danau Beluq",
    coords: [-0.320294, 115.515149],
    desc: "Danau Beluq berlokasi di kampung Dempar dengan luas sekitar 25 hektare dan dikelilingi berbagai jenis kayu dan akar-akar. Jaraknya sekitar 30 km dari ibu kota Kutai Barat. Danau ini memiliki legenda suku Dayak Benuaq yang menjadi asal usul terbentuknya danau.",
    type: "danau",
    images: [
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Beluq1.jpg",
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Beluq2.jpg",
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Beluq3.jpg"
    ],
    address: "MGH8+R34, Sentalar, Nyuatan, West Kutai Regency, East Kalimantan",
    labelColor: "#58d68d"
  }, {
    name: "Gunung S",
    coords: [-0.1274239236856152, 115.45937210881907],
    desc: "Gunung S, yang juga dikenal sebagai Gunung Es, adalah sebuah destinasi wisata alam yang terletak di Kabupaten Kutai Barat, Kalimantan Timur, tepatnya di antara Kampung Tutung dan Kampung Intu Lingau di kawasan Sendawar. Gunung ini populer karena pemandangan alamnya yang indah, terutama saat matahari terbit dan terbenam, serta suasana \"Negeri di Atas Awan\" yang diciptakannya oleh hamparan awan di puncaknya. Selain itu, Gunung S juga menjadi lokasi favorit untuk olahraga paralayang.",
    type: "gunung",
    images: [
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Gunung1.jpeg",
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Gunung2.jpeg",
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Gunung3.jpeg"
    ],
    address: "VFC5+WQR, Tutung, Linggang Bigung, West Kutai Regency, East Kalimantan 75776",
    labelColor: "#9b59b6"
  }, {
    name: "Alun-Alun ITHO",
    coords: [-0.23860145193244478, 115.6962525687145],
    desc: "Terletak di samping Kantor Bupati Kutai Barat, Alun-Alun Itho menjadi pusat kegiatan masyarakat sekaligus ruang terbuka hijau favorit warga. Setiap akhir pekan, alun-alun ramai dikunjungi untuk olahraga, bersantai, maupun menikmati kuliner UMKM lokal. Suasananya semakin hidup dengan pedagang kaki lima yang menjajakan camilan tradisional seperti jagung rebus, kacang rebus, hingga minuman segar. Tempat ini cocok untuk rekreasi keluarga, berkumpul bersama teman, atau sekadar menikmati sore di jantung kota Kutai Barat.",
    type: "rekreasi",
    images: [
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Alun1.jpeg",
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Alun2.jpeg",
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Alun3.jpeg"
    ],
    address: "Barong Tongkok, West Kutai Regency, East Kalimantan 75777",
    labelColor: "#f1c40f"
  }, {
    name: "Taman Budaya Sendawar",
    coords: [-0.22178726715731004, 115.70467486649088],
    desc: "Dikenal sebagai \"Lamin Enam Etnis,\" TBS merupakan pusat budaya Kutai Barat yang menampilkan enam lamin (rumah adat) dari Dayak Ahoeng, Benuaq, Tanjung, Kenyah, dan etnis Melayu. Bangunan berbentuk huruf U ini didominasi kayu ulin dengan ukiran khas tiap etnis, menjadikannya destinasi wisata budaya yang memukau dan penuh nilai sejarah.",
    type: "budaya",
    images: [
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Tbs1.jpeg",
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Tbs2.jpeg",
      "https://jkthe149-creator.github.io/Wisata-Kutai-Barat/Tbs3.jpeg"
    ],
    address: "QPH3+5VV, Jl. Sendawar Raya, Barong Tongkok, Kec. Barong Tongkok, Kabupaten Kutai Barat, Kalimantan Timur 75777",
    labelColor: "#d35400"
  }];

  function clearAllHighlights() {
    if (activeMarker) {
      if (activeMarker._icon) activeMarker._icon.classList.remove('active');
      const tooltip = activeMarker.getTooltip();
      if (tooltip && tooltip.getElement()) {
        tooltip.getElement().classList.remove('active');
        tooltip.getElement().style.removeProperty('--label-active-color');
      }
      activeMarker = null;
    }
  }

  function determineLabelDirection(coords, index) {
    return index % 2 === 0 ? 'right' : 'left';
  }

  function createIconHTML(type) {
    let iconColor, svgIcon;
    switch (type) {
      case "jantur":
        iconColor = "#3498db";
        svgIcon = `<svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="janturG" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#5dade2"/><stop offset="100%" stop-color="#3498db"/></radialGradient></defs><path d="M16 0C8 0 1.5 6.5 1.5 14.5C1.5 25.5 16 40 16 40C16 40 30.5 25.5 30.5 14.5C30.5 6.5 24 0 16 0Z" fill="url(#janturG)" stroke="#242833" stroke-width="2"/><text x="16" y="22" text-anchor="middle" font-size="16" fill="#fff">🌊</text></svg>`;
        break;
      case "danau":
        iconColor = "#2ecc71";
        svgIcon = `<svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="danauG" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#58d68d"/><stop offset="100%" stop-color="#2ecc71"/></radialGradient></defs><path d="M16 0C8 0 1.5 6.5 1.5 14.5C1.5 25.5 16 40 16 40C16 40 30.5 25.5 30.5 14.5C30.5 6.5 24 0 16 0Z" fill="url(#danauG)" stroke="#242833" stroke-width="2"/><text x="16" y="22" text-anchor="middle" font-size="16" fill="#fff">🏞️</text></svg>`;
        break;
      case "pulau":
        iconColor = "#e74c3c";
        svgIcon = `<svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="pulauG" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#ec7063"/><stop offset="100%" stop-color="#e74c3c"/></radialGradient></defs><path d="M16 0C8 0 1.5 6.5 1.5 14.5C1.5 25.5 16 40 16 40C16 40 30.5 25.5 30.5 14.5C30.5 6.5 24 0 16 0Z" fill="url(#pulauG)" stroke="#242833" stroke-width="2"/><text x="16" y="22" text-anchor="middle" font-size="16" fill="#fff">🏝️</text></svg>`;
        break;
      case "sungai":
        iconColor = "#48C9B0";
        svgIcon = `<svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="sungaiG" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#48C9B0"/><stop offset="100%" stop-color="#1abc9c"/></radialGradient></defs><path d="M16 0C8 0 1.5 6.5 1.5 14.5C1.5 25.5 16 40 16 40C16 40 30.5 25.5 30.5 14.5C30.5 6.5 24 0 16 0Z" fill="url(#sungaiG)" stroke="#242833" stroke-width="2"/><text x="16" y="22" text-anchor="middle" font-size="16" fill="#fff">🛶</text></svg>`;
        break;
      case "gunung":
        iconColor = "#9b59b6";
        svgIcon = `<svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<radialGradient id="gunungG" cx="50%" cy="40%" r="60%">
						<stop offset="0%" stop-color="#b39ddb"/>
						<stop offset="100%" stop-color="#9b59b6"/>
					</radialGradient>
				</defs>
				<path d="M16 0C8 0 1.5 6.5 1.5 14.5C1.5 25.5 16 40 16 40C16 40 30.5 25.5 30.5 14.5C30.5 6.5 24 0 16 0Z" fill="url(#gunungG)" stroke="#242833" stroke-width="2"/>
				<text x="16" y="22" text-anchor="middle" font-size="16" fill="#fff">🏔️</text>
			</svg>`;
        break;
      case "rekreasi":
        iconColor = "#f1c40f";
        svgIcon = `<svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<radialGradient id="rekreasiG" cx="50%" cy="40%" r="60%">
						<stop offset="0%" stop-color="#f1c40f"/>
						<stop offset="100%" stop-color="#f39c12"/>
					</radialGradient>
				</defs>
				<path d="M16 0C8 0 1.5 6.5 1.5 14.5C1.5 25.5 16 40 16 40C16 40 30.5 25.5 30.5 14.5C30.5 6.5 24 0 16 0Z" fill="url(#rekreasiG)" stroke="#242833" stroke-width="2"/>
				<text x="16" y="22" text-anchor="middle" font-size="16" fill="#fff">🌳</text>
			</svg>`;
        break;
      case "budaya":
        iconColor = "#d35400";
        svgIcon = `<svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="budayaG" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#f39c12"/>
        <stop offset="100%" stop-color="#d35400"/>
      </radialGradient>
    </defs>
    <path d="M16 0C8 0 1.5 6.5 1.5 14.5C1.5 25.5 16 40 16 40C16 40 30.5 25.5 30.5 14.5C30.5 6.5 24 0 16 0Z" fill="url(#budayaG)" stroke="#242833" stroke-width="2"/>
    <text x="16" y="22" text-anchor="middle" font-size="14" fill="#fff">🏛️</text>
  </svg>`;
        break;
      default:
        iconColor = "#95a5a6";
        svgIcon = `<svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="defaultG" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#fff"/><stop offset="100%" stop-color="#95a5a6"/></radialGradient></defs><path d="M16 0C8 0 1.5 6.5 1.5 14.5C1.5 25.5 16 40 16 40C16 40 30.5 25.5 30.5 14.5C30.5 6.5 24 0 16 0Z" fill="url(#defaultG)" stroke="#242833" stroke-width="2"/><text x="16" y="22" text-anchor="middle" font-size="16" fill="#242833">📍</text></svg>`;
        break;
    }
    // tambahkan kelas inner-type agar preview hasil pencarian tetap menampilkan warna yang benar
    return `<div class="marker-inner marker-${type}" style="width:32px;height:40px;">${svgIcon}</div>`;
  }

  function createCustomIcon(type) {
    const iconHTML = createIconHTML(type);
    return L.divIcon({
      // pastikan className menyertakan tipe agar CSS .custom-marker.gunung / .custom-marker.rekreasi berlaku
      className: `custom-marker ${type}`,
      html: iconHTML,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  }

  function repositionTooltip(marker) {
    setTimeout(() => {
      const tooltip = marker.getTooltip();
      if (tooltip && tooltip.getElement()) {
        const element = tooltip.getElement();
        const direction = tooltip.options.direction;
        
        element.style.transform = '';
        element.style.margin = '';
        
        if (direction === 'left') {
          element.style.transform = 'translateX(-10px)';
          element.style.marginLeft = '-8px';
        } else {
          element.style.transform = 'translateX(10px)';
          element.style.marginRight = '-8px';
        }
      }
    }, 50);
  }

  let markers = [];
  let activeMarker = null;
  let userLocationMarker = null;
  let accuracyCircle = null;
  let routingControl = null;
  let routeActive = false;
  let routeLine = null;
  let watchId = null;
  let gpsActive = false;

  const markerZoomThreshold = 9;
  const labelZoomThreshold = 11;
  const mapContainer = document.getElementById('map');

  function updateVisibility() {
    const currentZoom = map.getZoom();
    const isMarkerVisible = currentZoom >= markerZoomThreshold;
    const isLabelVisible = currentZoom >= labelZoomThreshold;

    markers.forEach(marker => {
      if (isMarkerVisible) {
        if (!map.hasLayer(marker)) {
          map.addLayer(marker);
          repositionTooltip(marker);
        }
      } else {
        if (map.hasLayer(marker)) {
          map.removeLayer(marker);
        }
      }
        
      const tooltip = marker.getTooltip();
      if (tooltip && tooltip.getElement()) {
        if (isLabelVisible) {
          tooltip.getElement().style.display = 'block';
        } else {
          tooltip.getElement().style.display = 'none';
        }
      }
    });
    
    mapContainer.classList.toggle('labels-visible', isLabelVisible);
  }

  map.on('zoomend', updateVisibility);
  map.on('moveend', updateVisibility);

  // Buat marker dan tooltip untuk setiap wisata

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
      const offsetX = labelDirection === 'left' ? -20 : 20;
      marker.bindTooltip(loc.name, {
        permanent: true,
        direction: labelDirection,
        offset: [offsetX, 0],
        className: `location-label ${loc.type}`,
        opacity: 1
      });
      marker.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        clearAllHighlights();
        const clickedMarker = e.target;
        clickedMarker._icon.classList.add('active');
        const tooltip = clickedMarker.getTooltip();
        if (tooltip && tooltip.getElement()) {
          tooltip.getElement().classList.add('active');
          tooltip.getElement().style.setProperty('--label-active-color', clickedMarker._locData.labelColor);
        }
        activeMarker = clickedMarker;
        map.flyTo(loc.coords, Math.max(map.getZoom(), 14), {
          duration: 1.2
        });
        showSheet(loc);
      });
    });
  // Tidak ada marker yang permanen, semua ikut animasi
  }

  function hideAllMarkers() {
    // Semua marker dihapus dari peta, tooltip juga ikut hilang
    markers.forEach(m => {
      if (map.hasLayer(m)) map.removeLayer(m);
      // Hilangkan tooltip manual jika masih ada di DOM
      const tooltip = m.getTooltip && m.getTooltip();
      if (tooltip && tooltip.getElement()) {
        tooltip.getElement().style.display = 'none';
      }
    });
  }

  async function showMarkersAnimated() {
    // Semua marker dihapus dari peta sebelum animasi
    markers.forEach(m => {
      if (map.hasLayer(m)) map.removeLayer(m);
      // Hilangkan tooltip manual jika masih ada di DOM
      const tooltip = m.getTooltip && m.getTooltip();
      if (tooltip && tooltip.getElement()) {
        tooltip.getElement().style.display = 'none';
      }
    });
    for (let i = 0; i < markers.length; i++) {
      if (map.getZoom() >= markerZoomThreshold) {
        markers[i].addTo(map);
        repositionTooltip(markers[i]);
        // Tampilkan tooltip jika label memang seharusnya muncul
        const tooltip = markers[i].getTooltip && markers[i].getTooltip();
        if (tooltip && tooltip.getElement() && map.getZoom() >= labelZoomThreshold) {
          tooltip.getElement().style.display = 'block';
        }
      }
      // Jika ini pertama kali setelah pilih mode peta, delay 2 detik untuk marker pertama
      if (i === 0 && firstMarkerDelay) {
        await new Promise(res => setTimeout(res, 2000));
        firstMarkerDelay = false;
      } else {
        await new Promise(res => setTimeout(res, 120));
      }
    }
    updateVisibility();
  }


  const searchInput = document.getElementById('search-input'),
    searchOverlay = document.getElementById('search-overlay'),
    closeSearchBtn = document.getElementById('search-overlay-close'),
    resultsList = document.getElementById('search-results-list');

  // tambahkan tombol "×" untuk menghapus teks pencarian di sebelah kanan input
  const searchBoxEl = document.querySelector('.search-box');
  let clearSearchBtn = null;
  if (searchBoxEl) {
    clearSearchBtn = document.createElement('button');
    clearSearchBtn.type = 'button';
    clearSearchBtn.className = 'search-clear-btn';
    clearSearchBtn.innerText = '×';
    clearSearchBtn.setAttribute('aria-label', 'Hapus pencarian');
    // hidden by default; visibility toggled by JS
    clearSearchBtn.style.display = 'none';
    // append after the input
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

  // Escape HTML safe
  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Highlight only exact substring(s) that match the query (case-insensitive).
  function highlightMatches(name, query) {
    // only highlight when query is a prefix (starts from beginning)
    if (!query) return escapeHtml(name);
    const q = query.toLowerCase();
    const lower = name.toLowerCase();
    if (!lower.startsWith(q)) {
      // no prefix match -> return escaped original (should be filtered out already)
      return escapeHtml(name);
    }
    // split prefix and remainder
    const prefix = name.slice(0, q.length);
    const rest = name.slice(q.length);
    return `<span class="char-match">${escapeHtml(prefix)}</span>${escapeHtml(rest)}`;
  }

  function populateSearchResults() {
    resultsList.innerHTML = '';
    // Order results so the last selected item (if any) is first
    const ordered = [...wisata];
    if (lastSelectedSearchName) {
      const idx = ordered.findIndex(w => w.name === lastSelectedSearchName);
      if (idx > 0) ordered.unshift(ordered.splice(idx, 1)[0]);
    }

    const query = (searchInput.value || '').trim();
    const qLower = query.toLowerCase();

    ordered.forEach(loc => {
      // Filter: only keep items that start with the query (when query present)
      if (query && !loc.name.toLowerCase().startsWith(qLower)) return;
      const item = document.createElement('div');
      // mark item with its type so CSS can style .char-match per type
      item.className = `search-result-item type-${loc.type}`;
      // if a labelColor is provided in data, expose it to CSS as --match-color
      if (loc.labelColor) {
        item.style.setProperty('--match-color', loc.labelColor);
      }
      const nameHtml = highlightMatches(loc.name, query);
      item.innerHTML = `<div class="icon-container">${createIconHTML(loc.type)}</div><span class="result-name">${nameHtml}</span>`;
      item.addEventListener('click', async () => {
        // Remember this selection so it appears on top next time
        lastSelectedSearchName = loc.name;
        // Move this item to the top of the results immediately (visual feedback while map animates)
        resultsList.prepend(item);

        // Ensure markers exist so we can trigger marker click; create if needed
        if (markers.length === 0) {
          createAllMarkers();
          // allow markers array to populate (createAllMarkers is synchronous)
        }

        // Try to find the marker for this location
        const targetMarker = markers.find(m => m._locData && m._locData.name === loc.name);

        if (targetMarker) {
          // ensure target marker is added to map before firing click (in case zoom threshold removed it)
          if (!map.hasLayer(targetMarker)) targetMarker.addTo(map);
          // center & zoom, then trigger marker click to keep behavior consistent
          map.flyTo(targetMarker.getLatLng(), Math.max(map.getZoom(), 14), { duration: 0.9 });
          // small timeout so flyTo starts before click (helps UX)
          setTimeout(() => targetMarker.fire('click'), 250);
        } else {
          // fallback: fly directly to coords and open sheet
          map.flyTo(loc.coords, Math.max(map.getZoom(), 14), { duration: 0.9 });
          showSheet(loc);
        }

        hideSearchOverlay();
      });
      resultsList.appendChild(item);

      // Jika ada .char-match di item => restart animasi (hanya muncul bila ada kecocokan)
      const matches = item.querySelectorAll('.char-match');
      if (matches && matches.length > 0) {
        matches.forEach(m => {
          // restart CSS animation by toggling class
          m.classList.remove('match-animate');
          // force reflow to allow re-adding the class
          void m.offsetWidth;
          m.classList.add('match-animate');
        });
      }
    });
  }

  // Update highlights as user types
  searchInput.addEventListener('input', () => {
    populateSearchResults();
    // toggle tombol clear
    if (clearSearchBtn) {
      clearSearchBtn.style.display = searchInput.value.trim() ? 'block' : 'none';
    }
  });

  // If user presses Enter (desktop or mobile Done), and the query equals a wisata name,
  // zoom to that wisata and open the bottom sheet.
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      e.preventDefault();
      const query = (searchInput.value || '').trim();
      if (!query) return;
      const dest = wisata.find(w => w.name.toLowerCase() === query.toLowerCase());
      if (dest) {
        // ensure markers exist
        if (markers.length === 0) createAllMarkers();
        const targetMarker = markers.find(m => m._locData.name === dest.name);
        if (targetMarker) {
          // trigger marker click which handles flyTo and showSheet
          targetMarker.fire('click');
        } else {
          // fallback: directly show sheet & flyTo
          map.flyTo(dest.coords, Math.max(map.getZoom(), 14), { duration: 1.0 });
          showSheet(dest);
        }
        hideSearchOverlay();
        searchInput.blur();
        if (clearSearchBtn) clearSearchBtn.style.display = 'none';
      }
    }
  });

  function showSearchOverlay() {
    // Rebuild results so lastSelectedSearchName gets priority
    populateSearchResults();

    // update visibility tombol clear saat overlay dibuka
    if (clearSearchBtn) {
      clearSearchBtn.style.display = searchInput.value.trim() ? 'block' : 'none';
    }

    // Pastikan overlay tidak menutupi input pencarian:
    // posisikan overlay tepat di bawah input dan atur tingginya.
    try {
      const rect = searchInput.getBoundingClientRect();
      const gap = 8; // jarak sedikit antar input dan overlay
      const topPx = Math.max(Math.round(rect.bottom + gap), 0); // dalam px relatif viewport

      searchOverlay.style.position = 'fixed';
      searchOverlay.style.left = '0';
      searchOverlay.style.right = '0';
      searchOverlay.style.top = topPx + 'px';
      searchOverlay.style.height = `calc(100% - ${topPx}px)`;
      searchOverlay.style.zIndex = '1200';

      // Pastikan input pencarian terlihat di atas overlay
      if (getComputedStyle(searchInput).position === 'static') {
        searchInput.style.position = 'relative';
      }
      searchInput.style.zIndex = '1300';
    } catch (err) {
      // fallback: jika terjadi error, biarkan kelas .show saja
      console.warn('Gagal mengatur posisi overlay pencarian', err);
    }

    searchOverlay.classList.add('show');
    // fokuskan input agar pengguna dapat langsung mengetik
    searchInput.focus();
  }

  function hideSearchOverlay() {
    searchOverlay.classList.remove('show');

    // sembunyikan tombol clear saat overlay ditutup
    if (clearSearchBtn) clearSearchBtn.style.display = 'none';

    // Reset style yang diubah supaya tidak mempengaruhi tata letak lain
    searchOverlay.style.position = '';
    searchOverlay.style.left = '';
    searchOverlay.style.right = '';
    searchOverlay.style.top = '';
    searchOverlay.style.height = '';
    searchOverlay.style.zIndex = '';

    if (searchInput) {
      searchInput.style.zIndex = '';
      // jangan ubah position kembali agar tidak mengganggu layout if intentionally set elsewhere
    }
  }

  searchInput.addEventListener('click', showSearchOverlay);
  closeSearchBtn.addEventListener('click', hideSearchOverlay);
  populateSearchResults();

  // ================== FUNGSI GPS ==================
  // const gpsBtn = document.getElementById('gps-btn'); // Sudah dideklarasikan di atas
  const permissionModal = document.getElementById('gps-permission-modal');
  const allowGpsBtn = document.getElementById('allow-gps');

  // Sembunyikan marker wisata saat awal (belum ada izin)
  hideAllMarkers();
  wisataMarkersVisible = false;

  function requestLocationPermission() {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung geolocation");
      return;
    }

    permissionModal.style.display = 'flex';
    // Disable zoom saat modal izin GPS tampil
    map.scrollWheelZoom.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();

    allowGpsBtn.addEventListener('click', () => {
      permissionModal.style.display = 'none';
      gpsBtn.classList.add('loading');
      // Enable zoom kembali setelah modal izin GPS ditutup
      map.scrollWheelZoom.enable();
      map.touchZoom.enable();
      map.doubleClickZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();

      navigator.geolocation.getCurrentPosition(
        () => {
          startWatchingPosition();
          // Setelah izin diberikan, baru tampilkan marker wisata
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
  const routeBtn = document.getElementById('route-btn');

  routeBtn.addEventListener('click', () => {
    // HIDE any overlays that might block the map or interactions before showing route UI
    ['search-overlay','map-mode-modal','gps-permission-modal','landing-overlay'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.remove('show');
        // ensure hidden regardless of how each overlay was implemented
        el.style.display = 'none';
        el.style.opacity = '0';
        el.style.visibility = 'hidden';
      }
    });

    if (routeActive) {
      if (routingControl) map.removeControl(routingControl);
      routingControl = null;
      routeBtn.textContent = '🗺️ Tampilkan Rute';
      routeBtn.classList.remove('active');
      routeActive = false;
      return;
    }

    if (!gpsActive || !userLocationMarker) {
      alert("Aktifkan GPS terlebih dahulu untuk menampilkan rute.");
      if (!gpsActive) gpsBtn.click();
      return;
    }

    const currentLocName = sheetTitle.textContent;
    const destinationData = wisata.find(w => w.name === currentLocName);
    if (!destinationData) return;

    const start = userLocationMarker.getLatLng();
    const end = L.latLng(destinationData.coords[0], destinationData.coords[1]);

    if (routingControl) map.removeControl(routingControl);

    routingControl = L.Routing.control({
      waypoints: [start, end],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{
          color: '#3498db',
          opacity: 0.9,
          weight: 6
        }]
      },
      createMarker: () => null
    }).addTo(map);

    routingControl.on('routesfound', function(e) {
      const routes = e.routes;
      if (!routes.length) return;
      const summary = routes[0].summary;
      const container = routingControl.getContainer();
      const instructions = routingControl.getAlternativesContainer();

      const distance = (summary.totalDistance / 1000).toFixed(1);
      const time = Math.round(summary.totalTime / 60);

      let customHeader = `
          <h3>Rute ke ${destinationData.name}</h3>
          <p style="margin: 5px 0;">Jarak: <b>${distance} km</b>, Waktu: <b>${time} menit</b></p>
          <a href="#" class="leaflet-bar leaflet-routing-close-btn">×</a>
        `;
      container.innerHTML = customHeader;
      container.appendChild(instructions);

      container.querySelector('.leaflet-routing-close-btn').addEventListener('click', (ev) => {
        ev.preventDefault();
        routeBtn.click();
      });
    });

    routeBtn.textContent = '❌ Hapus Rute';
    routeBtn.classList.add('active');
    routeActive = true;
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
    // Clear any typed search when header close is clicked
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
    sheetCloseBtn = document.getElementById("sheet-close-btn");

  // State management untuk bottom sheet
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
      [sheetStates.HALF]: windowH - (windowH * 0.42),
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
        sheet.style.height = "42%";
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

  function showSheet(loc) {
    // remove any previously injected images and keep the images area hidden
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

    if (routeActive) {
      if (routingControl) map.removeControl(routingControl);
      routingControl = null;
    }
    routeBtn.textContent = '🗺️ Tampilkan Rute';
    routeBtn.classList.remove('active');
    routeActive = false;

    // Tampilkan dalam state HALF (50%) pertama kali
    setSheetState(sheetStates.HALF);
  }

  function minimizeSheet() {
    setSheetState(sheetStates.MINI);
    clearAllHighlights();
  }

  function hideSheet() {
    setSheetState(sheetStates.HIDDEN);
    if (routingControl) {
      map.removeControl(routingControl);
      routingControl = null;
    }
    routeBtn.textContent = '🗺️ Tampilkan Rute';
    routeBtn.classList.remove('active');
    routeActive = false;
    clearAllHighlights();

    dragging = false;
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
        // Drag ke bawah - sembunyikan
        hideSheet();
      } else if (currentTranslate > thresholdHalf) {
        // Drag ke bawah - ke mode mini
        setSheetState(sheetStates.MINI);
      } else if (currentTranslate < thresholdHalf * 0.4) {
        // Drag ke atas - ke mode full
        setSheetState(sheetStates.FULL);
      } else {
        // Kembali ke state half
        setSheetState(sheetStates.HALF);
      }
    }
  }

  // Event listeners untuk drag
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

  // Hapus event listener untuk expand handle, expand hanya dengan drag

  // Event listener untuk header click (expand dari mini)
  sheetHeader.addEventListener('click', e => {
    // Hanya expand dari mini ke half jika klik header, bukan tombol X
    if (e.target !== sheetCloseBtn && !e.target.classList.contains('drag-handle') && currentSheetState === sheetStates.MINI) {
      setSheetState(sheetStates.HALF);
    }
  });

  map.on('click', function(e) {
    // Jika klik peta (bukan marker) dan sheet sedang tampil, turunkan ke mode mini
    if (!e.originalEvent.propagatedFromMarker && sheet.classList.contains('show')) {
      setSheetState(sheetStates.MINI);
    }
  });

  sheetCloseBtn.addEventListener('click', function(e) {
    e.stopPropagation(); // Mencegah event bubbling
    hideSheet();
  });
  
  window.addEventListener('resize', setBounds);
  setBounds();
});