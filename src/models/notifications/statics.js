import httpStatus from 'http-status';
import mongoose from 'mongoose';
import APIError from '../../errors/APIError';
import modelNames from '../../utils/constants';
import { paginationPipeline } from '../../utils';

export async function getNewNotification(_id) {
  const Notification = this.model(modelNames.notification);
  try {
    const notification = await Notification.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(_id),
          isRead: false,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id,
          unreadCount: { $sum: 1 },
          latestNotification: { $first: '$$ROOT' },
        },
      },
    ]);

    return notification.length > 0 ? notification[0] : { unreadCount: 0 };
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}

export async function getNotifications(_id, page = 1, limit = 10) {
  const Notification = this.model(modelNames.notification);
  try {
    const notifications = await Notification.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(_id),
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      ...paginationPipeline(page, limit),
    ]);

    return notifications[0];
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}

export async function markAsRead(userId, notificationId) {
  const notificationModel = this.model(modelNames.notification);
  try {
    const message = await notificationModel.updateOne(
      {
        _id: notificationId,
        userId,
        isRead: false,
      },
      { isRead: true }
    );

    return message;
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}

export async function markAllAsRead(userId) {
  try {
    const message = await this.updateMany(
      {
        userId,
        isRead: false,
      },
      { isRead: true }
    );

    return message;
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}

export async function deleteNotification(userId, notificationId) {
  const notificationModel = this.model(modelNames.notification);
  try {
    const notification = await notificationModel.deleteOne({
      _id: notificationId,
      userId,
    });

    return notification;
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}

export async function deleteAllNotification(userId) {
  const notificationModel = this.model(modelNames.notification);
  try {
    const message = await notificationModel.deleteMany({ userId });

    return message;
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}

export async function createNewNotification(data) {
  const Notification = this.model(modelNames.notification);
  try {
    const notification = await Notification.create(data);

    return notification;
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}
