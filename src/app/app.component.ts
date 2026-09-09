import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type HotspotId = 'about' | 'education' | 'languages' | 'certifications' | 'experience';

interface Hotspot {
  id: HotspotId;
  label: string;
  color: string;
  glow: string;
  x: number;
  y: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Track which panels are open (multiple can coexist)
  openPanels = signal<Set<HotspotId>>(new Set());

  hoveredHotspot = signal<HotspotId | null>(null);

  hotspots: Hotspot[] = [
    {
      id: 'about',
      label: 'About Me',
      color: '#c084fc',
      glow: 'rgba(192, 132, 252, 0.55)',
      x: 50.8,
      y: 52.5
    },
    {
      id: 'experience',
      label: 'Work Experience',
      color: '#fb923c',
      glow: 'rgba(251, 146, 60, 0.55)',
      x: 47.5,
      y: 70.0
    },
    {
      id: 'education',
      label: 'Education',
      color: '#34d399',
      glow: 'rgba(52, 211, 153, 0.55)',
      x: 53.0,
      y: 78.0
    },
    {
      id: 'languages',
      label: 'Programming Languages',
      color: '#fbbf24',
      glow: 'rgba(251, 191, 36, 0.55)',
      x: 67.0,
      y: 12.0
    },
    {
      id: 'certifications',
      label: 'Certifications',
      color: '#38bdf8',
      glow: 'rgba(56, 189, 248, 0.55)',
      x: 67.5,
      y: 62.0
    }
  ];

  // About Me — Personal, human, no tech list
  aboutMe = {
    name: 'Santiago Castro Salt',
    tagline: 'Building things that matter.',
    location: 'Valencia, Spain → Dublin, Ireland',
    bio: 'Hi! I\'m Santiago, a curious and driven developer from Valencia. I love turning complex problems into clean, elegant solutions. After completing my internship integrating AI into clinical workflows at Hospital La Fe, I\'m now heading to Dublin this September to pursue my BSc in Computer Science — taught entirely in English.',
    interests: 'When I\'m not coding, you\'ll find me exploring new cities, gaming, or diving deep into AI research. My goal is to build impactful software at the intersection of engineering and artificial intelligence.',
    languages: [
      { name: 'English', level: 'C1 — IELTS 8.0' },
      { name: 'Spanish', level: 'Native' },
      { name: 'Valencian', level: 'Native' }
    ]
  };

  // Work Experience — From CVs-en.pdf
  experience = [
    {
      role: 'AI & Software Integration Developer',
      type: 'Clinical Internship (FCT)',
      company: 'Fertoolity — Hospital La Fe, Valencia',
      period: 'Mar 2026 – Jun 2026',
      highlights: [
        'Human-in-the-Loop supervised AI workflow for medical image segmentation and dataset annotation.',
        'FastAPI REST endpoints with Python, OpenCV, PyTorch & MONAI for real-time model inference.',
        'Direct collaboration with clinical specialists translating diagnostic requirements into production software.'
      ]
    },
    {
      role: 'FitForge — Full-Stack Fitness SPA',
      type: 'Final Degree Project (TFG)',
      company: 'Sole Developer',
      period: '2025 – 2026',
      highlights: [
        'Personalized workout & nutrition plans powered by a recommendation algorithm.',
        'Symfony 7 REST API (33 endpoints, JWT, RBAC) + Angular standalone frontend.',
        'Containerised with Docker Compose (PHP-FPM, Nginx, MySQL).'
      ]
    },
    {
      role: 'Legacy Land Mapper — Geospatial Tool',
      type: 'Personal Project',
      company: 'Sole Developer',
      period: '2025',
      highlights: [
        'Automated cadastral Excel/CSV records into interactive HTML maps.',
        'Multi-threaded Python backend (20 workers) cutting bulk query times by 90%.'
      ]
    }
  ];

  education = [
    {
      degree: 'BSc (Hons) in Computer Science',
      institution: 'Canterbury Christ Church University (via MSMK, Madrid)',
      period: 'Sep 2026 – Jun 2027',
      badge: '100% in English',
      topics: 'Cloud Systems · Cybersecurity · AI Integration · Advanced Software Engineering'
    },
    {
      degree: 'CFGS Web Application Development (DAW)',
      institution: 'La Florida Universitària, Valencia',
      period: '2024 – 2026',
      badge: '7.00 / 10',
      topics: 'Symfony 7 REST APIs · MySQL · Angular 19 · Docker · Git workflows'
    }
  ];

  skills = [
    { name: 'TypeScript / Angular', level: 95, color: '#38bdf8' },
    { name: 'PHP 8 / Symfony 7', level: 90, color: '#c084fc' },
    { name: 'Python 3 / PyTorch', level: 88, color: '#34d399' },
    { name: 'SQL / Databases', level: 82, color: '#fbbf24' },
    { name: 'Go / Java / Systems', level: 75, color: '#f87171' }
  ];

  certifications = [
    { title: 'English: C1 Certified (IELTS 8.0)', issuer: 'Official IELTS', year: '2026' },
    { title: 'Google: AI & Productivity', issuer: 'Santander Open Academy', year: 'Jan 2025' },
    { title: 'Cloud Computing: Applied Infrastructure', issuer: 'Florida Universitària', year: 'May 2026' }
  ];

  toggle(id: HotspotId) {
    this.openPanels.update(set => {
      const next = new Set(set);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  close(id: HotspotId) {
    this.openPanels.update(set => {
      const next = new Set(set);
      next.delete(id);
      return next;
    });
  }

  isOpen(id: HotspotId): boolean {
    return this.openPanels().has(id);
  }
}
