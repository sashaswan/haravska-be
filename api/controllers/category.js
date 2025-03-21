const mongoose = require('mongoose');
const Category = mongoose.model('Categories');
const messages = require('../../config/messages');

exports.getAll = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    const category = await newCategory.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const query = req.params.query;
    // First try to find by title
    let category = await Category.findOne({ title: query }).populate('photoSessions');

    // If not found by title, try to find by ID
    if (!category) {
      try {
        category = await Category.findById(query).populate('photoSessions');
      } catch (idErr) {
        // Invalid ID format, will be handled by the next check
      }
    }

    if (!category) {
      return res.status(404).json({
        message: messages.category.api.categoryNotFound,
      });
    }

    res.status(200).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        message: messages.category.api.categoryNotFound,
      });
    }

    res.status(200).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await Category.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: messages.category.api.categoryNotFound,
      });
    }

    res.status(200).json({ message: messages.category.api.categoryDeleted });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};