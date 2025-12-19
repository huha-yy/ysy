import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Button, Avatar, Dropdown, Space, Breadcrumb, Card, Row, Col } from 'antd'
import {
  HomeOutlined,
  DashboardOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  BarChartOutlined,
  EnvironmentOutlined,
  MessageOutlined,
  CalendarOutlined,
  CompassOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { logout } from '@/api/auth'
import type { MenuProps } from 'antd'
import './AdminLayout.less'

const { Header, Content, Sider } = Layout

// 面包屑项映射
const breadcrumbNameMap: Record<string, string> = {
  '/admin': '管理员后台',
  '/admin/dashboard': '仪表盘',
  '/admin/users': '用户管理',
  '/admin/analytics': '数据分析',
  '/admin/routes': '路线管理',
  '/admin/checkpoints': '签到点管理',
  '/admin/registrations': '报名管理',
  '/admin/feedbacks': '反馈管理',
  '/admin/trajectory': '轨迹监控',
  '/admin/checkin-statistics': '签到统计',
}

// 菜单项映射
const getMenuItems = (role: string): MenuProps['items'] => {
  const baseItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
  ]

  const adminOnlyItems = [
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: '用户管理',
    },
    {
      key: '/admin/analytics',
      icon: <BarChartOutlined />,
      label: '数据分析',
    },
  ]

  const commonItems = [
    {
      key: '/admin/routes',
      icon: <CompassOutlined />,
      label: '路线管理',
    },
    {
      key: '/admin/checkpoints',
      icon: <EnvironmentOutlined />,
      label: '签到点管理',
    },
    {
      key: '/admin/registrations',
      icon: <CalendarOutlined />,
      label: '报名管理',
    },
    {
      key: '/admin/feedbacks',
      icon: <MessageOutlined />,
      label: '反馈管理',
    },
    {
      key: '/admin/trajectory',
      icon: <CompassOutlined />,
      label: '轨迹监控',
    },
    {
      key: '/admin/checkin-statistics',
      icon: <BarChartOutlined />,
      label: '签到统计',
    },
  ]

  let items = [...baseItems]
  if (role === 'admin') {
    items = [...items, ...adminOnlyItems]
  }
  items = [...items, ...commonItems]

  return items
}

function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, clearAuth } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false)
  const [breadcrumbItems, setBreadcrumbItems] = useState<any[]>([])

  // 根据路径生成面包屑
  useEffect(() => {
    const pathSnippets = location.pathname.split('/').filter((i) => i)
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
      return {
        title: breadcrumbNameMap[url] || url,
      }
    })
    setBreadcrumbItems(extraBreadcrumbItems)
  }, [location.pathname])

  // 菜单点击处理
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    navigate(e.key)
  }

  // 用户下拉菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
      onClick: () => navigate('/profile'),
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
        navigate('/')
      },
      danger: true,
    },
  ]

  // 返回首页
  const goHome = () => {
    navigate('/')
  }

  return (
    <Layout className="admin-layout">
      {/* 侧边栏 */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        className="admin-sider"
        width={256}
        collapsedWidth={80}
      >
        {/* Logo区域 */}
        <div className="admin-logo">
          {collapsed ? '户' : '🏔️ 户外徒步管理'}
        </div>

        {/* 侧边菜单 */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={getMenuItems(user?.role || '')}
          onClick={handleMenuClick}
          className="admin-menu"
        />
      </Sider>

      {/* 主内容区域 */}
      <Layout className="site-layout">
        {/* 顶部导航 */}
        <Header className="admin-header">
          <div className="admin-header-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="trigger"
            />
            
            {/* 返回首页按钮 */}
            <Button 
              type="text" 
              icon={<HomeOutlined />} 
              onClick={goHome}
              className="home-button"
            >
              返回首页
            </Button>
          </div>

          {/* 用户信息 */}
          <div className="admin-header-right">
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className="user-info">
                <Avatar icon={<UserOutlined />} src={user?.avatar} />
                <span className="username">{user?.username}</span>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* 面包屑导航 */}
        <div className="breadcrumb-container">
          <div className="container">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        {/* 页面内容 */}
        <Content className="admin-content">
          <div className="container">
            <Outlet />
          </div>
        </Content>

        {/* 页脚 */}
        <div className="admin-footer">
          <div className="container">
            <p>户外徒步活动管理系统 © 2025 管理员后台</p>
          </div>
        </div>
      </Layout>
    </Layout>
  )
}

export default AdminLayout
