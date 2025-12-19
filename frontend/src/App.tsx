import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, App as AntdApp } from 'antd'
import AppRouter from './router'

// 配置Ant Design全局参数
const theme = {
  token: {
    colorPrimary: '#1890ff',
  },
}

function App() {
  return (
    <ConfigProvider theme={theme}>
      <AntdApp>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  )
}

export default App

