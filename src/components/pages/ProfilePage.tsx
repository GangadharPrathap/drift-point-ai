import { motion } from 'framer-motion';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import { useMember } from '@/integrations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { format } from 'date-fns';
import { Image } from '@/components/ui/image';

function ProfilePageContent() {
  const { member } = useMember();

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
              Your <span className="text-neon-blue">Profile</span>
            </h1>
            <p className="text-xl text-gray-300">
              Manage your DriftPoint AI account
            </p>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-glass-white backdrop-blur-md border border-white/20 rounded-xl p-8"
          >
            {/* Profile Photo & Name */}
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8 pb-8 border-b border-white/20">
              <div className="w-24 h-24 bg-gradient-to-br from-neon-blue to-neon-orange rounded-full flex items-center justify-center">
                {member?.profile?.photo?.url ? (
                  <Image src={member.profile.photo.url} alt={member?.profile?.nickname || 'Profile'} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-background" />
                )}
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-heading font-bold mb-2">
                  {member?.profile?.nickname || 
                   (member?.contact?.firstName && member?.contact?.lastName
                     ? `${member.contact.firstName} ${member.contact.lastName}`
                     : 'Racer')}
                </h2>
                {member?.profile?.title && (
                  <p className="text-gray-300">{member.profile.title}</p>
                )}
              </div>
            </div>

            {/* Profile Details */}
            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-neon-blue/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-neon-blue" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-400 mb-1">Email Address</p>
                  <p className="font-heading font-semibold text-lg">
                    {member?.loginEmail || 'Not provided'}
                  </p>
                  {member?.loginEmailVerified && (
                    <div className="flex items-center gap-2 mt-1">
                      <Shield className="w-4 h-4 text-neon-blue" />
                      <span className="text-xs text-neon-blue">Verified</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Member Since */}
              {member?._createdDate && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-neon-orange/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-neon-orange" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-1">Member Since</p>
                    <p className="font-heading font-semibold text-lg">
                      {format(new Date(member._createdDate), 'MMMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              )}

              {/* Contact Info */}
              {(member?.contact?.firstName || member?.contact?.lastName) && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-glass-white border border-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-1">Full Name</p>
                    <p className="font-heading font-semibold text-lg">
                      {member.contact.firstName} {member.contact.lastName}
                    </p>
                  </div>
                </div>
              )}

              {/* Phone */}
              {member?.contact?.phones && member.contact.phones.length > 0 && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-glass-white border border-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📱</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-1">Phone Number</p>
                    <p className="font-heading font-semibold text-lg">
                      {member.contact.phones[0]}
                    </p>
                  </div>
                </div>
              )}

              {/* Account Status */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-glass-white border border-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-400 mb-1">Account Status</p>
                  <p className="font-heading font-semibold text-lg">
                    {member?.status || 'Active'}
                  </p>
                </div>
              </div>
            </div>

            {/* Last Login */}
            {member?.lastLoginDate && (
              <div className="mt-8 pt-8 border-t border-white/20">
                <p className="text-sm text-gray-400">
                  Last login: {format(new Date(member.lastLoginDate), 'MMMM dd, yyyy \'at\' h:mm a')}
                </p>
              </div>
            )}
          </motion.div>

          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 bg-glass-white backdrop-blur-md border border-white/20 rounded-xl p-8"
          >
            <h3 className="text-2xl font-heading font-bold mb-6 text-neon-blue">Quick Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-background/30 rounded-lg p-6 text-center">
                <p className="text-4xl font-heading font-black text-neon-blue mb-2">0</p>
                <p className="text-gray-400">Karts Registered</p>
              </div>
              <div className="bg-background/30 rounded-lg p-6 text-center">
                <p className="text-4xl font-heading font-black text-neon-orange mb-2">0</p>
                <p className="text-gray-400">AI Analyses</p>
              </div>
              <div className="bg-background/30 rounded-lg p-6 text-center">
                <p className="text-4xl font-heading font-black text-foreground mb-2">0</p>
                <p className="text-gray-400">Track Sessions</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProfilePageContent />
  );
}
