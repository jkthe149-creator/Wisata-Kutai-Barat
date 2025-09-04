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
  const wisata = [ /* ... data wisata tetap sama ... */ ];

  // ================== MARKER & TOOLTIP ==================
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

  function createIconHTML(type) {
    let html, bgColor, iconColor;
    switch (type) {
      case "jantur": html = "🌊"; bgColor = "#3498db"; iconColor = "#5dade2"; break;
      case "danau": html = "🏞️"; bgColor = "#2ecc71"; iconColor = "#58d68d"; break;
      case "pulau": html = "🏝️"; bgColor = "#e74c3c"; iconColor = "#ec7063"; break;
      case "sungai": html = "🛶"; bgColor = "#48C9B0"; iconColor = "#48C9B0"; break;
      default: html = "📍"; bgColor = "#95a5a6"; iconColor = "#fff"; break;
    }
    return `<div style="background-color:${bgColor};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:18px;border:2px solid #242833;--icon-color:${iconColor};">${html}</div>`;
  }

  function createCustomIcon(type) {
    return L.divIcon({
      className: 'custom-marker',
      html: createIconHTML(type),
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  }

  let markers = [], activeMarker = null;
  const markerZoomThreshold = 9;
  const labelZoomThreshold = 11;

  function updateVisibility() {
    const currentZoom = map.getZoom();
    const isMarkerVisible = currentZoom >= markerZoomThreshold;
    const isLabelVisible = currentZoom >= labelZoomThreshold;

    markers.forEach(marker => {
      if (isMarkerVisible) {
        if (!map.hasLayer(marker)) map.addLayer(marker);
      } else {
        if (map.hasLayer(marker)) map.removeLayer(marker);
      }
      const tooltip = marker.getTooltip();
      if (tooltip && tooltip.getElement()) {
        tooltip.getElement().style.display = isLabelVisible ? 'block' : 'none';
      }
    });
    document.getElementById('map').classList.toggle('labels-visible', isLabelVisible);
  }

  wisata.forEach((loc, index) => {
    const marker = L.marker(loc.coords, { icon: createCustomIcon(loc.type) });
    marker._locData = loc;
    markers.push(marker);
    marker.bindTooltip(loc.name, {
      permanent: true,
      direction: index % 2 === 0 ? 'right' : 'left',
      offset: [index % 2 === 0 ? 20 : -20, 0],
      className: `location-label ${loc.type}`,
      opacity: 1
    });

    marker.on("click", (e) => {
      L.DomEvent.stopPropagation(e);
      clearAllHighlights();
      activeMarker = e.target;
      activeMarker._icon.classList.add('active');
      const tooltip = activeMarker.getTooltip();
      if (tooltip && tooltip.getElement()) {
        tooltip.getElement().classList.add('active');
        tooltip.getElement().style.setProperty('--label-active-color', activeMarker._locData.labelColor);
      }
      map.flyTo(loc.coords, Math.max(map.getZoom(), 14), { duration: 1.2 });
      showSheet(loc);
    });

    if (map.getZoom() >= markerZoomThreshold) marker.addTo(map);
  });

  map.on('zoomend moveend', updateVisibility);
  updateVisibility();

  // ================== SEARCH ==================
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
        if (targetMarker) targetMarker.fire('click');
        hideSearchOverlay();
      });
      resultsList.appendChild(item);
    });
  }
  function showSearchOverlay() { searchOverlay.classList.add('show'); }
  function hideSearchOverlay() { searchOverlay.classList.remove('show'); }

  searchInput.addEventListener('click', showSearchOverlay);
  closeSearchBtn.addEventListener('click', hideSearchOverlay);
  populateSearchResults();

  // 🔊 Mic Search Feature (Placeholder)
  const searchMic = document.querySelector('.search-mic');
  if (searchMic) {
    searchMic.addEventListener('click', () => {
      alert("Fitur voice search akan tersedia segera!");
    });
  }

  // ================== GPS, ROUTE, HEADER, BOTTOM SHEET ==================
  // ... semua fungsi GPS, routing, header, bottom sheet tetap sama seperti sebelumnya ...

});
