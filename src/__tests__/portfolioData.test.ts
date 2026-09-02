import { describe, it, expect } from 'vitest';
import { profileData, projectsData, experienceData } from '../data';
import { engineeringNotesData } from '../data';

describe('Portfolio Core Data Integrity', () => {
  it('has valid profile details for Kalyan Mahato', () => {
    expect(profileData.name).toBe('Kalyan Mahato');
    expect(profileData.location).toBe('Bengaluru, India');
    expect(profileData.email).toBe('mahatokalyan2@gmail.com');
    expect(profileData.github).toBe('https://github.com/ZairoXcode');
    expect(profileData.linkedin).toContain('kalyan-mahato');
  });

  it('contains valid project definitions with case studies', () => {
    expect(projectsData.length).toBeGreaterThanOrEqual(4);
    projectsData.forEach((project) => {
      expect(project.id).toBeTruthy();
      expect(project.title).toBeTruthy();
      expect(project.technologies.length).toBeGreaterThan(0);
      expect(project.caseStudy).toBeDefined();
      expect(project.caseStudy?.systemArchitecture).toBeDefined();
    });
  });

  it('exclusively contains Excellis IT experience as requested', () => {
    expect(experienceData).toHaveLength(1);
    expect(experienceData[0].company).toBe('Excellis IT');
  });

  it('dynamically loads markdown blogs with non-empty content and thumbnails', () => {
    expect(engineeringNotesData.length).toBeGreaterThanOrEqual(8);
    engineeringNotesData.forEach((note) => {
      expect(note.id).toBeTruthy();
      expect(note.title).toBeTruthy();
      expect(note.htmlContent).toBeTruthy();
      expect(note.thumbnail).toBeTruthy();
    });
  });
});
