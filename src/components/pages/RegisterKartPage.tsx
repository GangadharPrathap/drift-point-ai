import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { KartRegistrations } from '@/entities';
import { useMember } from '@/integrations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function RegisterKartPageContent() {
  const { member } = useMember();
  const [formData, setFormData] = useState({
    kartName: '',
    ownerName: member?.contact?.firstName && member?.contact?.lastName 
      ? `${member.contact.firstName} ${member.contact.lastName}` 
      : '',
    manufacturer: '',
    modelYear: new Date().getFullYear(),
    engineType: '',
    kartPhoto: '',
    contactEmail: member?.loginEmail || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'modelYear' ? parseInt(value) || new Date().getFullYear() : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    const kartData: KartRegistrations = {
      _id: crypto.randomUUID(),
      kartName: formData.kartName,
      ownerName: formData.ownerName,
      manufacturer: formData.manufacturer,
      modelYear: formData.modelYear,
      engineType: formData.engineType,
      kartPhoto: formData.kartPhoto || 'https://static.wixstatic.com/media/6583f0_e2fb03d93e294a48aca7951e31f276cd~mv2.png?originWidth=768&originHeight=576',
      contactEmail: formData.contactEmail,
    };

    await BaseCrudService.create('kartregistrations', kartData);
    setSubmitStatus('success');
    setFormData({
      kartName: '',
      ownerName: member?.contact?.firstName && member?.contact?.lastName 
        ? `${member.contact.firstName} ${member.contact.lastName}` 
        : '',
      manufacturer: '',
      modelYear: new Date().getFullYear(),
      engineType: '',
      kartPhoto: '',
      contactEmail: member?.loginEmail || '',
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-paragraph">
      <Header />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-heading font-black mb-4">
              Register Your <span className="text-neon-blue">Kart</span>
            </h1>
            <p className="text-xl text-gray-300">
              Add your go-kart to unlock AI-powered performance analysis
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-glass-white backdrop-blur-md border border-white/20 rounded-xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Kart Name */}
              <div>
                <label htmlFor="kartName" className="block text-sm font-heading font-semibold mb-2 text-neon-blue">
                  Kart Name *
                </label>
                <input
                  type="text"
                  id="kartName"
                  name="kartName"
                  value={formData.kartName}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-background/50 border border-white/20 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-neon-blue transition-colors"
                  placeholder="e.g., Lightning Bolt"
                />
              </div>

              {/* Owner Name */}
              <div>
                <label htmlFor="ownerName" className="block text-sm font-heading font-semibold mb-2 text-neon-blue">
                  Owner Name *
                </label>
                <input
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-background/50 border border-white/20 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-neon-blue transition-colors"
                  placeholder="Your full name"
                />
              </div>

              {/* Grid for Manufacturer and Model Year */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="manufacturer" className="block text-sm font-heading font-semibold mb-2 text-neon-blue">
                    Manufacturer *
                  </label>
                  <input
                    type="text"
                    id="manufacturer"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-background/50 border border-white/20 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-neon-blue transition-colors"
                    placeholder="e.g., Tony Kart, CRG"
                  />
                </div>

                <div>
                  <label htmlFor="modelYear" className="block text-sm font-heading font-semibold mb-2 text-neon-blue">
                    Model Year *
                  </label>
                  <input
                    type="number"
                    id="modelYear"
                    name="modelYear"
                    value={formData.modelYear}
                    onChange={handleInputChange}
                    required
                    min="1980"
                    max={new Date().getFullYear() + 1}
                    className="w-full bg-background/50 border border-white/20 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-neon-blue transition-colors"
                  />
                </div>
              </div>

              {/* Engine Type */}
              <div>
                <label htmlFor="engineType" className="block text-sm font-heading font-semibold mb-2 text-neon-blue">
                  Engine Type *
                </label>
                <select
                  id="engineType"
                  name="engineType"
                  value={formData.engineType}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-background/50 border border-white/20 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-neon-blue transition-colors"
                >
                  <option value="">Select engine type</option>
                  <option value="2-Stroke">2-Stroke</option>
                  <option value="4-Stroke">4-Stroke</option>
                  <option value="Electric">Electric</option>
                  <option value="Rotax Max">Rotax Max</option>
                  <option value="IAME X30">IAME X30</option>
                  <option value="Honda GX390">Honda GX390</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Kart Photo URL */}
              <div>
                <label htmlFor="kartPhoto" className="block text-sm font-heading font-semibold mb-2 text-neon-blue">
                  Kart Photo URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    id="kartPhoto"
                    name="kartPhoto"
                    value={formData.kartPhoto}
                    onChange={handleInputChange}
                    className="flex-1 bg-background/50 border border-white/20 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-neon-blue transition-colors"
                    placeholder="https://example.com/my-kart.jpg"
                  />
                  <button
                    type="button"
                    className="bg-glass-white border border-white/20 rounded-lg px-4 py-3 hover:border-neon-blue transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Optional: Add a photo of your kart</p>
              </div>

              {/* Contact Email */}
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-heading font-semibold mb-2 text-neon-blue">
                  Contact Email *
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-background/50 border border-white/20 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-neon-blue transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-neon-blue text-primary-foreground px-8 py-4 rounded-lg font-heading font-bold text-lg hover:bg-neon-blue/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Registering...' : 'Register Kart'}
                </button>
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 bg-neon-blue/20 border border-neon-blue rounded-lg p-4"
                >
                  <CheckCircle className="w-5 h-5 text-neon-blue" />
                  <p className="text-neon-blue font-heading font-semibold">
                    Kart registered successfully! Head to the AI Pit Crew for analysis.
                  </p>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 bg-destructive/20 border border-destructive rounded-lg p-4"
                >
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  <p className="text-destructive font-heading font-semibold">
                    {errorMessage || 'Registration failed. Please try again.'}
                  </p>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function RegisterKartPage() {
  return (
    <RegisterKartPageContent />
  );
}
