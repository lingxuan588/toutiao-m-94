<template>
<!-- 我的频道 -->
  <div class="channel-edit">
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <!-- 我的频道循环选项 -->
      <van-grid class="van-hairline--left">
        <!-- 循环渲染我的频道 -->
        <van-grid-item v-for="(item,index) in channels" :key="item.id">
          <!-- @click="'selectchannels',index"点击我的频道 进入到对应标签频道 -->
          <span :class="{red: index === activeIndex}" @click="$emit('selectchannels',index)"  class="f12">{{item.name}}</span>
          <!-- 叉号标签应该在进入编辑状态时显示 应该在退出状态后不显示-->
          <!-- 推荐永远不显示叉号 -->
          <van-icon  @click="$emit('del',item.id)"  v-if="index!==0 && editing" class="btn" name="cross"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 可选频道 全部频道-我的频道就是可选频道-->
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in optionalChannels" :key="item.id">
          <!-- :class="{red:i===activeIndex}"加一个激活的样式 点击我的频道中的某个频道会显示  -->
          <span  class="f12">{{item.name}}</span>
          <van-icon  @click="$emit('addChannel', item)" class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channels'
export default {
  data () {
    return {
      editing: false, // 控制删除图标显示隐藏
      allChannels: []// 定义一个变量接收全部的频道数据
    }
  },
  // props: ['channels']// 接收频道数据
  props: {
    channels: {
      required: true, // 必须传递
      tpye: Array, // 数组类型
      default: () => []// 默认值给一格空数组 此函数默认返回一个空数组
    },
    // 先在index.vue中绑定了此方法  props接收  点击我的频道会显示
    activeIndex: {
      requred: true, // 表示必须传递channels requred根据业务需求
      type: Number, // 指定type是number类型
      default: 0
    }
  },
  methods: {
    async  getAllChannels () {
      const data = await getAllChannels()
      this.allChannels = data.channels
    }
  },
  // 渲染可选频道 可选频道=全部频道-我的频道
  // 计算属性  因为可选频道是一个动态结果 全部数据（data)-用户频道（props)=>重新计算频道数据=》缓存
  computed: {
    // 可选频道 计算属性必须要求有返回值
    optionalChannels () {
      // 全部频道-我的频道
      return this.allChannels.filter(item => !this.channels.some(o => o.id === item.id))
    }
  },
  created () {
    this.getAllChannels()// 调用的方法是methods中的方法
  }
}
</script>

<style lang='less' scoped>
.channel-edit {
  .channel {
    padding: 10px;
    .tit {
      line-height: 3;
      .tip {
        font-size: 10px;
        color: #999;
      }
    }
    .van-button {
      float: right;
      margin-top: 7px;
    }
    .btn {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #ddd;
      font-size: 12px;
      color: #fff;
    }
    .f12 {
      font-size: 12px;
      color: #555;
    }
    .red {
      color: red;
    }
  }
}
</style>
