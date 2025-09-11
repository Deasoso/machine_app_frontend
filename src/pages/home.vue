<template>
  <div class="pageborder">
    <div class="pageback">
      <div class="pageinpadding" :style="{ backgroundImage: `url(${backgroundImage})`, backgroundPosition: 'center', backgroundSize: 'cover', paddingTop: topposition + 'px'}">
        <div>
          <div v-for="machine, index1 in machinelist" class="allbutton">
            <el-row class="actiontop" v-if="machinelist.length > 1">
              <el-col :span="12" style="font-size: 16px;">
                {{ machine.name }}
              </el-col>
              <el-col :span="12" style="text-align: right;font-size: 16px;">
                <div v-if="machinestatus[machine.id] == 'free'" style="color: #67C23A">
                  ● 空闲中
                </div>
                <div v-else-if="machinestatus[machine.id] == 'working'" style="color: #E6A23C">
                  ● 运行中
                </div>
                <div v-else style="color: #F56C6C">
                  ● 未连接
                </div>
              </el-col>
            </el-row>
            <div v-else class="righttopstatu">
              <div v-if="machinestatus[machinelist[0].id] == 'free'" style="color: #67C23A">
                ● 空闲中
              </div>
              <div v-else-if="machinestatus[machinelist[0].id] == 'working'" style="color: #E6A23C">
                ● 运行中
              </div>
              <div v-else style="color: #F56C6C">
                ● 未连接
              </div>
            </div>
            <div v-for="item, index in actionlist[machine.id]" :style="{flex: '0 1 calc(' + (100 / actionperrow) + '% - 5px', textAlign: 'center'}">
              <!-- <el-card @click="doaction(item, machine)" class="onebutton">
                <template #header>
                  <div class="card-header"> -->
                    <img class="shadow" :src="item.iconurl" @click="clickpic(item, machine)"></img>
                    <div :style="{fontFamily: fontname, fontSize: fontsize + 'px', fontWeight: fontweight, width: '100%', color: fontcolor}"class="actionname">{{item.name}}</div>
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
                    {{task.name}}
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
import { ElMessage } from 'element-plus'
import { serializeMethodCall } from './xml'
import x2js from 'x2js'
const xmlparser = new x2js();
const route = useRoute();

const activity = ref({});
const actionlist = ref([]);
const machinelist = ref([]);
const backgroundImage = ref('');

const topposition = ref(0);
const actionperrow = ref(6);
const fontsize = ref(16);
const fontweight = ref(400);
const fontcolor = ref('#000000');
const fontname = ref('');

const machinestatus = ref([]);
const tasklist = ref({});
const showlist = ref(false);

const activemachine = ref(0);
const issee = ref(false);

const robottaskids = ref({});
const getcookies = ref({})

onMounted(async () => {
  
  const token = route.query ? route.query.token : '';
  const token2 = route.query ? route.query.token2 : '';

  // 创建响应式标题对象（默认读取当前文档标题）
  const pageTitle = useTitle();
  const pageFavicon = useFavicon();

  var addr = 'http://39.108.167.152:8481/api'
  var result;
  if(route.query.token){
    result = await axios.post(
      addr + '/getactions', 
      {},
      {
        headers: {
          'token': token,
        }
      }
    );
    const allmachines = result.data.machines;
    const allactions = result.data.actions;
    for(const machineindex in allmachines){
      const thisallaction = result.data.actions[allmachines[machineindex].id];
      if(allmachines[machineindex].type == 0){
        setInterval(async () => {
          try{
            const bb = await axios.post("http://" + allmachines[machineindex].ip + ":3021", {
              "jsonrpc": "2.0",
              "method": "load_running_tasks",
              "params": [
                {}
              ],
              "id": 1
            })
            tasklist.value[allmachines[machineindex].id] = [];
            if(bb.data.result.tasks.length > 0){
              machinestatus.value[allmachines[machineindex].id] = 'working'
              for(const currenttaskindex in bb.data.result.tasks){
                const runningtask = bb.data.result.tasks[currenttaskindex]
                if(robottaskids.value[runningtask.event_id]){
                  var have = false;
                  for(const allactionindex in thisallaction){
                    if(thisallaction[allactionindex].actionid == robottaskids.value[runningtask.event_id]){
                      tasklist.value[allmachines[machineindex].id].push({
                        name: thisallaction[allactionindex].name
                      })
                      have = true;
                      break;
                    }
                  }
                  if(!have){
                    tasklist.value[allmachines[machineindex].id].push({
                      name: robottaskids.value[runningtask.event_id].name
                    })
                  }  
                }else{
                  tasklist.value[allmachines[machineindex].id].push({
                    name: runningtask.event_id
                  })
                }
              }
            }else{
              machinestatus.value[allmachines[machineindex].id] = 'free';
            }
          }catch(e){
            machinestatus.value[allmachines[machineindex].id] = 'stop';
            console.log(e);
            console.log('没连上');
          }
        }, 1000)
      }else if(allmachines[machineindex].type == 1){
        setInterval(async () => {
          try{
            const config = {
              headers: {
                'Content-Type': 'application/xml',
              },
            };
            const statexml = serializeMethodCall('GetProgramState', []);
            const set = await axios.post('http://' + allmachines[machineindex].ip + ':20003/RPC2', statexml, config);
            const json = xmlparser.xml2js(set.data);
            tasklist.value[allmachines[machineindex].id] = [];
            if(json.methodResponse.params.param.value.array.data.value[1].i4 == 1){
              machinestatus.value[allmachines[machineindex].id] = 'free';
            }else{
              const programxml = serializeMethodCall('GetLoadedProgram', []);
              const getprogram = await axios.post('http://' + allmachines[machineindex].ip + ':20003/RPC2', programxml, config);
              const programjson = xmlparser.xml2js(getprogram.data);
              const programname = programjson.methodResponse.params.param.value.array.data.value[1].string;
              const showprogramname = programname.slice(8, -4);
              var have = false;
              for(const allactionindex in thisallaction){
                if(thisallaction[allactionindex].actionid == showprogramname){
                  tasklist.value[allmachines[machineindex].id].push({
                    name: thisallaction[allactionindex].name
                  })
                  have = true;
                  break;
                }
              }
              if(!have){
                tasklist.value[allmachines[machineindex].id].push({
                  name: showprogramname
                })
              }  
              machinestatus.value[allmachines[machineindex].id] = 'working';
            }
          }catch(e){
            machinestatus.value[allmachines[machineindex].id] = 'stop';
            console.log(e);
            console.log('没连上');
          }
        }, 1000)
      }
    }
  }else{
    result = await axios.post(
      addr + '/getactions', 
      {},
      {
        headers: {
          'token2': token2,
        }
      }
    );
    issee.value = true;
  }

  console.log(result);
  activity.value = result.data.activity;
  actionlist.value = result.data.actions;
  machinelist.value = result.data.machines;
  if(result.data.machines.length > 0) activemachine.value = result.data.machines[0].id;
  backgroundImage.value = route.query.type == 0 ? result.data.activity.imageurl : result.data.activity.imageurl2;
  topposition.value = result.data.activity.yposition;
  pageTitle.value = result.data.activity.name;
  if(result.data.activity.iconurl) pageFavicon.value = result.data.activity.iconurl;
  if(result.data.activity.actionperrow) actionperrow.value = result.data.activity.actionperrow;
  if(result.data.activity.fontsize) fontsize.value = result.data.activity.fontsize;
  if(result.data.activity.fontweight) fontweight.value = result.data.activity.fontweight;
  if(result.data.activity.fontcolor) fontcolor.value = result.data.activity.fontcolor;
  if(result.data.activity.fontname) fontname.value = result.data.activity.fontname;
})

const openconfirm = ref(false);
const confirmtext = ref('');
const confirmaction = ref({});
const confirmmachine = ref({});

const clickpic = (action, machine) => {
  if(issee.value){
    ElMessage('现在不能操作');
    return;
  }
  if(activity.value.statu != 1){
    ElMessage('现在不能操作');
    return;
  }
  if(machine.statu != 0){
    ElMessage('现在不能操作');
    return;
  }
  if(machine.statu != 0){
    ElMessage('现在不能操作');
    return;
  }
  if(activity.value.type == 0){
    if(machinestatus.value[machine.id] != 'free'){
      ElMessage('现在不能操作');
      return;
    }
  }
  if(activity.value.type == 1){
    if(machine.type == 1){
      if(machinestatus.value[machine.id] != 'free'){
        ElMessage('现在不能操作');
        return;
      }
    }else{
      if(machinestatus.value[machine.id] != 'free' && machinestatus.value[machine.id] != 'working'){
        ElMessage('现在不能操作');
        return;
      }
    }
  }
  confirmtext.value = '确定要运行动作：' + action.name + '吗？';
  confirmaction.value = action;
  confirmmachine.value = machine;
  openconfirm.value = true;
}

const doaction = async () => {
  openconfirm.value = false;

  if(confirmaction.value.type == 0){
    const newtask = await axios.post("http://" + confirmmachine.value.ip + "/public/task", {
      "scene_id": confirmaction.value.actionid,
      "execute_count": 0,
      "clear": 1
    })
    robottaskids.value[newtask.data.data.id] = confirmaction.value;
  }else{
    const config = {
      headers: {
        'Content-Type': 'application/xml',
      },
    };
    const xmljson = serializeMethodCall('ProgramLoad', ['/fruser/' + confirmaction.value.actionid + '.lua']);
    const set = await axios.post('http://' + confirmmachine.value.ip + ':20003/RPC2', xmljson, config);

    const xmljson2 = serializeMethodCall('ProgramRun', []);
    const set2 = await axios.post('http://' + confirmmachine.value.ip + ':20003/RPC2', xmljson2, config);
  }
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
  padding-top: 10px;
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
  width: calc(100% - 30px);
  padding: 6px 12px;
  border-radius: 10px;
  background-color: #fff;
}
.righttopstatu{
  right: 32px;
  top: 16px;
  position: fixed;
}
</style>
