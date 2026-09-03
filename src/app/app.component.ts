import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type HotspotType = 'about' | 'education' | 'languages' | 'certifications';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Independent Window Open States
  isAboutMeOpen = signal(false);
  isEducationOpen = signal(false);
  isLanguagesOpen = signal(false);
  isCertificationsOpen = signal(false);

  // Active hover preview tooltip
  hoveredHotspot = signal<HotspotType | null>(null);

  // Hotspot definitions with exact coordinates, colors and labels
  hotspots = [
    {
      id: 'about' as HotspotType,
      label: 'About Me // Santiago',
      color: '#a855f7', // Purple
      pulseColor: 'rgba(168, 85, 247, 0.5)',
      x: 49.6,
      y: 53.8,
      direction: 'left',
      icon: '👤'
    },
    {
      id: 'education' as HotspotType,
      label: 'Education // CS Degree & DAW',
      color: '#10b981', // Emerald Green
      pulseColor: 'rgba(16, 185, 129, 0.5)',
      x: 48.2,
      y: 71.5,
      direction: 'left',
      icon: '📚'
    },
    {
      id: 'languages' as HotspotType,
      label: 'Programming Languages',
      color: '#f59e0b', // Amber
      pulseColor: 'rgba(245, 158, 11, 0.5)',
      x: 64.9,
      y: 51.2,
      direction: 'right',
      icon: '⚡'
    },
    {
      id: 'certifications' as HotspotType,
      label: 'Certifications & Workshops',
      color: '#06b6d4', // Cyan
      pulseColor: 'rgba(6, 182, 212, 0.5)',
      x: 65.4,
      y: 72.2,
      direction: 'right',
      icon: '🎓'
    }
  ];

  // Verified CV Data extracted from CVs-en.pdf
  cvData = {
    personal: {
      name: 'Santiago Castro Salt',
      role: 'Full-Stack Developer & AI Systems Integrator',
      locations: 'Dublin, Ireland • Valencia, Spain',
      email: 'santiagocsdev@gmail.com',
      phone: '+34 654 763 788',
      linkedin: 'linkedin.com/in/santiago-castro-salt',
      github: 'github.com/Sacasa01',
      summary: 'Experienced in engineering production-grade web applications (PHP/Symfony 7, TypeScript/Angular, Python, Docker, SQL) and integrating AI into software architectures—including controlled agents, MCP tools, and Human-in-the-Loop workflows at Hospital La Fe.',
      languagesSpoken: [
        { lang: 'English', level: 'C1 Certified (IELTS 8.0)', badge: 'Fluent / Academic' },
        { lang: 'Spanish', level: 'Native', badge: 'Bilingual' },
        { lang: 'Catalan / Valencian', level: 'Native', badge: 'Bilingual' }
      ]
    },
    education: [
      {
        degree: 'BSc (Hons) in Computer Science',
        institution: 'Canterbury Christ Church University (via MSMK University, Madrid)',
        period: 'Sep 2026 – Jun 2027',
        highlight: 'Taught 100% in English',
        specialisations: [
          'Advanced Software Engineering',
          'Cloud Systems Architecture',
          'Cybersecurity Protocols',
          'AI System Integration'
        ]
      },
      {
        degree: 'Higher National Diploma (DAW) – Web Application Development',
        institution: 'La Florida Universitària, Valencia',
        period: '2024 – 2026',
        highlight: 'Grade: 7.00 / 10',
        specialisations: [
          'Enterprise Full-Stack Architecture (Symfony 7 & Angular 19)',
          'Relational Database Modeling (MySQL / PostgreSQL)',
          'RESTful API Engineering, JWT Auth & RBAC Security'
        ]
      }
    ],
    technicalSkills: [
      { name: 'TypeScript (Angular, Node.js)', level: 95, color: '#38bdf8' },
      { name: 'PHP 8 (Symfony 7)', level: 90, color: '#a855f7' },
      { name: 'Python 3 (FastAPI, Pandas)', level: 88, color: '#10b981' },
      { name: 'SQL (MySQL, PostgreSQL)', level: 82, color: '#f59e0b' },
      { name: 'Go / Java', level: 75, color: '#ef4444' }
    ],
    databasesAndInfra: [
      'Docker', 'Docker Compose', 'MySQL', 'PostgreSQL', 'REST APIs', 'Git', 'Nginx', 'Linux', 'PowerShell'
    ],
    certifications: [
      {
        title: 'English: C1 Certified (IELTS 8.0)',
        issuer: 'Official IELTS Examination',
        date: '2026',
        desc: 'Advanced professional and academic fluency in English.'
      },
      {
        title: 'Google: Artificial Intelligence & Productivity',
        issuer: 'Santander Open Academy',
        date: 'Jan 2025',
        desc: 'Productivity workflows, prompt engineering, and foundational AI models.'
      },
      {
        title: 'Cloud Computing: Applied Cloud Infrastructure & Deployment',
        issuer: 'Florida Universitària',
        date: 'May 2026',
        desc: 'Cloud deployment strategies, container orchestration, and network topologies.'
      },
      {
        title: 'AI & System Integration: MCP Protocols',
        issuer: 'Model Context Protocol & PyTorch / MONAI',
        date: '2026',
        desc: 'Controlled agentic workflows, function calling, and Human-in-the-Loop architectures.'
      }
    ]
  };

  toggleHotspot(id: HotspotType) {
    switch (id) {
      case 'about':
        this.isAboutMeOpen.update(v => !v);
        break;
      case 'education':
        this.isEducationOpen.update(v => !v);
        break;
      case 'languages':
        this.isLanguagesOpen.update(v => !v);
        break;
      case 'certifications':
        this.isCertificationsOpen.update(v => !v);
        break;
    }
  }

  closeSection(id: HotspotType) {
    switch (id) {
      case 'about':
        this.isAboutMeOpen.set(false);
        break;
      case 'education':
        this.isEducationOpen.set(false);
        break;
      case 'languages':
        this.isLanguagesOpen.set(false);
        break;
      case 'certifications':
        this.isCertificationsOpen.set(false);
        break;
    }
  }

  isSectionOpen(id: HotspotType): boolean {
    switch (id) {
      case 'about':
        return this.isAboutMeOpen();
      case 'education':
        return this.isEducationOpen();
      case 'languages':
        return this.isLanguagesOpen();
      case 'certifications':
        return this.isCertificationsOpen();
    }
  }
}
