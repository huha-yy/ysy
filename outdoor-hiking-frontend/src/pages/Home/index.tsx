import { useNavigate } from 'react-router-dom'
import { Button, Row, Col, Card, Statistic } from 'antd'
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  StarOutlined,
} from '@ant-design/icons'
import './index.less'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-page">
      {/* Hero 区域 */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="container">
            <h1 className="hero-title">探索自然，挑战自我</h1>
            <p className="hero-subtitle">
              加入我们的户外徒步社区，体验大自然的壮美与奇迹
            </p>
            <div className="hero-actions">
              <Button type="primary" size="large" onClick={() => navigate('/activities')}>
                开始探索
              </Button>
              <Button size="large" ghost onClick={() => navigate('/activities')}>
                查看活动
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 数据统计 */}
      <section className="stats-section">
        <div className="container">
          <Row gutter={[32, 32]}>
            <Col xs={12} sm={12} md={6}>
              <Card bordered={false} className="stat-card">
                <Statistic
                  title="累计活动"
                  value={1200}
                  suffix="+"
                  prefix={<EnvironmentOutlined />}
                  valueStyle={{ color: '#2E7D32' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card bordered={false} className="stat-card">
                <Statistic
                  title="活跃用户"
                  value={5000}
                  suffix="+"
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#1976D2' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card bordered={false} className="stat-card">
                <Statistic
                  title="累计里程"
                  value={50000}
                  suffix="km"
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#FF9800' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card bordered={false} className="stat-card">
                <Statistic
                  title="平均评分"
                  value={4.8}
                  precision={1}
                  prefix={<StarOutlined />}
                  valueStyle={{ color: '#FFC107' }}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* 功能特色 */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">为什么选择我们</h2>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} md={8}>
              <Card className="feature-card" bordered={false}>
                <div className="feature-icon">🗺️</div>
                <h3>智能路线规划</h3>
                <p>精确的GPS定位和实时路线导航，让你的每一步都更安全</p>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card className="feature-card" bordered={false}>
                <div className="feature-icon">📍</div>
                <h3>实时位置追踪</h3>
                <p>实时监控参与者位置，智能预警偏离和延迟，保障安全</p>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card className="feature-card" bordered={false}>
                <div className="feature-icon">📊</div>
                <h3>数据统计分析</h3>
                <p>详细的活动数据和个人成就记录，见证你的每一次成长</p>
              </Card>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  )
}

export default Home

