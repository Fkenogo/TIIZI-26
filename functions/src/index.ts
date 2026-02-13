import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();

export const notifyAdminsOnJoinRequest = functions.firestore
  .document('groups/{groupId}/joinRequests/{requestId}')
  .onCreate(async (snap, context) => {
    const { groupId } = context.params;
    const request = snap.data() as {
      userName?: string;
      note?: string;
    };

    const tokensSnap = await admin.firestore()
      .collection('groups')
      .doc(groupId)
      .collection('adminTokens')
      .get();

    const tokens = tokensSnap.docs
      .map((doc) => doc.get('token'))
      .filter(Boolean);

    if (tokens.length === 0) {
      return null;
    }

    const payload = {
      notification: {
        title: 'New Join Request',
        body: `${request.userName || 'Someone'} requested to join your group.`
      },
      data: {
        groupId
      }
    };

    await admin.messaging().sendToDevice(tokens, payload);
    return null;
  });
