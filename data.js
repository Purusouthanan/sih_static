const DATA = {
  nodes: [
    { id:'WATER-07', type:'Water', location:'River Basin / Zone 04', status:'online', risk:91, model:'Flood-v1.4', signal:4, battery:87, lastSync:'12s', riskLevel:'critical', conf:95 },
    { id:'WATER-08', type:'Water', location:'Zone 04 North',          status:'online', risk:83, model:'Flood-v1.4', signal:4, battery:79, lastSync:'8s',  riskLevel:'critical', conf:92 },
    { id:'WATER-09', type:'Water', location:'Upstream Gate 02',        status:'online', risk:76, model:'Flood-v1.4', signal:3, battery:91, lastSync:'15s', riskLevel:'high',     conf:89 },
    { id:'WATER-10', type:'Water', location:'Tributary Branch',        status:'online', risk:21, model:'Flood-v1.4', signal:2, battery:64, lastSync:'42s', riskLevel:'normal',   conf:68 },
    { id:'WATER-11', type:'Water', location:'Village 06 Creek',        status:'offline',risk:0,  model:'Flood-v1.4', signal:0, battery:64, lastSync:'4m',  riskLevel:'offline',  conf:0  },
    { id:'LAND-04',  type:'Land',  location:'Industrial Zone 02',      status:'online', risk:76, model:'Fire-v1.2',  signal:4, battery:91, lastSync:'9s',  riskLevel:'high',     conf:89 },
    { id:'LAND-05',  type:'Land',  location:'Forest Zone 01',          status:'online', risk:14, model:'Fire-v1.2',  signal:3, battery:85, lastSync:'18s', riskLevel:'normal',   conf:92 },
    { id:'LAND-06',  type:'Land',  location:'Farm Belt South',         status:'online', risk:28, model:'Fire-v1.2',  signal:3, battery:78, lastSync:'22s', riskLevel:'normal',   conf:87 },
    { id:'AIR-01',   type:'Air',   location:'Industrial Zone 02',      status:'online', risk:76, model:'Pollution-v2.1', signal:4, battery:94, lastSync:'11s', riskLevel:'high', conf:89 },
    { id:'AIR-02',   type:'Air',   location:'Urban Zone 11',           status:'online', risk:61, model:'Pollution-v2.1', signal:4, battery:88, lastSync:'7s',  riskLevel:'warning',conf:84},
    { id:'AIR-03',   type:'Air',   location:'Highway Corridor',        status:'online', risk:33, model:'Pollution-v2.1', signal:3, battery:72, lastSync:'19s', riskLevel:'normal',conf:91},
    { id:'LAND-07',  type:'Land',  location:'Hill Slope Zone B',       status:'online', risk:42, model:'Landslide-v1.0',signal:3,battery:83, lastSync:'14s', riskLevel:'warning',conf:82},
    { id:'LAND-08',  type:'Land',  location:'Rocky Ridge',             status:'online', risk:18, model:'Landslide-v1.0',signal:2,battery:71, lastSync:'31s', riskLevel:'normal', conf:88},
    { id:'WATER-12', type:'Water', location:'Reservoir Dam East',      status:'online', risk:37, model:'Flood-v1.4',    signal:4,battery:96, lastSync:'6s',  riskLevel:'normal', conf:94},
    { id:'AIR-04',   type:'Air',   location:'Forest Zone 03',          status:'online', risk:9,  model:'Pollution-v2.1',signal:2,battery:61, lastSync:'55s', riskLevel:'normal', conf:90},
    { id:'LAND-09',  type:'Land',  location:'Agricultural Zone 05',    status:'online', risk:22, model:'Fire-v1.2',     signal:3,battery:88, lastSync:'12s', riskLevel:'normal', conf:85},
    { id:'WATER-13', type:'Water', location:'River Mouth Delta',       status:'online', risk:54, model:'Flood-v1.4',    signal:3,battery:74, lastSync:'24s', riskLevel:'warning',conf:78},
    { id:'LAND-10',  type:'Land',  location:'Urban Zone 11 South',     status:'online', risk:61, model:'Heat-v1.0',     signal:4,battery:90, lastSync:'8s',  riskLevel:'warning',conf:84},
    { id:'AIR-05',   type:'Air',   location:'Port Area 07',            status:'online', risk:48, model:'Pollution-v2.1',signal:3,battery:77, lastSync:'16s', riskLevel:'warning',conf:81},
    { id:'WATER-14', type:'Water', location:'Eastern Canal',           status:'online', risk:31, model:'Flood-v1.4',    signal:3,battery:83, lastSync:'21s', riskLevel:'normal', conf:87},
    { id:'LAND-11',  type:'Land',  location:'Zone C Farmland',         status:'online', risk:17, model:'Fire-v1.2',     signal:2,battery:69, lastSync:'38s', riskLevel:'normal', conf:89},
    { id:'AIR-06',   type:'Air',   location:'Traffic Hub 03',          status:'online', risk:41, model:'Pollution-v2.1',signal:3,battery:82, lastSync:'13s', riskLevel:'warning',conf:86},
    { id:'LAND-12',  type:'Land',  location:'Village D Outskirts',     status:'online', risk:66, model:'Flood-v1.4',    signal:3,battery:78, lastSync:'10s', riskLevel:'warning',conf:83},
    { id:'WATER-15', type:'Water', location:'Lake Monitoring Point',   status:'online', risk:12, model:'Flood-v1.4',    signal:4,battery:95, lastSync:'5s',  riskLevel:'normal', conf:96},
    { id:'WATER-16', type:'Water', location:'Zone B Downstream',       status:'offline',risk:0,  model:'Flood-v1.4',    signal:0,battery:48, lastSync:'7m',  riskLevel:'offline',conf:0},
    { id:'LAND-13',  type:'Land',  location:'Industrial Zone East',    status:'online', risk:58, model:'Fire-v1.2',     signal:3,battery:86, lastSync:'9s',  riskLevel:'warning',conf:80},
  ],

  threats: [
    {
      level:'critical', type:'FLOOD EVENT', location:'River Basin / Zone 04',
      risk:91, conf:95,
      detected:['Rapid water rise (+22 cm/min)','Heavy rainfall (48mm/h)','Soil saturation detected','Upstream node confirmation'],
      propMin:31, id:'VX-EVT-00127'
    },
    {
      level:'high', type:'AIR POLLUTION', location:'Industrial Zone 02',
      risk:76, conf:89,
      detected:['PM2.5 anomaly (+133%)','Gas concentration increase','Temperature inversion layer'],
      propMin:null, id:'VX-EVT-00128'
    },
    {
      level:'warning', type:'EXTREME HEAT', location:'Urban Zone 11',
      risk:61, conf:84,
      detected:['Temperature spike (+14%)','Low humidity (-22%)','Night heat retention'],
      propMin:null, id:'VX-EVT-00129'
    }
  ],

  telemetry: [
    { node:'WATER-07', param:'Water Level', value:'4.21 m',   baseline:'3.20 m',   dev:'+31.5%', level:'critical' },
    { node:'WATER-07', param:'Rainfall',    value:'48 mm/h',  baseline:'20 mm/h',  dev:'+140%',  level:'high' },
    { node:'WATER-08', param:'Water Level', value:'3.94 m',   baseline:'3.10 m',   dev:'+27.1%', level:'high' },
    { node:'LAND-04',  param:'PM2.5',       value:'168 µg/m³',baseline:'72 µg/m³', dev:'+133%',  level:'high' },
    { node:'LAND-04',  param:'Temperature', value:'41.2°C',   baseline:'36°C',     dev:'+14%',   level:'warning' },
    { node:'AIR-01',   param:'PM10',        value:'210 µg/m³',baseline:'90 µg/m³', dev:'+133%',  level:'high' },
    { node:'WATER-09', param:'Rainfall',    value:'38 mm/h',  baseline:'20 mm/h',  dev:'+90%',   level:'high' },
    { node:'LAND-10',  param:'Temperature', value:'43.1°C',   baseline:'38°C',     dev:'+13.4%', level:'warning' },
    { node:'AIR-02',   param:'PM2.5',       value:'118 µg/m³',baseline:'72 µg/m³', dev:'+63.8%', level:'warning' },
    { node:'LAND-05',  param:'Soil Moisture',value:'24%',     baseline:'38%',      dev:'-36.8%', level:'warning' },
    { node:'WATER-12', param:'Water Level', value:'2.80 m',   baseline:'2.60 m',   dev:'+7.7%',  level:'normal' },
    { node:'LAND-06',  param:'Temperature', value:'38.4°C',   baseline:'36°C',     dev:'+6.6%',  level:'normal' },
  ],

  alerts: [
    { severity:'critical', type:'CRITICAL FLOOD', location:'River Basin / Zone 04', risk:91, conf:95, ago:'2 min', pop:7240, prop:'31 min', id:'VX-EVT-00127', active:true },
    { severity:'high',     type:'AIR POLLUTION',  location:'Industrial Zone 02',    risk:76, conf:89, ago:'14 min',pop:3120, prop:null,     id:'VX-EVT-00128', active:true },
    { severity:'warning',  type:'EXTREME HEAT',   location:'Urban Zone 11',         risk:61, conf:84, ago:'31 min',pop:8900, prop:null,     id:'VX-EVT-00129', active:true },
    { severity:'normal',   type:'LANDSLIDE WATCH',location:'Hill Slope Zone B',     risk:42, conf:82, ago:'1h 12m',pop:210,  prop:null,     id:'VX-EVT-00126', active:false},
    { severity:'normal',   type:'SOIL DRYNESS',   location:'Forest Zone 01',        risk:28, conf:91, ago:'2h 5m', pop:0,    prop:null,     id:'VX-EVT-00125', active:false},
  ],

  events: [
    {
      title:'FLOOD EVENT', id:'VX-EVT-00127', status:'CRITICAL', risk:91, conf:95,
      severity:'crit',
      timeline:[
        {time:'14:27', text:'Rainfall anomaly detected by WATER-07'},
        {time:'14:28', text:'Water level rise detected (+22 cm/min)'},
        {time:'14:29', text:'Upstream node WATER-09 confirmation'},
        {time:'14:30', text:'Multi-node consensus achieved (3/4)'},
        {time:'14:31', text:'Flood event verified by AI model'},
        {time:'14:31', text:'CRITICAL alert issued to operators'},
      ],
      evidence:['Water level anomaly (+34% above baseline)','Rainfall anomaly (2.4× normal)','Soil saturation confirmed','Upstream node confirmation','Neighboring node agreement (3/4)'],
      impact:['Population: 7,240','Infrastructure: 4','Hospitals: 1','Schools: 2','Major roads: 1'],
      prediction:'Zone 04 → Zone B → Village D. Estimated arrival: 31 minutes. Downstream communities should initiate evacuation protocol.',
    },
    {
      title:'AIR POLLUTION EVENT', id:'VX-EVT-00128', status:'HIGH', risk:76, conf:89,
      severity:'high',
      timeline:[
        {time:'14:14', text:'PM2.5 spike detected at AIR-01'},
        {time:'14:15', text:'Gas concentration rise confirmed'},
        {time:'14:16', text:'Temperature inversion identified'},
        {time:'14:17', text:'Cross-node verification (2/3)'},
        {time:'14:17', text:'HIGH alert issued'},
      ],
      evidence:['PM2.5 anomaly (+133% above baseline)','Gas concentration elevation','Temperature inversion layer confirmed','Wind pattern anomaly'],
      impact:['Population: 3,120','Industrial workers: 450','Sensitive groups: 890'],
      prediction:'Pollution plume expected to drift northwest toward residential area within 45 minutes.',
    },
    {
      title:'EXTREME HEAT EVENT', id:'VX-EVT-00129', status:'WARNING', risk:61, conf:84,
      severity:'warn',
      timeline:[
        {time:'13:58', text:'Temperature anomaly detected at LAND-10'},
        {time:'14:01', text:'Humidity drop correlated'},
        {time:'14:05', text:'Urban heat island pattern identified'},
        {time:'14:10', text:'WARNING alert issued'},
      ],
      evidence:['Temperature +14% above baseline','Humidity -22% below normal','Night-time heat retention pattern','Solar irradiance above normal'],
      impact:['Population: 8,900','Vulnerable persons: 2,100','Health facilities: 1'],
      prediction:'Sustained heat expected for 6–8 hours. Risk of heat exhaustion in outdoor workers. Peak temperature forecast: 46°C.',
    },
  ],

  pipeline:[
    {name:'Sensors',                desc:'26 nodes active',         val:'2,847/min', label:'Readings'},
    {name:'Signal Processing',      desc:'Noise filtering & calibration', val:'99.1%', label:'Accuracy'},
    {name:'Env. Fingerprint',       desc:'Baseline comparison',     val:'12',        label:'Anomalies'},
    {name:'Anomaly Detection',      desc:'ML-based deviation scoring',val:'5',       label:'Hazards'},
    {name:'Hazard AI',              desc:'Flood / Fire / Pollution', val:'3',         label:'Verified'},
    {name:'Multi-Node Consensus',   desc:'Cross-validation',        val:'94%',       label:'Consensus'},
    {name:'Propagation Model',      desc:'Spatial risk projection',  val:'7',         label:'Predicted'},
    {name:'Impact Assessment',      desc:'Population & infra risk',  val:'91/100',    label:'Risk Score'},
    {name:'Alert Engine',           desc:'Priority & notification',  val:'3',         label:'Alerts'},
  ],

  mapNodes:[
    { id:'WATER-07', x:32.5, y:55,  color:'#ef4444', riskLevel:'critical', risk:91, conf:95, sensors:'7/7 Online', model:'Flood v1.4', type:'Water', lastSync:'12s' },
    { id:'WATER-08', x:28,   y:48,  color:'#ef4444', riskLevel:'critical', risk:83, conf:92, sensors:'7/7 Online', model:'Flood v1.4', type:'Water', lastSync:'8s'  },
    { id:'WATER-09', x:43,   y:38,  color:'#f97316', riskLevel:'high',     risk:76, conf:89, sensors:'6/7 Online', model:'Flood v1.4', type:'Water', lastSync:'15s' },
    { id:'LAND-04',  x:73,   y:33,  color:'#f97316', riskLevel:'high',     risk:76, conf:89, sensors:'5/5 Online', model:'Fire v1.2',  type:'Land',  lastSync:'9s'  },
    { id:'LAND-05',  x:15,   y:35,  color:'#22c55e', riskLevel:'normal',   risk:14, conf:92, sensors:'5/5 Online', model:'Fire v1.2',  type:'Land',  lastSync:'18s' },
    { id:'LAND-06',  x:60,   y:72,  color:'#22c55e', riskLevel:'normal',   risk:28, conf:87, sensors:'5/5 Online', model:'Fire v1.2',  type:'Land',  lastSync:'22s' },
    { id:'AIR-02',   x:55,   y:62,  color:'#eab308', riskLevel:'warning',  risk:61, conf:84, sensors:'4/4 Online', model:'Pollution v2.1', type:'Air', lastSync:'7s'},
    { id:'WATER-13', x:47,   y:68,  color:'#eab308', riskLevel:'warning',  risk:54, conf:78, sensors:'6/7 Online', model:'Flood v1.4',type:'Water', lastSync:'24s'},
    { id:'LAND-12',  x:37,   y:78,  color:'#eab308', riskLevel:'warning',  risk:66, conf:83, sensors:'5/5 Online', model:'Flood v1.4',type:'Land',  lastSync:'10s'},
  ],
};
