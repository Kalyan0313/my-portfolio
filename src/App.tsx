import { useState } from "react";
import {
  Navbar,
  Footer,
  Hero,
  EngineeringNotes,
  Projects,
  Skills,
  Experience,
  About,
  Contact,
  CaseStudyModal,
  NoteModal,
  ResumeModal,
  Toast,
  FAB,
} from "./components";
import { useRouter } from "./hooks";

export function App() {
  const {
    selectedCaseStudy,
    selectedNote,
    isResumeOpen,
    openProject,
    openNote,
    openResume,
    closeModal,
  } = useRouter();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-dark)",
        display: "flex",
        flexDirection: "column",
        color: "var(--text-white)",
      }}
    >
      <Navbar onOpenResume={openResume} />

      <main>
        <Hero onOpenResume={openResume} />
        <Projects onSelectCaseStudy={openProject} />
        <Experience />
        <Skills />
        <EngineeringNotes onSelectNote={openNote} />
        <About />
        <Contact
          onOpenResume={openResume}
          onShowToast={showToast}
          data-section="contact"
        />
      </main>

      <Footer />

      {/* Interactive Modals with deep-link routing and history */}
      <CaseStudyModal
        project={selectedCaseStudy}
        onClose={() => closeModal("works")}
      />

      <NoteModal
        note={selectedNote}
        onClose={() => closeModal("notes")}
        onShowToast={showToast}
      />

      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => closeModal()}
      />

      {/* Toast Feedback */}
      <Toast message={toastMessage} />

      {/* Floating Action Button */}
      <FAB />
    </div>
  );
}

export default App;
