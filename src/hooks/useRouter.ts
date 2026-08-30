import { useState, useEffect, useCallback } from 'react';
import { projectsData, engineeringNotesData } from '../data';
import type { Project, EngineeringNote } from '../types';

export interface RouteState {
  currentSection: string;
  selectedCaseStudy: Project | null;
  selectedNote: EngineeringNote | null;
  isResumeOpen: boolean;
}

export function useRouter() {
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Project | null>(null);
  const [selectedNote, setSelectedNote] = useState<EngineeringNote | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Parse current hash and sync state
  const syncStateFromHash = useCallback(() => {
    const rawHash = window.location.hash.replace(/^#\/?/, '');
    if (!rawHash) {
      setSelectedCaseStudy(null);
      setSelectedNote(null);
      setIsResumeOpen(false);
      return;
    }

    const segments = rawHash.split('/');
    const primary = segments[0]?.toLowerCase();
    const id = segments[1];

    if (primary === 'project' || primary === 'work') {
      if (id) {
        const found = projectsData.find((p) => p.id === id);
        if (found) {
          setSelectedCaseStudy(found);
          setSelectedNote(null);
          setIsResumeOpen(false);
          return;
        }
      }
      setSelectedCaseStudy(null);
      scrollToSection('works');
    } else if (primary === 'note' || primary === 'blog' || primary === 'notes' || primary === 'blogs') {
      if (id) {
        const found = engineeringNotesData.find((n) => n.id === id);
        if (found) {
          setSelectedNote(found);
          setSelectedCaseStudy(null);
          setIsResumeOpen(false);
          return;
        }
      }
      setSelectedNote(null);
      scrollToSection('notes');
    } else if (primary === 'resume') {
      setIsResumeOpen(true);
      setSelectedCaseStudy(null);
      setSelectedNote(null);
    } else {
      // Normal section scroll
      setSelectedCaseStudy(null);
      setSelectedNote(null);
      setIsResumeOpen(false);
      scrollToSection(primary);
    }
  }, []);

  const scrollToSection = (sectionId: string) => {
    const targetId = sectionId === 'works' || sectionId === 'work' ? 'works' : sectionId;
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(targetId);
    }
  };

  useEffect(() => {
    // Initial mount check
    syncStateFromHash();

    const handleHashChange = () => {
      syncStateFromHash();
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [syncStateFromHash]);

  const openProject = (project: Project) => {
    setSelectedCaseStudy(project);
    window.location.hash = `/project/${project.id}`;
  };

  const openNote = (note: EngineeringNote) => {
    setSelectedNote(note);
    window.location.hash = `/note/${note.id}`;
  };

  const openResume = () => {
    setIsResumeOpen(true);
    window.location.hash = '/resume';
  };

  const closeModal = (fallbackSection?: string) => {
    setSelectedCaseStudy(null);
    setSelectedNote(null);
    setIsResumeOpen(false);

    if (fallbackSection) {
      window.location.hash = fallbackSection;
    } else if (selectedCaseStudy) {
      window.location.hash = 'works';
    } else if (selectedNote) {
      window.location.hash = 'notes';
    } else {
      window.location.hash = '';
    }
  };

  const navigateTo = (section: string) => {
    const cleanSection = section.replace(/^#\/?/, '');
    window.location.hash = cleanSection;
    scrollToSection(cleanSection);
  };

  return {
    selectedCaseStudy,
    selectedNote,
    isResumeOpen,
    activeSection,
    openProject,
    openNote,
    openResume,
    closeModal,
    navigateTo
  };
}
