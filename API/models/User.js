class User {
    constructor(db) {
        this.db = db;
    }

    // создание пользователя
    async create(userData) {
        const [id] = await this.db('users').insert(userData);
        return id;
    }

    // поиск по id
    async findById(userId) {
        // return await this.db('users').where({ id: userId }).first();

        const user = await this.db('users').where({ id: userId }).first();
        if (!user) return null;

        const postLikes = await this.db('likes')
            .join('posts', 'likes.post_id', 'posts.id')
            .where('posts.author_id', userId)
            .select('likes.type');

        const commentLikes = await this.db('likes')
            .join('comments', 'likes.comment_id', 'comments.id')
            .where('comments.author_id', userId)
            .select('likes.type');

        let likes = 0;
        let dislikes = 0;

        [...postLikes, ...commentLikes].forEach(like => {
            if (like.type === 'like') likes++;
            else if (like.type === 'dislike') dislikes++;
        });

        user.rating = likes - dislikes;

        return user;
    }

    // поиск по эмейлу или логину
    async findByEmailOrLogin(emailOrLogin) {
        return await this.db('users').where({ email: emailOrLogin }).orWhere('login', emailOrLogin).first();
    }

    // поиск по эмейл
    async findByEmail(userEmail) {
        return await this.db('users').where({ email: userEmail }).first();
    }

    // поиск по логину
    async findByLogin(userLogin) {
        return await this.db('users').where({ login: userLogin }).first();
    }

    // обновить пароль
    async updatePassword(userId, newHashedPassword) {
        return await this.db('users')
            .where({ id: userId })
            .update({ password_hash: newHashedPassword, updated_at: new Date() });
    }

    // получить всех пользователей
    async selectAll() {
        return await this.db('users').select('*');
    }

    // обновить аватар
    async updateAvatar(userId, avatarPath) {
        return await this.db('users').where({ id: userId }).update({ profile_picture: avatarPath });
    }

    // обновить по id
    async updateById(userId, updates) {
        await this.db('users')
            .where({ id: userId })
            .update({
                ...updates,
                updated_at: new Date()
            });

        return this.findById(userId);
    }

    // удалить по id
    async deleteById(userId) {
        const deletedCount = await this.db('users').where({ id: userId }).del();
        return deletedCount;
    }

    // обновить is_email_confirmed
    async updateIsEmailConfirmed(userId, value = true) {
        return await this.db('users')
            .where({ id: userId })
            .update({
                is_email_confirmed: value,
                updated_at: new Date()
            });
    }

    // обновить пользователя
    async update(id, fields) {
        if (!id || !fields || Object.keys(fields).length === 0) {
            throw new Error("User id and fields to update are required");
        }

        await this.db('users')
            .where({ id })
            .update(fields);

        return await this.findById(id);
    }
}

export default User;