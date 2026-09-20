const express = require('express');
const SiteContent = require('../models/SiteContent');
const auth = require('../middleware/auth');

const router = express.Router();

// helper - there is always exactly one SiteContent document
async function getContent() {
  let content = await SiteContent.findOne({});
  if (!content) content = await SiteContent.create({});
  return content;
}

// GET /api/content - PUBLIC. The public site calls this on every load,
// so any dashboard change is reflected for every visitor instantly (no caching).
router.get('/', async (req, res) => {
  try {
    const content = await getContent();
    res.set('Cache-Control', 'no-store');
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PATCH /api/content/:section - PROTECTED. Updates one top-level section
// e.g. /api/content/hero  body: { name, tagline, image, socials }
router.patch('/:section', auth, async (req, res) => {
  const allowed = ['hero', 'about', 'education', 'experience', 'certifications', 'projects', 'chronicles', 'gridMotion', 'banner', 'contact'];
  const { section } = req.params;
  if (!allowed.includes(section)) return res.status(400).json({ message: 'Unknown section' });

  try {
    const content = await getContent();
    content[section] = { ...content[section].toObject?.() ?? content[section], ...req.body };
    await content.save();
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PATCH /api/content/:section/visibility - PROTECTED. Toggle show/hide for
// education, experience, certifications, projects, chronicles
router.patch('/:section/visibility', auth, async (req, res) => {
  const toggleable = ['education', 'experience', 'certifications', 'projects', 'chronicles', 'gridMotion'];
  const { section } = req.params;
  const { visible } = req.body;
  if (!toggleable.includes(section)) return res.status(400).json({ message: 'Section cannot be toggled' });

  try {
    const content = await getContent();
    content[section].visible = !!visible;
    await content.save();
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
