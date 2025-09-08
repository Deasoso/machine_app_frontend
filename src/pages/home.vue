<template>
  <div class="pageborder">
    <div class="pageback">
      <div class="pageinpadding" :style="{ backgroundImage: `url(${backgroundImage})`, backgroundPosition: 'center', backgroundSize: 'cover', paddingTop: topposition + 'px'}">
        <div>
          <div v-for="machine, index1 in machinelist" class="allbutton">
            <el-row class="actiontop">
              <el-col :span="12" style="font-size: 16px;">
                {{ machine.name }}
              </el-col>
              <el-col :span="12" style="text-align: right;font-size: 16px;">
                <div v-if="machinestatus[activemachine] == 'free'" style="color: #67C23A">
                  ● 空闲中
                </div>
                <div v-else-if="machinestatus[activemachine] == 'working'" style="color: #E6A23C">
                  ● 运行中
                </div>
                <div v-else style="color: #F56C6C">
                  ● 已停止
                </div>
              </el-col>
            </el-row>
            <div v-for="item, index in actionlist[machine.id]" :style="{flex: '0 1 calc(' + (100 / actionperrow) + '% - 5px', textAlign: 'center'}">
              <!-- <el-card @click="doaction(item, machine)" class="onebutton">
                <template #header>
                  <div class="card-header"> -->
                    <img class="shadow" :src="item.iconurl" @click="clickpic(item, machine)"></img>
                    <div :style="{fontFamily: fontname, fontSize: fontsize + 'px', fontWeight: fontweight, width: '100%'}"class="actionname">{{item.name}}</div>
                  <!-- </div>
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
    <d-modal v-model="showlist">
      <template #header>
        <d-modal-header>
          <span>任务列表</span>
        </d-modal-header>
      </template>
      <div class="listout">
        <div class="machinestatu">
          <el-tabs v-model="activemachine">
            <el-tab-pane v-for="machine, index3 in machinelist" :label="machine.name" :name="machine.id">
              <div v-for="task, index2 in tasklist[machine.id]" class="listin">
                <el-row>
                  <el-col :span="12">
                    任务1
                  </el-col>
                  <el-col :span="11" style="text-align: right;">
                    <div v-if="index2 == 0" style="color: #E6A23C">
                      ● 运行中
                    </div>
                    <div v-else style="color: #67C23A">
                      ● 队列中
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <template #footer>
        <d-modal-footer style="text-align: right; padding-right: 20px;">
          <d-button @click="showlist = false">确认</d-button>
        </d-modal-footer>
      </template>
    </d-modal>
    <div class="addbutton" @click="showlist = true">
      <d-icon name="list-view" size="32px" class="righticon"></d-icon>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useTitle, useFavicon } from '@vueuse/core'

const route = useRoute();

const actionlist = ref([]);
const machinelist = ref([]);
const backgroundImage = ref('');

const topposition = ref(0);
const actionperrow = ref(6);
const fontsize = ref(16);
const fontweight = ref(400);
const fontname = ref('');

const machinestatus = ref([]);
const tasklist = ref({1: [1,1,1,1,1,1,1,1]});
const showlist = ref(false);

const activemachine = ref(0);

onMounted(async () => {
  const token = route.query ? route.query.token : '';
  
  // 创建响应式标题对象（默认读取当前文档标题）
  const pageTitle = useTitle();
  const pageFavicon = useFavicon();

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
  activemachine.value = result.data.machines[0].id;
  console.log(activemachine.value);
  backgroundImage.value = route.query.type == 0 ? result.data.activity.imageurl : result.data.activity.imageurl2;
  topposition.value = result.data.activity.yposition;
  pageTitle.value = result.data.activity.name;
  if(result.data.activity.iconurl) pageFavicon.value = result.data.activity.iconurl;
  if(result.data.activity.actionperrow) actionperrow.value = result.data.activity.actionperrow;
  if(result.data.activity.fontsize) fontsize.value = result.data.activity.fontsize;
  if(result.data.activity.fontweight) fontweight.value = result.data.activity.fontweight;
  if(result.data.activity.fontname) fontname.value = result.data.activity.fontname;
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
.onebutton{
  width: 188px;
}
.actionname{
  text-align: center;
  margin-top: 2px;
  font-size: 16px;
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
  padding-top: 44px;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 8px;
}
.addbutton{
  position: fixed;
  right: 50px;
  bottom: 50px;
  width: 64px;
  height: 64px;
  background-color: #fff;
  box-shadow: #000000;
  box-shadow: 3px 3px 5px #0000003f;
  border-radius: 50%;
}
.righticon{
  position: absolute;
  margin-top: 16px;
  margin-left: 16px;
}
.listout{
  height: 200px;
  overflow: scroll;
}
.listin{
  height: 30px;
}
.actiontop{
  position: absolute;
  width: calc(100% - 30px);
  padding: 6px 12px;
  margin-top: -44px;
  border-radius: 10px;
  background-color: #fff;
}
</style>
