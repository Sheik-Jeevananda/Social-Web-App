const Notification = require("../models/Notification");


const createNotification = async (recipient, sender, type, post = null) => {
    try {
    // Dont create notification if sender is recipient
    if (recipient.toString() === sender.toString()) return;

    await Notification.create({
      recipient,
      sender,
      type,
      post: post,
    });
  } catch (err) {
    console.log("Notification error:", err.message);
  }
}

module.exports = createNotification;
