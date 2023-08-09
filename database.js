import mysql from 'mysql2';

mysql.Connection.prototype.getUserById = async function (userId) {
    const query = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await this.promise().query(query, [userId]);
    return rows[0];
};

mysql.Connection.prototype.getAllUsers = async function () {
    const query = 'SELECT * FROM users';
    const [rows] = await this.promise().query(query);
    return rows;
};

mysql.Connection.prototype.getUserByEmail = async function (email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await this.promise().query(query, [email]);
    return rows[0];
};

mysql.Connection.prototype.createUser = async function ({ nick, secondName, pass, email }) {
    const query = 'INSERT INTO users (nick, secondName, pass, email) VALUES (?, ?, ?, ?)';
    const [result] = await this.promise().query(query, [nick, secondName, pass, email]);
    return result;
};

mysql.Connection.prototype.updateUser = async function ({ id, email, nick, secondName }) {
    const query = 'UPDATE users SET email = ?, nick = ?, secondName = ? WHERE id = ?';
    const [result] = await this.promise().query(query, [email, nick, secondName, id]);
    return result;
};

mysql.Connection.prototype.deleteUsers = async function (emails) {
    const query = 'DELETE FROM users WHERE email IN (?)';
    const [result] = await this.promise().query(query, [emails]);
    return result;
};

mysql.Connection.prototype.changeStatus = async function (emails) {
    const query = `UPDATE users SET blocked = !blocked WHERE email IN (?)`;
    const [result] = await this.promise().query(query, [emails]);
    return result;
};

mysql.Connection.prototype.setOffline = async function (email) {
    const query = 'UPDATE users SET stat = "offline" WHERE email = ?';
    const [result] = await this.promise().query(query, [email]);
    return result;
};

mysql.Connection.prototype.setOnline = async function (email) {
    const query = "UPDATE users SET stat = 'online', last_login = NOW() WHERE email = ?";
    const [result] = await this.promise().query(query, [email]);
    return result;
};

const db = mysql.createConnection({
    host: 'bpraeuanqfrowpekyhan-mysql.services.clever-cloud.com',
    port: 3306,
    user: 'ub9fjvzh3lcs5zil',
    password: 'dZYtz9DfdbGXF3sBo5MQ',
    database: 'bpraeuanqfrowpekyhan'
});

export default db;
