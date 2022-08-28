<template>
  <section>
    <el-card shadow="hover">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-button type="primary" @click="connect" :disabled="connectFlag">连接</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="close" :disabled="closeFlag">关闭</el-button>
        </el-form-item>
        <el-form-item label>
          <el-button type="primary" @click="explainDialog = true">使用说明</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dialogVisible = true">查看效果图</el-button>
        </el-form-item>
      </el-form>
      <div class="chat">
        <div class="chat-content" ref="infoListContent">
          <div>
            <dl
              v-for="(item, index) in historyInfos"
              :key="index"
              :class="[item.name == user_name ? 'info-right' : 'info-left']"
            >
              <dt>
                <img v-if="item.image" :src="item.image" class="headPortrait" alt="图片加载失败" />
                <img v-else src="@/assets/images/chartRoom/root.png" class="headPortrait" />
              </dt>
              <dd>
                <div class="txt-name">{{ item.name }}</div>
                <div>
                  <span class="txt-content">{{ item.text }}</span>
                </div>
              </dd>
            </dl>
          </div>
        </div>
        <div class="chart-button">
          <el-input v-model="msg" placeholder="请输入" center>
            <template #append>
              <el-button type="primary" @click="send">发送</el-button>
            </template>
          </el-input>
        </div>
      </div>
    </el-card>
    <el-dialog title="使用说明" center v-model="explainDialog">
      <div class="describle">
        <ul>
          <li>1.点击连接；</li>
          <li>2.使用另一个浏览器，登录另一个账户，点击连接；或者使用另一台电脑登录另一个账户</li>
          <li>3.输入消息，点击发送或者回车发送；</li>
        </ul>
      </div>
    </el-dialog>
    <el-dialog title="效果图" center v-model="dialogVisible" width="90%" top="2vh">
      <img src="@/assets/images/chartRoom/chatShowV2.0.png" alt="加载失败" />
    </el-dialog>
  </section>
</template>

<script>
import { reactive, toRefs } from 'vue';
import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/store/user';
import insService from '@/service/websocket';
import { bus } from '@/constants';

export default {
  name: 'ChatRoom',
  activated() {
    let that = this;
    document.addEventListener('keydown', that.keyDown);
    window.eventBus.$on(bus.updateWs, (value) => {
      this.historyInfos.push(value);
      this.$nextTick(() => {
        this.$refs.infoListContent.scrollTop = 9999999;
      });
    });
  },
  deactivated() {
    window.eventBus.$off(bus.updateWs);
    let that = this;
    document.removeEventListener('keydown', that.keyDown);
  },
  setup() {
    const userStore = useUserStore();
    const { user_name, imageUrl } = storeToRefs(userStore);
    const state = reactive({
      systePrompt: '',
      msg: '',
      connectFlag: false,
      closeFlag: true,
      mess: null,
      show: false,
      dialogVisible: false,
      explainDialog: false,
      historyInfos: [],
    });
    const closeCallBack = () => {
      state.historyInfos = [];
    };
    const methods = reactive({
      connect: () => {
        let user = {
          type: 'setName',
          name: user_name.value,
          image: imageUrl.value,
        };
        insService.joinMeeting({
          params: user,
          closeCallBack,
        });
        state.connectFlag = true;
        state.closeFlag = false;
      },
      close: () => {
        let close = {
          type: 'close',
        };
        insService.close(close);
        state.connectFlag = false;
        state.closeFlag = true;
      },
      send: () => {
        if (!state.connectFlag) {
          ElMessage({
            message: '请先连接',
            type: 'error',
          });
        }
        if (state.msg == '') return;
        let message = {
          type: 'chat',
          text: state.msg,
        };
        insService.sendMessage(message);
        state.msg = '';
      },
    });
    const keyDown = () => {
      let key = window.event.keyCode;
      if (key === 13) {
        methods.send();
      }
    };
    return { ...toRefs(state), ...toRefs(methods), keyDown, user_name };
  },
};
</script>

<style lang="scss" scoped>
.describle {
  margin: 15px 0;
}
.chat {
  border: 1px solid #000;
  box-sizing: border-box;
  width: 353px;
  height: 540px;
  position: relative;
}
.chat-content {
  height: 480px;
  overflow-y: auto;
  padding: 10px;
  .txt-name {
    margin-bottom: 10px;
  }
  .txt-content {
    word-break: break-all;
    background-color: #0083ff;
    border-radius: 3px;
    padding: 5px 12px;
    color: #fff;
  }
  .info-right {
    text-align: right;
    padding-right: 47px;
    dt {
      right: 0;
      @extend %main_centerRight;
    }
  }
  .info-left {
    text-align: left;
    padding-left: 47px;
    dt {
      left: 0;
      @extend %main_centerLeft;
    }
  }
  dl {
    position: relative;
    margin-bottom: 20px;
    dt {
      width: 60px;
      height: 60px;
      position: absolute;
      top: 0;
    }
  }
}
.headPortrait {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
img {
  width: 100%;
}
</style>

<style lang="scss">
.chart-button {
  width: 100%;
  position: absolute;
  bottom: 0;
}
.chatDialog {
  .el-dialog__body {
    height: 76vh;
    overflow: auto;
  }
}
.el-input-group__append {
  border-left: 0;
  border-radius: 0;
}
</style>
