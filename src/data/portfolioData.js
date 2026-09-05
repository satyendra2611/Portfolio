export const personalInfo = {
  name: "Satyendra Kumar",
  role: "Photographer / Engineer / Visual Storyteller",
  tagline: "Creative systems, clean execution.",
  lead: "B.Tech Computer Science student with a photographer's eye and an engineer's discipline, building practical digital ideas through Python, Java, C, modern web architecture, image craft, and video storytelling.",
  profileText: "I combine technical knowledge with creativity to deliver engaging, practical solutions. My work spans programming, modern web systems, photography, videography, and photo/video editing, with a strong commitment to real-world impact and aesthetic excellence.",
  email: "sk.patel86150@gmail.com",
  phone: "+91 8840348661",
  instagram: "https://www.instagram.com/_.random._.click_/?hl=en",
  instagramHandle: "@_.random._.click_",
  linkedin: "https://www.linkedin.com/in/satyendra-kumar-56b603359/",
  linkedinHandle: "satyendra-kumar-56b603359",
  github: "https://github.com/satyendra2611",
  githubHandle: "satyendra2611",
  stats: [
    { label: "B.Tech CGPA", value: "8.2", suffix: "/10" },
    { label: "Creative Fields", value: "4+", suffix: "Specs" },
    { label: "Core Langs", value: "Python / Java / C", suffix: "Eng" },
    { label: "Design Eye", value: "100%", suffix: "Focus" }
  ]
};

export const photos = [
  {
    id: "personal",
    title: "Poster",
    category: "City / Portrait",
    badge: "Satyendra",
    alt: "Satyendra Kumar on a city street",
    src: "/personal.jpg",
    featured: true,
    size: "large"
  },
  {
    id: "butterfly",
    title: "Flora & Wings",
    category: "Macro",
    badge: "Macro",
    alt: "Butterfly resting on a flower",
    src: "/butterfly.jpg",
    featured: true,
    size: "square"
  },
  {
    id: "tractor",
    title: "Rural Harvest Motion",
    category: "Field / Edit",
    badge: "Edit",
    alt: "Tractor moving through a rural field",
    src: "/tractor.jpg",
    featured: true,
    size: "square"
  },
  {
    id: "car",
    title: "Monochrome Rain Drive",
    category: "Street / Motion",
    badge: "Motion",
    alt: "Car driving through rain on a city street",
    src: "/car.jpg",
    featured: true,
    size: "wide"
  }
];

export const specialties = [
  { id: "01", title: "Photography", desc: "Monochrome, street perspective, macro detail, and golden hour light management." },
  { id: "02", title: "Videography", desc: "Cinematic movement, dynamic angles, sequence pacing, and ambient mood capture." },
  { id: "03", title: "Photo Editing", desc: "Precision color grading, tonal balance, exposure calibration, and high-contrast styling." },
  { id: "04", title: "Video Editing", desc: "Rhythmic transitions, sound design integration, narrative pacing, and visual storytelling." }
];

export const projects = [
  {
    title: "Predictive Analytics for Cybercrime & Cash Withdrawal Forecasting",
    category: "AI & Cyber Security / Geospatial Intelligence",
    status: "Flagship AI Project",
    icon: "ShieldAlert",
    lead: "Problem Statement: \"Development of a Predictive Analytics Framework for Cybercrime Complaints to Forecast Likely Cash Withdrawal Locations in Advance, Enabling Generation of Actionable Intelligence for Timely and Proactive Cybercrime Intervention.\"",
    highlights: [
      "Dual-Model Risk Architecture: Integrated a CNN-LSTM deep learning sequence network with a hybrid Random Forest + DBSCAN spatial anomaly clustering pipeline.",
      "Spatiotemporal Intelligence: Predicts high-risk cash withdrawal locations and ATM vulnerabilities utilizing Spatial Proximity calculations and Temporal Decay functions.",
      "Full-Stack Geospatial Dashboard: Interactive risk mapping and law enforcement visualization engineered with React, Vite 8, Leaflet Maps, and React Router v8, backed by Python, PostgreSQL, and SQL."
    ],
    techStack: [
      "React",
      "Vite 8",
      "Leaflet Maps",
      "React Router v8",
      "Python",
      "PostgreSQL",
      "SQL",
      "CNN-LSTM",
      "Random Forest",
      "DBSCAN",
      "Spatial Proximity",
      "Temporal Decay"
    ]
  },
  {
    title: "Smart Health Monitoring System",
    category: "Academic Mini Project",
    status: "Featured Project",
    icon: "Activity",
    lead: "Developed a healthcare platform connecting patients with doctors for improved communication, remote tracking, medication reminders, health updates, and API-based interactions.",
    highlights: [
      "Focused on user-friendly interface design and resilient data handling.",
      "Engineered notification-based reminders for medication schedules and critical vitals.",
      "Designed for immediate usability, low-latency communication, and practical healthcare workflows."
    ],
    techStack: ["Java", "Web Foundations", "REST APIs", "DBMS", "UI/UX Design"]
  },
  {
    title: "Student Result Manager",
    category: "Python & Web Application",
    status: "Academic Project",
    icon: "GraduationCap",
    lead: "Built an academic result management system utilizing Python file handling for robust data persistence, paired with a responsive web frontend for seamless student score computation and report card generation.",
    highlights: [
      "Automated grade calculation, subject percentage aggregates, and transcript report generation.",
      "Implemented persistent file handling mechanisms in Python for reliable record keeping and CRUD operations.",
      "Developed a clean, interactive user interface using HTML, CSS, and JavaScript for instantaneous student search and tabular result previews."
    ],
    techStack: ["Python", "File Handling", "HTML5", "CSS3", "JavaScript"]
  }
];

export const skillCategories = [
  {
    title: "Programming",
    icon: "Code2",
    skills: [
      { name: "Python", level: 88 },
      { name: "Java", level: 88 },
      { name: "C Language", level: 85 },
      { name: "SQL & Querying", level: 82 }
    ]
  },
  {
    title: "Web Engineering",
    icon: "Globe",
    skills: [
      { name: "HTML5 / Semantic Web", level: 92 },
      { name: "CSS3 / Modern Layouts", level: 90 },
      { name: "JavaScript / ES6+", level: 85 },
      { name: "React 19 & Vite", level: 82 }
    ]
  },
  {
    title: "Core CS Fundamentals",
    icon: "Cpu",
    skills: [
      { name: "Data Structures & OOP", level: 85 },
      { name: "Database Management (DBMS)", level: 82 },
      { name: "Operating Systems", level: 80 },
      { name: "Engineering Mathematics", level: 84 }
    ]
  },
  {
    title: "Visual & Creative Arts",
    icon: "Camera",
    skills: [
      { name: "Still Photography", level: 95 },
      { name: "Cinematography / Videography", level: 88 },
      { name: "Color Grading & Photo Edit", level: 92 },
      { name: "Video Post-Production", level: 87 }
    ]
  }
];

export const education = [
  {
    period: "2024 - 2028",
    status: "Current",
    degree: "B.Tech in Computer Science and Engineering",
    institution: "ABES Institute of Technology, Ghaziabad",
    affiliation: "Dr. A.P.J. Abdul Kalam Technical University (AKTU)",
    score: "CGPA: 8.2 (First Year)",
    highlights: "Focusing on data structures, algorithmic problem solving, software engineering, and visual computing."
  },
  {
    period: "2021 - 2023",
    status: "Completed",
    degree: "Intermediate, Science Stream (PCM)",
    institution: "Pioneer Montessori Inter College, Lucknow, UP",
    affiliation: "UP Board",
    score: "80%",
    highlights: "Strong analytical foundation in Physics, Chemistry, and Advanced Mathematics."
  },
  {
    period: "2019 - 2021",
    status: "Completed",
    degree: "High School Certification",
    institution: "Pioneer Montessori Inter College, Lucknow, UP",
    affiliation: "UP Board",
    score: "80%",
    highlights: "Distinction in science and foundational computer applications."
  }
];

export const engineeringTools = [
  { name: "Python", category: "Language / AI", icon: "Code2", color: "#38bdf8", badge: "Core" },
  { name: "Java", category: "OOP / Systems", icon: "Cpu", color: "#f97316", badge: "Core" },
  { name: "C / C++", category: "Low-Level & Memory", icon: "Binary", color: "#a855f7", badge: "Foundation" },
  { name: "React 19", category: "Frontend Framework", icon: "Globe", color: "#06b6d4", badge: "Modern UI" },
  { name: "Vite 8", category: "Build Tooling", icon: "Zap", color: "#eab308", badge: "Fast" },
  { name: "PostgreSQL", category: "Relational DB", icon: "Database", color: "#3b82f6", badge: "Database" },
  { name: "SQL", category: "Data Querying", icon: "Server", color: "#10b981", badge: "Analytics" },
  { name: "Leaflet Maps", category: "Geospatial GIS", icon: "Compass", color: "#84cc16", badge: "Spatial" },
  { name: "Git & GitHub", category: "Version Control", icon: "GitBranch", color: "#f43f5e", badge: "CI/CD" },
  { name: "Docker", category: "Containerization", icon: "Box", color: "#0284c7", badge: "DevOps" },
  { name: "Linux / Bash", category: "Operating System", icon: "Terminal", color: "#fb923c", badge: "Shell" },
  { name: "VS Code", category: "Primary IDE", icon: "Settings", color: "#38bdf8", badge: "Editor" },
  { name: "RESTful APIs", category: "Architecture", icon: "Layers", color: "#a855f7", badge: "Backend" },
  { name: "CSS3 / Canvas", category: "Hardware Accelerated UI", icon: "Palette", color: "#38bdf8", badge: "Design" }
];

export const creativeTools = [
  { name: "Vivo X300", category: "Primary Camera & Optics", icon: "Camera", color: "#38bdf8", badge: "Primary Gear" },
  { name: "Adobe Lightroom", category: "RAW Color Science & Tone", icon: "Sliders", color: "#60a5fa", badge: "Pro Grade" },
  { name: "Snapseed", category: "Selective Exposure & Curves", icon: "Palette", color: "#10b981", badge: "Master Edit" },
  { name: "Light Distortion", category: "Lens Flare & Atmospheric FX", icon: "Sparkles", color: "#f59e0b", badge: "Optical FX" },
  { name: "CapCut", category: "Cinematic Transitions & Pacing", icon: "Film", color: "#f43f5e", badge: "Video Flow" },
  { name: "VN", category: "Multi-Track Keyframing & Cuts", icon: "Film", color: "#a855f7", badge: "Precision" },
  { name: "InShot", category: "Reel Framing, Speed & Audio", icon: "Image", color: "#ec4899", badge: "Dynamic" }
];


