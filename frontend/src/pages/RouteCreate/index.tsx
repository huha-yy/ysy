import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Card,
  Row,
  Col,
  Divider,
  message,
  Space,
  Table,
  Modal,
  Switch,
  Upload,
  Tag,
  Spin,
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  RollbackOutlined,
  UploadOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons'
import { createRoute, updateRoute, getRouteById } from '@/api/route'
import { getActivityById } from '@/api/activity'
import type { RoutePointInfo, RouteCreateRequest, RouteUpdateRequest } from '@/api/route'
import type { Activity } from '@/types'
import './index.less'

const { TextArea } = Input
const { Option } = Select

function RouteCreate() {
  const { id, activityId } = useParams<{ id?: string; activityId?: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [activity, setActivity] = useState<Activity | null>(null)
  const [points, setPoints] = useState<RoutePointInfo[]>([])
  const [pointModalVisible, setPointModalVisible] = useState(false)
  const [editingPoint, setEditingPoint] = useState<RoutePointInfo | null>(null)
  const [pointForm] = Form.useForm()
  const [isEdit, setIsEdit] = useState(!!id)

  // 加载活动信息
  const loadActivity = async () => {
    if (!activityId && !id) return

    try {
      let currentActivityId = activityId
      // 如果是编辑模式，先获取路线信息，再获取活动信息
      if (id) {
        const routeData = await getRouteById(Number(id))
        currentActivityId = routeData.activityId.toString()
        
        // 设置表单初始值
        form.setFieldsValue({
          name: routeData.name,
          distance: routeData.distance,
          elevationGain: routeData.elevationGain,
          difficultyLevel: routeData.difficultyLevel,
          description: routeData.description,
          geojsonPath: routeData.geojsonPath,
          mapImgUrl: routeData.mapImgUrl,
        })

        // 设置点位信息
        if (routeData.pointsInfo) {
          // 后端返回的可能是Object，需要转换为数组
          const pointsData = Array.isArray(routeData.pointsInfo) 
            ? routeData.pointsInfo 
            : []
          setPoints(pointsData)
        }
      }
      
      if (currentActivityId) {
        const activityData = await getActivityById(Number(currentActivityId))
        setActivity(activityData)
      }
    } catch (error) {
      console.error('加载数据失败:', error)
      message.error('加载数据失败')
    }
  }

  useEffect(() => {
    loadActivity()
  }, [id, activityId])

  // 保存路线
  const handleSubmit = async (values: any) => {
    if (points.length < 2) {
      message.error('至少需要起点和终点两个点位')
      return
    }

    setLoading(true)
    try {
      // 获取活动ID
      let currentActivityId: number
      if (isEdit && route) {
        // 编辑模式，从route中获取activityId
        currentActivityId = route.activityId
      } else if (activityId) {
        // 创建模式，从URL参数中获取
        currentActivityId = Number(activityId)
      } else {
        message.error('无法确定所属活动')
        return
      }

      const data: RouteCreateRequest | RouteUpdateRequest = {
        ...values,
        pointsInfo: points,
      }

      // 只有创建时才需要activityId
      if (!isEdit) {
        (data as RouteCreateRequest).activityId = currentActivityId
      }

      if (isEdit) {
        await updateRoute(Number(id), data as RouteUpdateRequest)
        message.success('路线更新成功')
      } else {
        await createRoute(data as RouteCreateRequest)
        message.success('路线创建成功')
      }
      
      navigate(`/activities/${currentActivityId}`)
    } catch (error) {
      console.error('保存路线失败:', error)
      message.error('保存路线失败')
    } finally {
      setLoading(false)
    }
  }

  // 添加/编辑点位
  const handleSavePoint = async (values: any) => {
    try {
      const newPoint: RoutePointInfo = {
        pointIndex: editingPoint !== null ? editingPoint.pointIndex : points.length,
        pointName: values.pointName,
        pointType: values.pointType,
        latitude: values.latitude,
        longitude: values.longitude,
        expectedMinutes: values.expectedMinutes,
        allowedDeviationMeters: values.allowedDeviationMeters,
        allowedDelayMinutes: values.allowedDelayMinutes,
        description: values.description,
        mandatory: values.mandatory || false,
      }

      if (editingPoint !== null) {
        // 编辑模式
        const updatedPoints = [...points]
        updatedPoints[editingPoint.pointIndex] = newPoint
        setPoints(updatedPoints)
      } else {
        // 添加模式
        setPoints([...points, newPoint])
      }

      setPointModalVisible(false)
      setEditingPoint(null)
      pointForm.resetFields()
    } catch (error) {
      console.error('保存点位失败:', error)
      message.error('保存点位失败')
    }
  }

  // 删除点位
  const handleDeletePoint = (pointIndex: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个点位吗？',
      onOk: () => {
        const updatedPoints = points.filter((_, index) => index !== pointIndex)
        // 重新排序pointIndex
        const reorderedPoints = updatedPoints.map((point, index) => ({
          ...point,
          pointIndex: index,
        }))
        setPoints(reorderedPoints)
      },
    })
  }

  // 编辑点位
  const handleEditPoint = (point: RoutePointInfo) => {
    setEditingPoint(point)
    pointForm.setFieldsValue(point)
    setPointModalVisible(true)
  }

  // 点位表格列定义
  const pointColumns = [
    {
      title: '序号',
      dataIndex: 'pointIndex',
      key: 'pointIndex',
      width: 60,
    },
    {
      title: '名称',
      dataIndex: 'pointName',
      key: 'pointName',
    },
    {
      title: '类型',
      dataIndex: 'pointType',
      key: 'pointType',
      render: (type: string) => {
        const typeMap: Record<string, { text: string; color: string }> = {
          start: { text: '起点', color: 'green' },
          checkpoint: { text: '检查点', color: 'blue' },
          rest: { text: '休息点', color: 'orange' },
          end: { text: '终点', color: 'red' },
          emergency: { text: '紧急点', color: 'purple' },
        }
        const config = typeMap[type] || { text: type, color: 'default' }
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: '坐标',
      key: 'coordinates',
      render: (record: RoutePointInfo) => `${record.latitude}, ${record.longitude}`,
    },
    {
      title: '必须签到',
      dataIndex: 'mandatory',
      key: 'mandatory',
      width: 100,
      render: (mandatory: boolean) => (mandatory ? '是' : '否'),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (record: RoutePointInfo) => (
        <Space>
          <Button type="link" onClick={() => handleEditPoint(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDeletePoint(record.pointIndex)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="route-create-page">
      <div className="container">
        <Card
          title={isEdit ? '编辑路线' : '创建路线'}
          extra={
            <Space>
              <Button icon={<RollbackOutlined />} onClick={() => navigate(-1)}>
                返回
              </Button>
              <Button 
                type="primary" 
                icon={<SaveOutlined />} 
                loading={loading}
                onClick={() => form.submit()}
              >
                保存
              </Button>
            </Space>
          }
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              difficultyLevel: '中级',
            }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="name"
                  label="路线名称"
                  rules={[{ required: true, message: '请输入路线名称' }]}
                >
                  <Input placeholder="请输入路线名称" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="difficultyLevel"
                  label="难度等级"
                  rules={[{ required: true, message: '请选择难度等级' }]}
                >
                  <Select placeholder="请选择难度等级">
                    <Option value="入门">入门</Option>
                    <Option value="初级">初级</Option>
                    <Option value="中级">中级</Option>
                    <Option value="高级">高级</Option>
                    <Option value="专家">专家</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item name="distance" label="总距离（km）">
                  <InputNumber
                    min={0.01}
                    max={9999.99}
                    step={0.1}
                    precision={2}
                    placeholder="请输入总距离"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="elevationGain" label="累计爬升（m）">
                  <InputNumber
                    min={0}
                    max={9999}
                    placeholder="请输入累计爬升"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="description" label="路线描述">
              <TextArea rows={4} placeholder="请输入路线描述" maxLength={512} />
            </Form.Item>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item name="geojsonPath" label="GeoJSON路径">
                  <Input placeholder="请输入GeoJSON文件路径" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="mapImgUrl" label="路线图URL">
                  <Input placeholder="请输入路线图URL" />
                </Form.Item>
              </Col>
            </Row>

            <Divider>路线点位设置</Divider>

            <div style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingPoint(null)
                  pointForm.resetFields()
                  setPointModalVisible(true)
                }}
              >
                添加点位
              </Button>
            </div>

            <Table
              dataSource={points}
              columns={pointColumns}
              rowKey="pointIndex"
              pagination={false}
              locale={{ emptyText: '暂无点位，请添加起点和终点' }}
            />
          </Form>
        </Card>
      </div>

      {/* 添加/编辑点位弹窗 */}
      <Modal
        title={editingPoint !== null ? '编辑点位' : '添加点位'}
        open={pointModalVisible}
        onCancel={() => {
          setPointModalVisible(false)
          setEditingPoint(null)
          pointForm.resetFields()
        }}
        footer={null}
        width={700}
      >
        <Form
          form={pointForm}
          layout="vertical"
          onFinish={handleSavePoint}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="pointName"
                label="点位名称"
                rules={[{ required: true, message: '请输入点位名称' }]}
              >
                <Input placeholder="如：集合点、休息点、终点等" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="pointType"
                label="点位类型"
                rules={[{ required: true, message: '请选择点位类型' }]}
              >
                <Select placeholder="请选择点位类型">
                  <Option value="start">起点</Option>
                  <Option value="checkpoint">检查点</Option>
                  <Option value="rest">休息点</Option>
                  <Option value="end">终点</Option>
                  <Option value="emergency">紧急点</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="latitude"
                label="纬度"
                rules={[
                  { required: true, message: '请输入纬度' },
                  { type: 'number', min: -90, max: 90, message: '纬度范围为-90到90' }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入纬度"
                  precision={6}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="longitude"
                label="经度"
                rules={[
                  { required: true, message: '请输入经度' },
                  { type: 'number', min: -180, max: 180, message: '经度范围为-180到180' }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入经度"
                  precision={6}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item name="expectedMinutes" label="预期到达时间（分钟）">
                <InputNumber
                  min={0}
                  placeholder="相对于活动开始时间"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="allowedDeviationMeters" label="允许偏离距离（米）">
                <InputNumber
                  min={0}
                  placeholder="允许的最大偏离距离"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="allowedDelayMinutes" label="允许延迟时间（分钟）">
                <InputNumber
                  min={0}
                  placeholder="允许的最大延迟时间"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="mandatory" label="必须签到" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="description" label="点位描述">
            <TextArea rows={3} placeholder="如：风险提示、注意事项等" />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setPointModalVisible(false)
                setEditingPoint(null)
                pointForm.resetFields()
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default RouteCreate
