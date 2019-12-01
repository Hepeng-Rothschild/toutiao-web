<template>
  <div>
    <van-nav-bar title="登录" />
    <van-cell-group>
      <van-field required
                 v-model="user.mobile"
                 clearable
                 label="手机"
                 placeholder="请输入手机号"
                 name="mobile"
                 v-validate="'required'"
                 :error-message="errors.first('mobile')" />

      <van-field type="password"
                 v-model="user.code"
                 label="验证码"
                 placeholder="请输入验证码"
                 required
                 name="code"
                 v-validate="'required'"
                 :error-message="errors.first('code')" />
    </van-cell-group>

    <div class="login-btn">
      <van-button type="info"
                  :loading="isLoginLoading"
                  @click="onLogin">登录</van-button>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  name: 'LoginIndex',
  data () {
    return {
      isLoginLoading: false,
      user: {
        mobile: '18801185985',
        code: '246810'
      }
    }
  },
  created () {
    // 自定义配置表单验证提示消息---封装后
    this.customValidatorMessages()
  },
  methods: {
    ...mapMutations(['setUser']),
    async onLogin () {
      try {
        // 表单验证
        const isValid = await this.$validator.validate()
        // 如果验证失败，则停止代码往后执行
        if (!isValid) {
          return
        }
        // 提交表单，让登陆按钮 loading
        this.isLoginLoading = true
        const { data } = await login(this.user)
        console.log(data)
        // 将登录成功的用户状态（token）保存到vuex容器中
        this.setUser(data.data)
        // 登录成功，关闭loading
        this.isLoginLoading = false
        // 验证成功跳转主界面
        this.$router.push({ name: 'home' })
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        }
      }
      // 无论成功或失败，都要把loading停止
      this.isLoginLoading = false
    },
    // 自定义配置表单验证提示消息---封装过程
    customValidatorMessages () {
      this.$validator.localize('zh_CN', {
        custom: {
          mobile: {
            required: '手机号不能为空'
          },
          code: {
            required: '验证码不能为空'
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-btn {
  padding: 20px;
  .van-button {
    width: 100%;
  }
}
</style>
