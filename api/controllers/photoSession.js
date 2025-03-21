const mongoose = require('mongoose');
const PhotoSession = mongoose.model('PhotoSessions');
const Section = mongoose.model('Sections');
const Category = mongoose.model('Categories');
const messages = require('../../config/messages');

async function createSection(section, photoSessionId) {
  const newSection = new Section(section);
  const savedSection = await newSection.save();

  await PhotoSession.findByIdAndUpdate(
    photoSessionId,
    { $push: { 'sections': savedSection._id } },
    { new: true }
  );

  return savedSection;
}

exports.getAll = async (req, res) => {
  try {
    const photoSessions = await PhotoSession.find({}).populate('sections');
    res.status(200).json(photoSessions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { sections = [] } = req.body;
    delete req.body.sections;

    const newPhotoSession = new PhotoSession(req.body);
    const photoSession = await newPhotoSession.save();

    await Category.findByIdAndUpdate(
      photoSession.category,
      { $push: { 'photoSessions': photoSession._id } },
      { new: true }
    );

    // Create all sections in parallel
    const sectionPromises = sections.map(section =>
      createSection(section, photoSession._id)
    );

    await Promise.all(sectionPromises);

    const populatedSession = await PhotoSession.findById(photoSession._id).populate('sections');
    res.status(201).json(populatedSession);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const photoSession = await PhotoSession.findById(req.params.id).populate('sections');

    if (!photoSession) {
      return res.status(404).json({
        message: messages.photoSession.api.photoSessionNotFound,
      });
    }

    res.status(200).json(photoSession);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { sections = [] } = req.body;
    delete req.body.sections;

    // Get the current photo session
    const currentPhotoSession = await PhotoSession.findById(req.params.id).populate('sections');

    if (!currentPhotoSession) {
      return res.status(404).json({
        message: messages.photoSession.api.photoSessionNotFound,
      });
    }

    // Handle category change if needed
    if (req.body.category && req.body.category !== currentPhotoSession.category.toString()) {
      // Remove photo session from old category
      await Category.findByIdAndUpdate(
        currentPhotoSession.category,
        { $pull: { 'photoSessions': currentPhotoSession._id } }
      );

      // Add photo session to new category
      await Category.findByIdAndUpdate(
        req.body.category,
        { $push: { 'photoSessions': currentPhotoSession._id } }
      );
    }

    // Update the basic photo session info
    const updatedPhotoSession = await PhotoSession.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Handle sections - remove existing sections
    const sectionIds = currentPhotoSession.sections.map(section => section._id);
    await Section.deleteMany({ _id: { $in: sectionIds } });

    // Reset the sections array
    await PhotoSession.findByIdAndUpdate(
      req.params.id,
      { $set: { sections: [] } }
    );

    // Create all the new sections
    const sectionPromises = sections.map(section =>
      createSection(section, updatedPhotoSession._id)
    );

    await Promise.all(sectionPromises);

    // Return the updated photo session with populated sections
    const populatedSession = await PhotoSession.findById(updatedPhotoSession._id).populate('sections');
    res.status(200).json(populatedSession);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await PhotoSession.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: messages.photoSession.api.photoSessionNotFound,
      });
    }

    res.status(200).json({ message: messages.photoSession.api.photoSessionDeleted });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};