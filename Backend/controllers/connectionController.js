const { Connection } = require('../models/connection.js');
const Post = require('../models/post.js');
const { createNotification } = require('../utils/notification.js');



const sendConnectionRequest = async (req, res) => {
  try {
    const { connection_id } = req.body;
    const userId = req.user.id;


    if (userId === connection_id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot connect with yourself.'
      });
    }


    let connection = await Connection.findOne({
      where: {
        user_id: userId,
        connection_id: connection_id,
        status: 'pending',
      },
    });

    if (connection) {
      return res.status(400).json({
        success: false,
        message: 'Connection request already sent.'
      });
    }


    connection = await Connection.create({
      user_id: userId,
      connection_id,
      status: 'pending',
    });

    createNotification(connection_id, 'connection_request', `${req.user.name} sent you a connection request`);

    res.status(201).json({
      success: true,
      message: 'Connection request sent successfully', connection
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error', error
    });
  }
}


const acceptConnectionRequest = async (req, res) => {
  try {
    const connectionId = req.params.id;
    const userId = req.user.id;


    const connection = await Connection.findOne({
      where: {
        id: connectionId,
        connection_id: userId,
        status: 'pending',
      },
    });

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection request not found or already accepted.'
      });
    }


    connection.status = 'accepted';
    await connection.save();

    res.status(200).json({
      success: true,
      message: 'Connection request accepted', connection
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error', error
    });
  }
}


const rejectConnectionRequest = async (req, res) => {
  try {
    const connectionId = req.params.id;
    const userId = req.user.id;


    const connection = await Connection.findOne({
      where: {
        id: connectionId,
        connection_id: userId,
        status: 'pending',
      },
    });

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection request not found or already declined.'
      });
    }


    connection.status = 'declined';
    await connection.save();

    res.status(200).json({
      success: true,
      message: 'Connection request declined', connection
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}


const getAllAcceptedConnections = async (req, res) => {
  try {
    const userId = req.user.id;


    const connections = await Connection.findAll({
      where: {
        status: 'accepted',
        [Sequelize.Op.or]: [
          { user_id: userId },
          { connection_id: userId },
        ],
      },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'connection', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.status(200).json({
      success: true,
      message: 'Fetch all connected users',
      connections
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error', error
    });
  }
}


const getFeedController = async (req, res) => {
  try {
    const userId = req.user.id;


    const connections = await Connection.findAll({ where: { user_id: userId } });


    const posts = await Post.findAll({
      where: {
        user_id: { [Op.in]: connections.map(c => c.connection_id) },
      },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      message: 'Fetch feed successfully.',
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error', error
    });
  }
}


module.exports = {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getAllAcceptedConnections,
  getFeedController,
}