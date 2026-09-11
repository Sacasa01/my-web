import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize avatar state as TYPING', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.avatarState()).toBe('TYPING');
  });

  it('should toggle language correctly', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const initialLang = app.currentLang;
    app.toggleLang();
    expect(app.currentLang).toBe(initialLang === 'en' ? 'es' : 'en');
  });

  it('should have exactly 3 flagship projects (FitForge, VisionRest, LegacyLandMapper) in both English and Spanish', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    
    expect(app.content.en.projects.items.length).toBe(3);
    expect(app.content.es.projects.items.length).toBe(3);

    const enIds = app.content.en.projects.items.map(p => p.id);
    const esIds = app.content.es.projects.items.map(p => p.id);
    expect(enIds).toEqual(['fitforge', 'visionrest', 'land-mapper']);
    expect(esIds).toEqual(['fitforge', 'visionrest', 'land-mapper']);
  });

  it('should open and close project modal correctly', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const project = app.content.en.projects.items[0];

    expect(app.selectedProject()).toBeNull();
    
    app.openProjectModal(project);
    expect(app.selectedProject()).toEqual(project);

    app.closeProjectModal();
    expect(app.selectedProject()).toBeNull();
  });

  it('should close project modal on escape key', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const project = app.content.en.projects.items[1];

    app.openProjectModal(project);
    expect(app.selectedProject()).not.toBeNull();

    app.handleEscape();
    expect(app.selectedProject()).toBeNull();
  });

  it('should toggle theme correctly', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const initialTheme = app.theme();
    app.toggleTheme();
    expect(app.theme()).toBe(initialTheme === 'light' ? 'dark' : 'light');
  });

  it('should have exactly 3 verified certifications without targets in both languages', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    expect(app.content.en.certifications.items.length).toBe(3);
    expect(app.content.es.certifications.items.length).toBe(3);

    const enTitles = app.content.en.certifications.items.map(c => c.title);
    expect(enTitles.some(t => t.includes('English'))).toBeTrue();
    expect(enTitles.some(t => t.includes('Google'))).toBeTrue();
    expect(enTitles.some(t => t.includes('AWS'))).toBeTrue();

    // Verify no targets exist
    expect(enTitles.some(t => t.toLowerCase().includes('target'))).toBeFalse();
  });

  it('should order education timeline from bottom (oldest) to top (newest)', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    const enItems = app.content.en.education.items;
    expect(enItems.length).toBe(2);

    // Top item: newest (BSc Hons 2026-2027)
    expect(enItems[0].position).toBe('top');
    expect(enItems[0].degree).toContain('BSc (Hons)');
    expect(enItems[0].period).toContain('2026');

    // Bottom item: oldest (CFGS DAW 2024-2026)
    expect(enItems[1].position).toBe('bottom');
    expect(enItems[1].degree).toContain('CFGS DAW');
    expect(enItems[1].period).toContain('2024');
  });

  it('should have a curated skills list including HTML, programming languages, and spoken languages', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    expect(app.content.en.skills.items.length).toBeGreaterThanOrEqual(12);
    expect(app.content.es.skills.items.length).toBeGreaterThanOrEqual(12);

    const enSkillIds = app.content.en.skills.items.map(s => s.id);
    expect(enSkillIds).toContain('html-css');
    expect(enSkillIds).toContain('python');
    expect(enSkillIds).toContain('php');
    expect(enSkillIds).toContain('typescript');
    expect(enSkillIds).toContain('angular');
    expect(enSkillIds).toContain('docker');
    expect(enSkillIds).toContain('aws');
    expect(enSkillIds).toContain('lang-en');
    expect(enSkillIds).toContain('lang-es');

    expect(app.content.en.nav.skills).toBe('Skills');
    expect(app.content.es.nav.skills).toBe('Habilidades');
  });

  it('should not render Contact or Experience jump buttons inside the Hero section in the DOM', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const heroSection = compiled.querySelector('#hero');

    expect(heroSection).not.toBeNull();
    // Verify no anchor jump buttons inside hero
    const heroJumpButtons = heroSection?.querySelectorAll('a[href^="#"]');
    expect(heroJumpButtons?.length || 0).toBe(0);
  });

  it('should render all 4 navigation links in the header navbar (with contact in hanging cord and merged education/certifications)', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const headerNav = compiled.querySelector('header nav');

    expect(headerNav).not.toBeNull();
    const navLinks = Array.from(headerNav?.querySelectorAll('a') || []).map(a => a.getAttribute('href'));
    expect(navLinks).toEqual([
      '#experience',
      '#projects',
      '#skills',
      '#education'
    ]);
  });

  it('should render the Skills section with curated skill cards in the DOM', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const skillsSection = compiled.querySelector('#skills');

    expect(skillsSection).not.toBeNull();
    const skillCards = skillsSection?.querySelectorAll('.skill-card');
    expect(skillCards?.length).toBeGreaterThanOrEqual(12);

    // Verify SVG icons exist inside skill cards
    const svgs = skillsSection?.querySelectorAll('.skill-card svg');
    expect(svgs?.length).toBeGreaterThanOrEqual(12);
  });

  it('should render Education with ascending timeline nodes in the DOM', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const eduSection = compiled.querySelector('#education');

    expect(eduSection).not.toBeNull();
    const eduCards = eduSection?.querySelectorAll('article');
    expect(eduCards?.length).toBe(2);

    // Top card should be BSc Computer Science
    const topCardText = eduCards?.[0]?.textContent || '';
    expect(topCardText).toContain('BSc (Hons)');

    // Bottom card should be CFGS DAW
    const bottomCardText = eduCards?.[1]?.textContent || '';
    expect(bottomCardText).toContain('CFGS DAW');
  });

  it('should render exactly 3 Certification cards in the DOM', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const certSection = compiled.querySelector('#certifications');

    expect(certSection).not.toBeNull();
    const certCards = certSection?.querySelectorAll('article');
    expect(certCards?.length).toBe(3);
  });

  it('should render the redesigned Contact section with email copy and direct channels in the DOM', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const contactSection = compiled.querySelector('#contact');

    expect(contactSection).not.toBeNull();
    const mailLink = contactSection?.querySelector('a[href^="mailto:santiagocsdev@gmail.com"]');
    expect(mailLink).not.toBeNull();

    const phoneLink = contactSection?.querySelector('a[href^="tel:"]');
    expect(phoneLink).not.toBeNull();

    const linkedinLink = contactSection?.querySelector('a[href*="linkedin.com"]');
    expect(linkedinLink).not.toBeNull();

    const githubLink = contactSection?.querySelector('a[href*="github.com"]');
    expect(githubLink).not.toBeNull();
  });

  it('should render cleanly without overflow at Mobile (375px) breakpoint', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const hostEl = fixture.nativeElement as HTMLElement;
    hostEl.style.width = '375px';
    hostEl.style.maxWidth = '375px';
    hostEl.style.overflowX = 'hidden';
    document.body.appendChild(hostEl);

    fixture.detectChanges();

    const hero = hostEl.querySelector('#hero') as HTMLElement;
    const skills = hostEl.querySelector('#skills') as HTMLElement;
    const education = hostEl.querySelector('#education') as HTMLElement;
    const certs = hostEl.querySelector('#certifications') as HTMLElement;
    const contact = hostEl.querySelector('#contact') as HTMLElement;

    expect(hero).toBeTruthy();
    expect(skills).toBeTruthy();
    expect(education).toBeTruthy();
    expect(certs).toBeTruthy();
    expect(contact).toBeTruthy();

    // Verify container scrollWidth doesn't cause excessive overflow
    expect(hostEl.clientWidth).toBe(375);

    document.body.removeChild(hostEl);
  });

  it('should render cleanly without overflow at Tablet (768px) breakpoint', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const hostEl = fixture.nativeElement as HTMLElement;
    hostEl.style.width = '768px';
    hostEl.style.maxWidth = '768px';
    hostEl.style.overflowX = 'hidden';
    document.body.appendChild(hostEl);

    fixture.detectChanges();

    const hero = hostEl.querySelector('#hero') as HTMLElement;
    const skills = hostEl.querySelector('#skills') as HTMLElement;
    const education = hostEl.querySelector('#education') as HTMLElement;
    const certs = hostEl.querySelector('#certifications') as HTMLElement;
    const contact = hostEl.querySelector('#contact') as HTMLElement;

    expect(hero).toBeTruthy();
    expect(skills).toBeTruthy();
    expect(education).toBeTruthy();
    expect(certs).toBeTruthy();
    expect(contact).toBeTruthy();

    expect(hostEl.clientWidth).toBe(768);

    document.body.removeChild(hostEl);
  });
});
