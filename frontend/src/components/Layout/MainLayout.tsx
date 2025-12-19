import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Button, Avatar, Dropdown, Space } from 'antd'
import {
  HomeOutlined,
  AppstoreOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  MenuOutlined,
} from '@ant-design/icons'
import { useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { logout } from '@/api/auth'
import type { MenuProps } from 'antd'
import './MainLayout.less'

const { Header, Content, Footer } = Layout

function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, clearAuth } = useAuthStore()
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false)

  // 菜单项
  const menuItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/activities',
      icon: <AppstoreOutlined />,
      label: '活动广场',
    },
  ]

  // 用户下拉菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '个人中心',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'organizer',
      icon: <AppstoreOutlined />,
      label: '组织者后台',
      onClick: () => navigate('/organizer'),
      style: { display: user?.role === 'organizer' || user?.role === 'admin' ? 'block' : 'none' },
    },
    {
      key: 'admin',
      icon: <DashboardOutlined />,
      label: '管理员后台',
      onClick: () => navigate('/admin'),
      style: { display: user?.role === 'admin' ? 'block' : 'none' },
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        logout()
        clearAuth()
      },
      danger: true,
    },
  ]

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    navigate(e.key)
    setMobileMenuVisible(false)
  }

  return (
    <Layout className="main-layout">
      {/* 头部导航 */}
      <Header className="main-header">
        <div className="container header-content">
          {/* Logo */}
          <div className="logo" onClick={() => navigate('/')}>
            🏔️ 户外徒步
          </div>

          {/* PC 端菜单 */}
          <Menu
            className="desktop-menu"
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
          />

          {/* 用户操作区 */}
          <Space className="user-actions">
            {isAuthenticated() ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <div className="user-info">
                  <Avatar icon={<UserOutlined />} src={user?.avatar} />
                  <span className="desktop-only">{user?.username}</span>
                </div>
              </Dropdown>
            ) : (
              <>
                <Button type="text" onClick={() => navigate('/login')}>
                  登录
                </Button>
                <Button type="primary" onClick={() => navigate('/register')}>
                  注册
                </Button>
              </>
            )}

            {/* 移动端菜单按钮 */}
            <Button
              className="mobile-only"
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuVisible(!mobileMenuVisible)}
            />
          </Space>
        </div>

        {/* 移动端展开菜单 */}
        {mobileMenuVisible && (
          <div className="mobile-menu">
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              items={menuItems}
              onClick={handleMenuClick}
            />
          </div>
        )}
      </Header>

      {/* 内容区域 */}
      <Content className="main-content">
        <Outlet />
      </Content>

      {/* 底部 */}
      <Footer className="main-footer">
        <div className="container">
          <p>户外徒步活动管理系统 © 2025 Hiking Team</p>
          <p>探索自然 · 挑战自我</p>
        </div>
      </Footer>
    </Layout>
  )
}

export default MainLayout

