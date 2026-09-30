/* ------------------------------------------------------------------
   Portfolio content.
   FALLBACK is rendered immediately (so the page never waits on the
   network); the same admin-backed API used by profile-web-maroof.vercel.app
   is then queried and anything it returns replaces the fallback.
------------------------------------------------------------------- */
window.PORTFOLIO = {
  API: 'https://profile-web-rho-eight.vercel.app/api',

  links: {
    email: 'maroofk2108@gmail.com',
    github: 'https://github.com/maroofkhan000',
    linkedin: 'https://www.linkedin.com/in/maroofkhan000/',
    tryhackme: 'https://tryhackme.com/p/MaroofKhan000',
  },

  profile: {
    name: 'Maroof Khan',
    title: 'Web Application Security Enthusiast',
    bio: 'Focused on discovering vulnerabilities and strengthening web application security through secure development and hands-on penetration testing.',
  },

  education: [{
    degree: 'Bachelor of Technology in Computer Science',
    school: 'Integral University, Lucknow',
    period: '2023 – Present',
    description: 'Focused on web security, penetration testing, and secure application development.',
    cgpa: '8.5',
  }],

  /* Offensive-security methodology — drives the pinned "kill chain" story */
  methodology: [
    {
      n: '01', key: 'Recon', title: 'Map the attack surface.',
      text: 'Automated enumeration with Subfinder, httpx and Nuclei — then FFuf, Wayback and Shodan for the corners automation misses.',
      chips: ['Subfinder', 'httpx', 'Nuclei', 'FFuf', 'Wayback', 'Shodan'],
    },
    {
      n: '02', key: 'Analyse', title: 'Understand how it really works.',
      text: 'Burp Suite Proxy, Repeater and Intruder to map authentication flows, APIs, roles and the business logic hiding behind them.',
      chips: ['Burp Suite', 'Repeater', 'Intruder', 'Wireshark', 'Nmap'],
    },
    {
      n: '03', key: 'Exploit', title: 'Prove the impact.',
      text: 'OWASP Top 10 in practice — IDOR, SQLi, XSS, CSRF, SSRF, broken auth — plus race conditions, host-header injection and parameter tampering.',
      chips: ['IDOR', 'SQLi', 'XSS', 'CSRF', 'SSRF', 'Race Conditions'],
    },
    {
      n: '04', key: 'Report', title: 'Disclose it responsibly.',
      text: 'Clear, reproducible write-ups with impact and fixes — including a business-logic price-manipulation flaw disclosed to Student Senior.',
      chips: ['Responsible Disclosure', 'Impact', 'Remediation'],
    },
  ],

  /* Same shape as GET /api/skills */
  skills: [
    { title: 'Attack Vectors', iconName: 'Bug', skills: ['SQLi', 'XSS', 'CSRF', 'SSRF', 'RCE', 'IDOR'] },
    { title: 'Tools & Arsenal', iconName: 'ShieldCheck', skills: ['Burp Suite', 'Nmap', 'Metasploit', 'Wireshark', 'Ffuf', 'Nuclei'] },
    { title: 'Programming Languages', iconName: 'FileCode2', skills: ['Python', 'JavaScript', 'Bash'] },
    { title: 'Infrastructure', iconName: 'Server', skills: ['Linux', 'Networking', 'Web Protocols'] },
  ],

  securityTools: [
    { name: 'Burp Suite', icon: 'burpsuite', color: '#FF6633', role: 'Web Proxy',
      use: 'Intercept, replay and fuzz HTTP traffic to map auth flows, APIs and the business logic behind them.',
      does: ['Proxy', 'Repeater', 'Intruder'] },
    { name: 'Nmap', icon: 'nmap', color: '#4682B4', role: 'Recon',
      use: 'Port and service discovery to map the attack surface before touching the application.',
      does: ['Port scan', 'Service detect', 'NSE'] },
    { name: 'Metasploit', icon: 'metasploit', color: '#2596CD', role: 'Exploitation',
      use: 'Framework for validating exploits and post-exploitation in lab environments.',
      does: ['Exploits', 'Payloads', 'Meterpreter'] },
    { name: 'Wireshark', icon: 'wireshark', color: '#1679A7', role: 'Traffic Analysis',
      use: 'Packet-level inspection to see exactly what an app sends and receives over the wire.',
      does: ['Capture', 'Filters', 'Protocols'] },
    { name: 'Kali Linux', icon: 'kalilinux', color: '#557C94', role: 'Platform',
      use: 'The daily-driver OS that carries the whole offensive toolkit.',
      does: ['Tooling', 'Scripting', 'Labs'] },
    { name: 'OWASP', icon: 'owasp', color: '#000000', role: 'Methodology',
      use: 'The Top 10 and testing guide as the checklist behind every assessment.',
      does: ['Top 10', 'WSTG', 'ASVS'] },
    { name: 'Python', icon: 'python', color: '#3776AB', role: 'Automation',
      use: 'Custom scripts and recon pipelines that glue the other tools together.',
      does: ['Recon', 'Scripting', 'Parsing'] },
    { name: 'Bash', icon: 'gnubash', color: '#4EAA25', role: 'Shell',
      use: 'One-liners and scripts for fast enumeration and chaining CLI tools.',
      does: ['One-liners', 'Pipes', 'Automation'] },
  ],

  /* one-line notes shown in the skill-card popups (keyed by name, case/punctuation-insensitive) */
  skillNotes: {
    sqli: 'Tampering with database queries through unsanitised input',
    xss: 'Injecting script that runs in other users’ browsers',
    csrf: 'Riding a logged-in victim’s session to act on their behalf',
    ssrf: 'Making the server fetch internal resources for me',
    rce: 'Running commands on the target host',
    idor: 'Reaching other users’ data by changing an ID',
    burpsuite: 'Intercepting proxy, Repeater and Intruder',
    nmap: 'Port and service discovery',
    metasploit: 'Exploit validation and payloads',
    wireshark: 'Packet capture and protocol analysis',
    ffuf: 'Fast fuzzing for hidden paths, params and vhosts',
    nuclei: 'Template-based scanning for known misconfigs and CVEs',
    python: 'Recon pipelines and custom tooling',
    javascript: 'Reading client code and building full-stack apps',
    bash: 'Enumeration one-liners and glue scripts',
    linux: 'Daily driver — permissions, services, hardening',
    networking: 'TCP/IP, DNS and how traffic really flows',
    webprotocols: 'HTTP, TLS, cookies, CORS and headers',
  },


  webStack: [
    { name: 'React', icon: 'react', color: '#61DAFB' },
    { name: 'Node.js', icon: 'nodedotjs', color: '#5FA04E' },
    { name: 'Express.js', icon: 'express', color: '#000000' },
    { name: 'MongoDB', icon: 'mongodb', color: '#47A248' },
    { name: 'JavaScript', icon: 'javascript', color: '#F7DF1E' },
    { name: 'TypeScript', icon: 'typescript', color: '#3178C6' },
    { name: 'JWT', icon: 'jsonwebtokens', color: '#D63AFF' },
    { name: 'Three.js', icon: 'threedotjs', color: '#000000' },
    { name: 'SQL', icon: 'mysql', color: '#4479A1' },
    { name: 'Git', icon: 'git', color: '#F05032' },
    { name: 'Linux', icon: 'linux', color: '#FCC624' },
    { name: 'Vercel', icon: 'vercel', color: '#000000' },
  ],

  ctf: {
    rank: 'Top 5%',
    platform: 'TryHackMe',
    labs: [
      { t: 'IDOR', d: 'Exploited insecure object references to bypass authorization and access sensitive cross-user data.' },
      { t: 'Cross-Site Scripting', d: 'Identified reflected XSS to execute JavaScript and simulate session hijacking.' },
      { t: 'SQL Injection', d: 'Achieved authentication bypass and extracted data using UNION-based techniques.' },
      { t: 'Manual Testing', d: 'Auth & authorization bypass, business-logic analysis, race conditions, host-header injection.' },
    ],
    learning: [
      'PortSwigger Web Security Academy — OWASP Top 10 labs completed',
      'TryHackMe — Web Fundamentals learning path',
    ],
  },

  /* Same shape as GET /api/security-recognition (+ local image) */
  recognition: [{
    name: 'Student Senior',
    role: 'Founder, Student Senior',
    content: 'Identified a business logic vulnerability that allowed users to manipulate the price of items during the purchase process.',
    link: 'https://drive.google.com/uc?export=view&id=1V827xnHWlGmsVEK7srySPIB_1ccBXsm1',
    avatar: 'assets/img/logo_studentsenior.webp',
    image: 'assets/img/recog_studentsenior.webp',
  }],

  /* Same shape as GET /api/certificates (+ local thumbnail); security first */
  certificates: [
    { title: 'Bitten Tech - Cyber Security', issuer: 'Bitten Tech', date: '11 December 2023', link: 'https://drive.google.com/uc?export=view&id=139fQDTSP10XBdCMSVy0ERIt0ZWz2mIEg', image: 'assets/img/cert_bitten.webp' },
    { title: 'Learn Ethical Hacking From Scratch', issuer: 'Udemy', date: '17 July 2024', link: 'https://drive.google.com/uc?export=view&id=1b3lWs-wY4lE0Ma1TLZe_trVfJZTC47fa', image: 'assets/img/cert_udemy.webp' },
    { title: 'Python For Data Science', issuer: 'E-train Education', date: '21 July 2025', link: 'https://drive.google.com/uc?export=view&id=1aKFGuQmDGK3VnoMMYrIvumndIFzW2fy6', image: 'assets/img/cert_python.webp' },
  ],

  /* Security work first, then web development */
  projects: [
    {
      title: 'Recon Automation Script', tag: 'Security Tool', track: 'security',
      description: 'A Python pipeline chaining Subfinder → httpx → Nuclei for automated reconnaissance. Generates structured markdown reports with live subdomains, open ports and vulnerability flags — cutting manual recon time by ~70%.',
      techStack: ['Python', 'Subfinder', 'httpx', 'Nuclei'],
      githubLink: 'https://github.com/maroofkhan000/Recon_Automation', liveLink: '',
      image: 'assets/img/proj_recon.webp',
    },
    {
      title: 'Network Intrusion Detection System', tag: 'Security Tool', track: 'security',
      description: 'A real-time NIDS that uses ARP redirection to monitor devices on the network — detecting port scans, SYN and ICMP floods and ARP spoofing, and flagging SQL-injection and command-injection payloads.',
      techStack: ['Python', 'Packet Analysis', 'Networking'],
      githubLink: 'https://github.com/maroofkhan000/Intrusion_detection_system', liveLink: '',
      image: 'assets/img/proj_nids.webp',
    },
    {
      title: 'Portfolio Website', tag: 'Secure Web App', track: 'security',
      description: 'Developed a secure portfolio using React and Node.js with a hidden admin route for backend-driven content (skills, projects, certifications) and hardened HTTP security headers.',
      techStack: ['React', 'Node', 'MongoDB', 'Vercel'],
      githubLink: 'https://github.com/maroofkhan000/Profile_Web', liveLink: 'https://profile-web-maroof.vercel.app/',
      image: 'assets/img/proj_portfolio.webp',
    },
    {
      title: 'Car Rental', tag: 'Full Stack', track: 'web',
      description: 'Developed a car rental web application using React and Node.js, implementing secure authentication, input validation, and access control, with a focus on performance and security.',
      techStack: ['React', 'Node.js', 'Express and MongoDB'],
      githubLink: 'https://github.com/maroofkhan000/Car_Rent_Project', liveLink: 'https://car-rent-maroof.vercel.app/',
      image: 'assets/img/proj_car.webp',
    },
    {
      title: 'EcoVerse', tag: 'Hackathon', track: 'web',
      description: 'An interactive platform for real-world environmental restoration — communities organise and join tree plantations, river restorations and clean-ups, with before/after impact sliders and volunteer intake.',
      techStack: ['React', 'TypeScript', 'Web App'],
      githubLink: 'https://github.com/maroofkhan000/EcoVerse', liveLink: '',
      image: 'assets/img/proj_eco.webp',
    },
    {
      title: 'Aqua Pulse', tag: '3D Prototype', track: 'web',
      description: 'An interactive WebGL digital twin and SCADA-style monitoring prototype for a smart, off-grid water purification system with an automated safety-diversion mechanism.',
      techStack: ['Three.js', 'JavaScript', 'WebGL'],
      githubLink: 'https://github.com/maroofkhan000/Aqua-Pulse_3d_prototype', liveLink: 'https://aqua-pulse-3d-prototype.vercel.app',
      image: 'assets/img/proj_aqua.webp',
    },
    {
      title: 'Event Planner', tag: 'Web App', track: 'web',
      description: 'A modern event-planning application that helps users create and manage events, discover venues and build service packages end to end.',
      techStack: ['JavaScript', 'HTML', 'CSS'],
      githubLink: 'https://github.com/maroofkhan000/EventPlanner000', liveLink: 'https://event-planner000.vercel.app',
      image: 'assets/img/proj_event.webp',
    },
  ],
};
