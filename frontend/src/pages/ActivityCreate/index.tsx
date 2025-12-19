import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  InputNumber,
  Upload,
  message,
  Steps,
  Space,
  Divider,
  Typography,
} from 'antd'
import {
  InboxOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  DollarOutlined,
  LeftOutlined,
} from '@ant-design/icons'
import { createActivity } from '@/api/activity'
import { useAuthStore } from '@/store/useAuthStore'
import type { Activity } from '@/types'
import dayjs from 'dayjs'
import './index.less'

const { Title, Paragraph } = Typography
const { TextArea } = Input
const { RangePicker } = DatePicker

function ActivityCreate() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [coverImage, setCoverImage] = useState<string>('')

  // 检查用户权限
  if (!user || (user.role !== 'organizer' && user.role !== 'admin')) {
    message.error('您没有权限创建活动')
    navigate('/')
    return null
  }

  // 提交表单
  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      // 获取所有步骤的表单值，不仅是当前步骤的
      const allValues = form.getFieldsValue(true)
      console.log('表单提交，所有字段值:', allValues)
      
      // 处理timeRange值，确保是有效的Day.js对象
      const startTime = allValues.timeRange && allValues.timeRange.length > 0 ? 
        dayjs.isDayjs(allValues.timeRange[0]) ? allValues.timeRange[0] : dayjs(allValues.timeRange[0])
        : null;
      
      const endTime = allValues.timeRange && allValues.timeRange.length > 1 ? 
        dayjs.isDayjs(allValues.timeRange[1]) ? allValues.timeRange[1] : dayjs(allValues.timeRange[1])
        : null;
      
      if (!startTime || !endTime) {
        message.error('请选择有效的活动时间')
        setLoading(false)
        return
      }
      
      // 构建要求信息 - 直接作为对象
      const experience = allValues.experience || ''
      const health = allValues.health || ''
      const gear = allValues.gear ? allValues.gear.split(',').map((item: string) => item.trim()) : []
      
      const formData = {
        title: allValues.title,
        summary: allValues.summary,
        difficulty: allValues.difficulty,
        location: allValues.location,
        meetingPoint: allValues.meetingPoint,
        startTime: startTime.format('YYYY-MM-DDTHH:mm:ss'),
        endTime: endTime.format('YYYY-MM-DDTHH:mm:ss'),
        capacity: allValues.capacity,
        feeInfo: allValues.feeInfo,
        requirementInfo: JSON.stringify({
          experience,
          health,
          gear,
        }),
      }

      console.log('提交的活动数据:', formData)
      console.log('JSON.stringify:', JSON.stringify(formData))
      
      const result = await createActivity(formData)
      message.success('活动创建成功，请等待审核')
      navigate(`/activities/${result.id}`)
    } catch (error) {
      console.error('活动创建失败:', error)
      message.error('活动创建失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 上传封面图
  const handleCoverImageChange = (info: any) => {
    if (info.file.status === 'done') {
      setCoverImage(info.file.response?.url || '')
    }
  }

  // 下一步
  const nextStep = () => {
    console.log('点击下一步按钮，当前步骤:', currentStep)
    getFormValues()
    form.validateFields().then((values) => {
      console.log('验证通过，当前表单值:', values)
      // 保存当前步骤的表单值
      form.setFieldsValue(values)
      setCurrentStep(currentStep + 1)
    }).catch((error) => {
      console.log('验证失败:', error)
    })
  }

  // 上一步
  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  // 调试函数 - 获取所有表单值
  const getFormValues = () => {
    const values = form.getFieldsValue(true)
    console.log('当前表单所有值:', values)
    console.log('表单验证状态:', form.getFieldsError())
    return values
  }

  // 表单步骤
  const steps = [
    {
      title: '基本信息',
      content: (
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="title"
              label="活动标题"
              rules={[{ required: true, message: '请输入活动标题' }]}
            >
              <Input placeholder="请输入活动标题" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="difficulty"
              label="活动难度"
              rules={[{ required: true, message: '请选择活动难度' }]}
            >
              <Select placeholder="请选择活动难度">
                <Select.Option value="easy">入门</Select.Option>
                <Select.Option value="medium">中等</Select.Option>
                <Select.Option value="hard">困难</Select.Option>
                <Select.Option value="expert">专家</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="summary"
              label="活动简介"
              rules={[{ required: true, message: '请输入活动简介' }]}
            >
              <TextArea rows={4} placeholder="请输入活动简介" />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      title: '时间地点',
      content: (
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="location"
              label="活动地点"
              rules={[{ required: true, message: '请输入活动地点' }]}
            >
              <Input prefix={<EnvironmentOutlined />} placeholder="请输入活动地点" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="meetingPoint"
              label="集合点"
              rules={[{ required: true, message: '请输入集合点' }]}
            >
              <Input placeholder="请输入具体集合点" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="timeRange"
              label="活动时间"
              rules={[{ required: true, message: '请选择活动时间' }]}
            >
              <RangePicker 
                showTime 
                format="YYYY-MM-DD HH:mm"
                placeholder={['开始时间', '结束时间']}
              />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      title: '人数费用',
      content: (
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="capacity"
              label="人数上限"
              rules={[
                { required: true, message: '请输入人数上限' },
                { type: 'number', min: 1, message: '人数上限至少为1' }
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="请输入人数上限"
                min={1}
                max={1000}
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="feeInfo"
              label="费用说明"
              rules={[{ required: true, message: '请输入费用说明' }]}
            >
              <Input placeholder="如：100元/人（含领队）" />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      title: '活动要求',
      content: (
        <Row gutter={[24, 24]}>
          <Col xs={24}>
            <Form.Item
              name="experience"
              label="经验要求"
              rules={[{ required: true, message: '请输入经验要求' }]}
            >
              <TextArea rows={3} placeholder="请描述参与者需要具备的徒步经验" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="health"
              label="健康要求"
              rules={[{ required: true, message: '请输入健康要求' }]}
            >
              <TextArea rows={3} placeholder="请描述参与者的健康状况要求" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="gear"
              label="装备要求"
              rules={[{ required: true, message: '请输入装备要求' }]}
            >
              <TextArea rows={3} placeholder="请列出参与者需要准备的装备，用逗号分隔" />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
  ]

  return (
    <div className="activity-create-page">
      <div className="container">
        <Card variant="outlined">
          <Title level={2}>发布新活动</Title>
          <Paragraph>请填写活动信息，提交后将进入审核流程</Paragraph>

          <Steps current={currentStep} items={steps.map(item => ({ title: item.title }))} />

          <div className="steps-content">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                difficulty: 'medium',
                capacity: 20,
              }}
            >
              {steps[currentStep].content}
            </Form>
          </div>

          <Divider />

          <div className="steps-action">
            <Space>
              <Button
                icon={<LeftOutlined />}
                disabled={currentStep === 0}
                onClick={prevStep}
              >
                上一步
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button type="primary" onClick={nextStep}>
                  下一步
                </Button>
              ) : (
                <Button
                  type="primary"
                  loading={loading}
                  onClick={() => {
                    console.log('手动点击提交按钮')
                    getFormValues()
                    form.submit()
                  }}
                >
                  提交审核
                </Button>
              )}
            </Space>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ActivityCreate

