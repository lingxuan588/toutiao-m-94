<template>
    <div class="container">
      <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
      <div class="detail">
        <h3 class="title">{{article.title}}</h3>
        <div class="author">
          <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
          <div class="text">
            <p class="name">{{article.aut_name}}</p>
            <p class="time">{{article.pubdate | relTime }}</p>
          </div>
          <van-button
            @click="follow()"
            round
            size="small"
            type="info"
          >{{ article.is_followed ? '已关注' : '+ 关注' }}</van-button>
        </div>
        <!-- v-html="article.content"文章内容 有标签 有属性 有样式 将标签设置到对应的元素中v-html -->
        <div class="content" v-html="article.content"></div>
        <div class="zan">
          <van-button
            round
            size="small"
            :class="{active:article.attitude ===1 }"
            plain
            icon="like-o"
          >点赞</van-button>&nbsp;&nbsp;&nbsp;&nbsp;
          <van-button
            round
            size="small"
            :class="{active:article.attitude ===0 }"
            plain
            icon="delete"
          >不喜欢</van-button>
        </div>
        <!-- 放置评论组件 -->
        <Comment></Comment>
      </div>
    </div>
</template>

<script>
import { getArticleInfo } from '@/api/articles'
import { followuser, Nofollow } from '@/api/user'
import Comment from './components/comment' // 引入评论
export default {
  components: {
    Comment // 注册组件
  },
  data () {
    return {
      article: [] // 接收文章数据
    }
  },
  methods: {
    //  关注或取消关注
    async follow () {
      try {
        if (this.article.is_followed) {
          await Nofollow(this.article.aut_id) // 传入作者id
        } else {
          // 关注
          await followuser({ target: this.article.aut_id }) // 传入作者id
        }
        // 如果成功了
        // PC端 是重新加载
        // 移动端不会重新加载  只会修改对应的数据状态
        this.article.is_followed = !this.article.is_followed // 将状态改为对立状态
      } catch (error) {
        // 失败会进入到catch
        // error.message是报错信息  就可以知道哪里出问题 这个错误是从哪里抛出了的
        // 现在写的是中间代码=>编译的=>报错指示的是编译之后的代码=>推导出哪里出问题了
        this.$ynotify({ message: '操作失败' })
      }
    },
    // 获取文章详情
    async getArticleInfo () {
      const { artId } = this.$route.query // 解构查询id
      this.article = await getArticleInfo(artId) // 得到文章结果
    }
  },
  created () {
    this.getArticleInfo()
    // 获取文章详情数据
  }
}
</script>

<style  lang="less"  scoped>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 46px 10px 44px;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan {
    text-align: center;
    padding: 10px 0;
    .active {
      border-color: red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    position: sticky;
    background-color: #fff;
    top: 46px;
    z-index:2;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img {
      max-width: 100%;
      background: #f9f9f9;
    }
    /deep/ code {
      white-space: pre-wrap;
    }
  }
}
</style>
