const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll ({
      attributes: ["id", "tag_name"],
      include: [
        {
          model: Product,
          attributes: ["id", "product_name", "price", "stock", "category_id"],
          through: ProductTag
        },
      ],
    });
    if (!tagData) {
      res.status(404).json({ message: 'No tag with this id!' });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const singleTag = await Tag.findByPk(req.params.id, {
      attributes: ["id", "tag_name"],
      include: [
        {
          model: Product,
          attributes: ["id", "product_name", "price", "stock", "category_id"],
          through: ProductTag
        },
      ],
    });
    if (!singleTag) {
      res.status(404).json({ message: 'No tag with this id!' });
      return;
    }
    res.status(200).json(singleTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const newTag = await Tag.create(req.body);
    if (!newTag) {
      res.status(404).json({ message: 'Please enter a tag' });
      return;
    }
    res.status(200).json(newTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tagToUpdate = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!tagToUpdate[0]) {
      res.status(404).json({ message: 'No tag with this id!' });
      return;
    }
    res.status(200).json(tagToUpdate);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  const tagToDelete = await Tag.findByPk(req.params.id)
  Tag.destroy ({
    where: {
      id: req.params.id,
    },
  })
  .then(() => {
    res.json(`Tag has been removed`)
  })
  .catch((err) => {
    res.json(err);
  })
});

module.exports = router;
