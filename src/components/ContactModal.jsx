import { X, Send } from "lucide-react";
import { useEffect, useState } from "react";

export default function ContactModal({ isOpen, onClose }) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNo: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      // For now, log to console and show success message
      // In a real app, this would send to a backend API
      console.log('Form submitted:', formData);
      alert('Thank you for reaching out! Your message has been received.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        contactNo: '',
        message: ''
      });
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`modal-overlay ${
        isAnimating ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`modal-content ${isMobile ? 'modal-content-mobile' : ''} ${
          isAnimating ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-8"
        }`}
      >
        <button onClick={onClose} className="modal-close-btn">
          <X size={20} />
        </button>

        <div className="modal-header">
          <h3 className="modal-title">Contact Me</h3>
        </div>

        <div className="modal-body">
          <p className="modal-message">Send your Feedbacks!</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-3 mb-6">
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name"
              className="contact-input"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/60 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              className="contact-input"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/60 mb-1">Contact No.</label>
            <input
              type="tel"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleInputChange}
              placeholder="+1 (555) 123-4567"
              className="contact-input"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/60 mb-1">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Your message here..."
              rows="4"
              className="contact-textarea"
            />
          </div>

          <div className="modal-footer pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-action w-full py-3 mb-2 font-bold rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send size={16} />
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="modal-cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
