class User{
    constructor(id, country, avatar, age, name, score = undefined){
        this.id = `${id}`;
        this.country = country;
        this.avatar = avatar;
        this.age = age;
        this.name = name;
        this.score = score;
    }
}

module.exports = User;
