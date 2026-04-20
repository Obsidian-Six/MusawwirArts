import Category from '../Models/CategoryModel.js'; // Use import and add .js
import slugify from 'slugify';

// 1. Create Category
export const createCategory = async (req, res) => {
  try {
    const { name, parent, description, seo } = req.body;
    const category = new Category({
      name,
      slug: slugify(name, { lower: true }), // slugify options for cleaner URLs
      parent: parent || null,
      description,
      seo
    });
    await category.save();
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 2. Get All Categories (Simple List)
// 2. Get All Categories (Simple List with Populated Parent)
export const getCategories = async (req, res) => {
  try {
    // Populate 'parent' to get its 'name' and 'slug'
    const categories = await Category.find()
      .populate('parent', 'name slug')
      .sort({ name: 1 });

    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Get Category Tree (Nested Hierarchy)
export const getCategoryTree = async (req, res) => {
  try {
    const categories = await Category.find().lean();

    const buildTree = (parentId = null) => {
      return categories
        .filter(cat => String(cat.parent) === String(parentId) || (parentId === null && !cat.parent))
        .map(cat => ({
          ...cat,
          children: buildTree(cat._id)
        }));
    };

    const categoryTree = buildTree();
    res.status(200).json({ success: true, data: categoryTree });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Update Category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (name) {
      req.body.slug = slugify(name, { lower: true });
    }

    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!category) return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 5. Delete Category (Safety Logic)
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const hasChildren = await Category.findOne({ parent: id });
    if (hasChildren) {
      return res.status(400).json({
        message: "Cannot delete category with sub-categories. Move children first."
      });
    }

    await Category.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Category removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};