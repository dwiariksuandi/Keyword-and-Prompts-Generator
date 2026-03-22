import React from 'react';
import { AnimatePresence } from 'motion/react';
import { ErrorModal } from './ErrorModal';
import { VisualizerModal } from './VisualizerModal';
import { Toast } from './Toast';

interface GlobalModalsProps {
  errorModal: { show: boolean; title: string; message: string };
  setErrorModal: (modal: { show: boolean; title: string; message: string }) => void;
  isVisualizing: boolean;
  setIsVisualizing: (show: boolean) => void;
  visualizedImage: string | null;
  visualizingPrompt: string | null;
  toast: { show: boolean; message: string };
}

export const GlobalModals: React.FC<GlobalModalsProps> = ({
  errorModal,
  setErrorModal,
  isVisualizing,
  setIsVisualizing,
  visualizedImage,
  visualizingPrompt,
  toast,
}) => {
  return (
    <AnimatePresence>
      <ErrorModal
        show={errorModal.show}
        title={errorModal.title}
        message={errorModal.message}
        onClose={() => setErrorModal({ ...errorModal, show: false })}
      />

      <VisualizerModal
        show={isVisualizing}
        onClose={() => setIsVisualizing(false)}
        image={visualizedImage}
        prompt={visualizingPrompt}
      />

      <Toast show={toast.show} message={toast.message} />
    </AnimatePresence>
  );
};
