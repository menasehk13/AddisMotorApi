import * as OneSignal from 'onesignal-node';
import AppError from '../helpers/appError';
const Clients = new OneSignal.Client("a1c713b1-cbe1-4a6a-b898-6be47bc7cdeb","ZWMwODljNTctOGNkZi00OGFmLThkNjUtMzZmYzNhNDQ3NTRk")

export  async function Notification(title,message,id){
let getids = []
getids = id
console.log(getids)
    const notification = {
        headings:{
        'en':title
        },
        contents:{
            'en': message,
        },
        include_player_ids:  getids,
        template_id: 'a0cb3093-d5b9-4197-ae04-ccf44f335b2f',
    }
    
     try {
      await Clients.createNotification(notification);
    } catch (e) {
        new AppError(e.message, 404);
    }
}
export async function NotificationSingle(title,message,id){
    
    const notification = {
        headings:{
        'en':title
        },
        contents:{
            'en': message,
        },
        include_player_ids: [`${id}`],
        template_id: 'a0cb3093-d5b9-4197-ae04-ccf44f335b2f',
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
        template_id: 'a0cb3093-d5b9-4197-ae04-ccf44f335b2f',
        large_icon: ["https://robohash.org/sedaccusamusdistinctio.png?size=50x50&set=set1"]
    }
     try {
      await Clients.createNotification(notification);
    } catch (e) {
        new AppError(e.message, 404);
    }
}
