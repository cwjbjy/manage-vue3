import WebsocketClass from './ws_v2';
import { ElMessage } from 'element-plus';
let WSInstance = null;

/**
 * 聊天室服务接口
 */

export default {
  joinMeeting({ params = '', closeCallBack = null } = {}) {
    WSInstance = new WebsocketClass({ closeCallBack });
    WSInstance.connect(params)
      .then(() => {
        console.log('connect success');
        ElMessage({
          message: '连接成功',
          type: 'success',
        });
      })
      .catch(() => {
        ElMessage({
          message: '网络错误，请稍后重试',
          type: 'error',
        });
      });
  },
  sendMessage(params) {
    WSInstance.sendMessage({ msg: params });
  },
  close(params) {
    WSInstance.close(params).then(() => {
      ElMessage({
        message: '关闭成功',
        type: 'success',
      });
    });
  },
};
