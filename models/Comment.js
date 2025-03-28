const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('mysql://username:password@localhost:3306/database_name');

// 定义评论模型
const Comment = sequelize.define('Comment', {
  userAddr: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'comments',
      key: 'id',
    },
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  reports: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamps: true,
});

module.exports = Comment;
