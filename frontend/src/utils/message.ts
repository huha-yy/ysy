import { message as antdMessage } from 'antd'

// 创建一个简单的消息服务，用于在非组件环境中使用
// 这里的消息可能会在 Ant Design App 组件外部使用，所以会有警告
// 但在没有更好的解决方案之前，这是临时解决方案

export const message = {
  success: (content: string, duration?: number) => {
    antdMessage.success({
      content,
      duration,
    })
  },
  error: (content: string, duration?: number) => {
    antdMessage.error({
      content,
      duration,
    })
  },
  warning: (content: string, duration?: number) => {
    antdMessage.warning({
      content,
      duration,
    })
  },
  info: (content: string, duration?: number) => {
    antdMessage.info({
      content,
      duration,
    })
  },
}
