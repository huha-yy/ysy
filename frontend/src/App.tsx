import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
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
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App

