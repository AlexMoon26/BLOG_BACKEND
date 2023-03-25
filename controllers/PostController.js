import PostModel from "../models/Post.js";

export const getLastTags = async (req, res) => {
	try {
    const posts = await PostModel.find().limit(3).exec();

		const tags = posts.map(obj => obj.tags).flat().slice(0, 3);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
}

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').sort({createdAt:-1}).exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate({_id: postId}, {$inc: { viewsCount: 1 }},{new: true}).populate('user').exec()
		.then((data) => {
			if(!data) {
				return res.status(404).json({
					message: "Такой статьи не существует",
				});
			}
			return res.json(data);
		}).catch((err) => {
			return res.status(404).json({
					message: "Такой статьи не существует",
				});
		});

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статью",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

		PostModel.findOneAndDelete({
			_id: postId,
		}).then((data) => {
			if(!data) {
				return res.status(404).json({
					message: "Такой статьи не существует",
				});
			}
			return res.json({
				message: `Статья '${data.title}' была удалена`
			});


		}).catch((err) => {
			return res.status(404).json({
					message: "Такой статьи не существует",
				});
		});
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Внутренняя ошибка при удалении статьи",
    });
  }
};

export const create = async (req, res) => {
  try {
    
		const existingPost = await PostModel.findOne({title: req.body.title})
		if(existingPost){
			return res.status(400).json({
				message: "Пост с таким названием уже существует",
			});
		}
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать статью",
    });
  }
};

export const update = async (req, res) => {
	try {
		const postId = req.params.id;

		await PostModel.updateOne(
			{
				_id: postId
			},
			{
				title: req.body.title,
				text: req.body.text,
				imageUrl: req.body.imageUrl,
				user: req.userId,
				tags: req.body.tags,
			});

			res.json({
				success: true
			})

	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось обновить статью',
		})
	}
};
