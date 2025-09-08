<template>
  <div class="pageborder">
    <div class="pageback">
      <div class="pageinpadding" :style="{ backgroundImage: `url(${backgroundImage})`, backgroundPosition: 'center', backgroundSize: 'cover'}">
        <div>
          <div v-for="machine, index1 in machinelist" class="allbutton">
            <div v-for="item, index in actionlist[machine.id]">
              <!-- <el-card @click="doaction(item, machine)" class="onebutton">
                <template #header>
                  <div class="card-header"> -->
                    <img class="shadow" :src="item.iconurl" @click="clickpic(item, machine)"></img>
                    <!-- <div class="actionname">{{item.name}}</div>
                  </div>
                </template>
                <el-image style="width: 100%" :src="item ? item.imageurl : ''" fit="contain" />
              </el-card> -->
            </div>
            <el-divider v-if="index1 == machine.length - 1"/>
          </div>
        </div>
      </div>
    </div>
    <d-modal v-model="openconfirm">
      <template #header>
        <d-modal-header>
          <span>请确认</span>
        </d-modal-header>
      </template>
      <div>{{ confirmtext }}</div>
      <template #footer>
        <d-modal-footer style="text-align: right; padding-right: 20px;">
          <d-button @click="openconfirm = false">取消</d-button>
          <d-button @click="doaction">确认</d-button>
        </d-modal-footer>
      </template>
    </d-modal>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useTitle } from '@vueuse/core'

const route = useRoute();

const actionlist = ref([]);
const machinelist = ref([]);
const backgroundImage = ref('');

onMounted(async () => {
  const token = route.query ? route.query.token : '';
  
  // 创建响应式标题对象（默认读取当前文档标题）
  // const pageTitle = useTitle()

  // 三秒后自动更新标题
  // setTimeout(() => {
  //   pageTitle.value = '用户控制台 (3条新消息)'
  // }, 3000)

  var addr = 'http://39.108.167.152:8481/api'
  const result = await axios.post(
    addr + '/getactions', 
    {},
    {
      headers: {
        'token': token,
      }
    }
  );
  console.log(result);
  actionlist.value = result.data.actions;
  machinelist.value = result.data.machines;
  backgroundImage.value = result.data.activity.imageurl;
})

const openconfirm = ref(false);
const confirmtext = ref('');
const confirmaction = ref({});
const confirmmachine = ref({});

const clickpic = (action, machine) => {
  confirmtext.value = '确定要运行动作：' + action.name + '吗？';
  confirmaction.value = action;
  confirmmachine.value = machine;
  openconfirm.value = true;
}

const doaction = () => {
  openconfirm.value = false;
  // const sure = await new Promise((resol
  // ve, reject) => {
  //   ElMessageBox({
  //     title: "提示",
  //     dangerouslyUseHTMLString: true,
  //     message: '请确认运行动作：' + action.name,
  //     showCancelButton: true,
  //     confirmButtonText: "确定",
  //     cancelButtonText: "取消",
  //     beforeClose: (action, instance, done) => {
  //       if (action === "confirm") {
  //         done();
  //         resolve(true);
  //       } else {
  //         done();
  //         resolve(false);
  //       }
  //     }
  //   }).catch(() => {
  //     resolve(false);
  //   });
  // });
  // if (!sure) return;
  console.log('1111')
  console.log("http://" + confirmmachine.value.ip + "/public/task");
  console.log(confirmaction.value.actionid);
  if(confirmaction.value.type == 0){
    axios.post("http://" + confirmmachine.value.ip + "/public/task", {
      "scene_id": confirmaction.value.actionid,
      "execute_count": 0,
      "clear": 1
    })
  }
  // const config = {
  //   withCredentials: true,
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // };
  // Cookies.set("-goahead-session-", "::webs.session::fed63450554401e7662d87c3c8c35d9b");
  // console.log(Cookies.get('-goahead-session-'));
  // axios.post('http://192.168.58.2/action/set', {
  //   cmd: 105,
  //   data: {name: "123.lua"}
  // }, config)
  //   .then(response => {
  //     console.log(response.data);
  //   })
  //   .catch(error => {
  //     console.error(error);
  //   });
  // axios.post('http://192.168.58.2/action/set', {
  //   cmd: 1001,
  //   data: {pgline: "Lin(pos-left_2,20,-1,0,0)"}
  // }, config)
  //   .then(response => {
  //     console.log(response.data);
  //   })
  //   .catch(error => {
  //     console.error(error);
  //   });
}
</script>

<style scoped>
:deep(.el-card__header){
  padding-bottom: 10px;
}
:deep(.el-card__body){
  padding: 0;
}
.actionname{
  display: block;
  position: absolute;
  margin-top: -40px;
  margin-left: 60px;
}
.onebutton{
  width: 188px;
}
.shadow{
  box-shadow: 2px 2px 3px 1px #0000009f;
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.allbutton{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}
</style>
