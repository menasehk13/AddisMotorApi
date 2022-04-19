import * as OneSignal from 'onesignal-node';
import AppError from '../helpers/appError';
const Clients = new OneSignal.Client("a1c713b1-cbe1-4a6a-b898-6be47bc7cdeb","ZWMwODljNTctOGNkZi00OGFmLThkNjUtMzZmYzNhNDQ3NTRk")

export  async function Notification(title,message,id){
    const notification = {
        headings:{
        'en':title
        },
        contents:{
            'en': message,
        },
        include_player_ids: [id]
    }
     try {
      await Clients.createNotification(notification);
    } catch (e) {
        new AppError(e.message, 404);
    }
}

export  async function NotificationAll(title,message){
    const notification = {
        headings:{
        'en':title
        },
        contents:{
            'en': message,
        },
        included_segments: ["Subscribed Users"],
        large_icon: ["https://robohash.org/sedaccusamusdistinctio.png?size=50x50&set=set1"]
    }
     try {
      await Clients.createNotification(notification);
    } catch (e) {
        new AppError(e.message, 404);
    }
}
