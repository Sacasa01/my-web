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
  // Independent Window Open States (All 4 can stay open simultaneously without overlapping)
  isAboutMeOpen = signal(false);
  isEducationOpen = signal(false);
  isLanguagesOpen = signal(false);
  isCertificationsOpen = signal(false);

  // Active hover preview tooltip
  hoveredHotspot = signal<HotspotType | null>(null);

  // Precision Hotspots Calibrated to the Background Elements
  hotspots = [
    {
      id: 'about' as HotspotType,
      label: 'About Me',
      sublabel: 'Santiago Castro Salt',
      color: '#c084fc', // Vibrant Purple / Violet
      glow: 'rgba(192, 132, 252, 0.7)',
      x: 50.8, // Centered dead-center under the pixel art portrait
      y: 56.4,
      targetSide: 'left'
    },
    {
      id: 'education' as HotspotType,
      label: 'Education',
      sublabel: 'BSc Hons CS & DAW',
      color: '#34d399', // Emerald Green
      glow: 'rgba(52, 211, 153, 0.7)',
      x: 52.8, // Dead-center in the middle of the stacked textbooks
      y: 74.0,
      targetSide: 'left'
    },
    {
      id: 'languages' as HotspotType,
      label: 'Programming Languages',
      sublabel: 'Top 5 Tech Stack',
      color: '#fbbf24', // Amber / Warm Gold
      glow: 'rgba(251, 191, 36, 0.7)',
      x: 65.8, // Positioned right at the top of the yellow sticky note
      y: 26.5,
      targetSide: 'right'
    },
    {
      id: 'certifications' as HotspotType,
      label: 'Certifications',
      sublabel: 'English C1, Google & AWS',
      color: '#38bdf8', // Sky Blue / Cyan
      glow: 'rgba(56, 189, 248, 0.7)',
      x: 65.2, // Right above the header 'CERTIFICATIONS' on the blue sticky note
      y: 66.0,
      targetSide: 'right'
    }
  ];

  // Official Verified CV Data (from CVs-en.pdf)
  cvData = {
    personal: {
      name: 'Santiago Castro Salt',
      role: 'Full-Stack Developer & AI Systems Integrator',
      locations: 'Dublin, Ireland • Valencia, Spain',
      email: 'santiagocsdev@gmail.com',
      phone: '+34 654 763 788',
      github: 'github.com/Sacasa01',
      linkedin: 'linkedin.com/in/santiago-castro-salt',
      summary: 'Experienced in engineering production-grade web applications (PHP/Symfony 7, TypeScript/Angular, Python, Docker, SQL) and integrating AI into software architectures—including controlled agents, MCP tools, and Human-in-the-Loop clinical workflows at Hospital La Fe.',
      languages: [
        { name: 'English', level: 'C1 Certified (IELTS 8.0)' },
        { name: 'Spanish', level: 'Native' },
        { name: 'Valencian / Catalan', level: 'Native' }
      ]
    },
    education: [
      {
        degree: 'BSc (Hons) in Computer Science',
        institution: 'Canterbury Christ Church University (via MSMK, Madrid)',
        period: 'Sep 2026 – Jun 2027',
        badge: '100% in English',
        topics: 'Cloud Systems, Cybersecurity, AI Integration, Advanced Software Engineering'
      },
      {
        degree: 'CFGS Web Application Development (DAW)',
        institution: 'La Florida Universitària, Valencia',
        period: '2024 – 2026',
        badge: 'Grade: 7.00 / 10',
        topics: 'Symfony 7 REST APIs, Relational DBs (MySQL), Angular Standalone, Docker'
      }
    ],
    skills: [
      { name: 'TypeScript / Angular', level: 95, barColor: '#38bdf8' },
      { name: 'PHP 8 / Symfony 7', level: 90, barColor: '#c084fc' },
      { name: 'Python 3 / PyTorch', level: 88, barColor: '#34d399' },
      { name: 'SQL / Databases', level: 82, barColor: '#fbbf24' },
      { name: 'Go / Java / Systems', level: 75, barColor: '#f87171' }
    ],
    certifications: [
      {
        title: 'English: C1 Certified (IELTS 8.0)',
        issuer: 'Official IELTS Examination',
        year: '2026'
      },
      {
        title: 'Google: AI & Productivity',
        issuer: 'Santander Open Academy',
        year: 'Jan 2025'
      },
      {
        title: 'Cloud Computing: Applied Infrastructure',
        issuer: 'Florida Universitària',
        year: 'May 2026'
      },
      {
        title: 'Model Context Protocol & PyTorch / MONAI',
        issuer: 'AI Systems Integration',
        year: '2026'
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
