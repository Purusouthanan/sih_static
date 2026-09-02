
window.addEventListener('error', function(e) {
  if (e.message.includes("null") || e.message.includes("undefined")) {
    console.warn("Ignored missing element on this page");
    e.preventDefault();
  }
});

// ============================================================
// MOCK DATA
// ============================================================

// ============================================================
// NAVIGATION
// ============================================================
function navigateTo(page) {
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.querySelector(`[data-page="${page}"]`).classList.add('active');
  document.querySelectorAll('.page-section').forEach(el => el.classList.remove('active'));
  document.getElementById(`page-${page}`).classList.add('active');
  // close sidebar on mobile
  if(window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.remove('mobile-open');
  }
  
  // Refresh leaflet maps
  setTimeout(() => {
    if (page === 'overview' && typeof overviewMap !== 'undefined' && overviewMap) overviewMap.invalidateSize();
    if (page === 'riskmap' && typeof riskMap !== 'undefined' && riskMap) riskMap.invalidateSize();
  }, 200);
}

function toggleMobileMenu() {
  document.getElementById('sidebar').classList.toggle('mobile-open');
}

// ============================================================
// CLOCK & SYNC
// ============================================================
let syncCounter = 12;
function updateClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2,'0');
  const mm = String(now.getMinutes()).padStart(2,'0');
  const ss = String(now.getSeconds()).padStart(2,'0');
  document.getElementById('live-time').textContent = `${hh}:${mm}:${ss}`;
  syncCounter = (syncCounter >= 30) ? 5 : syncCounter + 1;
  document.getElementById('sync-time').textContent = syncCounter + 's';
}
setInterval(updateClock, 1000);
updateClock();

// ============================================================
// RENDER MAP NODES
// ============================================================
// ============================================================
// LEAFLET MAPS
// ============================================================
let overviewMap, riskMap;
const defaultBounds = [[28.5, 77.0], [28.7, 77.4]];

function initLeafletMaps() {
  if (document.getElementById('real-map')) {
    overviewMap = L.map('real-map', { zoomControl: false, attributionControl: false }).fitBounds(defaultBounds);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png').addTo(overviewMap);
  }
  
  if (document.getElementById('real-riskmap')) {
    riskMap = L.map('real-riskmap', { zoomControl: true }).fitBounds(defaultBounds);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(riskMap);
  }

  const extended = [

    ...DATA.mapNodes,
    { id:'AIR-01', x:68, y:22, color:'#ea580c', riskLevel:'high', risk:76, conf:89, sensors:'4/4', model:'Pollution v2.1', type:'Air', lastSync:'11s' },
    { id:'AIR-02', x:55, y:65, color:'#d97706', riskLevel:'warning', risk:61, conf:84, sensors:'4/4', model:'Pollution v2.1', type:'Air', lastSync:'7s' },
    { id:'LAND-10',x:52, y:74, color:'#d97706', riskLevel:'warning', risk:61, conf:84, sensors:'5/5', model:'Heat v1.0', type:'Land', lastSync:'8s' },
  ];

  extended.forEach(node => {
    const lat = 28.7 - (node.y / 100) * 0.2;
    const lng = 77.0 + (node.x / 100) * 0.4;
    
    const iconHtml = `
      <div style="position:relative;display:flex;flex-direction:column;align-items:center;gap:2px">
        <div style="width:14px;height:14px;border-radius:50%;background:${node.color};border:2px solid #fff;box-shadow:0 0 8px ${node.color}90;"></div>
        <div style="background:rgba(255,255,255,0.9);border:1px solid ${node.color};border-radius:3px;padding:1px 5px;font-size:0.55rem;font-weight:700;color:${node.color};white-space:nowrap">${node.id}</div>
      </div>
    `;
    const icon = L.divIcon({ className: 'leaflet-custom-icon', html: iconHtml, iconSize: [40, 40], iconAnchor: [20, 10] });

    // Overview marker
    if (overviewMap && DATA.mapNodes.some(n => n.id === node.id)) {
      L.marker([lat, lng], {icon}).addTo(overviewMap)
        .bindTooltip(`<b>${node.id}</b><br>Risk: ${node.risk}%<br>Conf: ${node.conf}%`, {direction: 'top'});
    }
    // Risk map marker
    if (riskMap) {
      L.marker([lat, lng], {icon}).addTo(riskMap)
        .bindPopup(`
        <div style="font-family:Inter,sans-serif;font-size:12px;color:#334155;padding:5px">
          <strong style="color:${node.color};font-size:14px;display:block;margin-bottom:5px">${node.id}</strong>
          <div><b>Status:</b> ${node.riskLevel.toUpperCase()}</div>
          <div><b>Risk:</b> ${node.risk}%</div>
          <div><b>Confidence:</b> ${node.conf}%</div>
          <div><b>Model:</b> ${node.model}</div>
        </div>
      `);
    }
  });

  // Highlight Zone
  const zoneCenter = [28.62, 77.1];
  L.circle(zoneCenter, { color: '#dc2626', fillColor: '#dc2626', fillOpacity: 0.15, radius: 4000 }).addTo(riskMap)
    .bindTooltip("CRITICAL FLOOD ZONE", {permanent: true, direction: "center", className: "leaflet-zone-label"})
    .openTooltip();
}

// ============================================================
// THREATS PANEL
// ============================================================
function renderThreats() {
  const container = document.getElementById('threats-panel');
  container.innerHTML = '';
  DATA.threats.forEach(t => {
    const propHtml = t.propMin
      ? `<div class="threat-prop"><span class="tp-label">Estimated Propagation</span><span class="tp-value">${t.propMin} MIN</span></div>`
      : '';
    const levelColor = t.level === 'critical' ? 'var(--red)' : t.level === 'high' ? 'var(--orange)' : 'var(--yellow)';
    const tagClass = t.level === 'critical' ? 'tag-critical' : t.level === 'high' ? 'tag-high' : 'tag-warning';
    const card = document.createElement('div');
    card.className = `threat-card ${t.level}`;
    card.innerHTML = `
      <div class="threat-top">
        <span class="tag ${tagClass}">${t.level.toUpperCase()}</span>
      </div>
      <div class="threat-type">${t.type}</div>
      <div class="threat-loc">${t.location}</div>
      <div class="threat-metrics">
        <div class="tm-item"><span class="tm-label">Risk</span><span class="tm-value" style="color:${levelColor}">${t.risk}%</span></div>
        <div class="tm-item"><span class="tm-label">Confidence</span><span class="tm-value">${t.conf}%</span></div>
      </div>
      <div class="threat-detected">
        <div class="td-title">Detected</div>
        ${t.detected.map(d=>`<div class="td-item">${d}</div>`).join('')}
      </div>
      ${propHtml}
      <button class="threat-btn" onclick="openEventModal('${t.id}')">VIEW EVENT</button>
    `;
    container.appendChild(card);
  });
}

// ============================================================
// TELEMETRY TABLE
// ============================================================
let telemOffset = 0;
function renderTelemetry() {
  const tbody = document.getElementById('telem-tbody');
  if (!tbody) return;
  const now = new Date();
  tbody.innerHTML = '';
  const rows = DATA.telemetry.slice(0, 12);
  rows.forEach((row, i) => {
    const t = new Date(now - (i * 3000 + telemOffset * 1000));
    const ts = `${String(t.getHours()).padStart(2,'0')}:${String(t.getMinutes()).padStart(2,'0')}:${String(t.getSeconds()).padStart(2,'0')}`;
    const devClass = row.level === 'critical' ? 'td-dev-crit' : row.level === 'high' ? 'td-dev-high' : row.level === 'warning' ? 'td-dev-warn' : 'td-dev-ok';
    const tagClass = row.level === 'critical' ? 'tag-critical' : row.level === 'high' ? 'tag-high' : row.level === 'warning' ? 'tag-warning' : 'tag-normal';
    const tagText = row.level === 'critical' ? 'CRITICAL' : row.level === 'high' ? 'HIGH' : row.level === 'warning' ? 'WARNING' : 'NORMAL';
    tbody.innerHTML += `
      <tr>
        <td class="td-time">${ts}</td>
        <td class="td-node">${row.node}</td>
        <td>${row.param}</td>
        <td class="td-val">${row.value}</td>
        <td style="color:var(--text-muted)">${row.baseline}</td>
        <td class="${devClass}">${row.dev}</td>
        <td><span class="tag ${tagClass}">${tagText}</span></td>
      </tr>
    `;
  });
}

setInterval(() => {
  telemOffset += 3;
  renderTelemetry();
}, 5000);

// ============================================================
// NODES TABLE
// ============================================================
function renderNodes(filterData) {
  const tbody = document.getElementById('nodes-tbody');
  if (!tbody) return;
  const data = filterData || DATA.nodes;
  tbody.innerHTML = '';
  data.forEach(node => {
    const statusHtml = node.status === 'online'
      ? `<span class="status-pill sp-online"><span class="sp-dot"></span>ONLINE</span>`
      : `<span class="status-pill sp-offline"><span class="sp-dot"></span>OFFLINE</span>`;
    const riskClass = node.riskLevel === 'critical' ? 'nt-risk-crit' : node.riskLevel === 'high' ? 'nt-risk-high' : node.riskLevel === 'warning' ? 'nt-risk-warn' : node.riskLevel === 'offline' ? '' : 'nt-risk-ok';
    const riskVal = node.risk > 0 ? node.risk + '%' : '—';
    // Signal bars
    const bars = [1,2,3,4].map(n => `<div class="sb${n <= node.signal ? ' active' : ''}" style="height:${n*3+3}px"></div>`).join('');
    const signalLabel = node.signal === 0 ? '<span style="color:var(--text-muted);font-size:0.62rem">Offline</span>' : `<div class="signal-bars">${bars}</div>`;
    // Battery
    const batColor = node.battery > 70 ? 'var(--green)' : node.battery > 30 ? 'var(--yellow)' : 'var(--red)';
    const batHtml = `<div style="display:inline-flex;align-items:center;gap:4px"><div class="battery-bar-wrap"><div class="battery-bar" style="width:${node.battery}%;background:${batColor}"></div></div><span style="font-size:0.65rem;color:var(--text-secondary)">${node.battery}%</span></div>`;
    tbody.innerHTML += `
      <tr>
        <td class="nt-node">${node.id}</td>
        <td><span class="tag tag-info" style="font-size:0.55rem">${node.type.toUpperCase()}</span></td>
        <td style="color:var(--text-secondary);max-width:150px;overflow:hidden;text-overflow:ellipsis">${node.location}</td>
        <td>${statusHtml}</td>
        <td class="${riskClass}">${riskVal}</td>
        <td style="color:var(--text-muted);font-size:0.63rem">${node.model}</td>
        <td>${signalLabel}</td>
        <td>${batHtml}</td>
        <td style="color:var(--text-muted);font-family:'Courier New',monospace;font-size:0.63rem">${node.lastSync} ago</td>
      </tr>
    `;
  });
}

function filterNodes() {
  const search = document.getElementById('nodes-search')?.value.toLowerCase() || '';
  const status = document.getElementById('nodes-status-filter')?.value || 'all';
  const type = document.getElementById('nodes-type-filter')?.value || 'all';
  const filtered = DATA.nodes.filter(n => {
    const matchSearch = n.id.toLowerCase().includes(search) || n.location.toLowerCase().includes(search);
    const matchStatus = status === 'all' || n.status === status;
    const matchType = type === 'all' || n.type.toLowerCase() === type;
    return matchSearch && matchStatus && matchType;
  });
  renderNodes(filtered);
}

// ============================================================
// ALERTS
// ============================================================
function renderAlerts(filter) {
  const container = document.getElementById('alerts-list');
  if (!container) return;
  container.innerHTML = '';
  const f = filter || 'all';
  DATA.alerts.filter(a => f === 'all' || a.severity === f).forEach(alert => {
    const card = document.createElement('div');
    const cls = alert.severity === 'critical' ? 'crit' : alert.severity === 'high' ? 'high' : alert.severity === 'warning' ? 'warn' : 'norm';
    const tc = alert.severity === 'critical' ? 'tag-critical' : alert.severity === 'high' ? 'tag-high' : alert.severity === 'warning' ? 'tag-warning' : 'tag-normal';
    card.className = `alert-card ${cls}`;
    card.innerHTML = `
      <div class="alert-top">
        <div>
          <div class="alert-type">${alert.type}</div>
          <div class="alert-loc">${alert.location}</div>
        </div>
        <span class="tag ${tc}">${alert.severity.toUpperCase()}</span>
      </div>
      <div class="alert-meta">
        <div class="am-item"><span class="am-label">Risk</span><span class="am-val">${alert.risk}%</span></div>
        <div class="am-item"><span class="am-label">Confidence</span><span class="am-val">${alert.conf}%</span></div>
        <div class="am-item"><span class="am-label">Detected</span><span class="am-val">${alert.ago} ago</span></div>
        ${alert.pop ? `<div class="am-item"><span class="am-label">Affected</span><span class="am-val">${alert.pop.toLocaleString()} people</span></div>` : ''}
      </div>
      ${alert.prop ? `<div class="alert-info">Propagation estimate: <strong style="color:var(--red)">${alert.prop}</strong></div>` : ''}
      <div class="alert-actions">
        <button class="btn btn-cyan btn-sm" onclick="openEventModal('${alert.id}')">VIEW EVENT</button>
        <button class="btn btn-sm" onclick="this.textContent='✓ Acknowledged';this.style.color='var(--green)'">ACKNOWLEDGE</button>
        <button class="btn btn-red btn-sm">ESCALATE</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function filterAlerts(filter) {
  document.querySelectorAll('.af-btn').forEach(b => {
    b.className = 'af-btn';
    if (b.dataset.filter === filter) {
      if (filter === 'all') b.classList.add('active-all');
      else if (filter === 'critical') b.classList.add('active-crit');
      else if (filter === 'high') b.classList.add('active-high');
      else if (filter === 'warning') b.classList.add('active-warning');
    }
  });
  renderAlerts(filter);
}

// ============================================================
// EVENTS PAGE
// ============================================================
function renderEvents() {
  const container = document.getElementById('events-list');
  if (!container) return;
  DATA.events.forEach(ev => {
    const card = document.createElement('div');
    card.className = `event-card ${ev.severity}`;
    card.innerHTML = `
      <div class="event-top">
        <div>
          <div class="event-title">${ev.title}</div>
          <div class="event-id">${ev.id}</div>
        </div>
        <span class="tag tag-${ev.severity === 'crit' ? 'critical' : ev.severity === 'high' ? 'high' : 'warning'}">${ev.status}</span>
      </div>
      <div class="event-meta-row">
        <div class="em-item"><span class="em-label">Risk</span><span class="em-val">${ev.risk}%</span></div>
        <div class="em-item"><span class="em-label">Confidence</span><span class="em-val">${ev.conf}%</span></div>
        <div class="em-item"><span class="em-label">Evidence</span><span class="em-val">${ev.evidence.length} signals</span></div>
      </div>
      <div style="display:flex;gap:8px;margin-top:4px">
        <button class="btn btn-cyan btn-sm" onclick="openEventModal('${ev.id}')">VIEW DETAILS</button>
        <button class="btn btn-sm">TIMELINE</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// ============================================================
// MODAL
// ============================================================
function openEventModal(evId) {
  const ev = DATA.events.find(e => e.id === evId);
  if (!ev) return;

  document.getElementById('modal-title').textContent = ev.title;
  document.getElementById('modal-id').textContent = ev.id;
  document.getElementById('modal-status').textContent = ev.status;
  document.getElementById('modal-status').style.color = ev.severity === 'crit' ? 'var(--red)' : ev.severity === 'high' ? 'var(--orange)' : 'var(--yellow)';
  document.getElementById('modal-risk').textContent = ev.risk + ' / 100';
  document.getElementById('modal-conf').textContent = ev.conf + '%';

  const tl = document.getElementById('modal-timeline');
  tl.innerHTML = '';
  ev.timeline.forEach((step, i) => {
    const isLast = i === ev.timeline.length - 1;
    tl.innerHTML += `
      <div class="tl-item">
        <div class="tl-dot-col">
          <div class="tl-dot"></div>
          ${!isLast ? '<div class="tl-line"></div>' : ''}
        </div>
        <span class="tl-time">${step.time}</span>
        <span class="tl-text">${step.text}</span>
      </div>
    `;
  });

  const evList = document.getElementById('modal-evidence');
  evList.innerHTML = ev.evidence.map(e => `<li>${e}</li>`).join('');

  const impact = document.getElementById('modal-impact');
  impact.innerHTML = ev.impact.map(i => `<div style="font-size:0.68rem;color:var(--text-secondary);padding:4px 0;border-bottom:1px solid var(--border)">${i}</div>`).join('');

  document.getElementById('modal-prediction').textContent = ev.prediction;

  document.getElementById('modal-overlay').classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (!e || e.target === document.getElementById('modal-overlay')) {
    document.getElementById('modal-overlay').classList.remove('visible');
    document.body.style.overflow = '';
  }
}

// ============================================================
// PIPELINE
// ============================================================
function renderPipeline() {
  const wrap = document.getElementById('pipeline-wrap');
  if (!wrap) return;
  wrap.innerHTML = '';
  // Stage colors cycling through the risk palette
  const stageColors = [
    { border:'rgba(56,189,248,0.3)',  bg:'rgba(56,189,248,0.05)',  name:'var(--cyan)' },
    { border:'rgba(56,189,248,0.25)', bg:'rgba(56,189,248,0.04)',  name:'var(--cyan)' },
    { border:'rgba(56,189,248,0.2)',  bg:'rgba(56,189,248,0.04)',  name:'var(--cyan)' },
    { border:'rgba(234,179,8,0.3)',   bg:'rgba(234,179,8,0.04)',   name:'var(--yellow)' },
    { border:'rgba(249,115,22,0.3)',  bg:'rgba(249,115,22,0.04)',  name:'var(--orange)' },
    { border:'rgba(34,197,94,0.3)',   bg:'rgba(34,197,94,0.05)',   name:'var(--green)' },
    { border:'rgba(249,115,22,0.3)',  bg:'rgba(249,115,22,0.04)',  name:'var(--orange)' },
    { border:'rgba(239,68,68,0.3)',   bg:'rgba(239,68,68,0.05)',   name:'var(--red)' },
    { border:'rgba(239,68,68,0.5)',   bg:'rgba(239,68,68,0.1)',    name:'var(--red)' },
  ];
  DATA.pipeline.forEach((stage, i) => {
    const isLast = i === DATA.pipeline.length - 1;
    const sc = stageColors[i] || stageColors[0];
    const delay = (i * 0.35).toFixed(2);
    wrap.innerHTML += `
      <div class="pipe-stage">
        <div class="pipe-node" style="--pipe-delay:${delay}s;border-color:${sc.border};background:${sc.bg}">
          <div class="pipe-left">
            <div class="pipe-step-num" style="color:${sc.name};border-color:${sc.border}">${String(i+1).padStart(2,'0')}</div>
            <div>
              <div class="pipe-name" style="color:${sc.name}">${stage.name}</div>
              <div class="pipe-desc">${stage.desc}</div>
            </div>
          </div>
          <div class="pipe-metric">
            <div class="pm-val">${stage.val}</div>
            <div class="pm-label">${stage.label}</div>
          </div>
        </div>
        ${!isLast ? '<div class="pipe-connector"><div class="pipe-conn-line"></div></div>' : ''}
      </div>
    `;
  });
}

// ============================================================
// RISK MAP LAYERS
// ============================================================
const LAYERS = [
  { name:'Flood',         color:'#38bdf8', checked:true  },
  { name:'Fire',          color:'#f97316', checked:true  },
  { name:'Air Pollution', color:'#a78bfa', checked:true  },
  { name:'Heat',          color:'#ef4444', checked:true  },
  { name:'Landslide',     color:'#84cc16', checked:false },
  { name:'Industrial',    color:'#fb923c', checked:true  },
];
function renderLayers() {
  const container = document.getElementById('layer-list');
  if (!container) return;
  container.innerHTML = '';
  LAYERS.forEach((layer, i) => {
    const item = document.createElement('div');
    item.className = 'layer-item';
    item.innerHTML = `
      <div class="layer-cb ${layer.checked ? 'checked' : ''}" id="layer-cb-${i}" onclick="toggleLayer(${i})"></div>
      <span class="layer-label">${layer.name}</span>
      <div class="layer-dot" style="background:${layer.color}"></div>
    `;
    container.appendChild(item);
  });
}
function toggleLayer(i) {
  LAYERS[i].checked = !LAYERS[i].checked;
  const cb = document.getElementById(`layer-cb-${i}`);
  cb.classList.toggle('checked', LAYERS[i].checked);
}

// ============================================================
// MAP CONTROLS
// ============================================================
function mapZoom(dir) {
  const activeSection = document.querySelector('.page-section.active');
  const activeMap = (activeSection && activeSection.id === 'page-riskmap') ? riskMap : overviewMap;
  if (!activeMap) return;
  if (dir > 0) activeMap.zoomIn();
  else activeMap.zoomOut();
}
function mapCenter() { 
  const activeSection = document.querySelector('.page-section.active');
  const activeMap = (activeSection && activeSection.id === 'page-riskmap') ? riskMap : overviewMap;
  if (activeMap) activeMap.fitBounds(defaultBounds); 
}
function toggleMapLayers() { alert('Layer controls: Use the Risk Map page for full layer controls.'); }

// ============================================================
// CANVAS CHARTS
// ============================================================
function drawFingerprintChart() {
  const canvas = document.getElementById('ef-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  // Normal range band
  ctx.fillStyle = 'rgba(34,197,94,0.1)';
  ctx.fillRect(0, h * 0.3, w, h * 0.35);

  // Normal range border
  ctx.strokeStyle = 'rgba(34,197,94,0.3)';
  ctx.setLineDash([3, 3]);
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, h * 0.3); ctx.lineTo(w, h * 0.3); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, h * 0.65); ctx.lineTo(w, h * 0.65); ctx.stroke();
  ctx.setLineDash([]);

  // Historical normal line
  const normalPts = [0,5,8,3,6,4,7,5,6,8,4,5,7,6,5,4,6,5,8,7];
  ctx.strokeStyle = 'rgba(34,197,94,0.6)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  normalPts.forEach((pt, i) => {
    const x = (i / (normalPts.length - 1)) * w;
    const y = h * 0.47 + (pt - 5) * 2;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Current anomalous line
  const currentPts = [0,4,6,8,12,16,20,25,30,34,36,38,36,34,36,38,40,38,36,34];
  const grad = ctx.createLinearGradient(0, 0, w, 0);
  grad.addColorStop(0, 'rgba(34,197,94,0.8)');
  grad.addColorStop(0.5, 'rgba(234,179,8,0.9)');
  grad.addColorStop(1, 'rgba(239,68,68,1)');
  ctx.strokeStyle = grad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  currentPts.forEach((pt, i) => {
    const x = (i / (currentPts.length - 1)) * w;
    const y = h - (pt / 40) * h - 4;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Labels
  ctx.fillStyle = 'rgba(34,197,94,0.7)';
  ctx.font = '7px Segoe UI';
  ctx.fillText('Normal range', 3, h * 0.26);
  ctx.fillStyle = 'rgba(239,68,68,0.9)';
  ctx.fillText('Current', w - 38, 12);
}

function drawMNCCanvas() {
  const canvas = document.getElementById('mnc-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  // Node positions
  const nodes = [
    { x: 40,  y: 20, conf: 91, color: '#22c55e', id: 'W-07' },
    { x: 100, y: 40, conf: 87, color: '#22c55e', id: 'W-08' },
    { x: 160, y: 20, conf: 93, color: '#22c55e', id: 'W-09' },
    { x: 220, y: 40, conf: 21, color: '#eab308', id: 'W-10' },
  ];
  // Center
  const cx = 130, cy = h - 8;

  // Lines to center
  nodes.forEach(n => {
    ctx.strokeStyle = n.conf > 50 ? 'rgba(56,189,248,0.4)' : 'rgba(234,179,8,0.3)';
    ctx.lineWidth = n.conf > 50 ? 1.5 : 0.8;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(n.x, n.y);
    ctx.lineTo(cx, cy);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  // Nodes
  nodes.forEach(n => {
    ctx.fillStyle = n.color + '30';
    ctx.strokeStyle = n.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(n.x, n.y, 8, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = n.color;
    ctx.font = 'bold 6px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText(n.conf + '%', n.x, n.y + 2);
  });
}

// ============================================================
// AI INSIGHTS - MODEL PERFORMANCE
// ============================================================
function renderModelPerf() {
  const container = document.getElementById('model-perf-list');
  if (!container) return;
  const models = [
    { name:'Flood Model v1.4',      acc:94.2, precision:92.8, recall:95.1 },
    { name:'Fire Model v1.2',       acc:91.6, precision:90.2, recall:93.4 },
    { name:'Pollution Model v2.1',  acc:93.4, precision:91.7, recall:94.8 },
    { name:'Heat Model v1.0',       acc:88.9, precision:87.5, recall:90.2 },
    { name:'Landslide Model v1.0',  acc:86.3, precision:84.1, recall:88.5 },
  ];
  container.innerHTML = '';
  models.forEach(m => {
    container.innerHTML += `
      <div class="model-row">
        <span class="model-name">${m.name}</span>
        <div class="model-bar-wrap"><div class="model-bar" style="width:${m.acc}%"></div></div>
        <span class="model-pct">${m.acc}%</span>
      </div>
      <div style="display:flex;gap:12px;margin:-6px 0 8px 130px">
        <span style="font-size:0.58rem;color:var(--text-muted)">Precision: <strong style="color:var(--cyan)">${m.precision}%</strong></span>
        <span style="font-size:0.58rem;color:var(--text-muted)">Recall: <strong style="color:var(--green)">${m.recall}%</strong></span>
      </div>
    `;
  });
}

function renderConfChart() {
  const container = document.getElementById('conf-chart');
  if (!container) return;
  const vals = [72, 78, 68, 85, 91, 88, 94, 87, 92, 95, 89, 94];
  const labels = ['10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30'];
  container.innerHTML = '';
  vals.forEach((v, i) => {
    const maxH = 72;
    const barH = (v / 100) * maxH;
    const color = v >= 90 ? 'var(--green)' : v >= 75 ? 'var(--cyan)' : 'var(--yellow)';
    container.innerHTML += `
      <div class="conf-bar-wrap">
        <div class="conf-bar" style="height:${barH}px;background:${color}"></div>
        <div class="conf-label">${labels[i]}</div>
      </div>
    `;
  });
}

// ============================================================
// LIVE SIMULATION ENGINE
// ============================================================

// Track simulation state
const SIM = {
  syncCounter: 0,
  confBase: 94.7,
  riskBase: 72,
  readingsBase: 2847,
};

function jitterTelemetry() {
  DATA.telemetry.forEach(row => {
    if (row.param === 'Water Level') {
      const base = parseFloat(row.value);
      const newVal = Math.max(3.8, Math.min(4.6, base + (Math.random() - 0.42) * 0.08)).toFixed(2);
      row.value = newVal + ' m';
      const dev = (((newVal - 3.0) / 3.0) * 100).toFixed(0);
      row.dev = '+' + dev + '%';
    } else if (row.param === 'Rainfall') {
      const base = parseFloat(row.value);
      const newVal = Math.max(38, Math.min(60, base + (Math.random() - 0.5) * 2)).toFixed(1);
      row.value = newVal + ' mm/h';
    } else if (row.param === 'AQI') {
      const base = parseInt(row.value);
      const newVal = Math.max(100, Math.min(200, base + Math.round((Math.random() - 0.5) * 4)));
      row.value = newVal.toString();
    } else if (row.param === 'Soil Moisture') {
      const base = parseFloat(row.value);
      const newVal = Math.max(55, Math.min(90, base + (Math.random() - 0.5) * 1)).toFixed(0);
      row.value = newVal + '%';
    } else if (row.param === 'Temperature') {
      const base = parseFloat(row.value);
      const newVal = Math.max(30, Math.min(45, base + (Math.random() - 0.5) * 0.3)).toFixed(1);
      row.value = newVal + ' °C';
    }
  });
}

function liveSimStep() {
  // 1. Jitter telemetry + re-render table
  jitterTelemetry();
  renderTelemetry();

  // 2. Update AI confidence KPI with small drift
  SIM.confBase = Math.max(91, Math.min(97.5, SIM.confBase + (Math.random() - 0.45) * 0.3));
  const confEl = document.getElementById('kpi-conf');
  if (confEl) {
    const old = confEl.textContent;
    const nv = SIM.confBase.toFixed(1) + '%';
    if (old !== nv) {
      confEl.textContent = nv;
      confEl.style.transition = 'color 0.4s';
      confEl.style.color = SIM.confBase > 94 ? 'var(--green)' : 'var(--cyan)';
    }
  }

  // 3. Update sync time counter
  SIM.syncCounter = Math.floor(Math.random() * 18) + 2;
  const syncEl = document.getElementById('sync-time');
  if (syncEl) syncEl.textContent = SIM.syncCounter + 's';

  // 4. Jitter readings/min on Live page
  const readingsEl = document.getElementById('li-readings');
  if (readingsEl) {
    SIM.readingsBase = Math.max(2600, Math.min(3200, SIM.readingsBase + Math.round((Math.random() - 0.5) * 40)));
    readingsEl.textContent = SIM.readingsBase.toLocaleString();
  }

  // 5. Occasionally pulse map node (visual effect via opacity)
  const nodeEls = document.querySelectorAll('#map-nodes-layer [data-pulse]');
  nodeEls.forEach(n => {
    if (Math.random() < 0.2) {
      n.style.opacity = '0.5';
      setTimeout(() => { n.style.opacity = '1'; }, 300);
    }
  });
}

// Slow simulation tick — every 6s
setInterval(liveSimStep, 6000);

// Fast clock tick
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2,'0');
  const m = String(now.getMinutes()).padStart(2,'0');
  const s = String(now.getSeconds()).padStart(2,'0');
  const el = document.getElementById('live-time');
  if (el) el.textContent = `${h}:${m}:${s}`;
}
setInterval(updateClock, 1000);
updateClock();

// ============================================================
// MODAL BUTTON ACTIONS
// ============================================================
function modalAcknowledge() {
  const btn = document.getElementById('modal-ack-btn');
  if (btn) {
    btn.textContent = '✓ Acknowledged';
    btn.style.color = 'var(--green)';
    btn.style.borderColor = 'rgba(34,197,94,0.4)';
    btn.disabled = true;
  }
}
function modalEscalate() {
  const btn = document.getElementById('modal-esc-btn');
  if (btn) {
    btn.textContent = '⬆ Escalated';
    btn.style.color = 'var(--orange)';
    btn.disabled = true;
  }
}
function modalViewOnMap() {
  closeModal();
  navigateTo('riskmap');
}

// ============================================================
// INIT
// ============================================================
(function init() {
  try { renderThreats(); } catch(e) {}
  try { renderTelemetry(); } catch(e) {}
  try { renderNodes(); } catch(e) {}
  try { renderAlerts(); } catch(e) {}
  try { renderEvents(); } catch(e) {}
  try { renderPipeline(); } catch(e) {}
  try { renderLayers(); } catch(e) {}
  try { initLeafletMaps(); } catch(e) {}
  try { renderModelPerf(); } catch(e) {}
  try { renderConfChart(); } catch(e) {}

  setTimeout(() => {
    try { drawFingerprintChart(); } catch(e) {}
    try { drawMNCCanvas(); } catch(e) {}
  }, 120);

  document.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', () => {
      setTimeout(() => {
        try { drawFingerprintChart(); } catch(e) {}
        try { drawMNCCanvas(); } catch(e) {}
      }, 60);
    });
  });
})();
// ============================================================
// DEMO SCENARIO LOGIC
// ============================================================
window.runOverviewDemo = function() {
  const tlProgress = document.getElementById('demo-timeline-progress');
  const tlSteps = document.querySelectorAll('.demo-step');
  
  // Reset
  tlProgress.style.transition = 'none';
  tlProgress.style.height = '0%';
  tlSteps.forEach(s => s.style.opacity = '0.3');
  
  document.getElementById('demo-rainfall').textContent = '-- mm/h';
  document.getElementById('demo-water').textContent = '-- m';
  document.getElementById('demo-rise').textContent = '-- cm/min';
  document.getElementById('demo-soil').textContent = '--%';
  document.getElementById('demo-consensus').textContent = '-- / 4';
  document.getElementById('demo-confidence').textContent = '--%';
  document.getElementById('demo-risk').textContent = '-- / 100';
  document.getElementById('demo-pred').textContent = '--';
  document.getElementById('demo-eta').textContent = '-- min';
  document.getElementById('demo-pop').textContent = '--';
  document.getElementById('demo-risk').style.color = 'var(--text-primary)';
  
  const resSteps = document.querySelectorAll('.demo-res-step');
  resSteps.forEach(s => {
    s.style.opacity = '0.4';
    s.style.borderColor = 'var(--border)';
  });
  const alertEl = document.getElementById('demo-final-alert');
  alertEl.style.opacity = '0';
  
  // Force reflow
  void tlProgress.offsetWidth;
  
  // Animate Timeline
  tlProgress.style.transition = 'height 11s linear';
  tlProgress.style.height = '100%';
  
  tlSteps.forEach((step, i) => {
    setTimeout(() => { step.style.opacity = '1'; }, i * 1000);
  });
  
  // Populate Data stagger
  setTimeout(() => { document.getElementById('demo-rainfall').textContent = '48 mm/h'; }, 1000);
  setTimeout(() => { document.getElementById('demo-water').textContent = '4.21 m'; }, 2000);
  setTimeout(() => { document.getElementById('demo-rise').textContent = '22 cm/min'; document.getElementById('demo-soil').textContent = '92%'; }, 3000);
  setTimeout(() => { document.getElementById('demo-consensus').textContent = '3 / 4'; }, 5000);
  setTimeout(() => { 
    document.getElementById('demo-risk').textContent = '91 / 100'; 
    document.getElementById('demo-risk').style.color = 'var(--red)'; 
    document.getElementById('demo-confidence').textContent = '95%'; 
  }, 6000);
  setTimeout(() => { document.getElementById('demo-pred').textContent = 'Downstream prop.'; document.getElementById('demo-eta').textContent = '31 min'; }, 7000);
  setTimeout(() => { document.getElementById('demo-pop').textContent = '7,240'; }, 8000);
  
  // AI Stages
  const stageTimings = [2000, 4000, 6000, 8000, 9000, 10000, 11000];
  const stageColors = ['var(--cyan)', 'var(--green)', 'var(--orange)', 'var(--yellow)', 'var(--red)', 'var(--red)', 'var(--red)'];
  
  resSteps.forEach((step, i) => {
    setTimeout(() => {
      step.style.opacity = '1';
      step.style.borderColor = stageColors[i];
    }, stageTimings[i]);
  });
  
  setTimeout(() => { alertEl.style.opacity = '1'; }, 11500);
};