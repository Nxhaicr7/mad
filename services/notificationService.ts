import { firestore } from "@/config/firebase";
import { NotificationType, ResponseType } from "@/types";
import { collection, doc, setDoc } from "firebase/firestore";

export const createNotification = async (
  data: Omit<NotificationType, "id" | "created"> & {
    created?: Date;
  },
): Promise<ResponseType> => {
  try {
    if (!data.uid || !data.title || !data.description || !data.type) {
      return { success: false, msg: "Invalid notification data" };
    }

    const notificationRef = doc(collection(firestore, "notification"));

    const payload: NotificationType = {
      uid: data.uid,
      title: data.title,
      description: data.description,
      type: data.type,
      created: data.created || new Date(),
    };

    await setDoc(notificationRef, payload, { merge: true });

    return {
      success: true,
      data: {
        id: notificationRef.id,
        ...payload,
      },
    };
  } catch (err: any) {
    console.log("error creating notification: ", err);
    return { success: false, msg: err.message };
  }
};
