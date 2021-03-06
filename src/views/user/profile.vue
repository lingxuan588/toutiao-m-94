<template>
  <div class="container">
    <van-nav-bar left-arrow @click-left="$router.back()"  @click-right="saveUser"   title="编辑资料" right-text="保存"></van-nav-bar>
    <!-- @click="showPhoto"点击头像 显示头像弹层 -->
    <van-cell-group>
      <van-cell is-link title="头像" center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          @click="showPhoto=true"
          :src="user.photo"
        />
      </van-cell>
      <!-- @click="showName= true"在点击用户名称时 弹出该层 -->
      <van-cell is-link title="名称" @click="showName= true" :value="user.name" />
      <!-- 根据当前的gender决定男或者女 -->
      <van-cell is-link title="性别" @click="showGender=true" :value="user.gender===0 ? '男' : '女'" />
      <van-cell is-link title="生日" @click="showDate" :value="user.birthday" />
    </van-cell-group>
    <!-- 头像弹层组件 -->
    <van-popup v-model="showPhoto" style="width:80%">
      <!-- 内容 -->
      <!-- 1 本地相册选择图片 -->
      <!-- 2 拍照 -->
      <van-cell @click="openFileDialog"    is-link title="本地相册选择图片"></van-cell>
      <van-cell is-link title="拍照"></van-cell>
    </van-popup>
    <!-- 弹昵称 :close-on-click-overlay="false"点击背景关闭弹窗-->
    <van-popup v-model="showName" style="width:80%" :close-on-click-overlay="false">
      <!-- 编辑用户昵称  双向绑定用户的昵称-->
      <van-field :error-message="nameMsg" v-model.trim="user.name" type="textarea" rows="4"></van-field>
      <!-- 放置一个按钮 用来确定关闭弹层 -->
      <van-button block type="info" size="normal" @click="btnName">确定</van-button>
    </van-popup>
    <!-- 性别弹层 =>van-action-sheet @select="selectItem"vant 组件库中的event事件-->
    <van-action-sheet @select="selectItem" :actions="actions" v-model="showGender" cancel-text="取消"></van-action-sheet>
    <!-- 生日弹层 -->
    <van-popup v-model="showBirthDay" position="bottom">
      <!-- 选择出生日期  出生日期应该小于现在时间-->
      <!-- type表示 当前的日期类型 年月日 @cancel="showBirthDay: false" 点击取消按钮把生日弹层关闭
      @confirm="confirmDate"点击确定把生日弹层关闭-->
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="confirmDate"
        @cancel="showBirthDay=false"
      />
    </van-popup>
    <!-- 放置一个input：file 标签 用来上传图片 不能让人看到  要隐藏-->
 <input  ref="myFile"  @change="upload()"  type="file"  style="display:none" name=""  id=""  >
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getUserProfile, updatePhoto, saveUser } from '@/api/user'
import { mapMutations } from 'vuex'// 小智同学用户头像
export default {
  data () {
    return {
      showPhoto: false, // 显示头像弹层:
      showName: false, // 显示昵称弹层
      showGender: false, // 显示性别弹层
      showBirthDay: false, // 控制生日弹层
      actions: [{ name: '男' }, { name: '女' }], // 性别数据
      minDate: new Date(1900, 1, 1), // 最小时间
      maxDate: new Date(), // 生日最大时间 永远是小于等于当前时间的
      currentDate: new Date(), // 当前时间
      nameMsg: '', // 错误信息
      user: {
        // 放置个人资料信息
        name: '', // 用户昵称
        gender: 1, // 性别默认值
        birthday: '1998-01-01', // 生日默认值
        photo: '' // 用户头像
      }
    }
  },
  methods: {
    // 小智同学用户头像信息
    ...mapMutations([' Photo ']), // 引入更新头像的方法
    // 保存用户信息
    async  saveUser () {
      try {
        await saveUser(this.user)// 传入user对象
        this.$ynotify({ type: 'success', message: '保存成功' })
      } catch (error) {
        this.$ynotify({ message: '保存失败' })
      }
    },
    // 打开选择相册的对话框 触发点击input:file的动作
    openFileDialog () {
      this.$refs.myFile.click()// 触发input:file的click事件 触发事件就会弹出文件对话框
    },
    // 获取用户个人资料
    async getUserProfile () {
      this.user = await getUserProfile()
    },
    // 编辑用户资料 昵称
    btnName () {
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        this.nameMsg = '用户昵称的长度应该是1-7位'
        return
      }
      this.nameMsg = '' // 直接将错误信息清空
      this.showName = false
    },
    // 编辑用户资料 性别  显示男或者女
    selectItem (item, index) {
      this.user.gender = index // 直接把index赋值给性别
      // 手动关闭 弹层
      this.showGender = false
      // index 0 男 1 女
      // 通过item或者index可以得到 点击的是男或者是女
    },
    // 编辑用户资料  生日
    showDate () {
      this.showBirthDay = true // 显示生日弹层
      // 将当前的生日  设置到选择日期的当前时间 将生日的字符串转化成Date对象  绑定到日期组件上
      this.currentDate = new Date(this.user.birthday)
    },
    // 点击确定把生日弹层关闭
    confirmDate () {
      // date要转成字符串
      this.user.birthday = dayjs(this.currentDate).format('YYYY-MM-DD')
      this.showBirthDay = false // 关闭弹层
    },
    // 修改头像
    async upload (params) {
      // 当选择完头像之后 就可以修改头像
      const data = new FormData()
      data.append('photo', this.$refs.myFile.files[0])// 第二个参数是选择的图片文件
      const result = await updatePhoto(data)// 上传头像
      this.user.photo = result.photo// 把成功上传的头像地址设置给当前data中的数据
      // 小智同学 用户修改头像之后 也将修改成功的头像  设置给当前的vuex
      this.Photo({ photo: result.photo })// 将最新的头像地址设置给vuex
      this.showPhoto = false// 关闭头像弹层
    }
  },
  created () {
    this.getUserProfile() // 获取用户资料
  }
}
</script>

<style>
</style>
