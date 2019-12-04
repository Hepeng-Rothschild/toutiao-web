<template>
  <div class="article-container">
    <van-nav-bar fixed
                 left-text="返回"
                 @click-left="$router.back()"
                 title="文章详情"></van-nav-bar>
    <van-loading class="article-loading"
                 v-if="loading" />
    <!-- 文章详情 -->
    <div class="detail"
         v-else-if="article.title">
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image round
                   width="2rem"
                   height="2rem"
                   fit="fill"
                   :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate}}</p>
        </div>
        <!-- 关注取关按钮操作 -->
        <van-button round
                    size="small"
                    :type="article.is_followed ? 'default' : 'info'"
                    @click="onFollow"
                    :loading="isFollowLoading">{{article.is_followed ? '已关注':'+关注'}}</van-button>
      </div>
      <div class="content"
           v-html="article.content"></div>
      <div class="zan">
        <van-button round
                    size="small"
                    hairline
                    :type="article.is_collected ? 'default' : 'info'"
                    plain
                    icon="good-job-o"
                    @click="onLiking"
                    :likeLoading="isLikeLoading">{{article.is_collected ? '已点赞' : '点赞'}}</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round
                    size="small"
                    hairline
                    :type="article.is_collected ? 'default' : 'info'"
                    plain
                    icon="delete"
                    @click="onDisLike"
                    :disLoading="isDisLoading">{{article.is_collected ? '取消对文章不喜欢':'对文章不喜欢'}}</van-button>
      </div>
    </div>
    <div class="error"
         v-else>
      <p>网络超时，点击 <a href="#"
           @click.prevent="loadArticle">刷新</a> 试一试。</p>
    </div>
    <!-- 评论组件 -->
    <article-comment />
  </div>
</template>

<script>
import { getArticle, likeArticle, DisArticle, unLikeArticle, unDisArticle } from '@/api/article'
import { followUser, unFollowUser } from '@/api/user'
import ArticleComment from './Components/component'
export default {
  name: 'ArticleIndex',
  components:{
    ArticleComment
  },
  data () {
    return {
      loading: true,
      article: {},
      isFollowLoading: false,
      isLikeLoading: false,
      isDisLoading: false
    }
  },
  created () {
    this.loadArticle()
  },
  methods: {
    // 加载评论详情
    async loadArticle () {
      try {
        const { data } = await getArticle(this.$route.params.id)
        console.log(data);
        this.article = data.data
      } catch (err) {
        console.log(err);
      }
      this.loading = false
    },
    // 添加关注、取关操作
    async onFollow () {
      this.isFollowLoading = true
      if (this.article.is_followed) {
        // 关注
        await followUser(this.article.aut_id)
      } else {
        // 取关
        await unFollowUser(this.article.aut_id)
      }
      this.article.is_followed = !this.article.is_followed
      this.isFollowLoading = false
    },
    // 添加对文章点赞，取消点赞操作
    async onLiking () {
      this.isLikeLoading = true
      if (this.article.is_collected) {
        await likeArticle(this.article.art_id)
      } else {
        await unLikeArticle(this.article.art_id)
      }
      this.article.is_collected = !this.article.is_collected
      this.isLikeLoading = false
    },
    // 添加对文章的不喜欢，取消不喜欢操作
    async onDisLike () {
      this.isDisLoading = true
      if (this.article.is_collected) {
        await unDisArticle(this.article.art_id)
      } else {
        await DisArticle(this.article.art_id)
      }
      this.article.is_collected = !this.article.is_collected
      this.isDisLoading = false
    }
  }
}
</script>

<style scoped lang='less'>
.article-container {
  position: absolute;
  left: 0;
  top: 0;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
}
.article-loading {
  padding-top: 100px;
  text-align: center;
}
.error {
  padding-top: 100px;
  text-align: center;
}
.detail {
  padding: 50px 10px;
  .title {
    font-size: 16px;
  }
  .zan {
    text-align: center;
  }
  .author {
    padding: 10px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.3;
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
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img {
      max-width: 100%;
      background: #f9f9f9;
    }
  }
}
</style>