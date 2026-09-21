const mongoose = require('mongoose');

// Everything the public site renders lives in ONE document.
// The dashboard edits fields on this document; the public site always
// fetches this document fresh (no caching) so updates reflect for every visitor immediately.

const SocialLinkSchema = new mongoose.Schema({
  platform: String, // e.g. "GitHub", "LinkedIn", "Twitter"
  url: String,
}, { _id: false });

const EducationItemSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  year: String,
  description: String,
  logo: { type: String, default: '' },
});

const ExperienceItemSchema = new mongoose.Schema({
  role: String,
  company: String,
  duration: String,
  description: String,
  logo: { type: String, default: '' },
});

const CertificationSchema = new mongoose.Schema({
  title: String,
  issuer: String,
  date: String,
  image: String, // Cloudinary URL - opened full-size on click
  order: { type: Number, default: 0 },
});

const ProjectSchema = new mongoose.Schema({
  title: String,
  shortDescription: String,
  details: String, // long description shown in modal (left column)
  techStack: [String],
  image: String, // cover image
  gallery: [String], // extra images shown in modal
  githubUrl: String,
  liveUrl: String,
  order: { type: Number, default: 0 },
});

const ChronicleSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  location: String,
  image: String,
  images: [String],
  order: { type: Number, default: 0 },
});

const GridMotionItemSchema = new mongoose.Schema({
  title: String,
  image: String,
  order: { type: Number, default: 0 },
});

const SiteContentSchema = new mongoose.Schema({
  hero: {
    name: { type: String, default: 'Your Name' },
    tagline: { type: String, default: 'What you do' },
    image: { type: String, default: '' },
    socials: [SocialLinkSchema],
  },
  about: {
    heading: { type: String, default: 'About Me' },
    bio: { type: String, default: '' },
    image: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
  },
  education: {
    visible: { type: Boolean, default: true },
    items: [EducationItemSchema],
  },
  experience: {
    visible: { type: Boolean, default: true },
    items: [ExperienceItemSchema],
  },
  certifications: {
    visible: { type: Boolean, default: true },
    items: [CertificationSchema],
  },
  projects: {
    visible: { type: Boolean, default: true },
    items: [ProjectSchema],
  },
  chronicles: {
    visible: { type: Boolean, default: true },
    items: [ChronicleSchema],
  },
  gridMotion: {
    visible: { type: Boolean, default: true },
    items: [GridMotionItemSchema],
  },
  banner: {
    heading: { type: String, default: 'Curiosity is my dataset; experimentation is my training loop.' },
    text: { type: String, default: '' },
    image: { type: String, default: '' },
  },
  contact: {
    heading: { type: String, default: "Let's Talk" },
    image: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    socials: [SocialLinkSchema],
  },
}, { timestamps: true });

module.exports = mongoose.model('SiteContent', SiteContentSchema);
