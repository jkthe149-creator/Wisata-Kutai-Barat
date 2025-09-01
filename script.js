document.addEventListener('DOMContentLoaded', function() {

  // ================== MAP INIT ==================
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

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri'
  });
  const labels = L.tileLayer('https://cartodb-basemaps-a.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OSM</a> & Carto',
    pane: 'shadowPane'
  }).addTo(map);

  L.control.layers({
    "Default": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
    "Satelit": satellite
  }, {
    "Label Jalan & Lokasi": labels
  }, {
    position: 'topright'
  }).addTo(map);

  // ================== DATA WISATA ==================
  const wisata = [{
    name: "Jantur Mapan",
    coords: [-0.175133, 115.624654],
    desc: "Air Terjun Jantur Mapan terletak sekitar 10 km dari Melak Kubar di Kampung Linggang Mapan, mudah diakses dari jalan utama Barong Tongkok-Linggang Bigung. Air terjun tingginya kurang dari 10 meter dengan volume air besar, dikelilingi pepohonan rindang dan sejuk. Terdapat dua paviliun istirahat, toilet, ruang ganti, dua ayunan kecil dengan bangku, dan produk budaya Dayak seperti anyaman keranjang (anjat) serta topi pelindung (seraung). Tiket masuk Rp5.000 per orang.",
    type: "jantur",
    images: [
      "https://i.imgur.com/HqFQ3wv.jpeg",
      "https://i.imgur.com/UHt1guU.jpeg",
      "https://i.imgur.com/Rsf5UF0.jpeg",
      "https://i.imgur.com/YdAKSu6.jpeg"
    ],
    address: "RJFF+WVM, Jalan Sengkereaq Lacaaq Kampung, Linggang Mapan, Kec. Linggang Bigung, Kabupaten Kutai Barat, Kalimantan Timur 75776",
    labelColor: "#5dade2"
  }, {
    name: "Jantur Sengkulai",
    coords: [-0.171224, 115.615799],
    desc: "Jantur Sengkulai adalah air terjun alami yang dikelilingi hutan tropis asri. Tempat ini menawarkan suasana sejuk dan pemandangan yang menenangkan, cocok bagi pengunjung yang ingin menikmati keindahan alam.",
    type: "jantur",
    images: [
      "https://i.imgur.com/k7oXZ5p.jpeg",
      "https://i.imgur.com/JHKoztR.jpeg",
      "https://i.imgur.com/HMbIXBj.jpeg"
    ],
    address: "PG2X+85V, Terajuk, Nyuatan, West Kutai Regency, East Kalimantan 75777",
    labelColor: "#5dade2"
  }, {
    name: "Jantur Dora",
    coords: [-0.233265, 115.592426],
    desc: "Air Terjun Jantur Dora memiliki ketinggian sedang dengan aliran air yang cukup deras. Dikelilingi oleh pepohonan hijau yang rimbun, tempat ini cocok untuk wisata alam dan fotografi dengan suasana alami yang masih terjaga.",
    type: "jantur",
    images: [
      "https://i.imgur.com/Ss7xj52.jpeg",
      "https://i.imgur.com/3m41r4Y.jpeg",
      "https://i.imgur.com/BwlJ0YG.jpeg"
    ],
    address: "QH8R+JX, Balok, Kec. Barong Tongkok, Kabupaten Kutai Barat, Kalimantan Timur",
    labelColor: "#5dade2"
  }, {
    name: "Jantur Tabalas",
    coords: [-0.171794, 115.570421],
    desc: "Jantur Tabalas merupakan air terjun di tengah hutan tropis yang lebat dan alami. Tempat ini menonjolkan keindahan alam dan sesuai untuk pengunjung yang menyukai petualangan dan kegiatan outdoor.",
    type: "jantur",
    images: [
      "https://i.imgur.com/NlIdDcA.jpeg",
      "https://i.imgur.com/1bd3hd2.jpeg"
    ],
    address: "RHHC+658, Jl. Poros Tenggarong Melak, Juhan Asa, Kec. Barong Tongkok, Kabupaten Kutai Barat, Kalimantan Timur 75776",
    labelColor: "#5dade2"
  }, {
    name: "Jantur Inar",
    coords: [-0.298955, 115.547921],
    desc: "Air Terjun Jantur Inar adalah air terjun tinggi di Kutai Barat dengan hutan tropis masih asli, menawarkan pengalaman alam yang menenangkan dan petualangan. Tempat ini juga memiliki nilai budaya penting terkait kisah seorang gadis Dayak bangsawan.",
    type: "jantur",
    images: [
      "https://i.imgur.com/b7lliKA.jpeg",
      "https://i.imgur.com/XeNYscp.jpeg",
      "https://i.imgur.com/9fikPcl.jpeg",
      "https://i.imgur.com/avoXz5e.jpeg"
    ],
    address: "PG2X+85V, Terajuk, Nyuatan, West Kutai Regency, East Kalimantan 75777",
    labelColor: "#5dade2"
  }, {
    name: "Danau Aco",
    coords: [-0.166611, 115.544450],
    desc: "Danau Aco seluas 4 hektare terletak di Kampung Linggang Melapeh, Kecamatan Linggang Bigung, sekitar 20 km dari Sendawar. Nama 'Aco' berarti 'memberi' dalam bahasa Dayak Tunjung dialek Rentenuukng, danau ini dianggap sebagai pemberian alam akibat bencana di masa lalu.",
    type: "danau",
    images: [
      "https://i.imgur.com/IPZZtlj.jpeg",
      "https://i.imgur.com/6AoGuJk.jpeg",
      "https://i.imgur.com/RQaIsSO.jpeg"
    ],
    address: "RGMV+7QQ, Linggang Melapeh, Linggang Bigung, West Kutai Regency, East Kalimantan",
    labelColor: "#58d68d"
  }, {
    name: "Danau Jempang",
    coords: [-0.509459, 116.149478],
    desc: "Danau Jempang merupakan danau alami terbesar di sepanjang Sungai Mahakam dengan luas sekitar 15.000 hektare dan kedalaman 7-8 meter, terletak di Kecamatan Jempang. Di danau ini bisa ditemukan berbagai burung dan ikan endemik. Di sekitar danau terdapat desa tradisional Tanjung Isuy yang masih menjaga kearifan lokal dan budaya adat istiadat.",
    type: "danau",
    images: [
      "https://i.imgur.com/GxAUIWR.jpeg",
      "https://i.imgur.com/oLuFUhe.jpeg",
      "https://i.imgur.com/OeVQTqP.jpeg"
    ],
    address: "F4RX+5QQ, Tanjung Isuy, Jempang, West Kutai Regency, East Kalimantan 75773",
    labelColor: "#58d68d"
  }, {
    name: "Pulau Lanting",
    coords: [-0.495314, 116.191875],
    desc: "Pulau Lanting adalah pulau kecil dengan pemandangan laut yang indah dan suasana pantai yang tenang. Pulau ini menawarkan pengalaman menikmati alam pantai yang masih alami dan cocok untuk aktivitas santai seperti berenang.",
    type: "pulau",
    images: [
      "https://i.imgur.com/rjWnkxR.jpeg",
      "https://i.imgur.com/29XMDU4.jpeg",
      "https://i.imgur.com/xWnxWNO.jpeg"
    ],
    address: "Jempang, West Kutai Regency, East Kalimantan",
    labelColor: "#ec7063"
  }, {
    name: "Batuq Bura Lakan Bilem",
    coords: [-0.128331, 115.426489],
    desc: "Batuq Bura Lakan Bilem merupakan formasi batuan unik di tengah alam yang asri. Tempat ini juga menjadi lokasi kegiatan budaya dan tradisional masyarakat setempat, memberikan nilai historis dan kultural selain keindahan alamnya.",
    type: "sungai",
    images: [
      "https://i.imgur.com/fWjQZrn.jpeg",
      "https://i.imgur.com/h1l3bki.jpeg",
      "https://i.imgur.com/MFcF5Vp.jpeg"
    ],
    address: "VCCG+JJJ, Lakan Bilem, Nyuatan, West Kutai Regency, East Kalimantan 75776",
    labelColor: "#48C9B0"
  }, {
    name: "Wisata Air Hemaq Beniung",
    coords: [-0.165157, 115.681563],
    desc: "Wisata Air Hemaq Beniung menyajikan pesona danau yang menyegarkan di tengah kawasan alam Kutai Barat. Tempat ini kerap digunakan untuk rekreasi mendayung dan menjadi destinasi yang menyenangkan untuk menikmati suasana sekitar.",
    type: "danau",
    images: [
      "https://i.imgur.com/ePwKLCh.jpeg",
      "https://i.imgur.com/S1grXiO.jpeg"
    ],
    address: "RMMJ+VJ4, Juaq Asa, Barong Tongkok, West Kutai Regency, East Kalimantan 75776",
    labelColor: "#58d68d"
  }, {
    name: "Danau Tajan",
    coords: [-0.069131, 115.670522],
    desc: "Danau Tajan adalah danau alami dengan suasan yang menenangkan dan udara segar. Tempat ini populer untuk memancing dan menikmati keindahan alam serta ketenangan di sekitarnya.",
    type: "danau",
    images: [
      "https://i.imgur.com/kJbFiKg.jpeg",
      "https://i.imgur.com/kJbFiKg.jpeg"
    ],
    address: "WMJC+76, Jelemuq, Tering, West Kutai Regency, East Kalimantan",
    labelColor: "#58d68d"
  }, {
    name: "Danau Beluq",
    coords: [-0.320294, 115.515149],
    desc: "Danau Beluq berlokasi di kampung Dempar dengan luas sekitar 25 hektare dan dikelilingi berbagai jenis kayu dan akar-akar. Jaraknya sekitar 30 km dari ibu kota Kutai Barat. Danau ini memiliki legenda suku Dayak Benuaq yang menjadi asal usul terbentuknya danau.",
    type: "danau",
    images: [
      "https://i.imgur.com/SbjTjNJ.jpeg",
      "https://i.imgur.com/MDilDG0.jpeg"
    ],
    address: "MGH8+R34, Sentalar, Nyuatan, West Kutai Regency, East Kalimantan",
    labelColor: "#58d68d"
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
    let html, bgColor, iconColor;
    switch (type) {
      case "jantur":
        html = "🌊";
        bgColor = "#3498db";
        iconColor = "#5dade2";
        break;
      case "danau":
        html = "🏞️";
        bgColor = "#2ecc71";
        iconColor = "#58d68d";
        break;
      case "pulau":
        html = "🏝️";
        bgColor = "#e74c3c";
        iconColor = "#ec7063";
        break;
      case "sungai":
        html = "🛶";
        bgColor = "#48C9B0";
        iconColor = "#48C9B0";
        break;
      default:
        html = "📍";
        bgColor = "#95a5a6";
        iconColor = "#fff";
        break;
    }
    return `<div style="background-color: ${bgColor}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; border: 2px solid #242833; --icon-color: ${iconColor};">${html}</div>`;
  }
  
  function createCustomIcon(type) {
    const iconHTML = createIconHTML(type);
    return L.divIcon({
      className: 'custom-marker',
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

    if (map.getZoom() >= markerZoomThreshold) {
      marker.addTo(map);
    }

    setTimeout(() => {
      const tooltip = marker.getTooltip();
      if (tooltip && tooltip.getElement()) {
        const element = tooltip.getElement();
        if (labelDirection === 'left') {
          element.style.transform = 'translateX(-10px)';
          element.style.marginLeft = '-8px';
        } else {
          element.style.transform = 'translateX(10px)';
          element.style.marginRight = '-8px';
        }
        
        if (map.getZoom() >= labelZoomThreshold) {
          element.style.display = 'block';
        } else {
          element.style.display = 'none';
        }
      }
    }, 100);
  });

  updateVisibility();

  const searchInput = document.getElementById('search-input'),
    searchOverlay = document.getElementById('search-overlay'),
    closeSearchBtn = document.getElementById('search-overlay-close'),
    resultsList = document.getElementById('search-results-list');

  function populateSearchResults() {
    resultsList.innerHTML = '';
    wisata.forEach(loc => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.innerHTML = `<div class="icon-container">${createIconHTML(loc.type)}</div><span>${loc.name}</span>`;
      item.addEventListener('click', () => {
        const targetMarker = markers.find(m => m._locData.name === loc.name);
        if (targetMarker) {
          targetMarker.fire('click');
        }
        hideSearchOverlay();
      });
      resultsList.appendChild(item);
    });
  }

  function showSearchOverlay() {
    searchOverlay.classList.add('show');
  }

  function hideSearchOverlay() {
    searchOverlay.classList.remove('show');
  }

  searchInput.addEventListener('click', showSearchOverlay);
  closeSearchBtn.addEventListener('click', hideSearchOverlay);
  populateSearchResults();

  // ================== FUNGSI GPS ==================
  const gpsBtn = document.getElementById('gps-btn');
  const permissionModal = document.getElementById('gps-permission-modal');
  const allowGpsBtn = document.getElementById('allow-gps');
  const denyGpsBtn = document.getElementById('deny-gps');

  window.addEventListener('load', () => {
    setTimeout(() => {
      permissionModal.style.display = 'flex';
    }, 1000);
  });

  function requestLocationPermission() {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung geolocation");
      return;
    }

    permissionModal.style.display = 'none';
    gpsBtn.classList.add('loading');

    navigator.geolocation.getCurrentPosition(
      () => {
        startWatchingPosition();
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

  allowGpsBtn.addEventListener('click', requestLocationPermission);
  denyGpsBtn.addEventListener('click', () => {
    permissionModal.style.display = 'none';
  });

  // ================== FUNGSI RUTE ==================
  const routeBtn = document.getElementById('route-btn');

  routeBtn.addEventListener('click', () => {
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
      [sheetStates.HALF]: windowH - (windowH * 0.5),
      [sheetStates.MINI]: windowH - parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--mini-height")),
      [sheetStates.FULL]: 0
    };
  }

  function setSheetState(state) {
    sheet.classList.remove('mini', 'half', 'full', 'show');
    
    switch(state) {
      case sheetStates.MINI:
        sheet.classList.add('show', 'mini');
        sheet.style.transform = `translateY(calc(100% - var(--mini-height)))`;
        break;
      case sheetStates.HALF:
        sheet.classList.add('show', 'half');
        sheet.style.transform = "translateY(0)";
        sheet.style.height = "50%";
        break;
      case sheetStates.FULL:
        sheet.classList.add('show', 'full');
        sheet.style.transform = "translateY(0)";
        sheet.style.height = "85%";
        break;
      case sheetStates.HIDDEN:
        sheet.style.transform = "translateY(100%)";
        break;
    }
    
    currentSheetState = state;
    setBounds();
  }

  function showSheet(loc) {
    sheetImages.innerHTML = '';
    if (loc.images && loc.images.length > 0) {
      loc.images.forEach(imgUrl => {
        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = `Gambar ${loc.name}`;
        sheetImages.appendChild(img);
      });
    }

    if (loc.address) {
      sheetAddress.textContent = loc.address;
      sheetAddressContainer.style.display = 'flex';
    } else {
      sheetAddressContainer.style.display = 'none';
    }

    sheetTitle.textContent = loc.name;
    sheetDesc.textContent = loc.desc;

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
  }, { passive: true });
  window.addEventListener('touchmove', e => {
    dragging && e.touches.length > 0 && moveDrag(e.touches[0].clientY)
  }, { passive: true });
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
  // Hanya sembunyikan sheet jika bukan klik pada marker
  if (!e.originalEvent.propagatedFromMarker && sheet.classList.contains('show')) {
    hideSheet();
  }
});

  sheetCloseBtn.addEventListener('click', function(e) {
    e.stopPropagation(); // Mencegah event bubbling
    hideSheet();
  });
  
  window.addEventListener('resize', setBounds);
  setBounds();

});