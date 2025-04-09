<!-- frontend/src/views/Login.vue -->
<template>
  <div class="login-container">
    <div class="login-box">
      <div class="logo-container">
        <div class="logo-wrapper">
          <img src="https://r2.qifei.click/qmm.svg" alt="Logo" class="logo">
        </div>
        <!-- <div class="brand-name">悄咪咪云</div> -->
      </div>
      <h3>🎉🎉🎉欢迎回家👏👏👏</h3>
      <form @submit.prevent="doLogin">
        <div class="input-group">
          <input v-model="email" placeholder="请输入用户名" required />
        </div>
        <div class="input-group">
          <input v-model="password" type="password" placeholder="请输入密码" required />
        </div>
        <button type="submit">登录</button>
      </form>
      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n'
import { defineComponent, inject,computed,ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { setupInitialProfile } from '@/services/profileSetup';
// 引入Request
import { Request } from '@/utils/request'



export default defineComponent({
  setup() {
    const { t } = useI18n(); // 移动到setup函数顶部
    const email = ref<string>(''); // 用户名
    const password = ref<string>(''); // 密码
    const errorMsg = ref<string>(''); // 错误信息
    const router = useRouter();       // 路由实例
    const authStore = useAuthStore(); // Pinia 状态
    const loading = ref(false)

    const handleCancel = inject('cancel') as any
    const canSubmit = computed(() => email.value && email.value.length > 0 && password.value && password.value.length > 0)


    // 创建请求实例
    const request = new Request({
      base: 'https://q.qiaomimi.shop',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const doLogin = async () => {
      loading.value = true
      if (canSubmit.value === false) {
        errorMsg.value = t('auth.loginFailed')
        loading.value = false
        return
      }
      errorMsg.value = ''; // 清空错误信息

      try {
        // 添加调试日志
        console.log('发送登录请求，参数:', JSON.stringify({
          email: email.value,
          password: password.value,
          // captchaData: ''
        }));
        
        // 修改请求，尝试使用不同的参数名或格式
        const response = await request.post<{
          status: string,
          message: string,
          data: any,
          error: any
        }>('/api/v1/passport/auth/login', {
          email: email.value.trim(), // 添加trim()去除可能的空格
          password: password.value,
          captchaData: '',
        })

        if (response && response.status === 'success') {
          // 登录成功
          errorMsg.value = t('auth.loginSuccess')

          // 存储用户信息或令牌（如果有）
          if (response.data) {
            const { token, auth_data } = response.data
            authStore.setToken(token)
            authStore.setAuthData(auth_data)

            // 获取用户的订阅链接

            const request = new Request({
              base: 'https://q.qiaomimi.shop',
              bearer: auth_data,
              headers: {
                'Content-Type': 'application/json',
              },
            })
            const subscribeRequest = await request.get<{
              status: string,
              message: string,
              data: any,
              error: any
            }>('/api/v1/user/getSubscribe')

            if (subscribeRequest && subscribeRequest.status === 'success') {
            
              // 存储用户的订阅信息

              //跳转到首页
              const setup = await setupInitialProfile( subscribeRequest.data.subscribe_url,token, () => {
                handleCancel()
                router.push("/")
              })
              if (!setup) {
                errorMsg.value = t('auth.setupFailed')
              }

            }else {
              // 获取订阅失败
              errorMsg.value = subscribeRequest?.message || t('auth.loginFailed')
            }
            
            // // 获取用户的订阅信息
            // const subscribes = await subscribeStore.getSubscribes()

            // // 获取用户的配置文件
            // const profiles = await profilesStore.getProfiles()

            // // 获取应用设置
            // const appSettings = await appSettingsStore.getAppSettings()

          } else {
            errorMsg.value = t('auth.loginFailed')
          }

        } else {
          // 登录失败但API正常返回
          errorMsg.value = response?.message || t('auth.loginFailed')
        }
      } catch (error: any) {
        // 请求异常
        errorMsg.value = error?.message || t('auth.loginFailed')
      } finally {
        loading.value = false
      }
     
    }
    return {
      email,
      password,
      errorMsg,
      doLogin
    };
  }
  });
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  /* height: 100vh; */
  padding-top: 30px;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}

.login-box {
  /* width: 360px; */
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
  margin-bottom: 20px;
}

.logo-container {

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 15px;
}

.logo-wrapper {
  background-color: #f5f7fa;
  border-radius: 50%;
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.logo {
  height: 45px;
  width: 45px;
  object-fit: contain;
}

.brand-name {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

h2 {
  margin-bottom: 24px;
  color: #333;
  font-size: 24px;
}

.input-group {
  margin-bottom: 16px;
}

input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #4a90e2;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #3a80d2;
}

.error {
  color: #e74c3c;
  margin-top: 16px;
  font-size: 14px;
}
</style>