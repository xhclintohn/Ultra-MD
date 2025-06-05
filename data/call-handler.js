import config from '../config.cjs';

const Callupdate = async (json, sock) => {
   for (const id of json) {
      if (id.status === 'offer' && config.REJECT_CALL ) {
         let msg = await sock.sendMessage(id.from, {
            text: `> Call rejected automatically! Please don't call without permission⚠️`,
            mentions: [id.from],
         });
         await sock.rejectCall(id.id, id.from);
      }
   }
};

export default Callupdate;
