import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, X, Plus, Search, Folder, Tag, Calendar, Pin } from 'lucide-react';

const WelcomeOnboarding = ({ onComplete, onCreateFirstNote }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const steps = [
    {
      title: "Welcome to NOTINO!",
      subtitle: "Your personal note-taking companion",
      content: "Create, organize, and manage your notes with powerful features designed for productivity.",
      icon: <Plus size={isMobile ? 40 : 64} className="text-yellow-400" />,
      action: {
        label: "Create Your First Note",
        onClick: () => {
          onCreateFirstNote();
          setCurrentStep(1);
        }
      }
    },
    {
      title: "Organize with Folders",
      subtitle: "Keep your notes structured",
      content: "Create folders to categorize your notes. Drag and drop to reorder, and nest folders for better organization.",
      icon: <Folder size={isMobile ? 40 : 64} className="text-blue-400" />,
      highlight: "sidebar"
    },
    {
      title: "Find Notes Instantly",
      subtitle: "Powerful search and filters",
      content: "Use the search bar to find notes by title, content, or tags. Filter by folders to focus on what matters.",
      icon: <Search size={isMobile ? 40 : 64} className="text-green-400" />,
      highlight: "search"
    },
    {
      title: "Enhance with Tags & Pins",
      subtitle: "Add context and priority",
      content: "Tag your notes for better categorization. Pin important notes to keep them at the top of your list.",
      icon: <Tag size={isMobile ? 40 : 64} className="text-purple-400" />,
      highlight: "tags"
    },
    {
      title: "Sync to Calendar",
      subtitle: "Never miss important notes",
      content: "Connect your Google Calendar to turn notes into events. Perfect for meetings, deadlines, and reminders.",
      icon: <Calendar size={isMobile ? 40 : 64} className="text-red-400" />,
      highlight: "calendar"
    },
    {
      title: "You're All Set!",
      subtitle: "Start writing and stay organized",
      content: "Explore all features as you use the app. You can always access help and settings from the footer.",
      icon: <Pin size={isMobile ? 40 : 64} className="text-yellow-400" />,
      action: {
        label: "Get Started",
        onClick: onComplete
      }
    }
  ];

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const nextStep = () => {
    if (!isLastStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
      isMobile ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/50 backdrop-blur-xl'
    }`}>
      {isMobile ? (
        // MOBILE VERSION - Compact and optimized
        <div className="onboarding-modal bg-gray-900 rounded-[2rem] shadow-2xl overflow-hidden border-2 border-white/10 w-full max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">N</span>
              </div>
              <h1 className="text-white font-bold text-8xl tracking-tighter">NOTINO</h1>
            </div>
            
            <button
              onClick={onComplete}
              className="text-white/60 hover:text-white transition-colors p-1"
              aria-label="Skip onboarding"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="text-center p-6">
            <div className="mb-4 flex justify-center">
              {currentStepData.icon}
            </div>

            <h2 className="font-bold text-white text-xl mb-2">
              {currentStepData.title}
            </h2>

            <p className="text-yellow-400 text-sm font-medium mb-3">
              {currentStepData.subtitle}
            </p>

            <p className="text-white/80 leading-relaxed text-sm mb-6">
              {currentStepData.content}
            </p>

            {/* Action Button */}
            {currentStepData.action && (
              <button
                onClick={currentStepData.action.onClick}
                className={`btn-action font-bold rounded-xl flex items-center justify-center mx-auto transition-all hover:scale-105 px-6 py-2.5 text-sm mt-4 mb-4 ${currentStep === 0 ? 'animate-up-down' : ''}`}
              >
                {currentStepData.action.label}
                <ChevronRight size={16} className="ml-2" />
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 border-t border-white/10 pt-4">
            <div className="flex justify-center space-x-2 mb-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'bg-yellow-400 w-3 h-3'
                      : 'bg-white/20 w-2 h-2 hover:bg-white/30'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between gap-2">
              <button
                onClick={prevStep}
                disabled={isFirstStep}
                className={`flex items-center rounded-lg transition-all ${
                  isFirstStep
                    ? 'text-white/20 cursor-not-allowed'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                } px-3 py-1.5 text-sm flex-1`}
              >
                <ChevronLeft size={14} className="mr-1" />
              </button>

              <span className="text-white/40 text-xs flex-shrink-0">
                {currentStep + 1}/{steps.length}
              </span>

              {!currentStepData.action && (
                <button
                  onClick={isLastStep ? onComplete : nextStep}
                  className="flex items-center rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all px-3 py-1.5 text-sm flex-1 justify-end"
                >
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        // DESKTOP VERSION - Enhanced and spacious
        <div className="onboarding-modal bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-white/15 w-full max-w-[75%] max-h-[88vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-10 py-5 sticky top-0 bg-gradient-to-b from-gray-900 to-gray-900/95 z-10">
            <div className="flex items-center space-x-3 flex-shrink-0">
              <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-400/20">
                <span className="text-black font-bold text-sm">N</span>
              </div>
              <h3 className="text-white font-bold text-xs tracking-[0.3em] whitespace-nowrap uppercase opacity-80">NOTINO</h3>
            </div>
            <button
              onClick={onComplete}
              className="text-white/60 hover:text-white hover:bg-white/10 transition-all p-2 rounded-lg"
              aria-label="Skip onboarding"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="px-12 pt-20 pb-10 flex flex-col items-center justify-center">
            {/* Large Icon with aesthetic background */}
            <div className="mb-8 flex justify-center animate-float">
              <div className="p-6 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl backdrop-blur-sm border border-white/10 shadow-xl">
                <div className="text-white">
                  {currentStepData.icon}
                </div>
              </div>
            </div>

            {/* Content Area - Centered */}
            <div className="text-center max-w-2xl">
              {/* Title */}
              <h2 className="font-bold text-white text-3xl md:text-4xl mb-3 leading-tight tracking-tight break-words">
                {currentStepData.title}
              </h2>

              {/* Subtitle */}
              <p className="text-yellow-300 text-lg font-semibold mb-5 tracking-wide">
                {currentStepData.subtitle}
              </p>

              {/* Description */}
              <p className="text-white/75 leading-relaxed text-base mb-10">
                {currentStepData.content}
              </p>

              {/* Action Button */}
              {currentStepData.action && (
                <button
                  onClick={currentStepData.action.onClick}
                  className={`btn-action font-bold rounded-xl flex items-center justify-center mx-auto transition-all mt-10 hover:scale-105 px-10 py-3 text-base mb-8 shadow-lg ${currentStep === 0 ? 'animate-up-down' : ''}`}
                >
                  {currentStepData.action.label}
                  <ChevronRight size={18} className="ml-2" />
                </button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-12 py-8 border-t border-white/10 bg-gradient-to-t from-gray-800/50 to-transparent flex flex-col items-center">
            {/* Progress Dots */}
            <div className="flex justify-center space-x-3 mb-8">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'bg-yellow-400 w-3 h-3 shadow-lg shadow-yellow-400/50'
                      : 'bg-white/20 w-2.5 h-2.5 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            {/* Navigation Bar */}
            <div className="flex items-center justify-center gap-8">
              <button
                onClick={prevStep}
                disabled={isFirstStep}
                className={`flex items-center rounded-lg transition-all font-medium gap-2 ${
                  isFirstStep
                    ? 'text-white/20 cursor-not-allowed'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                } px-5 py-2 text-sm`}
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <span className="text-white/50 text-sm font-medium">
                {currentStep + 1} of {steps.length}
              </span>

              {!currentStepData.action && (
                <button
                  onClick={isLastStep ? onComplete : nextStep}
                  className="flex items-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all font-medium gap-2 px-5 py-2 text-sm"
                >
                  {isLastStep ? 'Finish' : 'Next'}
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeOnboarding;