import httpStatus from 'http-status';
import Notification from '../models/notifications';

export const getNewNotificationController = async (req, res, next) => {
  const { id } = req.query;
  res.writeHead(httpStatus.OK, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  const sendNotification = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const notification = await Notification.getNewNotification(id);
    const interval = setInterval(async () => {
      const newNotification = await Notification.getNewNotification(id);
      if (newNotification.unreadCount > notification.unreadCount) {
        sendNotification(newNotification);
      } else {
        res.write(`data: ${JSON.stringify(newNotification.unreadCount)}\n\n`);
      }
    }, 10000);

    req.on('close', () => {
      clearInterval(interval);
    });
  } catch (error) {
    next(error);
  }
};

export const getNotificationController = async (req, res, next) => {
  const { _id } = req.user;
  const { page, limit } = req.query;

  try {
    const notification = await Notification.getNotifications(_id, page, limit);
    res.status(httpStatus.OK).json(notification);
  } catch (error) {
    next(error);
  }
};

export const markAsReadController = async (req, res, next) => {
  const { _id } = req.user;
  const { notificationId } = req.params;

  try {
    const message = await Notification.markAsRead(_id, notificationId);

    res.status(httpStatus.OK).json(message);
  } catch (error) {
    next(error);
  }
};

export const markAllAsReadController = async (req, res, next) => {
  const { _id } = req.user;

  try {
    const message = await Notification.markAllAsRead(_id);

    res.status(httpStatus.OK).json(message);
  } catch (error) {
    next(error);
  }
};

export const deleteNotificationController = async (req, res, next) => {
  const { _id } = req.user;
  const { notificationId } = req.params;

  try {
    const message = await Notification.deleteNotification(_id, notificationId);

    res.status(httpStatus.OK).json(message);
  } catch (error) {
    next(error);
  }
};

export const deleteAllNotificationController = async (req, res, next) => {
  const { _id } = req.user;

  try {
    const message = await Notification.deleteAllNotification(_id);
    res.status(httpStatus.OK).json(message);
  } catch (error) {
    next(error);
  }
};

export const createNewNotificationController = async (req, res, next) => {
  const { _id } = req.user;
  const { title, message, type } = req.body;

  const data = {
    userId: _id,
    title,
    message,
    type,
  };

  try {
    const notification = await Notification.createNewNotification(data);
    res.status(httpStatus.CREATED).json(notification);
  } catch (error) {
    next(error);
  }
};
