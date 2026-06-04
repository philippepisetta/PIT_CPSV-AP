// public/app.js - Frontend logique premium
// Tous les textes sont en français

// Configuration de base
const API_BASE = '/api';
const serviceListEl = document.getElementById('service-list').querySelector('ul');
const inspectorEl = document.querySelector('#inspector-panel .details');
const encoderModal = document.getElementById('encoder-modal');
const openEncoderBtn = document.getElementById('open-encoder');
const closeEncoderBtn = document.getElementById('close-encoder');
const encoderForm = document.getElementById('encoder-form');
const viewJsonLdBtn = document.getElementById('view-jsonld');

let currentService = null; // service sélectionné

// ---------- Utilitaires ----------
function renderOrthoGraph(service) {
  console.log('renderOrthoGraph called for service id:', service?.id);
  if (!service) {
    console.error('renderOrthoGraph: service data missing');
    return;
  }
  const svg = d3.select('#ortho-graph')
    .attr('width', '100%')
    .attr('height', '100%');
  const width = parseInt(svg.style('width')) || 800;
  const height = parseInt(svg.style('height')) || 600;
  // Remove existing content
  svg.selectAll('*').remove();
  const g = svg.append('g');

  // Define data
  const nodes = [];
  const links = [];
  const addNode = (entity, type) => {
    if (!entity) return null;
    const nid = `${type}-${entity.id}`;
    nodes.push({id:nid, label: entity.name || entity.code || type, type, data: entity});
    return nid;
  };
  const center = addNode(service, 'service');
  const org = addNode(service.organization, 'organization');
  if (org) links.push({source:center, target:org});
  const collections = [
    {key:'channels', type:'channel'},
    {key:'targetAudiences', type:'targetAudience'},
    {key:'businessEvents', type:'businessEvent'},
    {key:'lifeEvents', type:'lifeEvent'},
    {key:'requirements', type:'requirement'},
    {key:'outputs', type:'output'},
    {key:'costs', type:'cost'},
    {key:'contactPoints', type:'contactPoint'}
  ];
  collections.forEach(col=>{
    const items = service[col.key]||[];
    items.forEach(it=>{
      const nid = addNode(it, col.type);
      if (nid) links.push({source:center, target:nid});
    });
  });

  // D3 simulation
  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d=>d.id).distance(120))
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width/2, height/2));

  // Tooltip
  const tooltip = d3.select('body').append('div')
    .attr('class','tooltip')
    .style('position','absolute')
    .style('padding','6px')
    .style('background','rgba(0,0,0,0.7)')
    .style('color','#fff')
    .style('border-radius','4px')
    .style('pointer-events','none')
    .style('opacity',0);

  const link = g.append('g')
    .attr('stroke','rgba(255,255,255,0.2)')
    .selectAll('line')
    .data(links)
    .enter().append('line')
    .attr('stroke-width',1.5);

  const node = g.append('g')
    .attr('stroke','#fff')
    .attr('stroke-width',1.5)
    .selectAll('circle')
    .data(nodes)
    .enter().append('circle')
    .attr('r',20)
    .attr('class',d=>`node ${d.type}`)
    .call(d3.drag()
      .on('start', (event,d)=>{if(!event.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y;})
      .on('drag', (event,d)=>{d.fx = event.x; d.fy = event.y;})
      .on('end', (event,d)=>{if(!event.active) simulation.alphaTarget(0); d.fx = null; d.fy = null;})
    );

  const label = g.append('g')
    .selectAll('text')
    .data(nodes)
    .enter().append('text')
    .attr('text-anchor','middle')
    .attr('dy',4)
    .attr('fill','#fff')
    .attr('font-size','10px')
    .text(d=>d.label);

  node.on('click',(event,d)=>{
    const [type,id] = d.id.split('-');
    showDetails(parseInt(id), type);
  })
  .on('mouseover',(event,d)=>{
    tooltip.style('opacity',1)
      .html(`<strong>${d.label}</strong><br/>${d.type}`)
      .style('left', (event.pageX+10)+'px')
      .style('top', (event.pageY+10)+'px');
  })
  .on('mousemove',(event)=>{
    tooltip.style('left', (event.pageX+10)+'px')
      .style('top', (event.pageY+10)+'px');
  })
  .on('mouseout',()=>{tooltip.style('opacity',0);});

  simulation.on('tick',()=>{
    link.attr('x1',d=>d.source.x)
        .attr('y1',d=>d.source.y)
        .attr('x2',d=>d.target.x)
        .attr('y2',d=>d.target.y);
    node.attr('cx',d=>d.x).attr('cy',d=>d.y);
    label.attr('x',d=>d.x).attr('y',d=>d.y);
  });

  // Zoom & pan
  const zoom = d3.zoom()
    .scaleExtent([0.5,3])
    .on('zoom', (event)=>{g.attr('transform', event.transform);});
  d3.select('#graph-wrapper').call(zoom);
}

// Theme toggle (simple dark/light switch)
const themeToggleBtn = document.getElementById('theme-toggle');
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click',()=>{
    document.body.classList.toggle('light-theme');
    // Change icon
    themeToggleBtn.textContent = document.body.classList.contains('light-theme') ? '☀️' : '🌙';
  });
}

  // Trouver le nœud dans le service actuel
  if (!currentService) return;
  const map = {
    organization: currentService.organization,
    channel: currentService.channels?.find(c => c.id === id),
    targetAudience: currentService.targetAudiences?.find(a => a.id === id),
    businessEvent: currentService.businessEvents?.find(e => e.id === id),
    lifeEvent: currentService.lifeEvents?.find(e => e.id === id),
    requirement: currentService.requirements?.find(r => r.id === id),
    output: currentService.outputs?.find(o => o.id === id),
    cost: currentService.costs?.find(c => c.id === id),
    contactPoint: currentService.contactPoints?.find(cp => cp.id === id),
    service: currentService,
  };
  const entity = map[type] || map.service;
  if (!entity) return;
  const html = Object.entries(entity)
    .map(([k, v]) => `<strong>${k}:</strong> ${v}`)
    .join('<br/>');
  inspectorEl.innerHTML = html;
}

  


// ---------- Chargement de la liste des services ----------
async function loadServices() {
  const resp = await fetch(`${API_BASE}/services`);
  const services = await resp.json();
  serviceListEl.innerHTML = '';
  services.forEach(s => {
    const li = document.createElement('li');
    li.textContent = `${s.name} (${s.code || ''})`;
    li.addEventListener('click', () => selectService(s.id));
    serviceListEl.appendChild(li);
  });
}

async function selectService(id) {
  const resp = await fetch(`${API_BASE}/services/${id}`);
  const service = await resp.json();
  currentService = service;
  renderOrthoGraph(service);
  inspectorEl.innerHTML = `<strong>Nom:</strong> ${service.name}<br/><strong>Code:</strong> ${service.code || ''}`;
}

// ---------- Encodeur (modal) ----------
async function populateMeta() {
  const resp = await fetch(`${API_BASE}/meta`);
  return await resp.json();
}

function buildFormSteps(meta) {
  const stepsDiv = document.getElementById('form-steps');
  stepsDiv.innerHTML = '';
  // Étape 1 : informations de base
  const step1 = document.createElement('div');
  step1.innerHTML = `
    <h3>Informations de base</h3>
    <label>Nom: <input name="name" required></label><br/>
    <label>Code: <input name="code"></label><br/>
    <label>Description: <textarea name="description"></textarea></label><br/>
    <label>Organisation: <select name="organizationId" required></select></label><br/>
  `;
  const orgSelect = step1.querySelector('select');
  meta.organizations.forEach(o => {
    const opt = document.createElement('option');
    opt.value = o.id;
    opt.textContent = o.name;
    orgSelect.appendChild(opt);
  });
  stepsDiv.appendChild(step1);

  // Étape 2 : sélection multiple de références (channels, audiences, events)
  const multiFields = [
    {key: 'channels', label: 'Canaux'},
    {key: 'targetAudiences', label: 'Publics cibles'},
    {key: 'businessEvents', label: 'Événements métier'},
    {key: 'lifeEvents', label: 'Événements de vie'}
  ];
  multiFields.forEach(f => {
    const div = document.createElement('div');
    div.innerHTML = `<h3>${f.label}</h3>`;
    meta[f.key].forEach(item => {
      const id = `${f.key}-${item.id}`;
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.id = id;
      cb.name = f.key;
      cb.value = item.id;
      const lbl = document.createElement('label');
      lbl.htmlFor = id;
      lbl.textContent = item.name;
      div.appendChild(cb);
      div.appendChild(lbl);
      div.appendChild(document.createElement('br'));
    });
    stepsDiv.appendChild(div);
  });

  // Étape 3 : exigences (requêtes simplifiées) – on accepte du JSON brut
  const step3 = document.createElement('div');
  step3.innerHTML = `
    <h3>Exigences (JSON)</h3>
    <textarea name="requirements" placeholder='[ {"name":"Exigence 1", "evidences":[{"name":"Epreuve"}] } ]' rows="5"></textarea>
  `;
  stepsDiv.appendChild(step3);

  // Étape 4 : sorties (JSON)
  const step4 = document.createElement('div');
  step4.innerHTML = `
    <h3>Sorties (JSON)</h3>
    <textarea name="outputs" placeholder='[ {"name":"Sortie 1"} ]' rows="4"></textarea>
  `;
  stepsDiv.appendChild(step4);
}

openEncoderBtn.addEventListener('click', async () => {
  const meta = await populateMeta();
  // Populate organisation select
  const orgSelect = document.querySelector('#tab-basic select[name="organizationId"]');
  orgSelect.innerHTML = '';
  meta.organizations.forEach(o => {
    const opt = document.createElement('option');
    opt.value = o.id;
    opt.textContent = o.name;
    orgSelect.appendChild(opt);
  });
  // Populate relations checkboxes
  const relationsContainer = document.getElementById('relations-fields');
  relationsContainer.innerHTML = '';
  const relDefs = [
    {key: 'channels', label: 'Canaux'},
    {key: 'targetAudiences', label: 'Publics cibles'},
    {key: 'businessEvents', label: 'Événements métier'},
    {key: 'lifeEvents', label: 'Événements de vie'}
  ];
  relDefs.forEach(def => {
    const div = document.createElement('div');
    div.innerHTML = `<h4>${def.label}</h4>`;
    meta[def.key].forEach(item => {
      const id = `${def.key}-${item.id}`;
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.id = id;
      cb.name = def.key;
      cb.value = item.id;
      const lbl = document.createElement('label');
      lbl.htmlFor = id;
      lbl.textContent = item.name;
      div.appendChild(cb);
      div.appendChild(lbl);
      div.appendChild(document.createElement('br'));
    });
    relationsContainer.appendChild(div);
  });
  // Reset tab view to first tab
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelector('.tab[data-tab="basic"]').classList.add('active');
  document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
  document.getElementById('tab-basic').classList.remove('hidden');

  encoderModal.classList.remove('hidden');
});
closeEncoderBtn.addEventListener('click', () => {
  encoderModal.classList.add('hidden');
});

encoderForm.addEventListener('submit', async e => {
  e.preventDefault();
  const formData = new FormData(encoderForm);
  const body = {
    name: formData.get('name'),
    code: formData.get('code'),
    description: formData.get('description'),
    organizationId: formData.get('organizationId'),
    // multi-select values
    channels: formData.getAll('channels'),
    targetAudiences: formData.getAll('targetAudiences'),
    businessEvents: formData.getAll('businessEvents'),
    lifeEvents: formData.getAll('lifeEvents'),
    // JSON fields – parse safely, fallback to []
    requirements: JSON.parse(formData.get('requirements') || '[]'),
    outputs: JSON.parse(formData.get('outputs') || '[]'),
    costs: JSON.parse(formData.get('costs') || '[]'),
    contactPoints: JSON.parse(formData.get('contactPoints') || '[]'),
  };
  const resp = await fetch(`${API_BASE}/services`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body),
  });
  if (resp.ok) {
    alert('Service créé avec succès');
    encoderModal.classList.add('hidden');
    await loadServices();
  } else {
    const err = await resp.json();
    alert('Erreur : ' + (err.error || ''));
  }
});

// ---------- Vue JSON‑LD ----------
viewJsonLdBtn.addEventListener('click', () => {
  if (!currentService) { alert('Sélectionnez d’abord un service.'); return; }
  const jsonld = {
    '@context': 'https://schema.org/',
    '@type': 'PublicService',
    name: currentService.name,
    description: currentService.description,
    identifier: currentService.code,
    url: currentService.uri,
    provider: currentService.organization?.name,
    hasChannel: currentService.channels?.map(c => ({name: c.name, url: c.uri})),
    areaServed: currentService.targetAudiences?.map(a => a.name),
    knowsAbout: currentService.requirements?.map(r => r.name),
    outputs: currentService.outputs?.map(o => o.name),
    costs: currentService.costs?.map(c => ({name: c.name, value: c.value})),
    contacts: currentService.contactPoints?.map(cp => ({name: cp.name, email: cp.email}))
  };
  const blob = new Blob([JSON.stringify(jsonld, null, 2)], {type: 'application/ld+json'});
  const url = URL.createObjectURL(blob);
  const w = window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 5000);
});

// Initialise l'application
// Initialise l'application
loadServices();

// Gestion des onglets du formulaire d'encodage
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    // active tab
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    // show/hide panels
    document.querySelectorAll('.tab-content').forEach(pc => {
      if (pc.id === `tab-${target}`) pc.classList.remove('hidden');
      else pc.classList.add('hidden');
    });
  });
});
