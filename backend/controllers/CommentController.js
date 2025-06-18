import CommentModel from "../models/Comment.js";

export const create = async (req, res) => {
    try {
        const { text, post } = req.body; // Получаем текст комментария и ID поста из тела запроса
        const user = req.userId;          // Получаем ID пользователя из middleware checkAuth

        const doc = new CommentModel({
            text: text,
            user: user,
            post: post,
        });

        const comment = await doc.save();

        res.json(comment);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Не удалось создать комментарий",
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const postId = req.params.postId; // Получаем ID поста из параметров URL

        const comments = await CommentModel.find({ post: postId }) // Ищем комментарии, связанные с данным postID
            .populate('user') // Заполняем информацию о пользователе
            .exec();

        res.json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Не удалось получить комментарии",
        });
    }
};